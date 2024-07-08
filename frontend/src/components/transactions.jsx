import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Operations } from './operations';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import '../index.css'

export function Transactions() {
    const { id, blockNumber } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/networks/${id}/blocks/${blockNumber}/transactions/`);
                setTransactions(response.data);
                // console.log("data", response.data); // Verifica la estructura de los datos recibidos
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [id, blockNumber]);


    if (loading) {
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
        )

    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="mx-2">
            <Operations />
            <div className="mt-3">
                <h3>Transactions for Block {blockNumber}</h3>
                {transactions.length > 0 ? (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Transaction Hash</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td> 
                                        <Link to={`/networks/${id}/blocks/${blockNumber}/transactions/${transaction.hash}`}>
                                            {transaction.hash}
                                        </Link>
                                    </td>
                                    <td>{transaction.from}</td>
                                    <td>{transaction.to}</td>
                                    <td>{transaction.value/1E18}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No transactions found for Block {blockNumber}.</p>
                )}
            </div>
        </div>
    );
}
