import axios from 'axios';

// Definir la URL base del servidor desplegado en Heroku
//const API_URL = 'https://mysql-tickets-deploy-b8922bfc52f7.herokuapp.com/api/users'; // Nueva URL de tu API
const API_URL = 'http://localhost:3001/api/users';


// Obtener todos los empleados
export const getUsers = async () => {
  const token = localStorage.getItem('token'); // Agrega el token si es necesario
  try {
    const response = await axios.get(`${API_URL}/empleados`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error.response?.data || error.message);
    throw error;
  }
};

// Agregar un nuevo empleado
export const addEmpleado = async (empleado) => {
  const token = localStorage.getItem('token');
  try {
    await axios.post(`${API_URL}/register`, empleado, {
      headers: {
        'Authorization': `Bearer ${token}`, // Corregir el formato de token
      },
    });
  } catch (error) {
    console.error('Error al agregar el empleado', error);
    throw error;
  }
};


// Actualizar un empleado existente
export const updateEmpleado = async (empleado) => {
  const token = localStorage.getItem('token');
  try {
    await axios.put(`${API_URL}/update`, empleado, {
      headers: {
        Authorization: `Bearer ${token}` // Asegúrate de usar Bearer
      }
    });
  } catch (error) {
    console.error('Error al actualizar el empleado', error.response?.data || error.message);
    throw error;
  }
};



// Eliminar un empleado
export const deleteEmpleado = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token no encontrado');
    throw new Error('Token no encontrado');
  }

  try {
    console.log('Token enviado para eliminar:', token);
    await axios.delete(`${API_URL}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Formato correcto del token
      },
    });
  } catch (error) {
    console.error('Error al eliminar el empleado:', error.response?.data || error.message);
    throw error;
  }
};


