import React from 'react';
import { useParams } from 'react-router-dom';
import { Operations } from './operations';

export function Faucet() {
    //const { id } = useParams().id;
    return (
        <div className="mx-2">
            <Operations/>
            <button className="btn btn-warning w-100">Submit faucet</button>
        </div>
    );
}
