import React, { useEffect, useState } from 'react'
import PlayerSearch from './PlayerSearch';
import { Link, useNavigate } from 'react-router-dom';
import { database } from '../firebase.js'
import { signOut } from 'firebase/auth';
import './Team.css';
import { useLightMode } from '../LightModeContext.js';
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

function Team() {
    const history = useNavigate();

    const handleClick = () => {
        signOut(database).then(val => {
        console.log(val);
        history('/');
        });
    }

    const [players, setPlayers] = useState([]);
    const [selectedPlayerStats, setSelectedPlayerStats] = useState(null);

    const fetchPlayers = async () => { 
        const auth = getAuth();
        const user = auth.currentUser;
        const email = user.email;
        await getDocs(collection(db, email))
        .then((querySnapshot)=>{               
            const items = [];  
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setPlayers(items);            
        })
    }

    const handlePlayerStats = (playerStats) => {
        setSelectedPlayerStats(playerStats);
    };

    useEffect(()=>{
        fetchPlayers();
    }, [])

    useEffect(()=>{
        console.log("Updated players state:", players);
    }, [players]);

    const { isLightMode, toggleLightMode } = useLightMode();
    const handleLightModeToggle = () => {
        toggleLightMode();
    };
  
    return (
    <div className={isLightMode ? 'light-mode home-big-container' : 'home-big-container'}>
        <button onClick={handleClick} className='log-in-button'>Sign Out</button>
        <img
         src='/images/night-light.png'
         alt='Dark Mode Toggle'
         onClick={handleLightModeToggle} 
         className='dark-mode-button'
         />
        <Link to = '/home'><button className='log-in-button'>Home Page</button></Link>
        <div className="home-container">
            <img src='/images/MVP_Fantasy-logos_transparent.png' alt='logo' className='home-logo'/>
            <br/><br/>
            <div className='playerSearchContainer'>
                <div className="playerStatsContainer">
                    <h3>Player Stats</h3>
                    {selectedPlayerStats ? (
                    <div>
                        <p>Player Name: {selectedPlayerStats.player}</p>
                        <p>Team: {selectedPlayerStats.team}</p>
                        <p>Position: {selectedPlayerStats.position}</p>
                        <p>Games Played: {selectedPlayerStats.gamesPlayed}</p>
                        <p>Passing Yards: {selectedPlayerStats.passingYards}</p>
                        <p>Passing Touchdowns: {selectedPlayerStats.passingTouchdowns}</p>
                        <p>Passing Interceptions: {selectedPlayerStats.passingInterceptions}</p>
                        <p>Rushing Yards: {selectedPlayerStats.rushingYards}</p>
                        <p>Rushing Touchdowns: {selectedPlayerStats.rushingTouchdowns}</p>
                        <p>Receiving Receptions: {selectedPlayerStats.receivingReceptions}</p>
                        <p>Value Based Drafting (VBD): {selectedPlayerStats.vbd}</p>
                        <p>Position Rank: {selectedPlayerStats.positionRank}</p>
                        <p>Fantasy Points: {selectedPlayerStats.fantasyPoints}</p>
                        <p>Points Per Reception (PPR): {selectedPlayerStats.ppr}</p>
                        <p>Projected Fantasy Score: {selectedPlayerStats.projected}</p>
                    </div>
                ) : (
                        <p>Click on player name to view stats.</p>
                    )}
                </div>
                <div className="player-content">
                    {
                        players?.map((player,i)=>(
                            <button key={i} onClick={() => handlePlayerStats(player)}>
                                {player.player}
                            </button>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Team