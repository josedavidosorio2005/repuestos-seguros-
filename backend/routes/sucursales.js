const express = require('express');
const router = express.Router();
const db = require('../config/database').getDB();

// GET - Obtener todas las sucursales activas
router.get('/', async (req, res) => {
    try {
        const { ciudad, estado } = req.query;
        
        let sql = 'SELECT * FROM sucursales WHERE 1=1';
        const params = [];
        
        if (ciudad) {
            sql += ' AND ciudad = ?';
            params.push(ciudad);
        }
        
        if (estado) {
            sql += ' AND estado = ?';
            params.push(estado);
        } else {
            sql += ' AND estado = "activo"';
        }
        
        sql += ' ORDER BY ciudad, nombre';
        
        const [sucursales] = await db.query(sql, params);
        
        res.json({
            success: true,
            total: sucursales.length,
            sucursales: sucursales
        });
    } catch (error) {
        console.error('Error al obtener sucursales:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener sucursales'
        });
    }
});

// GET - Obtener sucursal específica por ID
router.get('/:id', async (req, res) => {
    try {
        const [sucursales] = await db.query(
            'SELECT * FROM sucursales WHERE id = ?',
            [req.params.id]
        );
        
        if (sucursales.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sucursal no encontrada'
            });
        }
        
        res.json({
            success: true,
            sucursal: sucursales[0]
        });
    } catch (error) {
        console.error('Error al obtener sucursal:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la sucursal'
        });
    }
});

// GET - Obtener lista de ciudades con sucursales
router.get('/info/ciudades', async (req, res) => {
    try {
        const [ciudades] = await db.query(
            'SELECT DISTINCT ciudad FROM sucursales WHERE estado = "activo" ORDER BY ciudad'
        );
        
        res.json({
            success: true,
            ciudades: ciudades.map(c => c.ciudad)
        });
    } catch (error) {
        console.error('Error al obtener ciudades:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener ciudades'
        });
    }
});

// POST - Encontrar sucursal más cercana basada en coordenadas GPS
router.post('/cercana', async (req, res) => {
    try {
        const { latitud, longitud } = req.body;
        
        if (!latitud || !longitud) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren latitud y longitud'
            });
        }
        
        // Obtener todas las sucursales activas
        const [sucursales] = await db.query(
            'SELECT * FROM sucursales WHERE estado = "activo" AND latitud IS NOT NULL AND longitud IS NOT NULL'
        );
        
        if (sucursales.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No hay sucursales disponibles'
            });
        }
        
        // Calcular distancia usando fórmula de Haversine
        const calcularDistancia = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Radio de la Tierra en km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distancia = R * c; // Distancia en km
            return distancia;
        };
        
        // Calcular distancia a cada sucursal
        const sucursalesConDistancia = sucursales.map(sucursal => {
            const distancia = calcularDistancia(
                parseFloat(latitud),
                parseFloat(longitud),
                parseFloat(sucursal.latitud),
                parseFloat(sucursal.longitud)
            );
            
            return {
                ...sucursal,
                distancia_km: Math.round(distancia * 10) / 10, // Redondear a 1 decimal
                tiempo_estimado: Math.round(distancia * 3) // Aproximadamente 3 minutos por km en ciudad
            };
        });
        
        // Ordenar por distancia y obtener las 3 más cercanas
        sucursalesConDistancia.sort((a, b) => a.distancia_km - b.distancia_km);
        const masCercanas = sucursalesConDistancia.slice(0, 3);
        
        res.json({
            success: true,
            sucursal_mas_cercana: masCercanas[0],
            alternativas: masCercanas.slice(1),
            todas_distancias: sucursalesConDistancia
        });
    } catch (error) {
        console.error('Error al calcular sucursal cercana:', error);
        res.status(500).json({
            success: false,
            message: 'Error al calcular sucursal más cercana'
        });
    }
});

// POST - Encontrar sucursal más cercana por ciudad (sin GPS)
router.post('/cercana-ciudad', async (req, res) => {
    try {
        const { ciudad } = req.body;
        
        if (!ciudad) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el nombre de la ciudad'
            });
        }
        
        // Buscar sucursales en la ciudad especificada
        const [sucursales] = await db.query(
            'SELECT * FROM sucursales WHERE estado = "activo" AND ciudad = ? ORDER BY nombre',
            [ciudad]
        );
        
        if (sucursales.length === 0) {
            // Si no hay en esa ciudad, buscar la ciudad más cercana
            const [todasSucursales] = await db.query(
                'SELECT * FROM sucursales WHERE estado = "activo" ORDER BY ciudad, nombre'
            );
            
            return res.json({
                success: true,
                mensaje: `No hay sucursales en ${ciudad}. Estas son las ciudades disponibles:`,
                sucursales_disponibles: todasSucursales,
                ciudades: [...new Set(todasSucursales.map(s => s.ciudad))]
            });
        }
        
        res.json({
            success: true,
            ciudad: ciudad,
            sucursales: sucursales,
            total: sucursales.length
        });
    } catch (error) {
        console.error('Error al buscar sucursales por ciudad:', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar sucursales'
        });
    }
});

// GET - Obtener horarios y servicios de una sucursal
router.get('/:id/info', async (req, res) => {
    try {
        const [sucursales] = await db.query(
            'SELECT nombre, ciudad, direccion, telefono, email, horario_apertura, horario_cierre, dias_atencion, encargado, servicios FROM sucursales WHERE id = ? AND estado = "activo"',
            [req.params.id]
        );
        
        if (sucursales.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sucursal no encontrada'
            });
        }
        
        const sucursal = sucursales[0];
        sucursal.servicios_lista = sucursal.servicios ? sucursal.servicios.split(',').map(s => s.trim()) : [];
        
        res.json({
            success: true,
            sucursal: sucursal
        });
    } catch (error) {
        console.error('Error al obtener información de sucursal:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener información de la sucursal'
        });
    }
});

module.exports = router;
