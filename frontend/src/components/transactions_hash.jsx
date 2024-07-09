import React, { useEffect, useState } from 'react';
import { Operations } from './operations';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {IsLoading} from './loading'
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
            <IsLoading/>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Crear filas de la tabla para cada propiedad del objeto data
    const tableRows = Object.keys(data)
    .filter(key => key !== "signature") // Filtramos las keys que no sean iguales a signature
    .map((key) => (
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
