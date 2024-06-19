import React from 'react';
import { Header } from './header';

export function Home() {
  return (
    <div>
      <Header />
      <h1 className="mx-3">Home</h1>
      <h1 className="mx-3">Aqui igual podemos agregar información de la aplicación</h1>
    </div>
  );
}