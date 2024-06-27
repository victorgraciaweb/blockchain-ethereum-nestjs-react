import React, { useState, useEffect } from 'react';
import { Header } from './header';
import { useParams, useNavigate  } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

export function AddNetwork() {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;

  let initialData = {
    id: '',
    chainId: '',
    subnet: '',
    ipBootnode: '',
    alloc: [''],
    nodos: [{ id: '', type: '', name: '', ip: '', port: '' }]
  };

  const [formData, setFormData] = useState(initialData);
  const [isEditMode, setIsEditMode] = useState(false);

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
          setIsEditMode(true);
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      }
    };

    fetchData();
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
    const alloc = [...formData.alloc];
    alloc[index]= value;
    setFormData({ ...formData, alloc });
  };

  const addAllocation = () => {
    const alloc = [...formData.alloc, ''];
    setFormData({ ...formData, alloc });
  };

  const removeAllocation = (index) => {
    const alloc = formData.alloc.filter((_, i) => i !== index);
    setFormData({ ...formData, alloc });
  };

  const handleNodeChange = (e, index) => {
    const { name, value } = e.target;
    const nodos = [...formData.nodos];

    if (name === 'type' && value === 'miner') {
      const minerCount = nodos.filter(node => node.type === 'miner').length;
      if (minerCount >= 1) {
        Swal.fire({
          icon: "error",
          title: "ERROR",
          text: "There can only be one node of type MINER!"
        });
        return;
      }
    }

    nodos[index][name] = value;
    setFormData({ ...formData, nodos });
  };

  const addNode = () => {
    if (formData.nodos.length >= 5) {
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "There can only be a maximum of 5 nodes!"
      });
      return;
    }
    const nodos = [...formData.nodos, { id: formData.nodos.length + 1, type: '', name: '', ip: '', port: '' }];
    setFormData({ ...formData, nodos });
  };

  const removeNode = (index) => {
    const nodos = formData.nodos.filter((_, i) => i !== index);
    setFormData({ ...formData, nodos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const minerNodes = formData.nodos.filter(node => node.type === "miner");
    if (minerNodes.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There must be at least one node of type MINER!'
      });
      return;
    }
    if (formData.alloc.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There must be at least one account Allocation!'
      });
      return;
    }

    // Array con solo los datos necesarios
    const nodosFiltered = formData.nodos.map(node => ({
      type: node.type,
      name: node.name,
      ip: node.ip,
      port: node.port
    }));

    // Este es el body que vamos a enviar a la API
    const newFormData = {
      ...formData,
      nodos: nodosFiltered
    };

    try {
      // console.log("id",newFormData.id)
      // console.log("chainId", newFormData.chainId)
      // console.log("subnet", newFormData.subnet)
      // console.log("ipBootnode",newFormData.ipBootnode)
      // console.log("alloc",newFormData.alloc)
      // console.log("nodos",newFormData.nodos)
      const response = await axios.post('http://localhost:3000/api/v1/networks', newFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      //Swal.fire('Success', 'Network created successfully!', 'success');
      navigate('/list');
    } catch (error) {
      Swal.fire('Error', `Failed to create network: ${error.response.data.message}`, 'error');
    }
  };


  return (
    <div>
      <Header />
      <div className="mx-3 my-2 container">
      <h1>{isEditMode ? 'Edit Network' : 'Add Network'}</h1>
      </div>
      <form className="mx-3 mb-5" onSubmit={handleSubmit}>
        <div className="mb-1">
          <label htmlFor="id" className="form-label">Network ID</label>
          <input type="text" className="form-control" id="id" name="id" value={formData.id} onChange={handleChange} required disabled={isEditMode} />
        </div>
        <div className="mb-1">
          <label htmlFor="chainId" className="form-label">Chain ID</label>
          <input type="text" className="form-control" id="chainId" name="chainId" value={formData.chainId} onChange={handleChange} required disabled={isEditMode} />
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
            {formData.alloc.map((item, index) => (
              <tr key={index}>
                <td>
                  <button type="button" className="btn btn-danger" onClick={() => removeAllocation(index)}>X</button>
                </td>
                <td>
                  <input type="text" className="form-control" value={item} onChange={(e) => handleAllocationChange(e, index)} required/>
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
            {formData.nodos.map((node, index) => (
              <tr key={index}>
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
                  <input type="text" className="form-control" name="port" value={node.port} onChange={(e) => handleNodeChange(e, index)}/>
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
