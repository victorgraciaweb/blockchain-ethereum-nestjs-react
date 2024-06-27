import React, { useEffect, useState } from 'react';
import { Header } from './header';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa'; 

export function ListNetworks() {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        const response = await axios.get('http://localhost:3000/api/v1/networks', { headers });
        setNetworks(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworks();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: `Are you sure you want to delete the network with ID: ${id}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Delete',
      denyButtonText: `Cancel`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const headers = {
            'Content-Type': 'application/json',
          };
          await axios.delete(`http://localhost:3000/api/v1/networks/${id}`, { headers });
          setNetworks(networks.filter((network) => network.id !== id));
          Swal.fire('Deleted!', '', 'success');
        } catch (err) {
          Swal.fire('Error!', 'Failed to delete the network.', 'error');
        }
      }
    });
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <FaSpinner className="spinner" style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Header />
      <div className='mx-3 my-2 container'>
        <h1>List Networks</h1>
        <h6><Link className='btn btn-primary' to='/network'>Add Network</Link></h6>
      </div>
      <div className='mx-3'>
        <table className='table'>
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
          <tbody className='table-group-divider'>
            {networks.map((item, index) => (
              <tr key={index}>
                <td>
                  <Link className='btn btn-success' to={`/network/${item.id}`}>Edit</Link>
                  <span> | </span>
                  <Link className='btn btn-dark' to={`/operations/${item.id}`}>Operations</Link>
                  <span> | </span>
                  <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
                <td>{item.status}</td>
                <td>{item.id}</td>
                <td>{item.chainId}</td>
                <td>{item.subnet}</td>
                <td>{item.ipBootnode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
