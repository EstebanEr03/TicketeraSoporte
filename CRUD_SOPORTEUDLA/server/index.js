// server/index.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { db, models } from './models/index.js'; // Importa los modelos correctamente
import userRoutes from './routes/userRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors({
  origin: ['https://transcendent-sawine-b81460.netlify.app', 'http://localhost:3000'],
  credentials: true,
}));
app.use(cookieParser());

// Usa las rutas importadas
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/categories', categoryRoutes);

// Sincronizar modelos
db.sync({ force: false }).then(() => {
  console.log('Base de datos sincronizada.');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch((error) => {
  console.error('Error al sincronizar la base de datos:', error);
});
