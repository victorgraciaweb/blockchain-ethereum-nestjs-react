import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Operations } from './operations';
import Swal from 'sweetalert2';

export function Faucet() {
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

    async function invokeFaucet(event) {
        event.preventDefault(); // Evitar el comportamiento por defecto del formulario

        Swal.fire({
            title: `Are you sure you want to invoke the faucet for account: ${account}?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                // const url = (`http://localhost:3333/faucet/${account}`)
                // const response = await fetch(url)
                // const json = await response.json()
                // setTx(json)
                console.log(`Faucet invoked for account ${account}`);
                Swal.fire('Faucet invoked!', '', 'success');
            }
        });
    }

    return (
        <div className='mx-2'>
            <Operations />
            <form>
                <div>
                    <h2>Faucet</h2>
                    <h5 className='text'>Account:{account}</h5>
                </div>
                <button onClick={invokeFaucet} className='btn btn-primary w-100'>
                    <i className='bi bi-droplet'></i> Submit faucet
                </button>
            </form>
        </div>
    );
}
