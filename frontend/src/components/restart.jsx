import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Operations } from './operations';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';

export function Restart() {
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
                setIsAlive({ success: false, error: error.message });
            }
        };

        checkIsAlive();
    }, [id]);

    const handleClick = async () => {
        try {
            setIsLoading(true)
            const response = await axios.post(`http://localhost:3000/api/v1/networks/${id}/restart`);
            setResult(response.data);
        }catch(error){
            console.log("error",error)
            setResult({ success: false, error: error.message });
        }finally{
            setIsLoading(false)
            setIsAlive(true)
        }
    };
    if (isLoading){
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <FaSpinner className="spinner" style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }} />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );

    }

    return (
        <div className="mx-3">
            <Operations /> 
            <button onClick={handleClick} className="btn btn-warning w-100" disabled={!isAlive}>
                <i className="bi bi-skip-start-btn-fill"></i> Submit Network Restart
            </button>
            {!isAlive ? (
                <>
                    <div className="alert alert-warning" role="alert"> Restart is only available when the network is UP </div>
                </>
            ) : (
                <>
                </>
            )}
        </div>
    );
}
