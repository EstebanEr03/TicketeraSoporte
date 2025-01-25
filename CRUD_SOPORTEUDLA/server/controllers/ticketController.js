// server/controllers/ticketController.js
import { db } from '../models/index.js'; // Ajusta el path según la estructura de tu proyecto
import { Op } from 'sequelize';
import Ticket from '../models/ticketModel.js';
import User from '../models/userModel.js';
import HistoricoAsignaciones from '../models/historicoAsignacionesModel.js';
import Category from '../models/categoryModel.js';
import Subcategory from '../models/subcategoryModel.js';
import * as ticketService from '../services/ticketService.js';

// Obtener Tickets Asignados a un Agente
export const getAssignedTickets = async (req, res) => {
  const { id } = req.user; // ID del agente logueado

  try {
    // Delegar al servicio
    const tickets = await ticketService.getAssignedTickets(id);
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error al obtener los tickets asignados:", error);
    res.status(500).json({ error: "Error al obtener los tickets asignados" });
  }
};

// Obtener Tickets Creados por el Solicitante
export const getMyTickets = async (req, res) => {
  const { id: user_id } = req.user; // Obtiene el ID del usuario autenticado

  try {
    if (!user_id) {
      return res.status(400).json({ error: 'No se encontró el ID del solicitante.' });
    }

    // Llamamos al servicio para obtener los tickets del solicitante
    const tickets = await ticketService.getMyTickets(user_id);

    // Enviamos la respuesta con los tickets obtenidos
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error al obtener los tickets del solicitante:', error.message);
    res.status(500).json({ error: 'Error al obtener los tickets del solicitante' });
  }
};

// Crear Ticket - Solo accesible por Solicitantes
export const createTicket = async (req, res) => {
  try {
    console.log("Datos recibidos para crear el ticket:", req.body);

    // Llamar al servicio para crear el ticket
    const newTicket = await ticketService.createTicket(req.body);

    res.status(201).json({ message: "Ticket creado correctamente", ticket: newTicket });
  } catch (error) {
    console.error("Error al crear el ticket:", error.message);
    res.status(500).json({ error: error.message || "Error al crear el ticket" });
  }
};

// Consultar Tickets - Acceso según Rol
export const getTickets = async (req, res) => {
  const { rol_id, user_id } = req.user; // Extraer el rol y el ID del usuario autenticado

  try {
    // Llamar al servicio para obtener los tickets según el rol
    const tickets = await ticketService.getTicketsByRole(rol_id, user_id);

    // Enviar los tickets obtenidos
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error al obtener los tickets:', error.message);
    if (error.message === 'No tienes permisos para acceder a los tickets.') {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al obtener los tickets' });
    }
  }
};

// Actualizar Ticket - Cambiar estado (solo Agentes)
export const updateTicketStatus = async (req, res) => {
  const { id } = req.params; // Obtener el ID del ticket desde los parámetros de la URL
  const { estado, motivo_reasignacion, solucion } = req.body; // Datos enviados en el cuerpo de la solicitud

  try {
    // Llamar al servicio para actualizar el estado del ticket
    const updatedTicket = await ticketService.updateTicketStatus(id, { estado, motivo_reasignacion, solucion });

    // Enviar la respuesta con el ticket actualizado
    res.status(200).json({ message: 'Estado del ticket actualizado correctamente', ticket: updatedTicket });
  } catch (error) {
    console.error('Error al actualizar el estado del ticket:', error.message);
    res.status(500).json({ error: error.message || 'Error al actualizar el estado del ticket' });
  }
};

// Eliminar Ticket - Solo Gestores
export const deleteTicket = async (req, res) => {
  const { id } = req.params; // Obtener el ID del ticket desde los parámetros de la URL

  try {
    // Llamar al servicio para eliminar el ticket
    const result = await ticketService.deleteTicket(id);

    // Enviar la respuesta
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al eliminar el ticket:', error.message);
    if (error.message === 'Ticket no encontrado') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar el ticket' });
    }
  }
};


// Asignación Automática de Tickets - Gestión de Carga de Trabajo
export const asignarTicket = async (req, res) => {
  const { ticket_id, motivo_reasignacion } = req.body;

  try {
    // Llamar al servicio para asignar el ticket
    const result = await ticketService.asignarTicket(ticket_id, motivo_reasignacion);

    // Enviar la respuesta con los datos del ticket asignado
    res.status(200).json({ message: 'Ticket asignado exitosamente', ...result });
  } catch (error) {
    console.error('Error en la asignación automática:', error.message);
    res.status(500).json({ error: error.message || 'Error en la asignación automática' });
  }
};


// Obtener un Ticket por su ID
export const getTicketById = async (req, res) => {
  const { id } = req.params; // Obtener el ID del ticket desde los parámetros de la URL

  try {
    // Llamar al servicio para obtener el ticket por ID
    const ticket = await ticketService.getTicketById(id);

    // Enviar la respuesta con el ticket obtenido
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error al obtener el ticket por ID:', error.message);
    if (error.message === 'Ticket no encontrado') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al obtener el ticket' });
    }
  }
};
// Asignación Automática y Creación de Ticket
export const automaticTickets = async (req, res) => {
  const id_solicitante = req.user?.id; // ID del solicitante autenticado
  const ticketData = req.body; // Datos del ticket

  if (!id_solicitante) {
    return res
      .status(401)
      .json({ error: 'No se encontró el ID del solicitante. Verifica tu sesión.' });
  }

  try {
    // Llamar al servicio para crear y asignar el ticket
    const result = await ticketService.createAndAssignTicket(ticketData, id_solicitante);

    // Enviar la respuesta
    res.status(201).json({ message: 'Ticket creado y asignado automáticamente', ...result });
  } catch (error) {
    console.error('Error al crear el ticket automáticamente:', error.message);
    res.status(500).json({ error: error.message || 'Error al crear el ticket automáticamente' });
  }
};

// Actualizar Ticket
export const updateTicket = async (req, res) => {
  const { id } = req.params; // ID del ticket desde los parámetros de la URL
  const updateData = req.body; // Datos enviados en el cuerpo de la solicitud

  console.log('Datos recibidos para actualizar ticket:', updateData);

  try {
    // Llamar al servicio para actualizar el ticket
    const updatedTicket = await ticketService.updateTicket(id, updateData);

    console.log('Ticket actualizado exitosamente:', updatedTicket);

    // Enviar respuesta
    res.status(200).json({ message: 'Ticket actualizado correctamente', ticket: updatedTicket });
  } catch (error) {
    console.error('Error al actualizar el ticket:', error.message);
    if (error.message === 'Ticket no encontrado') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar el ticket' });
    }
  }
};

// Reasignar Tickets Vencidos
export const reasignarTicket = async (req, res) => {
  try {
    const result = await ticketService.reasignarTicketsVencidos();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al reasignar tickets:', error.message);
    res.status(500).json({ error: 'Error al reasignar tickets' });
  }
};

// Generar reporte de tickets por rango de fechas
export const getTicketsReport = async (req, res) => {
  const { startDate, endDate, estado, agenteId } = req.query;

  try {
    // Llamar al servicio para generar el reporte
    const report = await ticketService.getTicketsReport(startDate, endDate, estado, agenteId);

    res.status(200).json(report);
  } catch (error) {
    console.error('Error al generar el reporte:', error.message);
    if (error.message.includes('fechas')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al generar el reporte.' });
    }
  }
};
// Obtener tickets vencidos
export const getOverdueTickets = async (req, res) => {
  try {
    const overdueTickets = await ticketService.getOverdueTickets();

    if (!overdueTickets || overdueTickets.length === 0) {
      console.warn("No se encontraron tickets vencidos.");
      return res.status(200).json([]); // Devuelve un array vacío en lugar de error
    }

    res.status(200).json(overdueTickets);
  } catch (error) {
    console.error('Error al obtener tickets vencidos:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




