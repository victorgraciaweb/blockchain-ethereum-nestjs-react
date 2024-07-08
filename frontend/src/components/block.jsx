import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Operations } from './operations';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

export function Blocks() {
    const { id } = useParams();
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOnlyBlocksWithTransactions, setShowOnlyBlocks] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/networks/${id}/blocks`);
                const reversedBlocks = response.data.reverse();
                setBlocks(reversedBlocks);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlocks();
    }, [id]);

    const toggleShowOnlyBlocks = () => {
        setShowOnlyBlocks(!showOnlyBlocksWithTransactions);
    };

    const handleBlockClick = (block) => {
        if (block.transactions.length === 0) {
            Swal.fire({
                title: 'No transactions found',
                text: `Block number ${block.number} has no transactions.`,
                icon: 'warning',
            });
        } else {
            navigate(`/blocks/${id}/transactions/${block.number}`);
        }
    };

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

    const filteredBlocks = showOnlyBlocksWithTransactions ? blocks.filter(block => block.transactions.length > 0) : blocks;

    return (
        <div className="mx-2">
            <Operations />
            <div className="mt-3">
                <h3>Blocks</h3>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="showOnlyBlocks" checked={showOnlyBlocksWithTransactions} onChange={toggleShowOnlyBlocks} />
                    <label className="form-check-label" htmlFor="showOnlyBlocks">
                        Show only blocks with transactions
                    </label>
                </div>
                {filteredBlocks.length > 0 ? (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Hash</th>
                                <th>Timestamp</th>
                                <th># Transactions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBlocks.map((block, index) => (
                                <tr key={index}>
                                    <td>
                                        <button 
                                            className="btn btn-link p-0" 
                                            style={{ textDecoration: 'none' }} 
                                            onClick={() => handleBlockClick(block)}
                                        >
                                            {block.number}
                                        </button>
                                    </td>
                                    <td>{block.hash}</td>
                                    <td>{new Date(block.timestamp * 1000).toLocaleString()}</td>
                                    <td>{block.transactions.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No blocks found.</p>
                )}
            </div>
        </div>
    );
}
