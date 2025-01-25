import { models,db } from '../models/index.js';
import { Op, fn, col } from 'sequelize';

const { Ticket, HistoricoAsignaciones,User  } = models;


// Consultar Tickets con Filtros y Relaciones
export const findAllTickets = async (filters, include) => {
    return await Ticket.findAll({
      where: filters,
      include,
    });
  };

export const findTicketById = async (id, include) => {
  return await Ticket.findByPk(id, {
    include,
  });
};

export const createTicket = async (ticketData) => {
  return await Ticket.create(ticketData);
};

export const updateTicket = async (id, updateData) => {
  const ticket = await Ticket.findByPk(id);
  if (!ticket) throw new Error('Ticket no encontrado');
  return await ticket.update(updateData);
};

export const deleteTicket = async (id) => {
  return await Ticket.destroy({
    where: { id },
  });
};

// Registrar en HistoricoAsignaciones
export const createHistoricoAsignacion = async (data) => {
  return await HistoricoAsignaciones.create(data);
};

// Repositorio para Usuarios
export const findAllAgents = async () => {
  return await User.findAll({
    where: { rol_id: 3 },
    include: [
      {
        model: Ticket,
        as: 'assignedTickets',
        where: { estado: ['Abierto', 'En proceso'] },
        required: false,
      },
      {
        model: HistoricoAsignaciones,
        as: 'historial',
        required: false,
      },
    ],
  });
};


// Eliminar registros relacionados en HistoricoAsignaciones
export const deleteHistoricoAsignacionesByTicketId = async (ticketId) => {
  return await HistoricoAsignaciones.destroy({
    where: { ticket_id: ticketId },
  });
};

// Eliminar un ticket por su ID
export const deleteTicketById = async (id) => {
  return await Ticket.destroy({
    where: { id },
  });
};

// Obtener agentes disponibles
export const findAvailableAgents = async () => {
  return await User.findAll({
    where: { rol_id: 3 }, // Solo agentes
    include: [
      {
        model: Ticket,
        as: 'assignedTickets',
        where: { estado: ['Abierto', 'En proceso'] },
        required: false, // Incluir agentes sin tickets
      },
      {
        model: HistoricoAsignaciones,
        as: 'historial',
        required: false,
      },
    ],
  });
};

// Buscar tickets vencidos

export const findOverdueTickets = async () => {
  const tickets = await Ticket.findAll({
    where: {
      estado: { [Op.not]: 'Resuelto' }, // Excluir resueltos
      fecha_vencimiento: { [Op.lte]: fn('CURDATE') }, // Comparar con la fecha actual sin hora
    },
  });

  console.log("Tickets vencidos encontrados:", tickets); // Depuración

  return Array.isArray(tickets) ? tickets : [];
};

// Buscar tickets con filtros
export const findTicketsWithFilters = async (filters) => {
  return await Ticket.findAll({
    where: filters,
    attributes: [
      'id',
      'tipo_solicitud',
      'estado',
      'hora_solicitud',
      'ultimo_cambio_estado',
      'tiempo_espera',
      'tiempo_abierto',
      'prioridad',
      'urgencia',
      'asignado_a',
    ],
  });
};

// Buscar reasignaciones dentro de un rango de fechas
export const findReasignaciones = async (start, end) => {
  return await HistoricoAsignaciones.findAll({
    attributes: [
      'agente_id',
      [db.fn('COUNT', db.col('HistoricoAsignaciones.id')), 'totalReasignaciones'], // Especifica el alias
    ],
    where: {
      motivo_reasignacion: 'Vencimiento',
      fecha_asignacion: {
        [Op.between]: [start, end],
      },
    },
    group: ['agente_id'],
    include: [
      {
        model: User,
        as: 'agente',
        attributes: ['id', 'nombre'],
      },
    ],
  });
};
