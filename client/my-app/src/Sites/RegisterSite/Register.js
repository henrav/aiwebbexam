import * as React from "react";
import {useState} from "react";
import "./Register.css";
import {useNavigate} from 'react-router-dom';

import {useAuth} from '../../AuthProvider';

function Register(){
    return(

                <ReturnRegister/>

    )
}

function ReturnRegister(){
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const isCorrect = (value, final) =>{
        if (final){
            return value.length >= 3;
        }else{
            if (value === null || value === undefined || value === '') {
                return true
            }else{
                return value.length >= 3;
            }
        }

    }

    const setError = (id, bool) => {
        const errorElement = document.getElementById(id);
        if (bool) {
            errorElement.style.display = 'none';
            return true;
        } else {
            errorElement.innerHTML = 'Min 3 chars.';
            errorElement.style.display = 'block';
            errorElement.style.marginTop = 'auto';
            errorElement.style.marginBottom = 'auto';
            return false;
        }
    }

    function showPassword() {
        var x = document.getElementById("TheSecretPassword");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }

    const finalCheck = () => {
        return [
            setError('nameError', isCorrect(firstName,true)),
            setError('lastnameError', isCorrect(lastName,true)),
            setError('emailError', isCorrect(email,true)),
            setError('usernameError', isCorrect(username,true)),
            setError('passwordError', isCorrect(password, true))
        ].every(Boolean);
    }

    const handleRegister = async (event)=>{
        event.preventDefault();
        const registerDetails = {username, email, firstName, lastName, password};
        const isValid = finalCheck();

        if (!isValid) {
            console.log('Validation failed');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerDetails),
            });

            const data = await response.json();
            if (data.success) {
                console.log('Register successful');
                login(data.user);
                navigate('/');
            } else {
                console.log('Register failed:', data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error('Register error:', error);
        }
    };

    return (
        <div className='Register-main'>
            <div className="RegisterTitleContainer">
                <div className="RegisterTitle">Register</div>
            </div>
            <div className={'RegisterBoxContainer'}>
                <div className="RegisterBox">
                    <div className='RegisterRow' style={{gridColumn: 1}}>
                        <div className='RegisterText'>First Name:</div>
                    </div>
                    <div className='RegisterRow' style={{gridColumn: 2}}>
                        <input className="Registerbox-default"
                               type="text"
                               placeholder="John"
                               value={firstName}
                               minLength={3}
                               onChange={(e) => {
                                   const val = e.target.value;
                                   setFirstName(val);
                                   setError('nameError', isCorrect(val));
                               }}>
                        </input>
                    </div>
                    <div id={'nameError'} className={'register-error'}></div>
                    <div className='RegisterRow' style={{gridColumn: 1}}>
                        <div className='RegisterText'>Last Name:</div>
                    </div>
                    <div className='RegisterRow' style={{gridColumn: 2}}>
                        <input className="Registerbox-default"
                               type="text"
                               placeholder="Doe"
                               value={lastName}
                               minLength={3}
                               onChange={(e) => {
                                   const val = e.target.value;
                                   setLastName(val);
                                   setError('lastnameError', isCorrect(val));
                               }}>
                        </input>
                    </div>
                    <span id={'lastnameError'} className={'register-error'}></span>
                    <div className='RegisterRow' style={{gridColumn: 1}}>
                        <div className='RegisterText'>Email:</div>
                    </div>
                    <div className='RegisterRow' style={{gridColumn: 2}}>
                        <input className="Registerbox-default"
                               type="text"
                               placeholder="JohnDoe@gmail.com"
                               value={email}
                               minLength={3}
                               onChange={(e) => {
                                   const val = e.target.value;
                                   setEmail(val);
                                   setError('emailError', isCorrect(val));
                               }}>
                        </input>
                    </div>
                    <div id={'emailError'} className={'register-error'}></div>
                    <div className='RegisterRow' style={{gridColumn: 1}}>
                        <div className='RegisterText'>Username:</div>
                    </div>
                    <div className='RegisterRow' style={{gridColumn: 2}}>
                        <input className="Registerbox-default"
                               type="text"
                               placeholder="John123"
                               value={username}
                               minLength={3}
                               onChange={(e) => {
                                   const val = e.target.value;
                                   setUsername(val);
                                   setError('usernameError', isCorrect(val));
                               }}>
                        </input>
                    </div>
                    <div id={'usernameError'} className={'register-error'}></div>
                    <div className='RegisterRow' style={{gridColumn: 1}}>
                        <div className='RegisterText'>Password:</div>
                    </div>
                    <div className='RegisterRow' style={{gridColumn: 2}}>
                        <input className="Registerbox-default"
                               type="password"
                               placeholder="MySecretPassword"
                               value={password}
                               id="TheSecretPassword"
                               minLength={3}
                               onChange={(e) => {
                                   const val = e.target.value;
                                   setPassword(val);
                                   setError('passwordError', isCorrect(val));
                               }}>
                        </input>
                    </div>
                    <div id={'passwordError'} className={'register-error'}></div>
                    <div className='RegisterRowCheckBox' style={{gridColumn: 3}}>
                        <input type="checkbox" onClick={showPassword}/> show password
                    </div>
                </div>
                <button className='LoginButton' type='submit' onClick={handleRegister}>Register</button>
                <div>
                    <h3 style={{color:"white", marginTop: "5vh"}}>
                        Already have an account?
                    </h3>
                    <button className='LoginButton' type='submit' onClick={() => navigate('/login')}>Login</button>
                </div>

            </div>


        </div>
    )
}

export default Register;