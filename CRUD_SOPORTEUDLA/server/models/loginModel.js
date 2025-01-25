// server/models/loginModel.js
import { DataTypes } from 'sequelize';
import db from './db.js'; // Import the Sequelize instance

const Login = db.define('Login', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios', // Reference to the 'usuarios' table
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'login', // Specify the actual table name in the database
  timestamps: false,
});

export default Login;
