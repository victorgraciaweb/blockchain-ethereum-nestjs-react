import React, { useState } from 'react';
import { Header } from './header';
import { Link, useParams } from 'react-router-dom';

export function AddNetwork() {
  const params= useParams()
  const id = params.id 
  
  let initialData ={
    networkid: '',
    chainid: '',
    subnet: '',
    ipBootnode: '',
    allocation: [{ id: 1, value: '' }],
    nodes: [{ id: 1, type: '', name: '', ip: '', port: '' }]
  }

  if (id){
    //Hacer consultar al servidor si id existe
    //para que devuelva todos los datos relevante a la id de la blockchain
    initialData.networkid=id
  }

  //initialData puede ser vacio si vamos a crear uno nuevo
  //o puede estar relleno si venimos de editar una blockchain levantada anteriormente
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAllocationChange = (e, index) => {
    const { value } = e.target;
    const allocation = [...formData.allocation];
    allocation[index].value = value;
    setFormData({ ...formData, allocation });
  };

  const addAllocation = () => {
    const allocation = [...formData.allocation, { id: formData.allocation.length + 1, value: '' }];
    setFormData({ ...formData, allocation });
  };

  const removeAllocation = (index) => {
    const allocation = formData.allocation.filter((_, i) => i !== index);
    setFormData({ ...formData, allocation });
  };

  const handleNodeChange = (e, index) => {
    const { name, value } = e.target;
    const nodes = [...formData.nodes];
    nodes[index][name] = value;
    setFormData({ ...formData, nodes });
  };

  const addNode = () => {
    const nodes = [...formData.nodes, { id: formData.nodes.length + 1, type: '', name: '', ip: '', port: '' }];
    setFormData({ ...formData, nodes });
  };

  const removeNode = (index) => {
    const nodes = formData.nodes.filter((_, i) => i !== index);
    setFormData({ ...formData, nodes });
  };

  const handleSubmit = (e) => {
   
    //Envio de acción al servidor pdte programar.
    console.log('Form Data Submitted:', formData);
  };

  return (
    <div>
      <Header />
      <div className="mx-2 my-2 container">
        <h1>Add Network</h1>
      </div>
      <form className="mx-3" onSubmit={handleSubmit}>
        <div className="mb-1">
          <label htmlFor="networkid" className="form-label">Network ID</label>
          <input type="text" className="form-control" id="networkid" name="networkid" value={formData.networkid} onChange={handleChange} required />
        </div>
        <div className="mb-1">
          <label htmlFor="chainid" className="form-label">Chain ID</label>
          <input type="text" className="form-control" id="chainid" name="chainid" value={formData.chainid} onChange={handleChange} required />
        </div>
        <div className="mb-1">
          <label htmlFor="subnet" className="form-label">Subnet</label>
          <input type="text" className="form-control" id="subnet" name="subnet" value={formData.subnet} onChange={handleChange} required/>
        </div>
        <div className="mb-1">
          <label htmlFor="ipBootnode" className="form-label">IP Bootnode</label>
          <input type="text" className="form-control" id="ipBootnode" name="ipBootnode" value={formData.ipBootnode} onChange={handleChange} required/>
        </div>
        <h3>Allocation</h3>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Remove</th>
              <th scope="col">Account (Wallet)</th>
            </tr>
          </thead>
          <tbody>
            {formData.allocation.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <button type="button" className="btn btn-danger" onClick={() => removeAllocation(index)}>X</button>
                </td>
                <td>
                  <input type="text" className="form-control" value={item.value} onChange={(e) => handleAllocationChange(e, index)} required/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="btn btn-secondary mb-3" onClick={addAllocation}>Add Allocation</button>

        <h3>Nodes</h3>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Remove</th>
              <th scope="col">Type</th>
              <th scope="col">Name</th>
              <th scope="col">IP</th>
              <th scope="col">Port</th>
            </tr>
          </thead>
          <tbody>
            {formData.nodes.map((node, index) => (
              <tr key={node.id}>
                <td>
                  <button type="button" className="btn btn-danger" onClick={() => removeNode(index)} >X</button>
                </td>
                <td>
                  <select className="form-control" name="type" value={node.type} onChange={(e) => handleNodeChange(e, index)} required>
                    <option value="">Select Type</option>
                    <option id="rpc" value="rpc">RPC</option>
                    <option id="miner" value="miner">MINER</option>
                  </select>
                </td>
                <td>
                  <input type="text"className="form-control"name="name"value={node.name}onChange={(e) => handleNodeChange(e, index)}required/>
                </td>
                <td>
                  <input type="text"className="form-control"name="ip"value={node.ip}onChange={(e) => handleNodeChange(e, index)}required/>
                </td>
                <td>
                  <input type="text"className="form-control"name="port"value={node.port}onChange={(e) => handleNodeChange(e, index)}required/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button"className="btn btn-secondary mb-3"onClick={addNode}>Add Node</button>
  
        <br></br>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
