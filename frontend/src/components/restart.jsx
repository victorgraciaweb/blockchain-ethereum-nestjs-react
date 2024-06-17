import React from 'react';
import { Header } from './header';
import { Link } from 'react-router-dom'
import { Operations } from './operations';

export function Restart() {
  return (
    <div>
        <Operations />

        <div className="mx-2">
            <button className="btn btn-primary">Restart</button>      
        </div>
    </div>
  );
}