const express = require('express');
const router = express.Router();
const db = require('../config/database').getDB();
const { authMiddleware } = require('../middleware/auth');

// GET - Obtener todos los productos del catálogo
router.get('/', async (req, res) => {
    try {
        const { categoria, marca, mas_vendidos, limite } = req.query;
        
        let sql = 'SELECT * FROM catalogo_productos WHERE 1=1';
        const params = [];
        
        if (categoria) {
            sql += ' AND categoria = ?';
            params.push(categoria);
        }
        
        if (marca) {
            sql += ' AND marca = ?';
            params.push(marca);
        }
        
        if (mas_vendidos === 'true') {
            sql += ' AND mas_vendido = 1';
        }
        
        sql += ' ORDER BY numero_ventas DESC, puntuacion DESC';
        
        if (limite) {
            sql += ' LIMIT ?';
            params.push(parseInt(limite));
        }
        
        const [productos] = await db.query(sql, params);
        
        res.json({
            success: true,
            total: productos.length,
            productos: productos
        });
    } catch (error) {
        console.error('Error al obtener catálogo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el catálogo de productos'
        });
    }
});

// GET - Obtener producto específico por ID
router.get('/:id', async (req, res) => {
    try {
        const [productos] = await db.query(
            'SELECT * FROM catalogo_productos WHERE id = ?',
            [req.params.id]
        );
        
        if (productos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            producto: productos[0]
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el producto'
        });
    }
});

// GET - Obtener categorías disponibles
router.get('/info/categorias', async (req, res) => {
    try {
        const [categorias] = await db.query(
            'SELECT DISTINCT categoria FROM catalogo_productos ORDER BY categoria'
        );
        
        res.json({
            success: true,
            categorias: categorias.map(c => c.categoria)
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorías'
        });
    }
});

// GET - Obtener marcas disponibles
router.get('/info/marcas', async (req, res) => {
    try {
        const [marcas] = await db.query(
            'SELECT DISTINCT marca FROM catalogo_productos ORDER BY marca'
        );
        
        res.json({
            success: true,
            marcas: marcas.map(m => m.marca)
        });
    } catch (error) {
        console.error('Error al obtener marcas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener marcas'
        });
    }
});

// POST - Comprar producto del catálogo (requiere autenticación)
router.post('/comprar', authMiddleware, async (req, res) => {
    try {
        const { producto_id, cantidad, sucursal_id, metodo_entrega, direccion_entrega } = req.body;
        
        // Verificar stock disponible
        const [productos] = await db.query(
            'SELECT * FROM catalogo_productos WHERE id = ?',
            [producto_id]
        );
        
        if (productos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        const producto = productos[0];
        
        if (producto.stock < cantidad) {
            return res.status(400).json({
                success: false,
                message: `Stock insuficiente. Solo hay ${producto.stock} unidades disponibles`
            });
        }
        
        // Calcular precio total
        const precio_total = producto.precio * cantidad;
        
        // Registrar venta
        const [result] = await db.query(
            `INSERT INTO ventas_catalogo 
            (producto_id, usuario_id, sucursal_id, cantidad, precio_unitario, precio_total, metodo_entrega, direccion_entrega, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
            [producto_id, req.usuario.id, sucursal_id, cantidad, producto.precio, precio_total, metodo_entrega || 'sucursal', direccion_entrega]
        );
        
        // Actualizar stock y número de ventas
        await db.query(
            'UPDATE catalogo_productos SET stock = stock - ?, numero_ventas = numero_ventas + ? WHERE id = ?',
            [cantidad, cantidad, producto_id]
        );
        
        // Crear notificación
        await db.query(
            `INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje) 
            VALUES (?, 'transaccion', 'Compra Realizada', ?)`,
            [req.usuario.id, `Has comprado ${cantidad}x ${producto.nombre}. Total: $${precio_total.toLocaleString()}`]
        );
        
        res.json({
            success: true,
            message: 'Compra realizada exitosamente',
            venta_id: result.insertId,
            total: precio_total
        });
    } catch (error) {
        console.error('Error al procesar compra:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la compra'
        });
    }
});

// GET - Obtener historial de compras del usuario
router.get('/mis-compras/historial', authMiddleware, async (req, res) => {
    try {
        const [compras] = await db.query(
            `SELECT v.*, p.nombre as producto_nombre, p.marca, p.categoria, 
                    s.nombre as sucursal_nombre, s.direccion as sucursal_direccion
            FROM ventas_catalogo v
            JOIN catalogo_productos p ON v.producto_id = p.id
            LEFT JOIN sucursales s ON v.sucursal_id = s.id
            WHERE v.usuario_id = ?
            ORDER BY v.fecha_venta DESC`,
            [req.usuario.id]
        );
        
        res.json({
            success: true,
            compras: compras
        });
    } catch (error) {
        console.error('Error al obtener compras:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial de compras'
        });
    }
});

module.exports = router;
