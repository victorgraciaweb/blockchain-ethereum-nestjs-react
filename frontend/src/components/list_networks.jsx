import React from 'react';
import { Header } from './header';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export function ListNetworks() {
  
  //El test debe ser la consulta al servidor par que me devuelva todas las redes que tengo
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

const handleDelete = (id) => {
  Swal.fire({
    title: `Are you sure you want to delete the network with ID: ${id}?`,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: 'Delete',
    denyButtonText: `Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      // Simula una solicitud al servidor para eliminar la red
      console.log(`Network ${id} deleted`);
      //Aqui debemos hacer la petición al servidor y ver lo que nos devuelve 
      //para saber si hemos podido eliminar o no la network
      Swal.fire('Deleted!', '', 'success');
      
    }
  });
};

  
  return (
    <div>
      <Header />
      <div className="mx-3 my-2 container">
        <h1>List Networks</h1>
        <h6><Link className="btn btn-primary" to="/network">Add Network</Link></h6>
      </div>
      <div className="mx-3">
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
                  <Link className="btn btn-success" to={`/network/${item.id}`}>Edit</Link>
                  <span> | </span>
                  <Link className="btn btn-dark" to={`/operations/${item.id}`}>Operations</Link>
                  <span> | </span>
                  <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
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
