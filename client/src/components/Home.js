import React from 'react';
import PlayerSearch from './PlayerSearch';
import { Link, useNavigate } from 'react-router-dom';
import { database } from '../firebase.js'
import { signOut } from 'firebase/auth';
import './Home.css';
import { useLightMode } from '../LightModeContext.js';

function Home() {

  const history = useNavigate();

  const handleClick = () => {
    signOut(database).then(val => {
      console.log(val);
      history('/');
    });
  }

  const { isLightMode, toggleLightMode } = useLightMode();
  const handleLightModeToggle = () => {
    toggleLightMode();
  };

  return (
    <div className={isLightMode ? 'light-mode home-big-container' : 'home-big-container'}>
        <button onClick={handleClick} className='log-in-button'>Sign Out</button>
        <Link to = '/team'><button className='log-in-button'>Team Page</button></Link>
        <img
         src='/images/night-light.png'
         alt='Dark Mode Toggle'
         onClick={handleLightModeToggle} 
         className='dark-mode-button'
         />
      <div className="home-container">
        <img src='/images/MVP_Fantasy-logos_transparent.png' alt='logo' className='home-logo'/>
        <br/><br/>
        <PlayerSearch />
      </div>
    </div>
  );
}

export default Home;