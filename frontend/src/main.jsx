import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/header';
import { ListNetworks } from './components/list_networks';
import { Home } from './components/home';
import { AddNetwork } from './components/add_network';
import { Operations } from './components/operations';
import { Faucet } from './components/faucet';



ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Header />} />
          <Route path="/home" element={<Home/>} /> 
          <Route path="/list" element={<ListNetworks />} />
          <Route path="/network" element={<AddNetwork />} />
          <Route path="/network/:id" element={<AddNetwork />} />
          <Route path="/operations/:id" element={<Operations />}/>
          <Route path="/faucet/:id" element={<Faucet />} />
          <Route path="/transfer/:id" element={<Faucet />} />
          <Route path="/up/:id" element={<Faucet />} />
          <Route path="/down/:id" element={<Faucet />} />
          <Route path="/restart/:id" element={<Faucet />} />
          
      </Routes>
    </BrowserRouter>
);
