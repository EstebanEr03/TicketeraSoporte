
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../Controllers/authController'; // Importa la función del controlador

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [role, setRole] = useState('1'); // Estado para seleccionar el rol
  const navigate = useNavigate(); // Hook para redireccionar

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(values);

    if (result.success) {
      // Guarda el rol seleccionado en el localStorage para simular el rol del usuario
      localStorage.setItem('rol_id', role);

      if (role === '1') {
        navigate('/solicitante'); // Redirige al solicitante
      } else if (role === '2') {
        navigate('/gestor'); // Redirige al gestor
      } else if (role === '3') {
        navigate('/agente'); // Redirige al agente
      } else {
        alert('Rol no reconocido. Contacta con soporte.');
      }
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#f8f9fa' }}>
      <div className="bg-white shadow-lg p-5 rounded" style={{ width: '400px' }}>
        <h2 className="text-center mb-4" style={{ color: '#6c757d' }}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label"><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              name="email"
              onChange={e => setValues({ ...values, email: e.target.value })}
              className="form-control"
              style={{ borderRadius: '10px' }}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label"><strong>Contraseña</strong></label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              name="password"
              onChange={e => setValues({ ...values, password: e.target.value })}
              className="form-control"
              style={{ borderRadius: '10px' }}
              required
            />
          </div>

          {/* Selector de roles */}
          <div className="mb-4">
            <label htmlFor="role" className="form-label"><strong>Seleccionar Rol</strong></label>
            <select
              id="role"
              className="form-select"
              style={{ borderRadius: '10px' }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="1">Solicitante</option>
              <option value="2">Gestor</option>
              <option value="3">Agente</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100" style={{ borderRadius: '10px' }}>
            Iniciar Sesión
          </button>
          <p className="text-center mt-3" style={{ fontSize: '14px', color: '#6c757d' }}>
            Al continuar, aceptas nuestros <strong>Términos y Políticas</strong>.
          </p>
          <Link
            to="/register"
            className="btn btn-outline-secondary w-100 mt-2 text-decoration-none"
            style={{ borderRadius: '10px' }}
          >
            Crear Cuenta
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
