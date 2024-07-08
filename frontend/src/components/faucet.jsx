import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Operations } from './operations';
import Swal from 'sweetalert2';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';

export function Faucet() {
    const { id } = useParams();
    const [account, setAccount] = useState('');
    const [amount, setAmount] = useState('0.15');
    const [metamaskAvailable, setMetamaskAvailable] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({
                method: 'eth_requestAccounts'
            }).then(accounts => {
                setAccount(accounts[0]);
                window.ethereum.on('accountsChanged', (accounts) => {
                    setAccount(accounts[0]);
                });
            });
        } else {
            setMetamaskAvailable(false);
            Swal.fire({
                title: 'MetaMask is not available',
                text: 'Please install MetaMask to use this feature.',
                icon: 'warning',
            });
        }
    }, []);

    async function invokeFaucet(event) {
        event.preventDefault();
        Swal.fire({
            title: `Are you sure you want to invoke the faucet for account: ${account}?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)
                try {
                    const body = {
                        address: account,
                        quantity: amount
                    };

                    const response = await axios.post(`http://localhost:3000/api/v1/networks/${id}/faucet`, body);
                    console.log(response.data);
                    Swal.fire('Success', `Faucet invoked! ${response.data.hash}`, 'success');
                } catch (error) {
                    console.log(error);
                    Swal.fire('Error', 'Error invoking faucet', error.message, 'error');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        });
    }

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

    return (
        <div className="mx-2">
            <Operations />
            <h2>Faucet</h2>
            <div className="card p-4 shadow">
                {metamaskAvailable ? (
                    <form>
                        <div className="mb-1">
                            <label className="form-label">Account:</label>
                            <input id="account" type="text" className="form-control" value={account} readOnly />
                        </div>
                        <div className="mb-1">
                            <label className="form-label">Amount:</label>
                            <input id="amount" className="form-control" value={amount} readOnly/>
                        </div>
                        <button onClick={invokeFaucet} className='btn btn-primary w-100'>
                            <i className='bi bi-droplet'></i> Submit faucet
                        </button>
                    </form>
                ) : (
                    <div>
                        <h2>Faucet</h2>
                        <p>MetaMask is required to use the faucet. Please install MetaMask and try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
