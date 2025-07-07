import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './QuizAttempts.css';


function QuizAttempts() {
    const location = useLocation();
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [attempts, setAttempts] = useState([]);
    const [quiz, setQuiz] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState([]);
    const [updatedAnswers, setUpdatedAnswers] = useState([]);
    const {quizName} = location.state || {};

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const response = await fetch(`/api/quiz_attempts/${quizId}`);
                const data = await response.json();
                if (response.ok) {
                    setAttempts(data.attempts);
                } else {
                    console.error('Failed to fetch attempts:', data.message);
                }
            } catch (error) {
                console.error('Network or server error:', error);
            }
        };

        fetchAttempts();
    }, [quizId]);

    const NavigateQuizAttempt = async (quizAttemptId) => {
        try {

            const responseQuiz = await fetch(`/api/getQuizDetailed/${quizId}`);
            const dataQuiz = await responseQuiz.json();
            if (!responseQuiz.ok) {
                console.error('Failed to fetch quiz:', dataQuiz.message);
                return;
            }
            setQuiz(dataQuiz.quiz);


            const responseAttempt = await fetch(`/api/quiz_attempt/${quizAttemptId}`);
            const dataAttempt = await responseAttempt.json();
            if (!responseAttempt.ok) {
                console.error('Failed to fetch quiz attempt:', dataAttempt.message);
                return;
            }


            const userAnswers = {};
            dataAttempt.answerIds.forEach((answerId, index) => {
                const questionId = dataQuiz.quiz.questions[index].question_id;
                userAnswers[questionId] = {
                    answerId: answerId,
                    isCorrect: dataQuiz.quiz.questions[index].answers.find(a => a.answer_id === answerId)?.is_correct
                };
            });

            setSelectedAnswer(userAnswers);


            navigate('/QuizScore', {
                state: {
                    quiz: dataQuiz.quiz,
                    userAnswers: userAnswers,
                    score: null,
                    passed: null,
                    totalQuestions: dataQuiz.quiz.questions.length
                }
            });
        } catch (error) {
            console.error('Network or server error', error);
        }
    };
    return (

                <div className="attempts-container">
                    <h1 style={{color:"white"}}>Quiz Attempts for Quiz ID: {quizName}</h1>
                    {attempts.length > 0 ? (
                        attempts.map((attempt, index) => (
                            <div key={index} className="attempt-item">
                                <div className="attempt-details">
                                    <p>Score: {attempt.score}</p>
                                    <p>Attempt Time: {new Date(attempt.attempt_time).toLocaleString()}</p>
                                </div>
                                <button onClick={() => NavigateQuizAttempt(attempt.attempt_id)}>View Attempt</button>
                            </div>
                        ))
                    ) : (
                        <p>No attempts found for this quiz.</p>
                    )}
                </div>


    );
}

export default QuizAttempts;