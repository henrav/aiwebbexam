// testaReactNode/index.js

// really important thingys dont remove or you'll feel my wrath come down on you with the fury of a thousand burnings suns
const express = require("express");
const multer = require('multer');
const OpenAI = require('openai');
const pdfParse = require('pdf-parse');
const mysql = require('mysql2');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
require('dotenv').config({path: '../.env'});
app.use(express.json());
// Project Imports

const mysqlConfig = {
    host:     process.env.MYSQL_HOST,
    port:     Number(process.env.MYSQL_PORT) || 3306,
    user:     process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
};
//const DatabaseManager = require('./DatabaseManager');
const pool = mysql.createPool(mysqlConfig).promise();

// Correct way to configure the OpenAI API client, should probably store my api key in a .env file seperate from alla er, speciellt nils. men men 
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})




//something something saying where to store the file the user uploads to the server momentarily, we will delete it after we have used it
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage }).single('file');


app.post("/api/login", async (req, res) => {
    try {
        let { username, password } = req.body;
        username = username.trim();

        const callProcedure = 'CALL login_user(?, ?)';

        const [resultSets] = await pool.query(callProcedure, [username, password]);
        const row = resultSets[0]?.[0];

        if (!row) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (row.message.includes("Login successful")) {
            const userData = {
                user_id:   row.user_id,
                username:  row.username,
                email:     row.email,
                firstname: row.firstname,
                lastname:  row.lastname,
                last_login: row.last_login
            };
            console.log("User data:", userData);
            return res.json({ success: true, message: "Login successful", user: userData });
        } else {
            return res.json({ success: false, message: row.message });
        }
    } catch (err) {
        console.error("Database error:", err);

        if (err.code === "ER_SIGNAL_EXCEPTION") {
            return res.status(401).json({ success: false, message: err.sqlMessage });
        }
        return res.status(500).json({ success: false, message: err.sqlMessage || "Database error" });
    }
});

async function canGenerateQuiz(userId) {
    const sql = 'SELECT COUNT(*) AS quiz_count FROM quizzes WHERE user_id = ?';
    try {
        const [rows] = await pool.query(sql, [userId]);
        return rows[0].quiz_count < 5;
    } catch (err) {
        console.error("Error in canGenerateQuiz:", err);
        throw err;
    }
}
app.post("/api/register", async (req, res) => {
    const { username, email, firstName, lastName, password } = req.body;
    const callProcedure = 'CALL register_user(?, ?, ?, ?, ?)';

    try {
        // 🔹 only change: use the shared pool instead of dbManager
        const [resultSets] = await pool.query(callProcedure, [
            username,
            email,
            firstName,
            lastName,
            password,
        ]);

        const result = resultSets[0]; // first result‐set from the stored procedure
        const message = result[0]?.message || "Unknown response";

        if (message.includes("User registered")) {
            const userData = {
                user_id:   result[0].user_id,
                username:  result[0].username,
                email:     result[0].email,
                firstname: result[0].firstname,
                lastname:  result[0].lastname,
                last_login: result[0].last_login,
            };

            console.log("User data:", userData);
            createSampleQuiz(userData.user_id);
            return res.json({
                success: true,
                message: "User registered successfully",
                user: userData,
            });
        } else {
            return res.json({ success: false, message });
        }
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({
            success: false,
            message: err.sqlMessage || "Database error",
        });
    }
});



async function createSampleQuiz(userId) {
    const sampleQuiz = {
        userId,
        title: "Sample Quiz",
        questionsAndAnswers: [
            {
                question: "What is the capital of France?",
                options: ["Paris", "London", "Berlin", "Madrid"],
                answer: "Paris"
            },
            {
                question: "What is 2 + 2?",
                options: ["3", "4", "5", "6"],
                answer: "4"
            },
            {
                question: "What is the largest planet in our solar system?",
                options: ["Earth", "Mars", "Jupiter", "Saturn"],
                answer: "Jupiter"
            }
        ]
    };

    try {
        // 1️⃣ insert the sample quiz
        await createQuiz(sampleQuiz);
        console.log('Sample quiz created for user:', userId);

        // 2️⃣ fetch its generated ID
        const quizId = await getQuizIDLatest(userId);
        if (!quizId) {
            console.log('No quizzes found after insert for user:', userId);
            return;
        }
        console.log('Latest quiz ID for user:', userId, 'is', quizId);

        // 3️⃣ insert a sample attempt for that quiz
        await createSampleAttempt(userId, quizId);
        console.log('Sample attempt created for user:', userId, 'quiz ID:', quizId);
    } catch (err) {
        console.error('Error in createSampleQuiz for user:', userId, err);
    }
}


async function getQuizIDLatest(userID) {
    const sql = 'SELECT quiz_id FROM quizzes WHERE user_id = ?';

    try {
        const [rows] = await pool.query(sql, [userID]);
        return rows.length > 0 ? rows[0].quiz_id : null;
    } catch (err) {
        console.error('Error fetching latest quiz ID:', err);
        // Return null on error so callers don’t crash
        return null;
    }
}

async function createSampleAttempt(userId, quizId) {
    console.log('Creating sample attempt for user:', userId, 'with quiz ID:', quizId);

    const sampleAttempt = {
        userId,
        quizId,
        answers: {
            0: { answerId: 1, isCorrect: 1 },
            1: { answerId: 2, isCorrect: 0 },
            2: { answerId: 3, isCorrect: 1 },
        },
        score: 2,
        totalQuestions: 3,
    };

    try {
        const response = await fetch(`http://localhost:${PORT}/api/submitQuizAnswers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sampleAttempt),
        });

        if (!response.ok) {
            console.error('submitQuizAnswers returned status', response.status);
            return false;
        }

        const data = await response.json();
        console.log('Sample attempt created successfully:', data);
        return true;
    } catch (err) {
        console.error('Error creating sample attempt:', err);
        return false;
    }
}





// this recieves the file from the client side and then sends it to the openai api to get the questions and answers
// this entire function or whatever you'd call it could probalby be done in a better way but i dont really have the time to do that right now
app.post('/api/upload', (req, res) => {
  //something something javascript magic upload file
  upload(req, res, async function (err) {
      if (err) {
        //  some error thingy
          return res.status(500).send({ error: err.message });
      }
      if (!req.file) {
        //another error thingy
          return res.status(400).send('No file uploaded.');
      }

      const allowed = await canGenerateQuiz(req.body.userId);
      if (!allowed) {
          return res.status(403).json({
              success: false,
              message: 'Quiz limit reached (max 5).',
          });
      }

      try {
        // convert the file to a buffer and then to a string
        // since it costs more to upload files to gpt and we want to save money and its easier this whay probably
          const dataBuffer = await fs.promises.readFile(req.file.path);
          const data = await pdfParse(dataBuffer);
          const nrQuestions = req.body.nrQuestions;
          /*
         // nr of questions is always gonna be divisible by 5, so if nr of questions = 25, then run the loop 5 times
           // this is because the openai api can only handle 5 questions at a time
         const responses = [];
         for (let i = 0; i < nrQuestions; i += 5) {
             const response = await createQuiz5Questions(dataText, userId, title);
             responses.push(response);  // Assuming response is the data you need
         }
         responses.flat()
         responses.append({userId: req.body.userId, title: req.body.title});
        */
         // give exact promt to gpt so it returns the correct dataformat every time using our insane "service"
         const prompt = `Generate a series of multiple choice quiz questions with 5 questions and 4 answers per question based on the following text. 
         Each question should be structured as a JSON object with the question text, four options, and a correct answer.
         The correct answer should be random, it could be either option A, B, C or D. Please format the entire output as a JSON array:
         Text: "${data.text}"
         User ID: "${req.body.userId}"  // Include user ID in prompt
         Quiz Title: "${req.body.title}" // Include quiz title in prompt
         Please format the output as follows exactly, must follow this format exactly, otherwise the client will not be able to parse it correctly
         :
         [
             {
                 "question": "What is the main theme of the text?",
                 "options": ["Option A", "Option B", "Option C", "Option D"],
                 "answer": "Option A"
             },
             {
                 "question": "How does the author describe the relationship between X and Y?",
                 "options": ["Option A", "Option B", "Option C", "Option D"],
                 "answer": "Option B"
             },
             {
                  "question": "Which argument does the author use to support their main point?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option C"
              }
             // More questions as needed
         ]`;



         const response = await openai.chat.completions.create({
             model: "gpt-4.1-nano",
             messages: [{ role: "user", content: prompt }]
         });
         console.log('Response:', response);
         let quizContent = JSON.parse(response.choices[0].message.content);
         console.log('Quiz content:', quizContent);
          if (nrQuestions > 5){
                for (let i = 0; i < nrQuestions / 5 - 1; i++) {
                    const additionalQuestions = await repeatedCreateQuiz5Questions(data.text, quizContent);
                    console.log('Additional questions content:', JSON.parse(additionalQuestions.choices[0].message.content));
                    const message = JSON.parse(additionalQuestions.choices[0].message.content);
                    quizContent = quizContent.concat(message);
                }
          }

         const responseData = {
             userId: req.body.userId,
             title: req.body.title,
             questionsAndAnswers: quizContent,
             success: true,
         };

          console.log('Response data:', responseData);

          createQuiz(responseData);
          res.status(200).json(responseData);
      } catch (error) {
          const responseData = {
                userId: req.body.userId,
                title: req.body.title,
                questionsAndAnswers: [],
                success: false,
                message: error.message || "An error occurred while processing the request."
            };
          console.error('Error processing the request:', responseData);
          res.status(500).send({ responseData });
      } finally {

          fs.unlink(req.file.path, err => {
              if (err) console.error('Error deleting file:', err);
          });
      }
  });
});

async function repeatedCreateQuiz5Questions(dataText, previousQuestionsAndAnswers) {
    const prompt = `
Generate exactly 5 new multiple-choice questions based on this text, and do NOT repeat or paraphrase any of these existing questions:

${JSON.stringify(previousQuestionsAndAnswers)}

Text:
${dataText}

Return _only_ a JSON array of 5 objects, each with the keys "question", "options" (an array of four strings), and "answer" (one of those strings). Do NOT include comments, semicolons, or any other text:

[
  {
    "question": "First question…",
    "options": ["A","B","C","D"],
    "answer": "B"
  },
  { … }
]

the "answer": "B" must be exactly the same as the answer "B" in options. 
`.trim();

    return openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [{ role: "user", content: prompt }]
    });
}

async function createQuiz5Questions(pdfToText, userId, title) {

    const prompt = `Generate a series of multiple choice quiz questions containing 5 questions with 4 answers per question based on the following text. Each question should be structured as a JSON object with the question text, four options, and a correct answer. Please format the entire output as a JSON array:
          Text: "${pdfToText}"  // Corrected to use the parameter passed
          Please format the output as follows:
          [
              {
                  "question": "What is the main theme of the text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option A"
              },
              {
                  "question": "How does the author describe the relationship between X and Y?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Option B"
              }
              // More questions as needed
          ]`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}]
    });
    console.log('Response:', response);

    return response.data.choices[0].message.content;
}




function createQuiz(responseData) {
    const callProcedure = 'CALL InsertQuizData(?)';

    pool.query(callProcedure, [JSON.stringify(responseData)], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return;
        }
        console.log("Quiz and associated questions and answers inserted successfully.");
    });
}



/**
 * Removes Quizzes from the db, along with all questions, answers and attempts related to the quiz.
 */
app.delete('/api/remove_quiz/:quizId', async (req, res) => {
    const { quizId } = req.params;
    try {
        // 🔹 only change: call the procedure via pool.query instead of dbManager
        await pool.query('CALL DeleteQuiz(?)', [quizId]);
        res.status(200).json({ message: 'Quiz successfully deleted' });
    } catch (error) {
        console.error('Failed to delete quiz:', error);
        res.status(500).json({ message: 'Failed to delete quiz' });
    }
});

/**
 * Retrieves quiz attempts (multiple, and not with questions and answers) from the db.
 */
app.get('/api/quiz_attempts/:quizId', async (req, res) => {
    const { quizId } = req.params;

    try {

        const [attempts] = await pool.query(
            'SELECT attempt_id, score, attempt_time FROM quiz_attempts WHERE quiz_id = ?',
            [quizId]
        );
        res.json({ attempts });
    } catch (error) {
        console.error('Failed to fetch quiz attempts:', error);
        res.status(500).json({ message: 'Failed to fetch quiz attempts' });
    }
});

/**
 * Retrieves all relevant data for a specific quiz attempt.
 */


app.post('/api/submitQuizAnswers', (req, res) => {
    const { userId, quizId, answers, score, totalQuestions } = req.body;
    const answerIds = [];

    for (const key in answers) {
        if (answers.hasOwnProperty(key)) {
            answerIds.push(answers[key].answerId);
        }
    }

    const ans_str      = answerIds.join(', ');
    const attempt_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const totalScore   = `${score}/${totalQuestions}`;

    const sql = `
      INSERT INTO quiz_attempts
        (quiz_id, score, ans_str, attempt_time)
      VALUES (?, ?, ?, ?)
    `;

    pool.query(sql, [quizId, totalScore, ans_str, attempt_time], (err, result) => {
        if (err) {
            console.error('Error saving quiz results:', err);
            return res.status(500).json({ message: 'Failed to save quiz results' });
        }
        res
            .status(200)
            .json({ message: 'Quiz results saved successfully', attemptId: result.insertId });
    });
});


app.get('/api/quiz_attempt/:attemptId', async (req, res) => {
    const { attemptId } = req.params;
    console.log('Fetching attempt details for attempt ID:', attemptId);

    try {
        // 🔹 use promise‐based pool.query
        const [results] = await pool.query(
            'SELECT ans_str FROM quiz_attempts WHERE attempt_id = ?',
            [attemptId]
        );

        if (results.length === 0) {
            return res.status(404).json({ message: 'Quiz attempt not found' });
        }

        const answerIds = results[0].ans_str
            .split(',')
            .map(id => parseInt(id.trim(), 10));

        return res.json({ answerIds });
    } catch (err) {
        console.error('Error fetching attempt:', err);
        return res.status(500).json({ message: 'Failed to fetch attempt details' });
    }
});



app.get("/api/getQuizDetailed/:quizId", async (req, res) => {
    const quizId = req.params.quizId;

    try {
        // run your stored procedure via the promise API
        const [resultSets] = await pool.query(
            "CALL GetQuizDetailsByQuizId(?)",
            [quizId]
        );
        const rows = resultSets[0] || [];

        if (!rows.length) {
            return res
                .status(404)
                .json({ success: false, message: "No quiz found with ID " + quizId });
        }

        // robustly handle whatever shape QuizData comes back in
        const raw = rows[0].QuizData;
        let quizData;
        if (typeof raw === "string") {
            quizData = JSON.parse(raw);
        } else {
            // mysql2 may already have parsed it
            quizData = raw;
        }

        // same logging you had
        console.log("Quiz Title:", quizData.title);
        quizData.questions.forEach(question => {
            console.log("Question:", question.text);
            question.answers.forEach(answer => {
                console.log(
                    "Answer:",
                    answer.text,
                    "Correct:",
                    answer.is_correct ? "Yes" : "No"
                );
            });
        });

        return res.json({ success: true, quiz: quizData });
    } catch (err) {
        console.error("Database error:", err);
        return res
            .status(500)
            .json({ success: false, message: err.sqlMessage || "Database error" });
    }
});



app.get('/api/getQuiz', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId is required' });
    }

    try {
        // ① run the procedure
        const [sets] = await pool.query('CALL GetQuizNamesByUserId(?)', [userId]);
        const rows   = sets[0] || [];

        // ② respond
        if (rows.length) {
            const quizzes = rows.map(r => ({ id: r.quiz_id, title: r.title }));
            return res.json({ success: true, quizzes });
        }
        return res.status(404).json({ success: false, message: 'No quizzes found' });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
    }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Closing database connection...');
    dbManager.close().then(() => {
        console.log('Database connection closed.');
        process.exit(0);
    }).catch(err => {
        console.error('Failed to close database connection:', err);
        process.exit(1);
    });
});



//yooooo

//old code somethign scared to remove it
/*
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/asdlogin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = 'SELECT * FROM public."Users" WHERE "User_Email" = $1 AND "User_Password" = $2';
    
    const result = await pool.query(query, [username, password]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
*/

//require('dotenv').config({ path: './.env' });
//const { Pool } = require('pg');
/*
  const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
*/