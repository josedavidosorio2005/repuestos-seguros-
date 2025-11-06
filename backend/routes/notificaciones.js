const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Obtener notificaciones del usuario
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [notificaciones] = await db.query(
            `SELECT * FROM notificaciones 
            WHERE usuario_id = ? 
            ORDER BY fecha_creacion DESC 
            LIMIT 50`,
            [req.usuario.id]
        );

        res.json({
            success: true,
            data: notificaciones
        });
    } catch (error) {
        console.error('Error obteniendo notificaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener notificaciones',
            error: error.message
        });
    }
});

// Marcar notificación como leída
router.put('/:id/leer', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            'UPDATE notificaciones SET leida = TRUE WHERE id = ? AND usuario_id = ?',
            [id, req.usuario.id]
        );

        res.json({
            success: true,
            message: 'Notificación marcada como leída'
        });
    } catch (error) {
        console.error('Error actualizando notificación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar notificación',
            error: error.message
        });
    }
});

// Marcar todas como leídas
router.put('/marcar-todas-leidas', authMiddleware, async (req, res) => {
    try {
        await db.query(
            'UPDATE notificaciones SET leida = TRUE WHERE usuario_id = ?',
            [req.usuario.id]
        );

        res.json({
            success: true,
            message: 'Todas las notificaciones marcadas como leídas'
        });
    } catch (error) {
        console.error('Error actualizando notificaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar notificaciones',
            error: error.message
        });
    }
});

module.exports = router;
