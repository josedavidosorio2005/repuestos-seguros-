const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');

// Cargar variables de entorno
dotenv.config();

// Importar base de datos
const database = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const motosRoutes = require('./routes/motos');
const autopartesRoutes = require('./routes/autopartes');
const reportesRoutes = require('./routes/reportes');
const verificacionRoutes = require('./routes/verificacion');
const usuariosRoutes = require('./routes/usuarios');
const notificacionesRoutes = require('./routes/notificaciones');
const catalogoRoutes = require('./routes/catalogo');
const sucursalesRoutes = require('./routes/sucursales');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/motos', motosRoutes);
app.use('/api/autopartes', autopartesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/verificacion', verificacionRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/catalogo', catalogoRoutes);
app.use('/api/sucursales', sucursalesRoutes);

// Ruta principal - sirve el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Iniciar servidor con inicialización de base de datos
async function startServer() {
    try {
        // Inicializar base de datos
        await database.init();
        console.log('✅ Base de datos inicializada correctamente');
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor MotoSegura corriendo en puerto ${PORT}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`💾 Base de datos SQLite lista`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
