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

    // Button switching functionality from https://learnersbucket.com/tutorials/js-projects/day-night-toggle-switch-in-javascript/
    const switchBox = document.querySelector(".sun-moon");
    document.querySelector("input").addEventListener("change", (e) => {
      const { checked } = e.target;
      if (checked) {
        switchBox.classList.remove("move");
      } else {
        switchBox.classList.add("move");
      }
    });
  };

  return (
    <div className={isLightMode ? 'light-mode home-big-container' : 'home-big-container'}>
        <button onClick={handleClick} className='log-in-button'>Sign Out</button>
        <Link to = '/team'><button className='log-in-button'>Team Page</button></Link>
        <div class="sun-moon" onClick={handleLightModeToggle}>
          <input type="checkbox" defaultChecked />
          <span class="circle large"></span>
          <span class="circle small"></span>
        </div>
      <div className="home-container">
        <img src='/images/logo.jpg' alt='logo' className='home-logo'/>
        <br/><br/>
        <PlayerSearch />
      </div>
    </div>
  );
}

export default Home;