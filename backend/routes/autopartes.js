const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Registrar nueva autoparte con código QR
router.post('/registrar', authMiddleware, async (req, res) => {
    try {
        const { motocicleta_id, tipo_parte, nombre_parte, numero_serie, marca, modelo_compatible, descripcion } = req.body;

        // Validaciones
        if (!motocicleta_id || !tipo_parte || !nombre_parte) {
            return res.status(400).json({
                success: false,
                message: 'Motocicleta, tipo y nombre de parte son requeridos'
            });
        }

        // Verificar que la motocicleta pertenece al usuario
        const [motos] = await db.query(
            'SELECT id FROM motocicletas WHERE id = ? AND usuario_id = ?',
            [motocicleta_id, req.usuario.id]
        );

        if (motos.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos sobre esta motocicleta'
            });
        }

        // Generar código único
        const codigo_unico = `AP-${uuidv4()}`;

        // Generar código QR
        const qrData = JSON.stringify({
            codigo: codigo_unico,
            tipo: tipo_parte,
            nombre: nombre_parte,
            fecha: new Date().toISOString()
        });

        const qrCode = await QRCode.toDataURL(qrData);

        // Insertar autoparte
        const [result] = await db.query(
            `INSERT INTO autopartes 
            (motocicleta_id, tipo_parte, nombre_parte, numero_serie, codigo_unico, codigo_qr, marca, modelo_compatible, descripcion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [motocicleta_id, tipo_parte, nombre_parte, numero_serie || null, codigo_unico, qrCode, marca || null, modelo_compatible || null, descripcion || null]
        );

        res.status(201).json({
            success: true,
            message: 'Autoparte registrada exitosamente',
            data: {
                id: result.insertId,
                codigo_unico,
                qr_code: qrCode
            }
        });
    } catch (error) {
        console.error('Error registrando autoparte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar autoparte',
            error: error.message
        });
    }
});

// Obtener autopartes del usuario
router.get('/mis-partes', authMiddleware, async (req, res) => {
    try {
        const [autopartes] = await db.query(
            `SELECT a.*, m.marca as moto_marca, m.modelo as moto_modelo, m.placa 
            FROM autopartes a
            INNER JOIN motocicletas m ON a.motocicleta_id = m.id
            WHERE m.usuario_id = ?
            ORDER BY a.fecha_registro DESC`,
            [req.usuario.id]
        );

        res.json({
            success: true,
            data: autopartes
        });
    } catch (error) {
        console.error('Error obteniendo autopartes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener autopartes',
            error: error.message
        });
    }
});

// Buscar autoparte por código
router.get('/buscar/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;

        const [autopartes] = await db.query(
            `SELECT a.*, m.marca as moto_marca, m.modelo as moto_modelo, m.estado as moto_estado,
            u.nombre as propietario_nombre
            FROM autopartes a
            INNER JOIN motocicletas m ON a.motocicleta_id = m.id
            INNER JOIN usuarios u ON m.usuario_id = u.id
            WHERE a.codigo_unico = ?`,
            [codigo]
        );

        if (autopartes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Autoparte no encontrada'
            });
        }

        res.json({
            success: true,
            data: autopartes[0]
        });
    } catch (error) {
        console.error('Error buscando autoparte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar autoparte',
            error: error.message
        });
    }
});

// Obtener autoparte por ID con historial
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener autoparte
        const [autopartes] = await db.query(
            `SELECT a.*, m.marca as moto_marca, m.modelo as moto_modelo, m.placa,
            u.nombre as propietario_nombre, u.email as propietario_email
            FROM autopartes a
            INNER JOIN motocicletas m ON a.motocicleta_id = m.id
            INNER JOIN usuarios u ON m.usuario_id = u.id
            WHERE a.id = ?`,
            [id]
        );

        if (autopartes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Autoparte no encontrada'
            });
        }

        // Obtener historial de verificaciones
        const [verificaciones] = await db.query(
            `SELECT v.*, u.nombre as verificador_nombre
            FROM verificaciones v
            INNER JOIN usuarios u ON v.usuario_verificador_id = u.id
            WHERE v.autoparte_id = ?
            ORDER BY v.fecha_verificacion DESC`,
            [id]
        );

        res.json({
            success: true,
            data: {
                autoparte: autopartes[0],
                historial_verificaciones: verificaciones
            }
        });
    } catch (error) {
        console.error('Error obteniendo autoparte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener autoparte',
            error: error.message
        });
    }
});

// Marketplace - Listar autopartes disponibles
router.get('/marketplace/disponibles', async (req, res) => {
    try {
        const { tipo, marca, busqueda } = req.query;
        
        let query = `
            SELECT a.*, m.marca as moto_marca, m.modelo as moto_modelo,
            u.nombre as vendedor_nombre
            FROM autopartes a
            INNER JOIN motocicletas m ON a.motocicleta_id = m.id
            INNER JOIN usuarios u ON m.usuario_id = u.id
            WHERE a.estado = 'registrada'
        `;
        
        const params = [];

        if (tipo) {
            query += ' AND a.tipo_parte = ?';
            params.push(tipo);
        }

        if (marca) {
            query += ' AND a.marca LIKE ?';
            params.push(`%${marca}%`);
        }

        if (busqueda) {
            query += ' AND (a.nombre_parte LIKE ? OR a.descripcion LIKE ?)';
            params.push(`%${busqueda}%`, `%${busqueda}%`);
        }

        query += ' ORDER BY a.fecha_registro DESC LIMIT 50';

        const [autopartes] = await db.query(query, params);

        res.json({
            success: true,
            data: autopartes
        });
    } catch (error) {
        console.error('Error en marketplace:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener autopartes del marketplace',
            error: error.message
        });
    }
});

module.exports = router;
