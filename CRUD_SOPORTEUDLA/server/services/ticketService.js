import { Op } from 'sequelize'; // Importar Op si lo usas aquí
import * as ticketRepository from '../repositories/ticketRepository.js';
import { models } from '../models/index.js';
import { getBestAgent } from './agentService.js';
import { TicketFactory } from '../factories/ticketFactory.js';

import AgentSelector from './agentSelector.js';
import {
  LeastLoadStrategy,
  RoundRobinStrategy,
  WeightedLoadStrategy,
} from '../strategies/agentSelectionStrategies.js';
import { CustomAgentSelectionStrategy } from '../strategies/customAgentSelectionStrategy.js';


const {User, Category, Subcategory,HistoricoAsignaciones } = models;

// Obtener Tickets Asignados a un Agente
export const getAssignedTickets = async (agentId) => {
    const filters = { asignado_a: agentId };
    const include = [
      { model: User, as: 'solicitante', attributes: ['nombre'] },
      { model: Category, as: 'categoria_rel', attributes: ['nombre'] },
      { model: Subcategory, as: 'subcategoria_rel', attributes: ['nombre'] },
    ];
  
    return await ticketRepository.findAllTickets(filters, include);
  };

// Obtener Tickets Creados por el Solicitante
export const getMyTickets = async (userId) => {
    const filters = { id_solicitante: userId }; // Filtro por solicitante
    const include = [
      { model: Category, as: 'categoria_rel', attributes: ['nombre'] },
      { model: Subcategory, as: 'subcategoria_rel', attributes: ['nombre'] },
      { model: User, as: 'agente', attributes: ['nombre'] }, // Relación con el agente asignado
    ];
  
    return await ticketRepository.findAllTickets(filters, include);
  };  

// Crear Ticket
export const createTicket = async (ticketData) => {
  const {
    tipo_solicitud,
    categoria_id,
    subcategoria_id,
    id_solicitante,
    ubicacion,
    prioridad,
    urgencia,
    fecha_vencimiento,
    id_gestor,
    asignado_a,
    estado,
    tiempo_estimado,
  } = ticketData;

  // Validar que el agente asignado sea válido
  const agente = await User.findOne({ where: { id: asignado_a, rol_id: 3 } });
  if (!agente) {
    throw new Error("El agente asignado no es válido");
  }

  const ahora = new Date(); // Momento actual

  // Crear el ticket usando la fábrica
  const newTicket = await TicketFactory.createTicketWithHistory(
    {
      tipo_solicitud,
      categoria_id,
      subcategoria_id,
      id_solicitante,
      ubicacion,
      prioridad,
      urgencia,
      estado: estado || "Abierto",
      hora_solicitud: ahora,
      ultimo_cambio_estado: ahora,
      fecha_vencimiento,
      id_gestor,
      asignado_a,
      tiempo_espera: estado === "En espera" ? 0 : null,
      tiempo_abierto: estado === "Abierto" ? 0 : null,
      tiempo_estimado: tiempo_estimado || null,
    },
    {
      agente_id: asignado_a,
      fecha_asignacion: ahora,
      estado_inicial: "Abierto",
      estado_final: estado || "Abierto",
    }
  );

  return newTicket;
};


// Obtener Tickets según el Rol del Usuario
export const getTicketsByRole = async (rol_id, user_id) => {
  let filters = {};
  let include = [
    { model: Category, as: 'categoria_rel', attributes: ['nombre'] },
    { model: Subcategory, as: 'subcategoria_rel', attributes: ['nombre'] },
    { model: User, as: 'solicitante', attributes: ['id', 'nombre'] },
    { model: User, as: 'gestor', attributes: ['id', 'nombre'] },
    { model: User, as: 'agente', attributes: ['id', 'nombre'] },
  ];

  if (rol_id == '2') {
    // Gestor: No se filtran tickets, ve todos
    filters = {};
  } else if (rol_id == '3') {
    // Agente: Solo los tickets asignados al agente
    filters = { asignado_a: user_id };
  } else {
    // Roles no permitidos
    throw new Error('No tienes permisos para acceder a los tickets.');
  }

  return await ticketRepository.findAllTickets(filters, include);
};

// Actualizar el estado de un ticket
export const updateTicketStatus = async (id, { estado, motivo_reasignacion, solucion }) => {
  // Buscar el ticket por ID
  const ticket = await ticketRepository.findTicketById(id);
  if (!ticket) {
    throw new Error('Ticket no encontrado');
  }

  const ahora = new Date();
  const ultimoCambio = new Date(ticket.ultimo_cambio_estado || ticket.hora_solicitud);
  const tiempoTranscurrido = Math.floor((ahora - ultimoCambio) / (1000 * 60));

  let tiempoEspera = ticket.tiempo_espera || 0;
  let tiempoAbierto = ticket.tiempo_abierto || 0;

  const estadoInicial = ticket.estado;

  // Actualizar los tiempos acumulados según el estado inicial
  if (estadoInicial === 'En espera') {
    tiempoEspera += tiempoTranscurrido;
  } else if (estadoInicial === 'Abierto') {
    tiempoAbierto += tiempoTranscurrido;
  }

  // Actualizar el ticket
  const updatedTicket = await ticketRepository.updateTicket(id, {
    estado,
    ultimo_cambio_estado: ahora,
    tiempo_espera: tiempoEspera,
    tiempo_abierto: tiempoAbierto,
    solucion: solucion || ticket.solucion,
  });

  // Registrar el cambio en HistoricoAsignaciones
  await ticketRepository.createHistoricoAsignacion({
    ticket_id: ticket.id,
    agente_id: ticket.asignado_a,
    fecha_asignacion: ahora,
    estado_inicial: estadoInicial,
    estado_final: estado,
    motivo_reasignacion: motivo_reasignacion || null,
  });

  return updatedTicket;
};

// Eliminar un Ticket
export const deleteTicket = async (id) => {
  // Primero, eliminar registros relacionados en HistoricoAsignaciones
  await ticketRepository.deleteHistoricoAsignacionesByTicketId(id);

  // Luego, eliminar el ticket
  const ticketDeleted = await ticketRepository.deleteTicketById(id);

  if (!ticketDeleted) {
    throw new Error('Ticket no encontrado');
  }

  return { message: 'Ticket eliminado correctamente' };
};

// Asignar un Ticket Automáticamente
export const asignarTicket = async (ticket_id, motivo_reasignacion) => {
  // Buscar el ticket
  const ticket = await ticketRepository.findTicketById(ticket_id);
  if (!ticket) {
    throw new Error('Ticket no encontrado');
  }

  // Obtener tiempo estimado desde la subcategoría
  const subcategoria = await Subcategory.findByPk(ticket.subcategoria_id);
  const tiempoEstimado = subcategoria ? subcategoria.tiempo_estimado : 0;

  // Obtener agentes disponibles
  const agentes = await ticketRepository.findAvailableAgents();
  if (!agentes || agentes.length === 0) {
    throw new Error('No hay agentes disponibles para asignación');
  }

  console.log('Agentes disponibles:', agentes);

  // Seleccionar al agente con menor carga de trabajo
  let menorCarga = Number.MAX_SAFE_INTEGER;
  let agenteSeleccionado = null;

  for (const agente of agentes) {
    const cargaActual = agente.assignedTickets.reduce((acc, t) => acc + t.tiempo_estimado, 0);
    if (cargaActual < menorCarga) {
      menorCarga = cargaActual;
      agenteSeleccionado = agente;
    }
  }

  if (!agenteSeleccionado) {
    throw new Error('No se encontró un agente adecuado para asignación');
  }

  // Actualizar el ticket con el agente seleccionado y tiempo estimado
  const updatedTicket = await ticketRepository.updateTicket(ticket_id, {
    asignado_a: agenteSeleccionado.id,
    tiempo_estimado: tiempoEstimado,
  });

  // Registrar en HistoricoAsignaciones
  await ticketRepository.createHistoricoAsignacion({
    ticket_id: ticket_id,
    agente_id: agenteSeleccionado.id,
    estado_inicial: ticket.estado,
    estado_final: 'Asignado',
    motivo_reasignacion: motivo_reasignacion || null,
  });

  return { ticket: updatedTicket, agente: agenteSeleccionado };
};
// Obtener un Ticket por su ID
export const getTicketById = async (id) => {
  // Relaciones a incluir
  const include = [
    { model: Category, as: 'categoria_rel', attributes: ['nombre'] },
    { model: Subcategory, as: 'subcategoria_rel', attributes: ['nombre'] },
    { model: User, as: 'solicitante', attributes: ['nombre'] },
  ];

  // Buscar el ticket por ID
  const ticket = await ticketRepository.findTicketById(id, include);
  if (!ticket) {
    throw new Error('Ticket no encontrado');
  }

  return ticket;
};


// Variable global para rastrear la última asignación
let ultimaAsignacion = null;


export const createAndAssignTicket = async (ticketData, id_solicitante) => {
  const {
    tipo_solicitud,
    categoria_id,
    subcategoria_id,
    ubicacion,
    prioridad,
    urgencia,
    fecha_vencimiento,
  } = ticketData;

  if (!tipo_solicitud || !prioridad || !urgencia) {
    throw new Error('Faltan datos obligatorios para crear el ticket');
  }

  const subcategoria = subcategoria_id
    ? await Subcategory.findByPk(subcategoria_id)
    : null;
  const categoria = categoria_id
    ? await Category.findByPk(categoria_id)
    : null;

  if (!subcategoria && !categoria) {
    throw new Error('Categoría o subcategoría no válidas');
  }

  const tiempoEstimado = subcategoria?.tiempo_estimado || categoria?.tiempo_estimado || 30;
  const agentes = await ticketRepository.findAvailableAgents();

  if (!agentes || agentes.length === 0) {
    throw new Error('No hay agentes disponibles para asignar');
  }

  // Usar tu estrategia personalizada
  const selector = new AgentSelector(new CustomAgentSelectionStrategy(ultimaAsignacion));

  const mejorAgente = selector.select(agentes, prioridad, urgencia);

  if (!mejorAgente) {
    throw new Error('No se encontró un agente adecuado para asignar');
  }

  const newTicket = await ticketRepository.createTicket({
    tipo_solicitud,
    categoria_id: categoria_id || null,
    subcategoria_id: subcategoria_id || null,
    id_solicitante,
    ubicacion: ubicacion || null,
    prioridad,
    urgencia,
    estado: 'Abierto',
    hora_solicitud: new Date(),
    fecha_vencimiento: fecha_vencimiento || null,
    tiempo_estimado: tiempoEstimado,
    asignado_a: mejorAgente.id,
  });

  await ticketRepository.createHistoricoAsignacion({
    ticket_id: newTicket.id,
    agente_id: mejorAgente.id,
    estado_inicial: 'Abierto',
    estado_final: 'En proceso',
    motivo_reasignacion: null,
  });

  ultimaAsignacion = mejorAgente.id;

  return { ticket: newTicket, agente: mejorAgente };
};

// Seleccionar el mejor agente
const seleccionarMejorAgente = (agentes, prioridad, urgencia) => {
  console.log('Comenzando la selección del mejor agente...');

  // Paso 1: Priorizar agentes sin carga
  const agentesSinCarga = agentes.filter(
    (agente) => !agente.assignedTickets || agente.assignedTickets.length === 0
  );

  if (agentesSinCarga.length > 0) {
    console.log('Agentes sin carga detectados:', agentesSinCarga.map((a) => a.nombre));

    if (ultimaAsignacion) {
      const indiceUltimaAsignacion = agentesSinCarga.findIndex(
        (agente) => agente.id === ultimaAsignacion
      );
      const siguienteIndice =
        (indiceUltimaAsignacion + 1) % agentesSinCarga.length;

      console.log(
        `Rotación cíclica: Última asignación a ${ultimaAsignacion}. Próximo agente: ${agentesSinCarga[siguienteIndice].nombre}`
      );

      return agentesSinCarga[siguienteIndice];
    } else {
      console.log(
        `Seleccionando el primer agente sin carga: ${agentesSinCarga[0].nombre}`
      );
      return agentesSinCarga[0];
    }
  }

  // Paso 2: Agentes con carga ponderada
  const agentesOrdenados = agentes.map((agente) => {
    const cargaActual = agente.assignedTickets.reduce(
      (acc, t) => acc + t.tiempo_estimado,
      0
    );
    const ticketsAsignados = agente.assignedTickets.length;

    const ticketsResueltos = agente.historial
      ? agente.historial.filter((h) => h.estado_final === 'Resuelto').length
      : 0;

    const eficiencia = ticketsResueltos || 1; // Evitar división por 0
    const pesoPrioridad = prioridad === 'Critico' ? 3 : prioridad === 'Alto' ? 2 : 1;
    const pesoUrgencia = urgencia === 'Alta' ? 3 : urgencia === 'Media' ? 2 : 1;

    const cargaPonderada =
      (cargaActual + ticketsAsignados * 10) / eficiencia +
      pesoPrioridad +
      pesoUrgencia;

    console.log(`Agente: ${agente.nombre}`);
    console.log(`  Carga Actual: ${cargaActual}`);
    console.log(`  Tickets Asignados: ${ticketsAsignados}`);
    console.log(`  Tickets Resueltos: ${ticketsResueltos}`);
    console.log(`  Eficiencia: ${eficiencia}`);
    console.log(`  Carga Ponderada: ${cargaPonderada}`);

    return { agente, cargaPonderada };
  });

  agentesOrdenados.sort((a, b) => a.cargaPonderada - b.cargaPonderada);

  console.log('Agentes ordenados por carga ponderada:', agentesOrdenados.map((a) => a.agente.nombre));

  if (ultimaAsignacion) {
    const indiceUltimaAsignacion = agentesOrdenados.findIndex(
      (a) => a.agente.id === ultimaAsignacion
    );
    const siguienteIndice =
      (indiceUltimaAsignacion + 1) % agentesOrdenados.length;

    console.log(
      `Rotación cíclica: Última asignación a ${ultimaAsignacion}. Próximo agente: ${agentesOrdenados[siguienteIndice].agente.nombre}`
    );

    return agentesOrdenados[siguienteIndice].agente;
  } else {
    console.log(
      `Seleccionando el primer agente por carga ponderada: ${agentesOrdenados[0].agente.nombre}`
    );
    return agentesOrdenados[0].agente;
  }
};
// Actualizar Ticket
export const updateTicket = async (id, updateData) => {
  const { estado, asignado_a, id_gestor, motivo_reasignacion, ...otherUpdates } = updateData;

  // Buscar el ticket por ID
  const ticket = await ticketRepository.findTicketById(id);
  if (!ticket) {
    throw new Error('Ticket no encontrado');
  }

  const ahora = new Date();
  const estadoInicial = ticket.estado; // Estado actual antes de actualizar
  const agenteInicial = ticket.asignado_a; // Agente actual antes de actualizar
  const gestorInicial = ticket.id_gestor; // Gestor actual antes de actualizar

  // Detectar si hubo cambios en estado, asignado_a, id_gestor
  const estadoCambia = estado && estado !== estadoInicial;
  const agenteCambia = asignado_a && asignado_a !== agenteInicial;
  const gestorCambia = id_gestor && id_gestor !== gestorInicial;

  // Cálculo de tiempo transcurrido desde el último cambio
  const ultimoCambio = new Date(ticket.ultimo_cambio_estado || ticket.hora_solicitud);
  const tiempoTranscurrido = Math.floor((ahora - ultimoCambio) / (1000 * 60)); // Minutos transcurridos

  // Inicializar tiempos acumulados si no están definidos
  let tiempoEspera = ticket.tiempo_espera || 0;
  let tiempoAbierto = ticket.tiempo_abierto || 0;

  // Sumar tiempo transcurrido basado en el estado inicial
  if (estadoInicial === 'En espera') {
    tiempoEspera += tiempoTranscurrido;
  } else if (estadoInicial === 'Abierto') {
    tiempoAbierto += tiempoTranscurrido;
  }

  // Preparar datos para la actualización
  const updatedData = {
    ...otherUpdates, // Otros campos como categoría, subcategoría, prioridad, etc.
    estado: estado || ticket.estado, // Actualizar estado si fue enviado
    asignado_a: asignado_a || ticket.asignado_a, // Actualizar asignado_a si fue enviado
    id_gestor: id_gestor || ticket.id_gestor, // Actualizar id_gestor si fue enviado
    ultimo_cambio_estado: estadoCambia ? ahora : ticket.ultimo_cambio_estado, // Actualiza solo si el estado cambió
    tiempo_espera: tiempoEspera,
    tiempo_abierto: tiempoAbierto,
  };

  // Actualizar el ticket
  const updatedTicket = await ticketRepository.updateTicket(id, updatedData);

  // Si el estado, el agente o el gestor cambiaron, registrar en HistoricoAsignaciones
  if (estadoCambia || agenteCambia || gestorCambia) {
    await ticketRepository.createHistoricoAsignacion({
      ticket_id: ticket.id,
      agente_id: asignado_a || ticket.asignado_a, // Agente asignado
      fecha_asignacion: ahora,
      estado_inicial: estadoInicial,
      estado_final: estado || ticket.estado, // Usa el nuevo estado o el estado actual como valor predeterminado
      motivo_reasignacion: motivo_reasignacion || null, // Campo opcional
    });
  }

  return updatedTicket;
};

// Reasignar Tickets Vencidos
export const reasignarTicketsVencidos = async () => {
  console.log('Buscando tickets vencidos...');
  
  // Obtener tickets vencidos
  const overdueTickets = await ticketRepository.findOverdueTickets();
  console.log('Tickets vencidos encontrados:', overdueTickets.map((t) => t.id));

  if (overdueTickets.length === 0) {
    console.log('No hay tickets vencidos para reasignar.');
    return { message: 'No hay tickets vencidos para reasignar.' };
  }

  for (const ticket of overdueTickets) {
    console.log(`Procesando ticket: ${ticket.id}`);
    console.log('Buscando agentes disponibles...');

    // Obtener agentes disponibles
    const agentes = await ticketRepository.findAvailableAgents();

    if (!agentes || agentes.length === 0) {
      console.warn('No hay agentes disponibles para reasignar el ticket:', ticket.id);
      continue;
    }

    console.log('Agentes disponibles:', agentes.map((a) => a.nombre));

    // Seleccionar el mejor agente
    const mejorAgente = getBestAgent(agentes, ticket.prioridad, ticket.urgencia);

    console.log('Mejor agente seleccionado:', mejorAgente?.nombre);

    if (!mejorAgente) {
      console.warn('No se pudo seleccionar un agente para el ticket:', ticket.id);
      continue;
    }

    // Actualizar el estado del ticket y registrar en el historial
    await ticketRepository.updateTicket(ticket.id, {
      estado: 'En proceso',
      asignado_a: mejorAgente.id,
    });

    await ticketRepository.createHistoricoAsignacion({
      ticket_id: ticket.id,
      agente_id: mejorAgente.id,
      estado_inicial: ticket.estado,
      estado_final: 'En proceso',
      motivo_reasignacion: 'Vencimiento',
    });

    console.log(`Ticket ${ticket.id} reasignado exitosamente.`);
  }

  return { message: 'Tickets vencidos reasignados correctamente' };
};
// Generar reporte de tickets por rango de fechas
export const getTicketsReport = async (startDate, endDate, estado, agenteId) => {
  if (!startDate || !endDate) {
    throw new Error('Debes proporcionar las fechas startDate y endDate.');
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59`);

  // Construir filtros
  const filtros = {
    hora_solicitud: {
      [Op.between]: [start, end],
    },
  };
  if (estado) filtros.estado = estado;
  if (agenteId) filtros.asignado_a = agenteId;

  console.log('Filtros aplicados:', filtros);

  // Obtener tickets principales
  const tickets = await ticketRepository.findTicketsWithFilters(filtros);

  // Obtener reasignaciones
  const reasignaciones = await ticketRepository.findReasignaciones(start, end);

  // Determinar agente con más reasignaciones
  const agenteConMasReasignaciones = reasignaciones.sort(
    (a, b) => b.dataValues.totalReasignaciones - a.dataValues.totalReasignaciones
  )[0];

  return {
    totalTickets: tickets.length,
    tickets,
    reasignaciones: reasignaciones.map((r) => ({
      agente: r.agente.nombre,
      totalReasignaciones: r.dataValues.totalReasignaciones,
    })),
    agenteConMasReasignaciones: agenteConMasReasignaciones
      ? {
          nombre: agenteConMasReasignaciones.agente.nombre,
          total: agenteConMasReasignaciones.dataValues.totalReasignaciones,
        }
      : null,
  };
};

export const getOverdueTickets = async () => {
  const tickets = await ticketRepository.findOverdueTickets();

  console.log("Respuesta de findOverdueTickets:", tickets); // Debugging

  return Array.isArray(tickets) ? tickets : [];
};


