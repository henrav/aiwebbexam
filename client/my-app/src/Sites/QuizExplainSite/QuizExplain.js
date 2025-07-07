import * as React from "react";

import {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom'; //  Link

import {useAuth} from "../../AuthProvider";
import { useParams } from 'react-router-dom';


function QuizExplain({quizData, quizAnswers, quizResults}){
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if (!user) {
            console.log("No user logged in, redirecting...");
            navigate("/login")
            return;
        }
    },[user]);

    return(

                <ShowResults/>

    )
}

function ShowResults(){
    return(
        <div>
            <h1>Results</h1>
        </div>
    )
}

export default QuizExplain;