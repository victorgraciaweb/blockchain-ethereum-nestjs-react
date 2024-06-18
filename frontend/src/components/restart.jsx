import React from 'react';
import { Header } from './header';
import { Link } from 'react-router-dom'
import { Operations } from './operations';

export function Restart() {
    return (
        <div className="mx-2">
            <Operations/>
            <button className="btn btn-info w-100">Submit restart Network</button>
        </div>
    );
}