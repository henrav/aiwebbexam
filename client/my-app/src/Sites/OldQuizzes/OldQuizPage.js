import * as React from "react";
import "./oldQuizzes.css";
import {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom'; //  Link

import {useAuth} from "../../AuthProvider";
import {Button} from "reactstrap";


function OldQuizzes() {
  return (

                  <ReturnQuizzes/>

  );
}

function ReturnQuizzes() {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    const [fetching, setFetching] = useState(true);
    useEffect(() => {

        if (!user) {
            console.log("No user logged in, redirecting...");
            navigate("/login")
            return;
        }

        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`/api/getQuiz?userId=${user.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setQuizzes(data.quizzes);
                } else {
                    console.error(data.message || 'Failed to fetch quizzes');
                }
            } catch (error) {
                console.error('Network or server error', error);
            }
            setFetching(false);
        };

        fetchQuizzes();
        console.log('fetching quizzes');
    }, [user]);

    const handleRemoveClick = (quizId) => {
        navigate(`/remove_quiz/${quizId}`);
    };

    const handlePreviousAttemptsClick = (quizId, quizTitle) => {
        navigate(`/quiz_attempts/${quizId}`,
            {
            state: {
                quizName: quizTitle
            }
        });
    };


    return (

        <> {fetching ? (FetchingQuizzes() ) : (
            <div className="quiz-container">
            {quizzes.length ? (
                quizzes.map((quiz) => (
                    <div key={quiz.id} className="quiz-item">
                        {/*  label + primary action share one flex box  */}
                        <div className="quiz-input">
                            <input className="quiz" value={quiz.title} disabled/>

                        </div>
                        <button  onClick={() => navigate(`/quiz/${quiz.id}`)} className="buttonThingy greenButton">
                            Take&nbsp;Quiz
                        </button>
                        <button
                            className="buttonThingy whiteButton"
                            onClick={() => handlePreviousAttemptsClick(quiz.id, quiz.title)}
                        >
                            Previous Attempts
                        </button>

                        <button
                            className="buttonThingy redButton"
                            onClick={() => handleRemoveClick(quiz.id)}
                        >
                            Remove Quiz
                        </button>
                    </div>
                ))
            ) : (
                <div className="no-quizzes-cta">
                    <p>No quizzes yet.</p>
                    <button
                        className="upload-btn"
                        onClick={() => navigate("/FileUpload")}
                    >
                        Upload a PDF &amp; create one
                    </button>
                </div>
            )}
        </div>)}
        </>

    );

}


function FetchingQuizzes() {
    return (
        <div className="fetching-container">
            <p>Fetching quizzes...</p>
            <div className="spinner2"></div>
        </div>
    );
}

export default OldQuizzes;