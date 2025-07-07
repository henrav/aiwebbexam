
import * as React from "react";
import "./botinfo.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function BotInfo(){
    return(

          <div className="test">
              <div className="textbox-botInfo">
                  <p>Welcome to our intelligent bot, designed to simplify your academic journey by providing concise summaries of quizzes, student notes, and teacher lectures.

Our bot is your virtual study companion, created to streamline your learning process. Whether you're a student preparing for exams or a teacher looking to enhance classroom learning, our bot is here to help.

Here's what our bot can do for you:

<p> 1. Quiz Summaries: Our bot can summarize quizzes on various subjects, condensing lengthy questions and answers into digestible chunks. With our bot, you can quickly review important concepts and test your knowledge.</p>

<p>2. Student Notes: Need a quick refresher on your class notes? Our bot can generate summaries of your notes, highlighting key points and essential information. Say goodbye to sifting through pages of notes – our bot provides the essential details you need to study effectively.</p>
                      <p>3. Teacher Lectures: Teachers, our bot is your assistant in creating engaging lectures. Simply input your lecture content, and our bot will generate summaries, making it easier for your students to grasp complex topics.</p>
<p>5. Ensuring that The Foul Ghouls of Lucifer Himself Do Not Prevail: Our bot is equipped to identify and correct misconceptions, acting as a beacon of knowledge that dispels the shadows cast by The Foul Ghouls of Lucifer himself. This keeps your learning path clear of misinformation and common pitfalls.</p>
<p>Whether you're a student seeking clarity or a teacher aiming to enhance teaching materials, our bot is your go-to solution for efficient learning. Say hello to simplified studying with our bot!</p></p>
              </div>
              
          </div>

)
}

function SetInStartBox() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (event)=>{
      event.preventDefault();
      const loginDetails = {username, password};
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginDetails),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        if (data.success) {
          console.log('Login successful');
          navigate('/');
        } else {
          console.log('Login failed', data.message);
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    };
    
  
  
    return (
      <div className="testMain">
<div className='StartLoginBox' >
        <div className='LoginRow'>
          <text className='LoginText'>login</text>
        </div>
        <div className='LoginRow'>
          <input 
          className='StartLoginInput'
          type='text'
          placeholder='User Name'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='LoginRow'>
          <input
          className='StartLoginInput'
          type ='password'
          placeholder='Password'
          value={password}
          
          onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='LoginRow'>
        <button className='LoginButton' type='submit' onClick={handleLogin}>Login</button>
        </div>
      </div>
      </div>
      
    )
  }

 export default BotInfo;