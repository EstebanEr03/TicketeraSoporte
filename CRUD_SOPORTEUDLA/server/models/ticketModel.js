
// server/models/ticketModel.js
import { DataTypes } from 'sequelize';
import db from './db.js';

const Ticket = db.define(
  'Ticket',
  {
    tipo_solicitud: {
      type: DataTypes.ENUM('Todos', 'Incidentes', 'Cambios', 'Problemas', 'Solicitudes'),
      allowNull: false,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subcategoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM('En proceso', 'En espera', 'Abierto', 'Resuelto', 'Cerrado'),
      allowNull: false,
      defaultValue: 'Abierto',
    },
    id_solicitante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_gestor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    prioridad: {
      type: DataTypes.ENUM('Critico', 'Alto', 'Medio', 'Bajo', 'Muy Bajo'),
      allowNull: false,
    },
    urgencia: {
      type: DataTypes.ENUM('Alta', 'Media', 'Baja', 'Muy Baja'),
      allowNull: false,
    },
    hora_solicitud: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    tiempo_espera: {
      type: DataTypes.INTEGER,
      allowNull: true, // Tiempo total acumulado en estado "En espera"
      defaultValue: 0,
    },
    tiempo_abierto: {
      type: DataTypes.INTEGER,
      allowNull: true, // Tiempo total acumulado en estado "Abierto"
      defaultValue: 0,
    },
    ultimo_cambio_estado: {
      type: DataTypes.DATE,
      allowNull: true, // Registro de la última vez que cambió el estado
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    asignado_a: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    solucion: {
      type: DataTypes.TEXT,
      allowNull: true, // No es obligatorio al crear el ticket
    },    
    tiempo_estimado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'tickets',
    timestamps: false,
  }
);

// Hook para calcular tiempos automáticamente antes de guardar
Ticket.addHook('beforeSave', (ticket) => {
  const ahora = new Date();
  const horaSolicitud = new Date(ticket.hora_solicitud);

  if (ticket.estado === 'En espera') {
    ticket.tiempo_espera = Math.floor((ahora - horaSolicitud) / (1000 * 60)); // Minutos transcurridos
  } else if (ticket.estado === 'Abierto') {
    ticket.tiempo_abierto = Math.floor((ahora - horaSolicitud) / (1000 * 60)); // Minutos transcurridos
  }

  // Log para verificar valores durante el guardado
  console.log('Calculado antes de guardar:', {
    tiempo_espera: ticket.tiempo_espera,
    tiempo_abierto: ticket.tiempo_abierto,
  });
});

export default Ticket;