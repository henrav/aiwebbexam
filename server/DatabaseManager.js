// Importing file system module for file operations
const fs = require('fs');


const mysql = require('mysql2');
const mysql1 = require('mysql');
/**
 * Manages database operations including connecting to the database,
 * executing SQL scripts, and closing the database connection.
 * @class
 * @classdesc This class provides methods to manage database operations like connection,
 * script execution, and closing the connection.
 * @author Mattias Fridsén
 */
class DatabaseManager {
    /**
     * Constructs a new instance of the DatabaseManager class with default database configuration.
     */
    constructor() {
        this.config = {
            host: process.env.DB_HOST, //här får man lägga till sina egna inställningar om man vill fixa
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: "AI_Exam_Web_App_DB",
            port: 3306,
        };
        this.connection = null;
    }

    /**
     * Connects to the database. If a connection is already established, it returns a resolved promise.
     * @returns {Promise<void>} A promise that resolves if the connection is successful, or rejects if it fails.
     */
    connect() {
        // Tracer
        console.log("TRACER DatabaseManager.js.connect: Attempting to connect to the database...");

        return new Promise((resolve, reject) => {
            if (this.connection) {
                resolve();
            } else {
                this.connection = mysql.createConnection(this.config);
                this.connection.connect(err => {
                    if (err) {
                        console.error('Failed to connect to database:', err);
                        reject(err);
                    } else {
                        console.log('Successfully connected to the database.');
                        resolve();
                    }
                });
            }
        });
    }

    //TODO JSDoc
    initializeDatabase() {
        console.log("Initializing database...");
        return this.connect()
            .then(() => this.runTableScript('sql/create_db.sql'))
            .then(() => this.runTableScript('sql/sample_data.sql'))
            .then(() => this.runProceduresScript('sql/create_procedures.sql'))
            //.then(() => this.runShowProcedures())
            /*.then(procedures => {
                console.log('Procedures:', procedures);
            })*/
            .catch(err => {
                console.error('An error occurred during database initialization:', err);
                throw err;
            });
    }

    /**
     * Closes the database connection if it exists.
     */
    close() {
        if (this.connection) {
            this.connection.end();
        }
    }

    /**
     * Executes a SQL script that consists of multiple table-related commands from a file.
     * @param {string} filePath - The path to the SQL script file.
     * @returns {Promise<void>} A promise that resolves when all commands have been executed, or rejects if an error occurs.
     */
    runTableScript(filePath) {
        // Tracer
        console.log(`TRACER DatabaseManager.js.runTableScript: Running SQL script from: ${filePath}`);

        return new Promise((resolve, reject) => {
            const sqlScript = fs.readFileSync(filePath, { encoding: 'utf-8' });
            const sqlCommands = sqlScript.split(';').filter(sql => sql.trim());

            const runCommand = async (command) => {
                return new Promise((resolve, reject) => {
                    this.connection.query(command, (err, results, fields) => {
                        if (err) {
                            console.error(`Error executing command: ${err.message}`);
                            reject(err);
                        } else {
                            if (command.trim().toUpperCase().startsWith('SHOW')) {
                                console.log(results);
                            }
                            resolve();
                        }
                    });
                });
            };

            const executeCommands = async () => {
                for (const command of sqlCommands) {
                    await runCommand(command);
                }
                resolve();
            };

            executeCommands().catch(reject);
        });
    }

    /**
     * Executes a SQL script with multiple stored procedures from a specified file.
     * @param {string} filePath - The path to the file containing the SQL procedures.
     * @returns {Promise<void>} A promise that resolves when all procedures are executed, or rejects if an error occurs.
     */
    runProceduresScript(filePath) {
        // Tracer
        console.log("TRACER DatabaseManager.js.runProceduresScript: Attempting to connect to the database...");

        console.log(`Running SQL script with multiple statements from: ${filePath}`);
        const multiStatementConfig = { ...this.config, multipleStatements: true };
        const multiStatementConnection = mysql.createConnection(multiStatementConfig);

        return new Promise((resolve, reject) => {
            fs.readFile(filePath, { encoding: 'utf-8' }, (err, sqlScript) => {
                if (err) {
                    console.error(`Error reading SQL file: ${err.message}`);
                    reject(err);
                    return;
                }

                multiStatementConnection.query(sqlScript, (err, results) => {
                    multiStatementConnection.end();
                    if (err) {
                        console.error(`Error executing SQL script: ${err.message}`);
                        reject(err);
                    } else {
                        console.log('Multiple statements executed successfully');
                        resolve(results);
                    }
                });
            });
        });
    }

    /**
     * Retrieves and displays all stored procedures from the database schema.
     * @returns {Promise<Array>} A promise that resolves with the stored procedures, or rejects if an error occurs.
     */
    runShowProcedures() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT ROUTINE_NAME, ROUTINE_DEFINITION
                FROM information_schema.ROUTINES
                WHERE ROUTINE_SCHEMA = '${this.config.database}' AND ROUTINE_TYPE = 'PROCEDURE';
            `;
            this.connection.query(sql, (err, results) => {
                if (err) {
                    console.error('Error fetching procedures:', err.message);
                    reject(err);
                } else {
                    console.log('Stored Procedures:', results);
                    resolve(results);
                }
            });
        });
    }

    /**
     * Calls a stored procedure to delete a quiz by its ID.
     * @param {number} quizId - The ID of the quiz to delete.
     * @returns {Promise<void>} A promise that resolves when the quiz is deleted or rejects if an error occurs.
     */
    deleteQuizById(quizId) {
        return new Promise((resolve, reject) => {
            this.connect().then(() => {
                const sql = 'CALL DeleteQuiz(?)';
                this.connection.query(sql, [quizId], (err, results, fields) => {
                    if (err) {
                        console.error(`Error when calling DeleteQuiz: ${err.message}`);
                        reject(err);
                    } else {
                        console.log('DeleteQuiz executed successfully', results);
                        resolve();
                    }
                });
            }).catch(err => {
                console.error('Failed to connect to database:', err);
                reject(err);
            });
        });
    }

    /**
     * Saves the results of a quiz attempt to the database.
     * @param {number} quizId - ID of the quiz taken.
     * @param {Object} answers - Object containing the user's answers.
     * @param {string} score - Final score of the quiz attempt as a string.
     * @returns {Promise} A promise that resolves with the result of the database operation.
     */
    async saveQuizResults(quizId, answers, score) {

        const ans_str = JSON.stringify(answers);
        console.log(ans_str)
        const attempt_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const sql = `INSERT INTO quiz_attempts (quiz_id, score, ans_str, attempt_time) VALUES (?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            this.connection.query(sql, [quizId, score, ans_str, attempt_time], (err, results) => {
                if (err) {
                    console.error('Failed to save quiz results:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    /**
     * Retrieves quiz attempts for a given quiz ID.
     * @param {number} quizId - The ID of the quiz for which attempts are fetched.
     * @returns {Promise<Array>} A promise that resolves to an array of attempts.
     */
    getQuizAttemptsById(quizId) {
        return new Promise((resolve, reject) => {
            this.connect().then(() => {
                const sql = 'SELECT attempt_id, score, attempt_time FROM quiz_attempts WHERE quiz_id = ?';
                this.connection.query(sql, [quizId], (err, results) => {
                    if (err) {
                        console.error(`Error fetching quiz attempts for quiz ID ${quizId}:`, err.message);
                        reject(err);
                    } else {
                        console.log('Quiz attempts fetched successfully');
                        resolve(results);
                    }
                });
            }).catch(err => {
                console.error('Failed to connect to database:', err);
                reject(err);
            });
        });
    }

    /**
     * Retrieves detailed information for a specific quiz attempt.
     * @param {number} attemptId - The ID of the quiz attempt to retrieve.
     * @returns {Promise<Object>} A promise that resolves with the quiz attempt details.
     */
    getAttemptDetails(attemptId) {
        return new Promise((resolve, reject) => {
            this.connect().then(() => {
                // Fetch basic attempt details
                const attemptSql = `SELECT quiz_id, score, ans_str FROM quiz_attempts WHERE attempt_id = ?`;
                this.connection.query(attemptSql, [attemptId], async (err, attemptResults) => {
                    if (err) {
                        console.error(`Error fetching attempt details:`, err.message);
                        reject(err);
                        return;
                    }
                    if (attemptResults.length === 0) {
                        reject(new Error("No attempt found with the given ID"));
                        return;
                    }

                    const attempt = attemptResults[0];
                    const questionsSql = `
                    SELECT q.question_id, q.text AS question_text, a.text AS answer_text, a.is_correct
                    FROM questions q
                    JOIN answers a ON q.question_id = a.question_id
                    WHERE q.quiz_id = ?
                    ORDER BY q.question_id, a.is_correct DESC
                `;


                    this.connection.query(questionsSql, [attempt.quiz_id], (err, questionsResults) => {
                        if (err) {
                            console.error(`Error fetching questions for quiz ID ${attempt.quiz_id}:`, err.message);
                            reject(err);
                            return;
                        }


                        const userAnswers = JSON.parse(attempt.ans_str);


                        const details = {
                            score: attempt.score,
                            questions: questionsResults.map(q => ({
                                ...q,
                                userAnswer: userAnswers[q.question_id]
                            }))
                        };

                        resolve(details);
                    });
                });
            }).catch(err => {
                console.error('Failed to connect to database:', err);
                reject(err);
            });
        });
    }


    //TODO JSDoc
    runQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    getConnection() {
        return this.connection;
    }

}

module.exports = DatabaseManager;