const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Obtener información del usuario
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT id, nombre, email, telefono, tipo_usuario, estado, verificado, 
            fecha_registro, ultima_conexion
            FROM usuarios WHERE id = ?`,
            [req.usuario.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
});

// Obtener estadísticas del usuario
router.get('/estadisticas', authMiddleware, async (req, res) => {
    try {
        // Contar motocicletas
        const [motos] = await db.query(
            'SELECT COUNT(*) as total FROM motocicletas WHERE usuario_id = ?',
            [req.usuario.id]
        );

        // Contar autopartes
        const [partes] = await db.query(
            `SELECT COUNT(*) as total FROM autopartes a
            INNER JOIN motocicletas m ON a.motocicleta_id = m.id
            WHERE m.usuario_id = ?`,
            [req.usuario.id]
        );

        // Contar reportes
        const [reportes] = await db.query(
            'SELECT COUNT(*) as total FROM reportes_robo WHERE usuario_id = ?',
            [req.usuario.id]
        );

        // Contar verificaciones
        const [verificaciones] = await db.query(
            'SELECT COUNT(*) as total FROM verificaciones WHERE usuario_verificador_id = ?',
            [req.usuario.id]
        );

        res.json({
            success: true,
            data: {
                motocicletas: motos[0].total,
                autopartes: partes[0].total,
                reportes: reportes[0].total,
                verificaciones: verificaciones[0].total
            }
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
});

module.exports = router;
