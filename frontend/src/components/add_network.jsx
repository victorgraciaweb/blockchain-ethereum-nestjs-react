import React, { useState, useEffect } from 'react';
import { Header } from './header';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2'

export function AddNetwork() {
  const params = useParams();
  const id = params.id;

  let initialData = {
    networkid: '',
    chainid: '',
    subnet: '',
    ipBootnode: '',
    allocation: [{ id: '', value: '' }],
    nodes: [{ id: '', type: '', name: '', ip: '', port: '' }]
  };

  let allocationNumberElements
  let nodesNumberElements

  const [formData, setFormData] = useState(initialData);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      // Hacer consulta al servidor para obtener datos por ID
      // Aquí deberías hacer una llamada al servidor para obtener los datos relevantes a la blockchain
      // Por ejemplo: fetch(`/api/network/${id}`).then(response => response.json()).then(data => setFormData(data));
      // Vamos a simular que se han obtenido los datos y se establece el estado de edición
      setFormData({
        ...initialData,
        networkid: id,
        chainid: '1234', // Simular datos obtenidos del servidor
        subnet: '192.168.0.0/24',
        ipBootnode: '192.168.0.1',
        allocation: [{ id: 1, value: '0x1234' }, { id: 2, value: '0x5678' }],
        nodes: [{ id: 1, type: 'rpc', name: 'Node1', ip: '192.168.0.2', port: '30303' },
           { id: 2, type: 'miner', name: 'Node2', ip: '192.168.0.3', port: '30304' }, 
           { id: 3, type: 'normal', name: 'Node3', ip: '192.168.0.3', port: '30305' }
          ]
      });
      setIsEditMode(true);
    }
  }, [id]);

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

    if (name === 'type' && value === 'miner') {
      const minerCount = nodes.filter(node => node.type === 'miner').length;
      if (minerCount >= 1) {
        Swal.fire({
          icon: "error",
          title: "ERROR",
          text: "¡There can only be one node of type MINER!"
        });
        return;
      }
    }

    nodes[index][name] = value;
    setFormData({ ...formData, nodes });
  };

  const addNode = () => {
    if (formData.nodes.length >= 5) {
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "¡There can only be a maximum of 5 nodes!"
      });
      return;
    }
    const nodes = [...formData.nodes, { id: formData.nodes.length + 1, type: '', name: '', ip: '', port: '' }];
    setFormData({ ...formData, nodes });
  };

  const removeNode = (index) => {
    const nodes = formData.nodes.filter((_, i) => i !== index);
    setFormData({ ...formData, nodes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const minerNodes= formData.nodes.filter(node => node.type === "miner")
    if (minerNodes.length === 0){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There must be at least one node of type MINER!'
      });
      return;
    }
    if (formData.allocation.length === 0){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There must be at least one account Allocation!'
      });
      return;
    }
    // Enviar datos al servidor
    console.log('Form Data Submitted:', formData);
  };

  return (
    <div>
      <Header />
      <div className="mx-3 my-2 container">
      <h1>{isEditMode ? 'Edit Network' : 'Add Network'}</h1>
      </div>
      <form className="mx-3 mb-5" onSubmit={handleSubmit}>
        <div className="mb-1">
          <label htmlFor="networkid" className="form-label">Network ID</label>
          <input type="text" className="form-control" id="networkid" name="networkid" value={formData.networkid} onChange={handleChange} required disabled={isEditMode} />
        </div>
        <div className="mb-1">
          <label htmlFor="chainid" className="form-label">Chain ID</label>
          <input type="text" className="form-control" id="chainid" name="chainid" value={formData.chainid} onChange={handleChange} required disabled={isEditMode} />
        </div>
        <div className="mb-1">
          <label htmlFor="subnet" className="form-label">Subnet</label>
          <input type="text" className="form-control" id="subnet" name="subnet" value={formData.subnet} onChange={handleChange} required disabled={isEditMode} />
        </div>
        <div className="mb-1">
          <label htmlFor="ipBootnode" className="form-label">IP Bootnode</label>
          <input type="text" className="form-control" id="ipBootnode" name="ipBootnode" value={formData.ipBootnode} onChange={handleChange} required disabled={isEditMode} />
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
        <button type="button" className="btn btn-secondary mb-3 w-25" onClick={addAllocation}>Add Allocation</button>

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
                  <button type="button" className="btn btn-danger" onClick={() => removeNode(index)}>X</button>
                </td>
                <td>
                  <select className="form-control" name="type" value={node.type} onChange={(e) => handleNodeChange(e, index)} required>
                    <option value="">Select Type</option>
                    <option id="rpc" value="rpc">RPC</option>
                    <option id="miner" value="miner">MINER</option>
                    <option id="normal" value="normal">NORMAL</option>
                  </select>
                </td>
                <td>
                  <input type="text" className="form-control" name="name" value={node.name} onChange={(e) => handleNodeChange(e, index)} required/>
                </td>
                <td>
                  <input type="text" className="form-control" name="ip" value={node.ip} onChange={(e) => handleNodeChange(e, index)} required/>
                </td>
                <td>
                  <input type="text" className="form-control" name="port" value={node.port} onChange={(e) => handleNodeChange(e, index)} required/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="btn btn-secondary mb-3 w-25" onClick={addNode}>Add Node</button>

        <br></br>
        <button type="submit" className="btn btn-primary w-100">Submit</button>
      </form>
    </div>
  );
}
