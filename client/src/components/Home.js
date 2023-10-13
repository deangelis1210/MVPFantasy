import React from 'react';
import PlayerSearch from './PlayerSearch';
import { Link, useNavigate } from 'react-router-dom';
import { database } from '../firebase.js'
import { signOut } from 'firebase/auth';
import './Home.css';

function Home() {

  const history = useNavigate();

  const handleClick = () => {
    signOut(database).then(val => {
      console.log(val);
      history('/');
    });
  }

  return (
    <div className='home-big-container'>
        <button onClick={handleClick} className='log-in-button'>Sign Out</button>
      <div className="home-container">
        <img src='/images/logo.jpg' alt='logo' className='home-logo'/>
        <br/><br/>
        <PlayerSearch />
      </div>
    </div>
  );
}

export default Home;