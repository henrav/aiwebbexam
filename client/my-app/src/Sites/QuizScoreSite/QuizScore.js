import * as React from "react";
import "./QuizScore.css";
import {useEffect, useState} from 'react';
import {  useNavigate, useParams, useLocation } from 'react-router-dom'; //  Link

import {useAuth} from "../../AuthProvider";



function QuizScore() {
    const location = useLocation();
    const { quiz, userAnswers, score, passed, totalQuestions} = location.state || {};
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = quiz.questions[currentQuestionIndex];
    console.log("QuizScore", quiz, userAnswers, score, passed, totalQuestions);

    function handleBackButton() {
        if (currentQuestionIndex === 0) {
            navigate("/old_quizzes");
        }else{
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }





    if (!quiz) {
        console.log("No quiz data available, redirecting...");
        navigate("/old_quizzes");
        return null;
    }

    return (

                <div className='Quiz-body'>
                    <div className='Quiz-nrOfQuestions' style={{gridColumn: 3}}>
                        <div className='Quiz-nrOfQuestions-text'>
                            Number of questions: {quiz.questions.length}
                        </div>
                    </div>


                    <div className="Quiz-question-number-text" style={{gridColumn: 2, gridRow: 1}}>
                        <div className='Quiz-question-nr' style={{gridColumn: 2}}>
                            <h1>Question {currentQuestionIndex + 1}</h1>
                        </div>
                    </div>
                    <div className="Quiz-question-text-container" style={{gridColumn: 2}}>
                        <div className='Quiz-question' style={{gridColumn: 2}}>
                            <h2>{currentQuestion.text}</h2>
                        </div>
                    </div>
                    {currentQuestion.answers.map((answer) => {
                        const chosen  = userAnswers[currentQuestion.question_id]?.answerId === answer.answer_id;
                        const correct = answer.is_correct;

                        /* pick the badge */
                        let badge = null;
                        if (chosen &&  correct) badge = <div className="Quiz-question-correct">nice!</div>;
                        if (chosen && !correct) badge = <div className="Quiz-question-incorrect">your answer.</div>;
                        if (!chosen &&  correct) badge = <div className="Quiz-question-correct">this is correct!</div>;

                        /* colour the text if needed */
                        const txtColor =
                            chosen && !correct ? "#ff0000" :
                                chosen &&  correct ? "#61dafb" : undefined;

                        return (
                            <div className={'quiz-thingy-container'}>

                            <div key={answer.answer_id} className="Quiz-question-container">
                                {/*  column 1: the text (wrapped so we can add max-width) */}
                                <div className="Quiz-question-potanswer" style={{ color: txtColor }}>
                                    <div className="potanswer-inner">
                                        <h3>{answer.text}</h3>
                                        <div className={'badge-thingy'}>{badge}</div>

                                    </div>
                                </div>

                                {/* column 2: the badge (null if none) */}
                            </div>
                            </div>

                        );
                    })}


                    <div className="Quiz-question-button-container-container" style={{gridColumn: 2}}>
                        <div className="Quiz-question-button-container" style={{justifyContent: "left"}}
                             id="rightbutton">
                            <button className='Quiz-button'
                                    onClick={() => handleBackButton()}>Previous
                            </button>
                        </div>
                        <div className="Quiz-question-button-container" style={{justifyContent: "right"}}
                             id="leftbutton">
                            <button className='Quiz-button' onClick={() => {
                                if (currentQuestionIndex >= quiz.questions.length - 1) {
                                    navigate("/old_quizzes");
                                } else {
                                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                                }
                            }}
                            >Next
                            </button>
                        </div>
                    </div>

                </div>

    );
}

function ReturnCorrectAnswerBox({row}) {
    return (
        <div className='Quiz-question-container' style={{gridRow: row}}>
            <div className={'Quiz-question-potanswer'}>
                <h3>Correct Answer</h3>
            </div>
        </div>
    );
}



export default QuizScore;