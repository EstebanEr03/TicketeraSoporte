import express from 'express';
import {
  getRoles,
  registerUser,
  loginUser,
  getEmpleados,
  updateEmpleado,
  deleteEmpleado,
} from '../controllers/userController.js';
import verifyToken, { verifyRole,verifyAdminGestor  } from '../middleware/authMiddleware.js'; // Incluye `verifyRole`

const router = express.Router();

// Obtener roles
router.get('/roles', verifyToken, verifyAdminGestor, getRoles);

// Registrar usuarios (solo administradores)
router.post('/register', registerUser);

router.post('/login', loginUser); // Ruta para iniciar sesión

// Ruta para obtener empleados (solo accesible para gestores, rol 2 en este caso)
router.get('/empleados', verifyToken, verifyRole(2), getEmpleados);
//router.get('/empleados', getEmpleados); // Temporalmente sin middleware

// Ruta para actualizar empleados (requiere autenticación)
router.put('/update', verifyToken,verifyAdminGestor,verifyRole(2), updateEmpleado);

// Ruta para eliminar empleados (requiere autenticación)
router.delete('/delete/:id', verifyToken, verifyAdminGestor,verifyRole(2), deleteEmpleado);

export default router;
