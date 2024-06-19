import React from 'react';
import { Header } from './header';
import { Link, useParams } from 'react-router-dom'

export function Operations() {
    const params = useParams()
    const id = params.id
    //console.log(id)
  return (
    <div>
        <Header />
        <div className="mx-3 my-2 container">
            <h1> Operations</h1>
        </div>
        <div className="container my-2 mx-3  d-flex justify-content-start  gap-5">
            <h5><Link className="d-flex btn btn-dark btn btn-dark" to={`/faucet/${id}`}>Faucet</Link></h5>  
            <h5><Link className="d-flex btn btn-dark" to={`/transfer/${id}`}>Transfer</Link></h5>
            <h5><Link className="d-flex btn btn-dark" to={`/up/${id}`}>Up</Link></h5>
            <h5><Link className="d-flex btn btn-dark" to={`/down/${id}`}>Down</Link></h5>
            <h5><Link className="d-flex btn btn-dark" to={`/restart/${id}`}>Restart</Link></h5>
            <h5><Link className="d-flex btn btn-dark" to={`/blocks/${id}`}>Blocks</Link></h5>
        </div>
    </div>
  );
}