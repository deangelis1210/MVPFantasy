import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./PlayerSearch.css"
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

function PlayerSearch() {
    const [playerNames, setPlayerNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPosition, setSelectedPosition] = useState('All Players');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedPlayerStats, setSelectedPlayerStats] = useState(null);


    useEffect(() => {
        const fetchPlayerNames = async () => {
            try {
                const response = await axios.get('/api/player-names');
                setPlayerNames(response.data.player_names);
                setFilteredPlayers(response.data.player_names);
            } catch (error) {
                console.error('Error fetching player names:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerNames();
    }, []);

    const fetchPlayerStats = async (playerName) => {
        try {
            const response = await axios.get('/api/get_player_stats', {
                params: {
                    name: playerName,
                },
            });
            setSelectedPlayerStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching player stats:', error);
        }
    };

    const handlePositionChange = async (position) => {
        setLoading(true);

        try {
            const response = await axios.get(`/api/get_players_by_position`, {
                params: {
                    position,
                },
            });

            setPlayerNames(response.data.players);
            setSelectedPosition(position);
            setFilteredPlayers(response.data.players);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (event) => {
        const searchTerm = event.target.value;
    
        setSearchTerm(searchTerm);
    
        if (searchTerm.trim() === '') {
            setFilteredPlayers(playerNames);
        } else {
            setLoading(true);
            try {
                const response = await axios.get(`/api/search_player`, {
                    params: {
                        name: searchTerm,
                    },
                });
                setFilteredPlayers(response.data.players);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
    };
    
    
    const togglePlayerSelection = async (playerName) => {
        await fetchPlayerStats(playerName);
        if (selectedPlayers.includes(playerName)) {
            setSelectedPlayers(prevPlayers => prevPlayers.filter(p => p !== playerName));
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                const email = user.email;
                await deleteDoc(doc(db, email, playerName));
                alert('Player Deleted ✔');
              } catch (error) {
                alert('Player was NOT Deleted! Please try again!');
                console.error('Error deleting player from Firestore:', error);
              }
        } else {
            setSelectedPlayers(prevPlayers => [...prevPlayers, playerName]);
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                const email = user.email;
                const passDoc = doc(db, email, playerName);
                await setDoc(passDoc, {
                    player: playerName, 
                    team: selectedPlayerStats.Team,
                    position: selectedPlayerStats.Position,
                    gamesPlayed: selectedPlayerStats.Games_Played,
                    passingYards: selectedPlayerStats.Passing_Yds,
                    passingTouchdowns: selectedPlayerStats.Passing_TD,
                    passingInterceptions: selectedPlayerStats.Passing_Int,
                    rushingYards: selectedPlayerStats.Rushing_Yds,
                    rushingTouchdowns: selectedPlayerStats.Rushing_TD,
                    receivingReceptions: selectedPlayerStats.Receiving_Rec,
                    vbd: selectedPlayerStats.VBD,
                    positionRank: selectedPlayerStats.PosRank,
                    fantasyPoints: selectedPlayerStats.FantPt,
                    ppr: selectedPlayerStats.PPR,
                });
                alert('Player Added ✔');
            } catch (e) {
                alert('Player was NOT Added! Please try again!');
                console.error("Error adding document: ", e);
            }
        }
    };
    
    
    
    const handleClearSearch = () => {
        setSearchTerm('');
        setFilteredPlayers(playerNames);
    };
    
    return (
        <div className="playerSearchContainer">
            <div className="playerStatsContainer">
                <h3>Player Stats</h3>
                {selectedPlayerStats ? (
                <div>
                    <p>Player Name: {selectedPlayerStats.Player}</p>
                    <p>Team: {selectedPlayerStats.Team}</p>
                    <p>Position: {selectedPlayerStats.Position}</p>
                    <p>Games Played: {selectedPlayerStats.Games_Played}</p>
                    <p>Passing Yards: {selectedPlayerStats.Passing_Yds}</p>
                    <p>Passing Touchdowns: {selectedPlayerStats.Passing_TD}</p>
                    <p>Passing Interceptions: {selectedPlayerStats.Passing_Int}</p>
                    <p>Rushing Yards: {selectedPlayerStats.Rushing_Yds}</p>
                    <p>Rushing Touchdowns: {selectedPlayerStats.Rushing_TD}</p>
                    <p>Receiving Receptions: {selectedPlayerStats.Receiving_Rec}</p>
                    <p>Value Based Drafting (VBD): {selectedPlayerStats.VBD}</p>
                    <p>Position Rank: {selectedPlayerStats.PosRank}</p>
                    <p>Fantasy Points: {selectedPlayerStats.FantPt}</p>
                    <p>Points Per Reception (PPR): {selectedPlayerStats.PPR}</p>
                </div>
            ) : (
                    <p>Click on player name to view stats.</p>
                )}
            </div>

            <div className="playerNamesContainer">
                <h2>Player Names</h2>
                <label>
                    Filter by Position:
                    <select value={selectedPosition} onChange={(e) => handlePositionChange(e.target.value)}>
                        <option value="All Players">All Players</option>
                        <option value="QB">QB</option>
                        <option value="RB">RB</option>
                        <option value="WR">WR</option>
                        <option value="TE">TE</option>
                    </select>
                </label>

                <div>
                    <label>
                        Search:
                        <input type="text" value={searchTerm} onChange={handleSearch} />
                    </label>
                    <button onClick={handleClearSearch}>Clear Search</button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ul>
                        {filteredPlayers.map((name, index) => (
                            <li key={index} className="playerNameBox">
                                <button className="toggleButton" onClick={() => togglePlayerSelection(name)}>
                                    {selectedPlayers.includes(name) ? "-" : "+"}
                                </button>
                                <span onClick={() => fetchPlayerStats(name)}>
                                    {name}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default PlayerSearch;


