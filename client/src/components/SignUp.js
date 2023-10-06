import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { database } from '../firebase.js'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import './SignUp.css'

function SignUp() {
    const [errorMessage, setErrorMessage] = useState('');
  
    const history = useNavigate();
  
    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
    
        setErrorMessage('');

        createUserWithEmailAndPassword(database, email, password).then(data => {
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
                <h1>Sign Up</h1>
                <input name="email" placeholder="Enter your email" 
                className='text-input'></input>
                <input name="password" type='password' placeholder="Enter your password" 
                className='text-input'></input>
                <button className='sign-up-button' type="submit">Sign Up</button>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <div className='signup-prompt-container'>Already have an account? <Link to = '/'>Sign In</Link> </div>
                <br/>
                <Link to = '/home'>Home</Link>
          </form>
      </div>
    )
}

export default SignUp