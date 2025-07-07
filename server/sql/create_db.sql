DROP DATABASE IF EXISTS AI_Exam_Web_App_DB;

CREATE DATABASE AI_Exam_Web_App_DB;
USE AI_Exam_Web_App_DB;

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `password_hash` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,

  PRIMARY KEY (`user_id`)
);


CREATE TABLE `quizzes` (
  `quiz_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` longtext,
  PRIMARY KEY (`quiz_id`),
  KEY `fk_quiz_user_idx` (`user_id`),
  CONSTRAINT `fk_quiz_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `questions` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int DEFAULT NULL,
  `text` longtext,
  PRIMARY KEY (`question_id`),
  KEY `fk_quiz_id_idx` (`quiz_id`),
  CONSTRAINT `fk_question_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `answers` (
  `answer_id` int NOT NULL AUTO_INCREMENT,
  `question_id` int DEFAULT NULL,
  `text` longtext,
  `is_correct` tinyint DEFAULT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `fk_question_id_idx` (`question_id`),
  CONSTRAINT `fk_answer_question_id` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `pdfs` (
  `PDF_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `upload_time` datetime DEFAULT NULL,
  PRIMARY KEY (`PDF_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `fk_PDFs_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
);


CREATE TABLE `quiz_attempts` (
  `attempt_id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int DEFAULT NULL,
  `score` VARCHAR(255) NOT NULL,
  `ans_str` VARCHAR(255) NOT NULL,
  `attempt_time` datetime DEFAULT NULL,
  PRIMARY KEY (`attempt_id`),
  KEY `fk_quiz_id_idx` (`quiz_id`),
  CONSTRAINT `fk_attempt_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) ON DELETE CASCADE
);

SHOW TABLES;