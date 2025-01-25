// src/Controllers/ticketController.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/tickets';
const API_USERS_URL = 'http://localhost:3001/api/users';
const API_CATEGORIES_URL = 'http://localhost:3001/api/categories';

// Actualizar el estado de un ticket
export const updateTicketStatus = async (ticketId, estado, solucion = null) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(
      `${API_URL}/update/${ticketId}`,
      {
        estado,
        solucion,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del ticket:", error.response?.data || error.message);
    throw error;
  }
};

export const ReasignarTicket = async (ticketId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${API_URL}/reasignarTicket`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    // Actualizar la lista de tickets o mostrar un mensaje de éxito
  } catch (error) {
    console.error('Error al reasignar ticket:', error.response?.data || error.message);
  }
};


// Obtener todos los tickets con filtros opcionales de estado y prioridad
export const getAllTickets = async (filters = {}) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener tickets:', error.response?.data || error.message);
    throw error;
  }
};

// Obtener los tickets creados por el solicitante autenticado
export const getMyTickets = async () => {
  const token = localStorage.getItem('token'); // Obtiene el token desde localStorage
  if (!token) {
    throw new Error('No se encontró un token. Inicia sesión nuevamente.');
  }

  try {
    const response = await axios.get('http://localhost:3001/api/tickets/my-tickets', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los tickets del solicitante:', error.message);
    throw error;
  }
};
// Obtener todos los tickets
export const getTickets = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los tickets:', error);
    throw error;
  }
};

// Obtener todos los usuarios (para la asignación de tickets)
export const getUsers = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_USERS_URL}/empleados`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Crear un nuevo ticket y asignarlo automáticamente
export const createTicket = async (ticketData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${API_URL}/create`, ticketData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el ticket:", error.response?.data || error.message);
    throw error;
  }
};

// Actualizar un ticket
export const updateTicket = async (ticketData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${API_URL}/update/${ticketData.id}`, ticketData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el ticket:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar un ticket
export const deleteTicket = async (id) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error al eliminar el ticket', error);
    throw error;
  }
};

// Obtener los tickets asignados a un agente específico
export const getAssignedTickets = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/assigned`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los tickets asignados:', error.response?.data || error.message);
    throw error;
  }
};

// Función para asignar ticket
export const asignarTicket = async (ticketId, motivoReasignacion) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(
      `${API_URL}/asignar`,
      { ticket_id: ticketId, motivo_reasignacion: motivoReasignacion },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error en la asignación del ticket:', error);
    throw error;
  }
};

// Solicitar subcategorías filtradas por categoría
export const fetchSubcategories = async (categoriaId) => {
  try {
    const response = await axios.get(`${API_CATEGORIES_URL}/subcategories`, {
      params: { categoria_id: categoriaId },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las subcategorías:', error);
    throw error;
  }
};

// Solicitar todas las categorías
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_CATEGORIES_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    throw error;
  }
};

// Actualizar subcategoría
export const updateSubcategory = async (subcategoryId, updatedData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(
      `${API_CATEGORIES_URL}/subcategories/${subcategoryId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la subcategoría', error);
    throw error;
  }
};

// Obtener agentes disponibles
export const getAgents = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_USERS_URL}/agentes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener agentes', error);
    throw error;
  }
};

// Obtener un ticket por su ID
export const getTicketById = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el ticket por ID:', error);
    throw error;
  }
};

// Crear un ticket automáticamente
export const createAutomaticTicket = async (ticketData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${API_URL}/automatic`, ticketData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el ticket automáticamente:', error.response?.data || error.message);
    throw error;
  }
};

// Ejemplo de solicitud al backend con el filtro de agente asignado
export const fetchTicketsReport = async (startDate, endDate, estado, agenteId) => {
  try {
    const params = {
      startDate,
      endDate,
      ...(estado && { estado }), // Filtro de estado
      ...(agenteId && { agenteId }), // Filtro de agente asignado
    };

    const response = await axios.get(`${API_URL}/report`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener el reporte de tickets:', error);
    throw error.response?.data || { error: 'Error inesperado al obtener el reporte' };
  }
};

export const getOverdueTickets = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get("http://localhost:3001/api/tickets/overdue", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Array.isArray(response.data) ? response.data : []; // Asegurar que siempre devuelve un array
  } catch (error) {
    console.error("Error al obtener tickets vencidos:", error.response?.data || error.message);
    return []; // Si hay error, devolver un array vacío
  }
};
