const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Crear nuevo reporte de robo
router.post('/crear', authMiddleware, async (req, res) => {
    try {
        const { motocicleta_id, autoparte_id, descripcion, fecha_robo, lugar_robo, numero_denuncia } = req.body;

        // Validaciones
        if (!descripcion || (!motocicleta_id && !autoparte_id)) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar descripción y al menos una motocicleta o autoparte'
            });
        }

        // Insertar reporte
        const [result] = await db.query(
            `INSERT INTO reportes_robo 
            (usuario_id, motocicleta_id, autoparte_id, descripcion, fecha_robo, lugar_robo, numero_denuncia) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.usuario.id, motocicleta_id || null, autoparte_id || null, descripcion, fecha_robo || null, lugar_robo || null, numero_denuncia || null]
        );

        // Actualizar estado de la motocicleta o autoparte
        if (motocicleta_id) {
            await db.query(
                'UPDATE motocicletas SET estado = ? WHERE id = ?',
                ['reportada_robada', motocicleta_id]
            );
        }

        if (autoparte_id) {
            await db.query(
                'UPDATE autopartes SET estado = ? WHERE id = ?',
                ['reportada_robada', autoparte_id]
            );
        }

        // Crear notificación para autoridades
        await db.query(
            `INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje)
            SELECT id, 'alerta_robo', 'Nuevo Reporte de Robo', ? 
            FROM usuarios WHERE tipo_usuario = 'autoridad'`,
            [`Se ha reportado un robo. Número de reporte: ${result.insertId}`]
        );

        res.status(201).json({
            success: true,
            message: 'Reporte creado exitosamente',
            data: {
                id: result.insertId
            }
        });
    } catch (error) {
        console.error('Error creando reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear reporte',
            error: error.message
        });
    }
});

// Obtener reportes del usuario
router.get('/mis-reportes', authMiddleware, async (req, res) => {
    try {
        const [reportes] = await db.query(
            `SELECT r.*, 
            m.marca as moto_marca, m.modelo as moto_modelo, m.placa,
            a.nombre_parte, a.tipo_parte
            FROM reportes_robo r
            LEFT JOIN motocicletas m ON r.motocicleta_id = m.id
            LEFT JOIN autopartes a ON r.autoparte_id = a.id
            WHERE r.usuario_id = ?
            ORDER BY r.fecha_reporte DESC`,
            [req.usuario.id]
        );

        res.json({
            success: true,
            data: reportes
        });
    } catch (error) {
        console.error('Error obteniendo reportes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener reportes',
            error: error.message
        });
    }
});

// Obtener todos los reportes (solo autoridades)
router.get('/todos', authMiddleware, async (req, res) => {
    try {
        if (req.usuario.tipo_usuario !== 'autoridad') {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para ver todos los reportes'
            });
        }

        const { estado } = req.query;
        
        let query = `
            SELECT r.*, 
            u.nombre as reportante_nombre, u.email as reportante_email,
            m.marca as moto_marca, m.modelo as moto_modelo, m.placa,
            a.nombre_parte, a.tipo_parte, a.codigo_unico
            FROM reportes_robo r
            INNER JOIN usuarios u ON r.usuario_id = u.id
            LEFT JOIN motocicletas m ON r.motocicleta_id = m.id
            LEFT JOIN autopartes a ON r.autoparte_id = a.id
        `;
        
        const params = [];

        if (estado) {
            query += ' WHERE r.estado = ?';
            params.push(estado);
        }

        query += ' ORDER BY r.fecha_reporte DESC';

        const [reportes] = await db.query(query, params);

        res.json({
            success: true,
            data: reportes
        });
    } catch (error) {
        console.error('Error obteniendo reportes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener reportes',
            error: error.message
        });
    }
});

// Actualizar estado de reporte (solo autoridades)
router.put('/:id/estado', authMiddleware, async (req, res) => {
    try {
        if (req.usuario.tipo_usuario !== 'autoridad') {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para actualizar reportes'
            });
        }

        const { id } = req.params;
        const { estado } = req.body;

        await db.query(
            'UPDATE reportes_robo SET estado = ?, autoridad_asignada = ? WHERE id = ?',
            [estado, req.usuario.id, id]
        );

        res.json({
            success: true,
            message: 'Estado del reporte actualizado'
        });
    } catch (error) {
        console.error('Error actualizando reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar reporte',
            error: error.message
        });
    }
});

module.exports = router;
