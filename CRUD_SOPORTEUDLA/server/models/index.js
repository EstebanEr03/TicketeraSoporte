// server/models/index.js
import db from './db.js';
import User from './userModel.js';
import Ticket from './ticketModel.js';
import Category from './categoryModel.js';
import Subcategory from './subcategoryModel.js';
import HistoricoAsignaciones from './historicoAsignacionesModel.js';
import Login from './loginModel.js';
import Role from './roleModel.js';
import associateModels from './associateModels.js';

// Registrar los modelos
const models = {
  User,
  Ticket,
  Category,
  Subcategory,
  HistoricoAsignaciones,
  Login,
  Role,
  sequelize: db, // Exporta la instancia de Sequelize con el nombre "sequelize"
};

// Configurar relaciones
associateModels(models);

export { models, db };
