// server/models/roleModel.js
import { DataTypes } from 'sequelize';
import db from './db.js'; // Import the database connection

// Define the Role model
const Role = db.define('Role', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'roles',  // Ensure Sequelize uses the correct table name
  timestamps: false,   // Disable timestamps if not needed in your table
});

export default Role;
