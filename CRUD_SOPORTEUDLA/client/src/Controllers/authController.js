import axios from 'axios';
//const API_URL = 'https://mysql-tickets-deploy-b8922bfc52f7.herokuapp.com/api/users';  // URL de tu servidor en Heroku
const API_URL = 'http://localhost:3001/api/users';


export const login = async (values) => {
  try {
    const response = await axios.post(`${API_URL}/login`, values);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('rol_id', response.data.rol_id); // Almacenar rol_id
      return { success: true };
    } else {
      return { success: false, message: 'Credenciales inválidas' };
    }
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    return { success: false, message: 'Ocurrió un error durante el inicio de sesión' };
  }
};


export const register = async (values) => {
  try {
    const response = await axios.post(`${API_URL}/register`, values);
    if (response.data.message === 'User and login created successfully') {
      return { success: true };
    } else {
      return { success: false, message: response.data.error || 'Registration failed' };
    }
  } catch (error) {
    console.error('Error during registration:', error.response?.data || error.message);
    return { success: false, message: error.response?.data.error || 'An error occurred during registration' };
  }
};