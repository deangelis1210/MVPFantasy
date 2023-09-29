import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">MVP Fantasy</h1>
      <Link to="/login" className="home-link">Login</Link>
      {/* TODO */}
    </div>
  );
}

export default Home;