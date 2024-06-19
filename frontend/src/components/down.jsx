import React from 'react';
import { Header } from './header';
import { Link } from 'react-router-dom'
import { Operations } from './operations';

export function Down() {
    return (
        <div className="mx-2">
            <Operations/>
            <button className="btn btn-danger w-100">Submit Network Down</button>
        </div>
    );
}