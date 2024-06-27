import React, { useState, useEffect } from 'react';
import { Header } from './header';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';


export function Operations() {
    const params = useParams()
    const id = params.id
    let initialData = {
        id: '',
        chainId: '',
        subnet: '',
        ipBootnode: '',
        alloc: [''],
        nodos: [{ id: '', type: '', name: '', ip: '', port: '' }]
      };
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        const fetchData = async () => {
          if (id) {
            try {
              const headers = {
                'Content-Type': 'application/json',
              };
              const response = await axios.get(`http://localhost:3000/api/v1/networks/${id}`, { headers });
              const data = response.data;
              setFormData({
                id: data.id,
                chainId: data.chainId,
                subnet: data.subnet,
                ipBootnode: data.ipBootnode,
                alloc: data.alloc,
                nodos: data.nodos
              });
            } catch (error) {
              console.error('Error al obtener los datos:', error);
            }
          }
        };
    
        fetchData();
      }, [id]);


    //console.log(id)
    //Aqui debemos hacer consulta a server para recuperar datos de la red
    //ahora los simulo con un objeto llamado test
    // const test = {
    //     "status":"UP",
    //     "id":"1234",
    //     "chain":"chain_XXX",
    //     "subnet":"192.168.0.1",
    //     "bootnode":1234
    //   }

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
        <h3 className={`mx-3 mt-4 ${formData.status === "DOWN" ? "text-danger" : formData.status === "UP" ? "text-success" : ""}`}>
            Datos de la red {formData.id} -- {formData.status}
        </h3>

            <table className="mx-3 table">
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
                    <tr key={formData.id}>
                    <td>{formData.id}</td>
                    <td>{formData.status}</td>
                    <td>{formData.chainId}</td>
                    <td>{formData.subnet}</td>
                    <td>{formData.ipBootnode}</td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
  );
}