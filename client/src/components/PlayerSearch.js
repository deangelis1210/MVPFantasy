import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./PlayerSearch.css"

function PlayerSearch() {
    const [position, setPosition] = useState('QB');
    const [season, setSeason] = useState(2023);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`/api/get_players_by_position`, {
                params: {
                    position,
                    season,
                },
            });

            setPlayers(response.data.players);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Trigger the search when the component mounts or when position or season changes
        handleSearch();
    }, [position, season]);

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
    return (
        <div>
            <label>
                Position:
                <select value={position} onChange={(e) => setPosition(e.target.value)}>
                    <option value="QB">QB</option>
                    <option value="RB">RB</option>
                    <option value="WR/TE">WR/TE</option>
                </select>
            </label>

            <label>
                Season:
                <select value={season} onChange={(e) => setSeason(e.target.value)}>
                    <option value={2023}>2023</option>

                    {/* Add more options as needed */}
                </select>
            </label>

            <div>
                <h3>All Players for {position} in {season}</h3>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>{player}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PlayerSearch;
