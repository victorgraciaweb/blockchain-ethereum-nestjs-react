import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Operations } from './operations';
import Swal from 'sweetalert2';
import { ethers } from 'ethers';

export function Transfer() {
    console.log('Ethers:', ethers);
    const { id } = useParams();
    console.log(id);
    const [account, setAccount] = useState('');
    const [metamaskAvailable, setMetamaskAvailable] = useState(true);

    useEffect(() => {
        console.log(typeof window.ethereum);
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
            Swal.fire('Error', 'MetaMask is not installed. Please install it to use this feature.', 'error');
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fromAddress = document.getElementById('from').value;
        const toAddress = document.getElementById('to').value;
        const amount = document.getElementById('amount').value;
        console.log(toAddress);
        console.log(amount);

        const weiAmount = ethers.utils.parseUnits(amount.toString(), 'ether');
        const txParams = {
            to: toAddress,
            from: fromAddress,
            value: weiAmount._hex
        };
        console.log(txParams);

        try {
            const tx = await ethereum.request({
                method: "eth_sendTransaction",
                params: [txParams]
            });
            Swal.fire('Success', `Transaction sent: ${tx.hash}`, 'success');
        } catch (error) {
            Swal.fire('Error', `Transaction failed: ${error.message}`, 'error');
        }
    };

    return (
        <div className="mx-2">
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
                    <div>
                        <h2>Transfer</h2>
                        <p>MetaMask is required to use the transfer feature. Please install MetaMask and try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
