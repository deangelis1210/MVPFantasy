import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { database } from '../firebase.js'
import { signInWithEmailAndPassword } from 'firebase/auth'
import './Login.css'
import { useLightMode } from '../LightModeContext.js';

function Login() {
  const [errorMessage, setErrorMessage] = useState('');

  const history = useNavigate();

  const { isLightMode, toggleLightMode } = useLightMode();
  const handleLightModeToggle = () => {
    toggleLightMode();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setErrorMessage('');

      signInWithEmailAndPassword(database, email, password).then(data => {
        console.log(data, "authData");
        history('/home');
      }).catch((error) => {
        console.log(error.code);
        setErrorMessage(error.message);
      });
  }

  return (
    <div className={isLightMode ? 'light-mode log-in-container' : 'log-in-container'}>
      <img
        src='/images/night-light.png'
        alt='Dark Mode Toggle'
        onClick={handleLightModeToggle} 
        className='dark-mode-button'
        />
      <form className='log-in-form' onSubmit={(e) => handleSubmit(e)}>
        <img src='/images/MVP_Fantasy-logos_transparent.png' alt="logo"/>
        <h1>Sign In</h1>
        <input name="email" placeholder="Enter your email" 
        className='text-input'></input>
        <input name="password" type='password' placeholder="Enter your password" 
        className='text-input'></input>
        <br/>
        <button className='log-in-button' type="submit">Sign In</button>
        <br/><br/>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className='signup-prompt-container'>Don't have an account? <Link to = '/signup'>Sign Up</Link></div>
        <br/>
      </form>
    </div>
  )
}

export default Login