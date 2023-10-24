import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./PlayerSearch.css"

function PlayerSearch() {
    const [playerNames, setPlayerNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPosition, setSelectedPosition] = useState('All Players');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);

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

    const handleSearch = (event) => {
        const searchTermLowerCase = event.target.value.toLowerCase();
        
        // Update the selected position to "All Players"
        setSelectedPosition('All Players');
        
        // Perform the case-insensitive search with the updated selected position
        if (searchTermLowerCase.trim() === '') {
            // If the search term is empty, show all players
            setFilteredPlayers(playerNames);
        } else {
            // Otherwise, filter based on the search term (case-insensitive)
            const filtered = playerNames.filter(name => name.toLowerCase().includes(searchTermLowerCase));
            setFilteredPlayers(filtered);
        }
    };
    
    
    
    
    
    const handleClearSearch = () => {
     
    };

    return (
        <div>
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
                        <li key={index}>{name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PlayerSearch;
