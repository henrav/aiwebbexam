import * as React from "react";
import "./oldQuizzes.css";
import {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom'; //  Link



function OldQuizzes() {
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const { user } = useAuth();
  const [fetching, setFetching] = useState(false);

  const handleQuizSelection = (quizName) => {
    setSelectedQuiz(quizName);
  }
    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!user) {
                console.log("Redirecting because no user is logged in.");
                navigate("/login");
                return;
            }
            setFetching(true);

            try {
                const response = await fetch('/api/getQuiz', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setQuizzes(data.quizzes);
            } catch (error) {
                console.error('Failed to fetch quizzes:', error);
                alert('Failed to fetch quizzes, please try again later');
            }
            setFetching(false);
        };

        fetchQuizzes();
    }, [user]);

  return (

        <div className="quiz-container">
          <div className="quiz-item">
            <div className="quiz-input">
              <input
                className='quiz'
                type='text'
                placeholder='Quiz 1'
                disabled
              />
              <Link to={`/quiz/${encodeURIComponent("Quiz 1")}`} className='quiz-button' onClick={() => handleQuizSelection("Quiz 1")}>TA Quiz</Link>
            </div>
            <button className='remove-button'>Remove Quiz</button>
          </div>
          <div className="quiz-item">
            <div className="quiz-input">
              <input
                className='quiz'
                type='text'
                placeholder='Quiz 2'
                disabled
              />
              <Link to={`/quiz/${encodeURIComponent("Quiz 2")}`} className='quiz-button' onClick={() => handleQuizSelection("Quiz 2")}>TA Quiz</Link>
            </div>
            <button className='remove-button'>Remove Quiz</button>
          </div>
          <div className="quiz-item">
            <div className="quiz-input">
              <input
                className='quiz'
                type='text'
                placeholder='Quiz 3'
                disabled
              />
              <Link to={`/quiz/${encodeURIComponent("Quiz 3")}`} className='quiz-button' onClick={() => handleQuizSelection("Quiz 3")}>TA Quiz</Link>
            </div>
            <button className='remove-button'>Remove Quiz</button>
          </div>
        </div>

  );
}

export default OldQuizzes;
