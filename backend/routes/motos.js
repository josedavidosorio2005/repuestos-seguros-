const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Registrar nueva motocicleta
router.post('/registrar', authMiddleware, async (req, res) => {
    try {
        const { marca, modelo, año, color, numero_serie, placa, numero_motor, numero_chasis } = req.body;

        // Validaciones
        if (!marca || !modelo || !año || !numero_serie) {
            return res.status(400).json({
                success: false,
                message: 'Marca, modelo, año y número de serie son requeridos'
            });
        }

        // Verificar si el número de serie ya existe
        const [existing] = await db.query(
            'SELECT id FROM motocicletas WHERE numero_serie = ?',
            [numero_serie]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Esta motocicleta ya está registrada'
            });
        }

        // Insertar motocicleta
        const [result] = await db.query(
            `INSERT INTO motocicletas 
            (usuario_id, marca, modelo, año, color, numero_serie, placa, numero_motor, numero_chasis) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.usuario.id, marca, modelo, año, color || null, numero_serie, placa || null, numero_motor || null, numero_chasis || null]
        );

        res.status(201).json({
            success: true,
            message: 'Motocicleta registrada exitosamente',
            data: {
                id: result.insertId
            }
        });
    } catch (error) {
        console.error('Error registrando motocicleta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar motocicleta',
            error: error.message
        });
    }
});

// Obtener motocicletas del usuario
router.get('/mis-motos', authMiddleware, async (req, res) => {
    try {
        const [motos] = await db.query(
            'SELECT * FROM motocicletas WHERE usuario_id = ? ORDER BY fecha_registro DESC',
            [req.usuario.id]
        );

        res.json({
            success: true,
            data: motos
        });
    } catch (error) {
        console.error('Error obteniendo motocicletas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener motocicletas',
            error: error.message
        });
    }
});

// Obtener detalle de motocicleta con sus autopartes
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const [motos] = await db.query(
            'SELECT * FROM motocicletas WHERE id = ? AND usuario_id = ?',
            [id, req.usuario.id]
        );

        if (motos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Motocicleta no encontrada'
            });
        }

        // Obtener autopartes de la motocicleta
        const [autopartes] = await db.query(
            'SELECT * FROM autopartes WHERE motocicleta_id = ? ORDER BY fecha_registro DESC',
            [id]
        );

        res.json({
            success: true,
            data: {
                motocicleta: motos[0],
                autopartes: autopartes
            }
        });
    } catch (error) {
        console.error('Error obteniendo motocicleta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener motocicleta',
            error: error.message
        });
    }
});

module.exports = router;
