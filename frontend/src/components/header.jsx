import React from 'react';
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <div>
      <div className="my-2 mx-2 d-flex justify-content-start gap-5">
        <h5 className="d-flex">ETH</h5>
        <h5><Link  className="d-flex" to="/home">Home</Link></h5>
        <h5><Link className="d-flex" to="/list">List Networks</Link></h5>
      </div>
      <hr style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }} />
      
    </div>
  );
}
