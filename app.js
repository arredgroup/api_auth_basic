import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json({ extended: false }));

// Definir rutas
app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
