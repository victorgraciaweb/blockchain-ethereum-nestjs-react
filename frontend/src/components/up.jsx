import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Operations } from './operations';
import { FaSpinner } from 'react-icons/fa';
import {IsLoading} from './loading'
import axios from 'axios';

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
                setIsAlive({ success: false, error: error.message });
            }
        };

        checkIsAlive();
    }, [id]);

    const handleClick = async () => {
        try {
            setIsLoading(true)
            const response = await axios.post(`http://localhost:3000/api/v1/networks/${id}/up`);
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
            <IsLoading/>
        );

    }

    return (
        <div className="mx-3">
            <Operations /> 
            <button onClick={handleClick} className="btn btn-success w-100" disabled={isAlive}>
                <i className="bi bi-arrow-up-circle-fill"></i> Submit Network Up
            </button>
            {isAlive ? (
                <>
                    <div className="alert alert-success" role="alert"> Network is alredy UP </div>
                </>
            ) : (
                <>
                </>
            )}
        </div>
    );
}
