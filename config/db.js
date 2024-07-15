import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const connectDB = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI); // Depurar la URI de conexión
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Detiene la aplicación si hay un error en la conexión
  }
};

export default connectDB;
