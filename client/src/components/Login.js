import React from 'react'
import { Link } from "react-router-dom"
import './Login.css'

function Login() {
  return (
    <div className="log-in-container">
        <form className='log-in-form'>
            <Link to = '/'>Home</Link>
            <h1>Log In</h1>
            <input type="email" placeholder="Enter your email" 
            className='text-input'></input>
            <input type="password" placeholder="Enter your password" 
            className='text-input'></input>
            <button className='log-in-button' type="submit">Log In</button>
            <button className='sign-up-button' type="submit">Sign </button>
        </form>
    </div>
  )
}

export default Login