import React from 'react';
import { Header } from './header';
import { Link } from 'react-router-dom'
import { Operations } from './operations';

export function Up() {
    //const { id } = useParams().id;
    return (
        <div className="mx-2">
            <Operations/>
            <button className="btn btn-success w-100">Submit Network Up</button>
        </div>
    );
}