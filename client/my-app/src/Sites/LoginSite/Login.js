
import * as React from "react";
import "./Login.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../AuthProvider';

function Login(){
    return(

                <SetInStartBox/>

      )
}

function SetInStartBox() {
  const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleClick() {
      navigate("/register");
    }

    const navigateRegister = () => {
        navigate('/register');
    }

    const wrongInput = (message) => {
        document.getElementById('errorBox').innerHTML = message === null ? 'Wrong input' : message;
    }
  
  
  
    const handleLogin = async (event) => {
      event.preventDefault();
      const loginDetails = { username, password };
      try {
          const response = await fetch('/api/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(loginDetails),
          });
  
          const data = await response.json();
          if (response.ok && data.success) {
              if (data.user) {
                  login(data.user);
                  navigate('/dashboard');
              } else {
                  alert('Login successful but no user data returned');
              }
          } else {
                wrongInput(data.message || 'Login failed, please check your credentials.');
          }
      } catch (error) {
          console.error('Login error:', error);
          alert('Network or server error');
      }
  };
  
    
  
  
    return (
      <div className="testMain">
          <div className='StartLoginBox'>
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
                      type='password'
                      placeholder='Password'
                      value={password}

                      onChange={(e) => setPassword(e.target.value)}
                  />
              </div>
              <div>
                  <span id={'errorBox'} className={'login-error'}></span>
              </div>
              <div className='LoginRow'>
                  <button className='LoginButton' type='submit' onClick={handleLogin}>Login</button>
                  {/*  <button className='LoginButton' type='submit' onClick={handleClick}>Login</button> */}
              </div>
              <div>
                  <h3 style={{color:"white"}}>
                      Dont have an account?
                  </h3>
                  <button className='LoginButton' type='submit' onClick={navigateRegister}>Register</button>
            </div>
      </div>
</div>

)
}

export default Login;