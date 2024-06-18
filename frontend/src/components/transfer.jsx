import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Operations } from './operations';
import Swal from 'sweetalert2';

export function Transfer() {
    const { id } = useParams(); // Obtener id de los parámetros de la URL
    const [tx, setTx] = useState(null);
    const [account, setAccount] = useState('');

    useEffect(() => {
        window.ethereum.request({
            method: 'eth_requestAccounts'
        }).then(accounts => {
            setAccount(accounts[0]);
            window.ethereum.on('accountsChanged', (accounts) => {
                setAccount(accounts[0]);
            });
        });

    }, []);
    //const { id } = useParams().id;
    return (
        <div className='mx-2'>
            <Operations/>
            <form>
                <div>
                    <h2>Transfer</h2>
                    <h5 className='text'>Account:{account}</h5>
                </div>
                <button className='btn btn-warning w-100'>
                    <i className='bi bi-cash-coin'></i> Submit transfer
                </button>
            </form>
        </div>
    );
}