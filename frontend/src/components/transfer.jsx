import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Operations } from './operations';
import Swal from 'sweetalert2';
import { ethers } from 'ethers';

export function Transfer() {
    const [account, setAccount] = useState('');
    const [metamaskAvailable, setMetamaskAvailable] = useState(true);

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({
                method: 'eth_requestAccounts'
            }).then(accounts => {
                setAccount(accounts[0]);
                window.ethereum.on('accountsChanged', (accounts) => {
                    setAccount(accounts[0]);
                });
            }).catch(error => {
                Swal.fire('Error', `Failed to connect to MetaMask: ${error.message}`, 'error');
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const fromAddress = document.getElementById('from').value;
        const toAddress = document.getElementById('to').value;
        const amount = Number(document.getElementById('amount').value);

        // console.log("fromAddress",fromAddress)
        // console.log("toAddress",toAddress)
        // console.log("amount",Number(amount).toString(16))

        try {
            ;
            const txParams = {
                to: toAddress,
                from: fromAddress,
                value:`0x${(Number(amount)*1E18).toString(16)}`
            };
            // console.log("Params", txParams);

            // Enviar la transacción
            const tx = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [txParams],
            });
   
            Swal.fire('Success', `Transaction sent: ${tx}`, 'success');
        } catch (error) {
            Swal.fire('Error', `Transaction failed: ${error.message}`, 'error');
        }
    };

    return (
        <div className="mx-3">
            <Operations />
            <h2>Transfer</h2>
            <div className="card p-4 shadow">
                {metamaskAvailable ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-1">
                            <label className="form-label">From:</label>
                            <input id="from" type="text" className="form-control" value={account} readOnly />
                        </div>
                        <div className="mb-1">
                            <label className="form-label">To:</label>
                            <input id="to" className="form-control" required />
                        </div>
                        <div className="mb-1">
                            <label className="form-label">Amount:</label>
                            <input id="amount" className="form-control" required />
                        </div>
                        <button type="submit" className="btn btn-warning w-100 my-2">
                            <i className="bi bi-cash-coin"></i> Submit Transfer
                        </button>
                    </form>
                ) : (
                    <div class="alert alert-danger" role="alert">MetaMask is required to use the faucet. Please install MetaMask and try again.</div>
                )}
            </div>
        </div>
    );
}
