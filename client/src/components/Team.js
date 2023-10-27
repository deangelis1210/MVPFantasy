import React, { useEffect, useState } from 'react'
import PlayerSearch from './PlayerSearch';
import { Link, useNavigate } from 'react-router-dom';
import { database } from '../firebase.js'
import { signOut } from 'firebase/auth';
import './Team.css';
import { useDarkMode } from '../DarkModeContext.js';
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

function Team() {
    const history = useNavigate();

    const handleClick = () => {
        signOut(database).then(val => {
        console.log(val);
        history('/');
        });
    }

    const [players, setPlayers] = useState([]);

    const fetchPlayers = async () => { 
        await getDocs(collection(db, "team-players"))
        .then((querySnapshot)=>{               
            const items = [];  
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setPlayers(items);            
        })
    }

    useEffect(()=>{
        fetchPlayers();
    }, [])

    useEffect(()=>{
        console.log("Updated players state:", players);
    }, [players]);

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
            <div className="player-content">
                {
                    players?.map((player,i)=>(
                        <p key={i}>
                            {player.player}
                        </p>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Team