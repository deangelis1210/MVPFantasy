import React from 'react'
import PlayerSearch from './PlayerSearch';
import { Link, useNavigate } from 'react-router-dom';
import { database } from '../firebase.js'
import { signOut } from 'firebase/auth';
import './Team.css';
import { useDarkMode } from '../DarkModeContext.js';

function Team() {
    const history = useNavigate();

    const handleClick = () => {
        signOut(database).then(val => {
        console.log(val);
        history('/');
        });
    }

    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const handleDarkModeToggle = () => {
        toggleDarkMode();
    };
  
    return (
    <div className={isDarkMode ? 'dark-mode home-big-container' : 'home-big-container'}>
        <button onClick={handleClick} className='log-in-button'>Sign Out</button>
        <button onClick={handleDarkModeToggle} className='log-in-button'>Toggle Dark Mode</button>
        <Link to = '/home'><button className='log-in-button'>Home Page</button></Link>
        <div className="home-container">
            <img src='/images/logo.jpg' alt='logo' className='home-logo'/>
            <br/><br/>
            <PlayerSearch />
        </div>
    </div>
  )
}

export default Team