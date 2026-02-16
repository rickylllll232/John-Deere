const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Usar servidores DNS de Google

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./SRC/routes/authRoutes');
const productRoutes = require('./SRC/routes/ProductRoutes');
const connectDB = require('./SRC/config/db');

// Configuración
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Para poder leer JSON en el body

// Conexión a DB
connectDB();

// Rutas
app.use('/api/user', authRoutes);
app.use('/api/products', productRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Productos funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto: ${PORT}`);
});

module.exports = app; // Importante para Vercel y Jest