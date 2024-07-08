import React, { useEffect, useState } from 'react';
import { Header } from './header';
import { Link, useParams } from 'react-router-dom'
import { Operations } from './operations';
import axios from 'axios';
import '../index.css';

export function Up() {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [isAlive, setIsAlive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    }, [id]);

    const handleClick = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/api/v1/networks/${id}/up`);
            setResult(response.data);
            console.log(response.data)
            // if (response.data.success) {
            //     window.location.reload(); // Forzar recarga de la página
            // }
        } catch (error) {
            console.error(error);
            setResult({ success: false, error: error.message });
        }
    };

    return (
        <div className="mx-2">
            <Operations/>
            <button onClick={handleClick} className="btn btn-success w-100">
                <i className="bi bi-arrow-up-circle-fill"></i> Submit Network Up
            </button>

            <p>Network is {isAlive ? 'alive' : 'not alive'}</p>
        </div>
    );
}

// {result && result.success ? (
//     <p>Network up successfully!</p>
// ) : (
//     <p>Error updating network: {result?.error}</p>
// )}