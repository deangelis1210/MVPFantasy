import React, { useState, useEffect } from 'react';

function Data() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/data');
            const responseData = await response.json();
            setData(responseData);
        }
        fetchData();
    }, []);

    return (
        <div>
            <h2>Data from Flask:</h2>
            {data ? <p>{data.message} </p> : <p>Loading...</p>}
        </div>
    );
}

export default Data;
