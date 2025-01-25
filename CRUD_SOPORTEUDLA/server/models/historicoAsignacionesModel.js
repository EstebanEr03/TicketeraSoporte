

// server/models/historicoAsignacionesModel.js
import db from './db.js';
import { DataTypes } from 'sequelize';
import Ticket from './ticketModel.js';
import User from './userModel.js';

const HistoricoAsignaciones = db.define('HistoricoAsignaciones', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Ticket,
      key: 'id'
    },
    allowNull: false,
  },
  agente_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false,
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  estado_inicial: {
    type: DataTypes.ENUM('En proceso', 'En espera', 'Abierto', 'Resuelto', 'Cerrado'),
    allowNull: false,
  },
  estado_final: {
    type: DataTypes.ENUM('En proceso', 'En espera', 'Abierto', 'Resuelto', 'Cerrado'),
    allowNull: false,
  },
  motivo_reasignacion: {
    type: DataTypes.STRING,
    allowNull: true, // Campo opcional
  },
}, {
  tableName: 'historico_asignaciones',
  timestamps: false,
});


export default HistoricoAsignaciones;