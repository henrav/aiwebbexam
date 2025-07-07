

import './App.css';

import {useEffect, useState} from 'react';
import {Link } from "react-router-dom";
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from './Sites/DashboardSite/Dashboard';
import { Outlet } from 'react-router-dom';
export function Layout() {
    return (
    <div className="App">
        <ReturnHeader/>
        <div className="App-body">
            <div className="stars"></div>
            <Outlet/>
        </div>
        <ReturnFooter/>
    </div>
    )
}


export function App() {
    const {user} = useAuth();

    return user
        ? <Dashboard/>
        : <LoginOrRegisterColumns column={3} row={2} />;


}

function ReturnMenu(){
  return (
    <div className='Header-text'>
      <text>tjena</text>
    </div>
  )
}


function ReturnFooter(){
  return(
    <div className='App-footer'>
       <text className='Footer-text'>
        2024 Tenta QuizBuilder
       </text>
       <div className='Footer-container'>
          <text className='Footer-text'>
            Henrik Ravnborg
          </text>
       </div>
    </div>
  )
}

function ReturnDropDown({gridColumn = 2, gridRow = 1}){
  return(
    <div className='Header-text-dropdown' style={{gridColumn: {gridColumn}}}> tjena  {/* dropdown menyers nu poggers */}
          <div className='Header-text-dropdown-content'>
            <div className='Header-text-dropdown-content-grid'>
              <text >test</text>
              <text >test</text>
              <text >test</text>
            </div>
          </div>
        </div>
  )
}

function ReturnHeader() {
    const { user } = useAuth();

    return (
        <div className='App-header'>
            <div className='Header-container'>

                <div className='Header-text' style={{gridColumn: 3}}>
                    {/*  */}
                    <Link to={user ? "/dashboard" : ""}>
                        Home
                    </Link>
                </div>
                <div className={'Header-text'}>
                    <Link to={"/Map"}>Map</Link>
                </div>
                <div className={'Header-text'}>
                    <Link to={"/FileUpload"}>Create Quiz</Link>
                </div>
                <div className='Header-text'>
                    <Link to="/contactus">Contact Us</Link>
                </div>
                <LoggedInUser/>

            </div>
        </div>
    );
}

function LoggedInUser() {
    const {user, logout} = useAuth();//
    const navigate = useNavigate();

  const handleLogout = () => {
      logout();

  };
  if (!user) {
    return (
      <div className='Header-text'>
        <Link to="/login">
          Login
        </Link>
      </div>
    );
  } else {
    return (
        <div>
            <div className='Header-text-dropdown' style={{gridColumn: 7}}>
                {user.username}'s profile {/*  */}
                <i className="arrow down"></i>
                <div className='Header-text-dropdown-content'>
                    <div className='Header-text-dropdown-content-grid'>
                        <text>
                            <Link to="/dashboard">Profile</Link>
                        </text>
                        <text>
                            <Link to="/old_quizzes">Quizzes</Link>
                        </text>
                        <text>
                            <Link to='/FileUpload'>Upload File</Link>
                        </text>
                        <text>
                            <Link to='/' onClick={handleLogout}>Logout</Link>
                        </text>

                    </div>
                </div>
            </div>
        </div>

    );
  }
}

function useLoggedInUser() {
    const {user} = useAuth();
    return user;
}

function LoginOrRegisterColumns({column, row}) {
    return (
        <div className="lr-hero-wrapper">
            <p className="lr-hero-text">
                Welcome to our AI quiz-builder website.<br />
                <span className="lr-hero-em">Log in</span> or&nbsp;
                <span className="lr-hero-em">register</span> to start creating tenta quizzes.
            </p>

            <div className="lr-btn-group">
                <Link to="/login" className="LoginButton lr-btn">Login</Link>
                <span className="lr-divider">or</span>
                <Link to="/register" className="LoginButton lr-btn">Register</Link>
            </div>
        </div>
    );
}

function SetInStartBox() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      const data = await response.json();
      if (data.success){
        console.log('login successful');
      }else{
        console.log('login failed', data.message);
      }
  }catch(error){
    console.log('login error', error);
  }
};



  return (
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
        type ='text'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className='LoginRow'>
      <button className='LoginButton' type='submit' onClick={handleLogin}>Login</button>
      </div>
    </div>
  )
}


function LoginButton(){
  return (
    <button className='LoginButton' type='loginButton'>login</button>
  )
}

export default Layout;