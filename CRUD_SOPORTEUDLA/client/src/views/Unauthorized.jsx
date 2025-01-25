import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/'); // Redirige a la página principal
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Acceso Denegado</h1>
      <p>No tienes los permisos necesarios para acceder a esta página.</p>
      <button 
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleBackToHome}
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default Unauthorized;
