const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Verificar autoparte por código QR
router.post('/verificar', authMiddleware, async (req, res) => {
    try {
        const { codigo_unico, ubicacion } = req.body;

        if (!codigo_unico) {
            return res.status(400).json({
                success: false,
                message: 'Código único es requerido'
            });
        }

        // Buscar autoparte
        const [autopartes] = await db.query(
            `SELECT a.*, m.estado as moto_estado, m.marca as moto_marca, m.modelo as moto_modelo,
            u.nombre as propietario_nombre, u.email as propietario_email
            FROM autopartes a
            INNER JOIN motocicletas m ON a.motocicleta_id = m.id
            INNER JOIN usuarios u ON m.usuario_id = u.id
            WHERE a.codigo_unico = ?`,
            [codigo_unico]
        );

        let resultado;
        let mensaje;

        if (autopartes.length === 0) {
            resultado = 'no_registrada';
            mensaje = 'Autoparte no registrada en el sistema';
        } else {
            const autoparte = autopartes[0];
            
            if (autoparte.estado === 'reportada_robada' || autoparte.moto_estado === 'reportada_robada') {
                resultado = 'robada';
                mensaje = '¡ALERTA! Esta autoparte ha sido reportada como robada';
            } else if (autoparte.estado === 'verificada') {
                resultado = 'legitima';
                mensaje = 'Autoparte legítima y verificada';
            } else {
                resultado = 'legitima';
                mensaje = 'Autoparte registrada correctamente';
            }
        }

        // Registrar verificación
        const [verificationResult] = await db.query(
            `INSERT INTO verificaciones 
            (autoparte_id, usuario_verificador_id, resultado, ubicacion_verificacion, notas) 
            VALUES (?, ?, ?, ?, ?)`,
            [autopartes[0]?.id || null, req.usuario.id, resultado, ubicacion || null, mensaje]
        );

        // Si es robada, notificar al propietario y autoridades
        if (resultado === 'robada') {
            await db.query(
                `INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje)
                VALUES (?, 'alerta_robo', 'Verificación de Parte Robada', ?)`,
                [autopartes[0].usuario_id, `Se ha detectado una verificación de su autoparte robada. Ubicación: ${ubicacion || 'No especificada'}`]
            );

            // Notificar autoridades
            await db.query(
                `INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje)
                SELECT id, 'alerta_robo', 'Detección de Autoparte Robada', ? 
                FROM usuarios WHERE tipo_usuario = 'autoridad'`,
                [`Se ha detectado una autoparte robada. Código: ${codigo_unico}. Ubicación: ${ubicacion || 'No especificada'}`]
            );
        }

        // Actualizar última verificación
        if (autopartes.length > 0) {
            await db.query(
                'UPDATE autopartes SET ultima_verificacion = NOW(), estado = ? WHERE id = ?',
                [resultado === 'legitima' ? 'verificada' : resultado, autopartes[0].id]
            );
        }

        res.json({
            success: true,
            data: {
                resultado,
                mensaje,
                autoparte: autopartes[0] || null,
                id_verificacion: verificationResult.insertId
            }
        });
    } catch (error) {
        console.error('Error verificando autoparte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar autoparte',
            error: error.message
        });
    }
});

// Obtener historial de verificaciones
router.get('/historial', authMiddleware, async (req, res) => {
    try {
        const [verificaciones] = await db.query(
            `SELECT v.*, 
            a.nombre_parte, a.tipo_parte, a.codigo_unico,
            u.nombre as verificador_nombre
            FROM verificaciones v
            LEFT JOIN autopartes a ON v.autoparte_id = a.id
            INNER JOIN usuarios u ON v.usuario_verificador_id = u.id
            WHERE v.usuario_verificador_id = ?
            ORDER BY v.fecha_verificacion DESC
            LIMIT 50`,
            [req.usuario.id]
        );

        res.json({
            success: true,
            data: verificaciones
        });
    } catch (error) {
        console.error('Error obteniendo historial:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial de verificaciones',
            error: error.message
        });
    }
});

module.exports = router;
