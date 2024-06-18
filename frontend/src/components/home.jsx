import React from 'react';
import { Header } from './header';

export function Home() {
  return (
    <div>
      <Header />
      <div>
        <h1 className='mx-4'>Equipo de proyecto</h1>
      </div>
      <div className='d-flex justify-content-start'>
        <div className='card mx-4' style={{ width: '18rem' }}>
          <img src='../../public/victorgracia.png' className='card-img-top' alt='Victor Gracia' style={{ height: '350px', objectFit: 'cover' }} />
          <div className='card-body'>
            <h5 className='card-title'>Victor Gracia</h5>
            <p className='card-text'>🚀 Blockchain Developer | NodeJS | NestJS | TypeScript | Ethereum | Blockchain | Solidity | Web3 | Crypto | DeFi | NFT | Docker | Kubernetes | Polygon 👨‍💻 (FREELANCE)</p>
            <a href='https://www.linkedin.com/in/victorgraciaweb/' target='_blank' className='btn btn-primary'>Linkedin</a>
          </div>
        </div>
        <div className='card mx-4' style={{ width: '18rem' }}>
          <img src='../../public/victorporres.jpg' className='card-img-top' alt='Victor Porres' style={{ height: '350px', objectFit: 'cover' }} />
          <div className='card-body'>
            <h5 className='card-title'>Victor Porres</h5>
            <p className='card-text'>Project Manager | Industrial Engineer | Implant Applications | Blockchain | Defi | Web3 | Developer</p>
            <a href='https://www.linkedin.com/in/victorporres/' target='_blank'  className='btn btn-primary'>Linkedin</a>
          </div>
        </div>
        <div className='card mx-4' style={{ width: '18rem' }}>
          <img src='../../public/pedrocollado.jpg' className='card-img-top' alt='Victor Porres' style={{ height: '350px', objectFit: 'cover' }} />
          <div className='card-body'>
            <h5 className='card-title'>Pedro Collado</h5>
            <p className='card-text'>.....</p>
            <a href='https://www.linkedin.com/in/pedrocollado' target='_blank' className='btn btn-primary'>Linkedin</a>
          </div>
        </div>
      </div>
    </div>
  );
}
