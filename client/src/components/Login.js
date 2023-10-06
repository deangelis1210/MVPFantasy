import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { database } from '../firebase.js'
import { signInWithEmailAndPassword } from 'firebase/auth'
import './Login.css'

function Login() {
  const [errorMessage, setErrorMessage] = useState('');

  const history = useNavigate();

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
    <div className="log-in-container">
        <form className='log-in-form' onSubmit={(e) => handleSubmit(e)}>
            <img src='/images/logo.jpg' alt="logo"/>
            <h1>Sign In</h1>
            <input name="email" placeholder="Enter your email" 
            className='text-input'></input>
            <input name="password" type='password' placeholder="Enter your password" 
            className='text-input'></input>
            <button className='log-in-button' type="submit">Sign In</button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className='signup-prompt-container'>Don't have an account? <Link to = '/signup'>Sign Up</Link></div>
            <br/>
            <Link to = '/home'>Home</Link>
        </form>
    </div>
  )
}

export default Login