import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../Controllers/authController'; // Importa la función del controlador

function Register() {
  const [values, setValues] = useState({
    nombre: '',
    email: '',
    password: '',
    edad: '',
    sede: '',
    area: '',
    rol_id: '', // Nuevo campo para el rol
  });

  const navigate = useNavigate(); // Hook para redireccionar

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!values.rol_id) {
      alert('Por favor selecciona un rol');
      return;
    }
    const result = await register(values);
    if (result.success) {
      navigate('/login'); // Redirige al login
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign-Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre"><strong>Name</strong></label>
            <input type="text" placeholder="Enter Name" name="nombre"
              onChange={e => setValues({ ...values, nombre: e.target.value })}
              className="form-control rounded-0" />
          </div>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input type="email" placeholder="Enter Email" name="email"
              onChange={e => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0" />
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong></label>
            <input type="password" placeholder="Enter Password" name="password"
              onChange={e => setValues({ ...values, password: e.target.value })}
              className="form-control rounded-0" />
          </div>
          <div className="mb-3">
            <label htmlFor="edad"><strong>Age</strong></label>
            <input type="number" placeholder="Enter Age" name="edad"
              onChange={e => setValues({ ...values, edad: e.target.value })}
              className="form-control rounded-0" />
          </div>
          <div className="mb-3">
            <label htmlFor="sede"><strong>Sede</strong></label>
            <input type="text" placeholder="Enter Sede" name="sede"
              onChange={e => setValues({ ...values, sede: e.target.value })}
              className="form-control rounded-0" />
          </div>
          <div className="mb-3">
            <label htmlFor="area"><strong>Area</strong></label>
            <input type="text" placeholder="Enter Area" name="area"
              onChange={e => setValues({ ...values, area: e.target.value })}
              className="form-control rounded-0" />
          </div>
          <div className="mb-3">
            <label htmlFor="rol_id"><strong>Role</strong></label>
            <select name="rol_id" value={values.rol_id}
              onChange={e => setValues({ ...values, rol_id: e.target.value })}
              className="form-control rounded-0">
              <option value="">Select Role</option>
              <option value="1">Solicitante</option>
              <option value="2">Gestor</option>
              <option value="3">Agente</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">Sign up</button>
          <p>You agree to our terms and policies</p>
          <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Log in</Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
