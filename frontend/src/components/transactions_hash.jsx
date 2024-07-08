import React, { useEffect, useState } from 'react';
import { Operations } from './operations';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../index.css';

export function TransactionsHash() {
    const { id, blockNumber, transactionHash } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactionsHash = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/networks/${id}/blocks/${blockNumber}/transactions/${transactionHash}`);
                setData(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionsHash();
    }, [id, blockNumber, transactionHash]);

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
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Crear filas de la tabla para cada propiedad del objeto data
    const tableRows = Object.keys(data).map((key) => (
        <tr key={key}>
            <td>{key}</td>
            <td>{typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]}</td>
        </tr>
    ));

    return (
        <div className="mx-2">
            <Operations />
            <div>
                <h3>Transaction Hash: {transactionHash}</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
