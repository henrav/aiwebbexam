

CREATE PROCEDURE GetQuizDetailsByQuizId(IN quiz_id INT)
BEGIN
    SELECT JSON_OBJECT(
        'quiz_id', q.quiz_id,
        'title',   q.title,
        'questions',
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'question_id', qu.question_id,
                'text',        qu.text,
                'answers',
                (SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'answer_id', a.answer_id,
                            'text',      a.text,
                            'is_correct',a.is_correct
                        )
                     )
                 FROM answers a
                 WHERE a.question_id = qu.question_id)
            )
        )
    ) AS QuizData
    FROM quizzes q
    JOIN questions qu ON q.quiz_id = qu.quiz_id
    WHERE q.quiz_id = quiz_id
    GROUP BY q.quiz_id;
END;


CREATE DEFINER=`root`@`localhost` PROCEDURE `GetQuizNamesByUserId`(IN `userid` INT)
BEGIN
    SELECT title, quiz_id
    FROM quizzes
    WHERE user_id = userid;
    
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetQuizzesQuestionsAnswersByUserId`(IN `user_id` INT)
BEGIN
    SELECT JSON_OBJECT(
        'quiz_id', q.quiz_id,
        'title', q.title,
        'questions', JSON_ARRAYAGG(
            JSON_OBJECT(
                'question_id', qu.question_id,
                'text', qu.text,
                'answers', (SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'answer_id', a.answer_id,
                                    'text', a.text,
                                    'is_correct', a.is_correct
                                )
                            )
                            FROM answers a
                            WHERE a.question_id = qu.question_id
                        )
            )
        )
    ) AS QuizData
    FROM quizzes q
    JOIN questions qu ON q.quiz_id = qu.quiz_id
    WHERE q.user_id = user_id
    GROUP BY q.quiz_id;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertQuizData`(IN quizData JSON)
BEGIN
    DECLARE v_quiz_id INT;
    DECLARE v_question_id INT;
    DECLARE v_index INT DEFAULT 0;
    DECLARE v_indexOptions INT DEFAULT 0;
    DECLARE v_question JSON;
    DECLARE v_option TEXT;
    DECLARE v_is_correct TINYINT;

    INSERT INTO quizzes(user_id, title)
    VALUES (JSON_UNQUOTE(JSON_EXTRACT(quizData, '$.userId')),
            JSON_UNQUOTE(JSON_EXTRACT(quizData, '$.title')));

    SET v_quiz_id = LAST_INSERT_ID();

    WHILE v_index < JSON_LENGTH(JSON_EXTRACT(quizData, '$.questionsAndAnswers')) DO
        SET v_question = JSON_EXTRACT(quizData, CONCAT('$.questionsAndAnswers[', v_index, ']'));

        INSERT INTO questions(quiz_id, text)
        VALUES (v_quiz_id,
                JSON_UNQUOTE(JSON_EXTRACT(v_question, '$.question')));

        SET v_question_id = LAST_INSERT_ID();
        SET v_indexOptions = 0;

        WHILE v_indexOptions < JSON_LENGTH(JSON_EXTRACT(v_question, '$.options')) DO
            SET v_option = JSON_UNQUOTE(JSON_EXTRACT(v_question, CONCAT('$.options[', v_indexOptions, ']')));

            SET v_is_correct = IF(v_option = JSON_UNQUOTE(JSON_EXTRACT(v_question, '$.answer')), 1, 0);

            INSERT INTO answers(question_id, text, is_correct)
            VALUES (v_question_id, v_option, v_is_correct);

            SET v_indexOptions = v_indexOptions + 1;
        END WHILE;

        SET v_index = v_index + 1;
    END WHILE;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `login_user`(
    IN p_identifier VARCHAR(100),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE user_exists INT;

    SELECT COUNT(*) INTO user_exists
    FROM users
    WHERE (username = p_identifier OR email = p_identifier) AND password_hash = p_password_hash;

    IF user_exists = 1 THEN
        UPDATE users
        SET last_login = NOW()
        WHERE username = p_identifier OR email = p_identifier;
		
		SELECT user_id, username, email, firstname, lastname, last_login
        INTO @user_id, @username, @email, @firstname, @lastname, @last_login
        FROM users
        WHERE username = p_identifier OR email = p_identifier;
			
        SELECT 'Login successful' AS message, @user_id AS user_id, @username AS username, @email AS email, @firstname AS firstname, @lastname AS lastname, @last_login AS last_login;

    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid credentials';
    END IF;
END;



CREATE DEFINER=`root`@`localhost` PROCEDURE `register_user`(
	IN p_username VARCHAR(50),
	IN p_email VARCHAR(100),
	IN p_firstname VARCHAR(50),
	IN p_lastname VARCHAR(50),
	IN p_password_hash VARCHAR(255)
)
BEGIN
	DECLARE existing_user_count INT;
    DECLARE existing_username_count INT;
    SELECT COUNT(*) INTO existing_username_count FROM users WHERE username = p_username;
    IF existing_username_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A user with this username already exists.';
    ELSE
		SELECT COUNT(*) INTO existing_user_count FROM users WHERE email = p_email;

		IF existing_user_count = 0 THEN
			INSERT INTO users (username, email, firstname, lastname, password_hash, created_at, last_login)
			VALUES (p_username, p_email, p_firstname, p_lastname, p_password_hash, NOW(), NOW());
            
		SELECT user_id, username, email, firstname, lastname, last_login
        INTO @user_id, @username, @email, @firstname, @lastname, @last_login
        FROM users
        WHERE username = p_username;
			
        SELECT 'User registered' AS message, @user_id AS user_id, @username AS username, @email AS email, @firstname AS firstname, @lastname AS lastname, @last_login AS last_login;
			
		ELSE

			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A user with this email already exists.';
		END IF;
	END IF;
END;



CREATE DEFINER=`root`@`localhost` PROCEDURE `ViewQuizAttempts`(IN `user_id` INT)
BEGIN
	Select * 
    FROM user_quiz_attempts qa
    JOIN 
        users u ON qa.user_id = u.user_id
    JOIN 
        quizzes q ON qa.quiz_id = q.quiz_id
	WHERE qa.user_id = user_id
    ORDER BY 
        qa.attempt_time DESC;
END;


CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteQuiz`(IN q_id INT)
BEGIN
	DELETE FROM quizzes WHERE quiz_id = q_id; 
END;

