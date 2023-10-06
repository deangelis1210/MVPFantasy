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
      history('/login')
    });
  }

  return (
    <div className="home-container">
      <img src='/images/logo.jpg' alt='logo'/>
      <br/>
      <Link to="/" className="home-link">Login</Link>
      <br/>
      <button onClick={handleClick}>Log Out</button>
      <PlayerSearch />
    </div>
  );
}

export default Home;