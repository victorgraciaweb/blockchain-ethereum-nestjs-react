import React, { useEffect, useState } from 'react';
import { Header } from './header';
import { Link, useParams } from 'react-router-dom'
import { Operations } from './operations';
import axios from 'axios';

export function Restart() {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [isAlive, setIsAlive] = useState(false);

    useEffect(() => {
        const checkIsAlive = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/networks/${id}/isAlive`);
                setIsAlive(response.data.success);
            } catch (error) {
                console.error('Error checking if the network is alive:', error);
                setIsAlive({ success: false, error: error.message });
            }
        };

        // Check isAlive immediately
        checkIsAlive();

        // Check isAlive periodically every 5 seconds
        const intervalId = setInterval(checkIsAlive, 5000);
        console.log(isAlive)
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [id]);

    const handleClick = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/api/v1/networks/${id}/restart`);
            setResult(response.data);
        } catch (error) {
            console.error(error);
            setResult({ success: false, error: error.message });
        }
    };

    return (
        <div className="mx-2">
            <Operations/>
            <button onClick={handleClick} className="btn btn-success w-100">
                <i className="bi bi-arrow-up-circle-fill"></i> Submit Network Restart
            </button>
            {result && result.success ? (
                <p>Network restart successfully!</p>
            ) : (
                <p>Error restarting and updating network: {result?.error}</p>
            )}
            <p>Network is {isAlive ? 'alive' : 'not alive'}</p>
        </div>
    );
}