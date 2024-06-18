import React from 'react';
import { Header } from './header';
import { Link, useParams } from 'react-router-dom'


export function Operations() {
    const params = useParams()
    const id = params.id
    //console.log(id)
    //Aqui debemos hacer consulta a server para recuperar datos de la red
    //ahora los simulo con un objeto llamado test
    const test = {
        "status":"UP",
        "id":"1234",
        "chain":"chain_XXX",
        "subnet":"192.168.0.1",
        "bootnode":1234
      }

  return (
    <div>
        <Header />
        <div className="mx-3 my-2 container">
            <h1> Operations</h1>
        </div>
        <div className="container my-2 mx-3 d-flex justify-content-start gap-2">
            <Link className="d-flex btn btn-dark" to={`/faucet/${id}`}>Faucet</Link> 
            <Link className="d-flex btn btn-dark" to={`/transfer/${id}`}>Transfer</Link>
            <Link className="d-flex btn btn-dark" to={`/up/${id}`}>Up</Link>
            <Link className="d-flex btn btn-dark" to={`/down/${id}`}>Down</Link>
            <Link className="d-flex btn btn-dark" to={`/restart/${id}`}>Restart</Link>
            <Link className="d-flex btn btn-dark" to={`/blocks/${id}`}>Blocks</Link>
        </div>

        <div>
        <h3 className={`mt-4 ${test.status === "DOWN" ? "text-danger" : test.status === "UP" ? "text-success" : ""}`}>
            Datos de la red {test.id} -- {test.status}
        </h3>

            <table className="table">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Status</th>
                    <th>Chain</th>
                    <th>Subnet</th>
                    <th>Bootnode</th>
                </tr>
            </thead>
            <tbody className="table-group-divider" >
                    <tr key={test.id}>
                    <td>{test.id}</td>
                    <td>{test.status}</td>
                    <td>{test.chain}</td>
                    <td>{test.subnet}</td>
                    <td>{test.bootnode}</td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
  );
}