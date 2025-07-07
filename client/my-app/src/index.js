import  React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import reportWebVitals from './reportWebVitals';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";


import Welcome from "./App";
import Register from "./Sites/RegisterSite/Register";
import Login from "./Sites/LoginSite/Login";
import ContactUs from "./Sites/ContactUsSite/ContactUs";

import BotInfo from './Sites/BotInfoSite/botInfo';
import About from './Sites/AboutSite/About';

import Quiz from './Sites/QuizSite/Quiz';
import FileUpload from './Sites/FileUploadSite/FileUpload';
import AuthProvider from "./AuthProvider";
import OldQuizzes from './Sites/OldQuizzes/OldQuizPage';

import RemoveQuiz from "./Sites/RemoveQuiz/RemoveQuiz";
import QuizAttempts from "./Sites/QuizAttempts/QuizAttempts";
import QuizAttempt from "./Sites/QuizAttempt/QuizAttempt";
import {Layout, App} from './App';

import ReturnMap from './Sites/Maps/Map';
import QuizScore  from "./Sites/QuizScoreSite/QuizScore";
import MapComponent from "./Sites/Maps/Map";
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Router>
            <AuthProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={< App/>} />
                        <Route path="register" element={<Register />} />
                        <Route path="login" element={<Login />} />
                        <Route path="contactus" element={<ContactUs />} />
                        <Route path="botinfo" element={<BotInfo />} />
                        <Route path="about" element={<About />} />
                        <Route path="quiz" element={<Quiz />} />
                        <Route path="quiz/:quizId" element={<Quiz />} />
                        <Route path="old_quizzes" element={<OldQuizzes />} />
                        <Route path="fileupload" element={<FileUpload />} />
                        <Route path="remove_quiz/:quizId" element={<RemoveQuiz />} />
                        <Route path="quizscore" element={<QuizScore />} />
                        <Route path="quiz_attempts/:quizId" element={<QuizAttempts />} />
                        <Route path="map" element={<MapComponent />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    </React.StrictMode>
);


reportWebVitals();
