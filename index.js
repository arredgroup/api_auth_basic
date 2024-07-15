import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import UserController from './controllers/UserController.js';
import AuthController from './controllers/AuthController.js';
const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
        // Allow follow-up middleware to override this CORS for options
        preflightContinue: true,
    }),
);

app.use(bodyParser.json());
app.use('/api/v1/users', UserController);
app.use('/api/v1/auth', AuthController);

app.listen(3001, ()  => {
    console.log('Server is running on port 3001');
});
//import express from 'express';
//import connectDB from './config/db.js';
//import dotenv from 'dotenv';
//import userRoutes from './routes/users.js';

//dotenv.config();

//const app = express();

// Conectar a MongoDB
//connectDB();

// Middlewares
//app.use(express.json({ extended: false }));

// Definir rutas
//app.use('/api/v1/users', userRoutes);

//const PORT = process.env.PORT || 3000;

//app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
