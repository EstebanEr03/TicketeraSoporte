// server/models/userModel.js
import { DataTypes } from 'sequelize';
import db from './db.js';

const User = db.define('User', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sede: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Identifica si es administrador
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
});

export default User;
