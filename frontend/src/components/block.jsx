import React from 'react';
import { Operations } from './operations';

export function Blocks() {
    return (
        <div className="mx-2">
            <Operations/>
            <button className="btn btn-info w-100">
                <i className="bi bi-skip-start-btn-fill"></i> Blocks
            </button>
        </div>
    );
}