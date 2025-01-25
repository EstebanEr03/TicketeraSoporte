import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1>Bienvenido a la Gestión de Tickets</h1>
        <p>Por favor, inicia sesión o regístrate para continuar.</p>
        <div className="mt-4">
          <Link to="/login" className="btn btn-primary mx-2">Iniciar Sesión</Link>
          <Link to="/register" className="btn btn-secondary mx-2">Registrarse</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
