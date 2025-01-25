import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './views/Home';
import Register from './views/Register';
import Login from './views/Login';
import SolicitanteView from './views/SolicitanteView';
import GestorView from './views/GestorView';
import Unauthorized from './views/Unauthorized';
import SolicitarTicket from './views/SolicitarTicket';
import EditTicket from './views/EditTicket';
import CreateTicket from './views/CreateTicket.jsx';
import AutomaticTicket from './views/AutomaticTicket';
import AgentTickets from './views/AgentTickets';
import CrudComponent from './views/CrudComponent'; // Importa CrudComponent
import ReportView from './views/ReportView'; // Importa la nueva vista de reportes


// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  console.log('isAuthenticated - Token:', token);
  return !!token;
};

// Función para obtener el rol del usuario
const getUserRole = () => {
  const role = localStorage.getItem('rol_id');
  console.log('getUserRole - Role ID from localStorage:', role);
  return role;
};

// Función para verificar si el usuario es administrador
const isAdmin = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded Token Payload:', payload);
    return payload.is_admin; // Retorna true o false según el token
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};

// Componente para rutas protegidas basadas en roles
const RoleBasedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    console.log('RoleBasedRoute - User not authenticated, redirecting to login.');
    return <Navigate to="/login" />;
  }

  const userRole = getUserRole();
  if (allowedRoles.includes(userRole)) {
    console.log('RoleBasedRoute - User authorized for role:', userRole);
    return children;
  }

  console.log('RoleBasedRoute - User unauthorized, redirecting to /unauthorized.');
  return <Navigate to="/unauthorized" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<Home />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Redirección después del login */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? (
              getUserRole() === '1' ? (
                <Navigate to="/solicitante" />
              ) : getUserRole() === '2' ? (
                <Navigate to="/gestor" />
              ) : (
                <Navigate to="/agente" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Rutas protegidas basadas en roles */}
        <Route
          path="/solicitante"
          element={
            <RoleBasedRoute allowedRoles={['1']}>
              <SolicitanteView />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/solicitar-ticket"
          element={
            <RoleBasedRoute allowedRoles={['1']}>
              <SolicitarTicket />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/gestor"
          element={
            <RoleBasedRoute allowedRoles={['2']}>
              <GestorView />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/gestor/edit/:id"
          element={
            <RoleBasedRoute allowedRoles={['2']}>
              <EditTicket />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/agente"
          element={
            <RoleBasedRoute allowedRoles={['3']}>
              <AgentTickets />
            </RoleBasedRoute>
          }
        />

        {/* Ruta para CrudComponent solo accesible por administradores */}
        <Route
          path="/crud-component"
          element={
            isAuthenticated() && getUserRole() === '2' && isAdmin() ? (
              <CrudComponent />
            ) : (
              <Navigate to="/unauthorized" />
            )
          }
        />

        {/* Rutas adicionales */}
        <Route
          path="/automatic-ticket"
          element={
            <RoleBasedRoute allowedRoles={['1', '2']}>
              <AutomaticTicket />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/crear-ticket"
          element={
            <RoleBasedRoute allowedRoles={['1', '2']}>
              <CreateTicket />
            </RoleBasedRoute>
          }
        />

        {/* Nueva ruta para ReportView */}
        <Route
          path="/reportes"
          element={
            <RoleBasedRoute allowedRoles={['2', '3']}>
              <ReportView />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
