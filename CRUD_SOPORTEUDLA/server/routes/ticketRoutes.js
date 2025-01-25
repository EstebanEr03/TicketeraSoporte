// server/routes/ticketRoutes.js
import express from 'express';
import {
  createTicket,
  getTickets,
  updateTicketStatus,
  deleteTicket,
  asignarTicket,
  getAssignedTickets,
  getMyTickets,
  getTicketById,
  automaticTickets,
  updateTicket,
  reasignarTicket,
  getTicketsReport,
  getOverdueTickets 
} from '../controllers/ticketController.js';
import verifyToken, { verifyRole } from '../middleware/authMiddleware.js'; // Importa los middlewares


const router = express.Router();

router.get('/overdue', verifyToken, verifyRole(2, 3), getOverdueTickets);
router.get('/report', verifyToken, verifyRole(2, 3), getTicketsReport);
router.post('/create', verifyToken, verifyRole(2), createTicket); // Crear Ticket
router.get('/all', verifyToken, verifyRole(2,3), getTickets); // Consultar todos los Tickets (Gestores)
router.get('/assigned', verifyToken, verifyRole(3), getAssignedTickets); // Solo para agentes
router.get('/my-tickets', verifyToken, verifyRole(1), getMyTickets); // Tickets creados por el solicitante
router.get('/:id', verifyToken, verifyRole(2,3), getTicketById); // Nueva ruta para obtener un ticket por ID
router.put('/:id', verifyToken, verifyRole(3), updateTicketStatus); // Cambiar estado (Agentes)
router.put('/update/:id', verifyToken, verifyRole(2,3), updateTicket); // Actualización completa (Gestores)
router.delete('/:id', verifyToken, verifyRole(2), deleteTicket); // Eliminar Ticket (Gestores)
router.post('/asignar', verifyToken, verifyRole(2), asignarTicket); // Asignación de Ticket
router.post('/automatic', verifyToken, verifyRole(1,2), automaticTickets); // Crear y asignar automáticamente
router.post('/reasignarTicket', verifyToken, verifyRole(1,2,3), reasignarTicket); // Crear y reasignar


export default router;
