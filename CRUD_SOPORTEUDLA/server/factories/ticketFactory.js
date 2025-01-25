import { models } from '../models/index.js';

const { Ticket, HistoricoAsignaciones } = models;

export class TicketFactory {
  /**
   * Crea un ticket simple.
   * @param {Object} ticketData - Datos del ticket.
   * @returns {Promise<Object>} - El ticket creado.
   */
  static async createTicket(ticketData) {
    return await Ticket.create(ticketData);
  }

  /**
   * Crea un ticket y registra la asignación en el historial.
   * @param {Object} ticketData - Datos del ticket.
   * @param {Object} asignacionData - Datos para el historial de asignaciones.
   * @returns {Promise<Object>} - El ticket creado.
   */
  static async createTicketWithHistory(ticketData, asignacionData) {
    const ticket = await Ticket.create(ticketData);

    // Registrar en HistoricoAsignaciones
    await HistoricoAsignaciones.create({
      ticket_id: ticket.id,
      agente_id: asignacionData.agente_id,
      fecha_asignacion: asignacionData.fecha_asignacion || new Date(),
      estado_inicial: asignacionData.estado_inicial || "Abierto",
      estado_final: asignacionData.estado_final || "Abierto",
      motivo_reasignacion: asignacionData.motivo_reasignacion || null,
    });

    return ticket;
  }
}
