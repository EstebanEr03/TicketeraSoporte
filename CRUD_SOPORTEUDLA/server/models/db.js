// server/models/db.js
import { Sequelize } from 'sequelize';

// Local database configuration
const db = new Sequelize('usuariossoporte_crud', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

/* Uncomment and use this if you want to connect to the remote database
const db = new Sequelize('heroku_400060f9830c2e6', 'b8e0f4832953a9', '7ab139e7', {
  host: 'us-cluster-east-01.k8s.cleardb.net',
  dialect: 'mysql',
});
*/

// Test the connection
// Log para verificar los modelos cargados
db.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa.');
    console.log('Modelos definidos:', db.models); // Esto listará todos los modelos registrados
  })
  .catch((error) => console.error('Error al conectar a la base de datos:', error));


export default db;
