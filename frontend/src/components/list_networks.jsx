import React from 'react';
import { Header } from './header';
import { Link } from 'react-router-dom';

export function ListNetworks() {
  const test = [{
    "status":"DOWN",
    "id":"1234",
    "chain":"chain_XXX",
    "subnet":"192.168.0.1",
    "bootnode":1234
  },{
    "status":"UP",
    "id":"4321",
    "chain":"chain_YYY",
    "subnet":"192.168.0.2",
    "bootnode":1234
  }
];
  
  return (
    <div>
      <Header />
      <div className="mx-2 my-2 container">
        <h1>List Networks</h1>
        <h6><Link to="/addnetwork">Add Network</Link></h6>
      </div>
      <div className="">
        <table className="table">
          <thead>
            <tr>
              <th>Options</th>
              <th>Status</th>
              <th>id</th>
              <th>Chain</th>
              <th>Subnet</th>
              <th>Bootnode</th>
            </tr>
          </thead>
          <tbody className="table-group-divider" >
            {test.map((item,index) => (
              <tr key={index}>
                <td>
                  <Link to={`/list/${item.id}/edit`}>Edit</Link>
                  <span> | </span>
                  <Link to={`/list/${item.id}/operaciones`}>Operations</Link>
                </td>
                <td>{item.status}</td>
                <td>{item.id}</td>
                <td>{item.chain}</td>
                <td>{item.subnet}</td>
                <td>{item.bootnode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
