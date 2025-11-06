const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

// Crear directorio de base de datos si no existe
const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'motosegura.db');

let db = null;

// Función para guardar la base de datos
function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
}

// Inicializar SQLite
async function initDB() {
    const SQL = await initSqlJs();
    
    // Cargar base de datos existente o crear nueva
    if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
        console.log('✅ Base de datos SQLite cargada:', dbPath);
    } else {
        db = new SQL.Database();
        console.log('✅ Nueva base de datos SQLite creada:', dbPath);
    }
    
    // Habilitar foreign keys
    db.run('PRAGMA foreign_keys = ON');
    
    return db;
}

// Inicializar tablas
function initDatabase() {
    if (!db) return;
    
    // Tabla de usuarios
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            telefono TEXT,
            tipo_usuario TEXT DEFAULT 'propietario' CHECK(tipo_usuario IN ('propietario', 'taller', 'autoridad')),
            estado TEXT DEFAULT 'activo' CHECK(estado IN ('activo', 'inactivo', 'suspendido')),
            verificado INTEGER DEFAULT 0,
            fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
            ultima_conexion DATETIME
        );
    `);

    // Índices para usuarios
    db.run(`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo_usuario)`);

    // Tabla de motocicletas
    db.run(`
        CREATE TABLE IF NOT EXISTS motocicletas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            marca TEXT NOT NULL,
            modelo TEXT NOT NULL,
            año INTEGER NOT NULL,
            color TEXT,
            numero_serie TEXT UNIQUE NOT NULL,
            placa TEXT UNIQUE,
            numero_motor TEXT,
            numero_chasis TEXT,
            estado TEXT DEFAULT 'activa' CHECK(estado IN ('activa', 'reportada_robada', 'inactiva')),
            fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );
    `);

    // Índices para motocicletas
    db.run(`CREATE INDEX IF NOT EXISTS idx_motos_usuario ON motocicletas(usuario_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_motos_estado ON motocicletas(estado)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_motos_serie ON motocicletas(numero_serie)`);

    // Tabla de autopartes
    db.run(`
        CREATE TABLE IF NOT EXISTS autopartes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            motocicleta_id INTEGER NOT NULL,
            tipo_parte TEXT NOT NULL,
            nombre_parte TEXT NOT NULL,
            numero_serie TEXT,
            codigo_unico TEXT UNIQUE NOT NULL,
            codigo_qr TEXT,
            marca TEXT,
            modelo_compatible TEXT,
            estado TEXT DEFAULT 'registrada' CHECK(estado IN ('registrada', 'vendida', 'reportada_robada', 'verificada')),
            descripcion TEXT,
            fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
            ultima_verificacion DATETIME,
            FOREIGN KEY (motocicleta_id) REFERENCES motocicletas(id) ON DELETE CASCADE
        );
    `);

    // Índices para autopartes
    db.run(`CREATE INDEX IF NOT EXISTS idx_autopartes_moto ON autopartes(motocicleta_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_autopartes_codigo ON autopartes(codigo_unico)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_autopartes_estado ON autopartes(estado)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_autopartes_tipo ON autopartes(tipo_parte)`);

    // Tabla de transacciones
    db.run(`
        CREATE TABLE IF NOT EXISTS transacciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            autoparte_id INTEGER NOT NULL,
            vendedor_id INTEGER NOT NULL,
            comprador_id INTEGER,
            precio REAL,
            estado TEXT DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'completada', 'cancelada')),
            fecha_transaccion DATETIME DEFAULT CURRENT_TIMESTAMP,
            verificada INTEGER DEFAULT 0,
            FOREIGN KEY (autoparte_id) REFERENCES autopartes(id) ON DELETE CASCADE,
            FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (comprador_id) REFERENCES usuarios(id) ON DELETE SET NULL
        );
    `);

    // Tabla de reportes de robo
    db.exec(`
        CREATE TABLE IF NOT EXISTS reportes_robo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            motocicleta_id INTEGER,
            autoparte_id INTEGER,
            descripcion TEXT NOT NULL,
            fecha_robo DATE,
            lugar_robo TEXT,
            estado TEXT DEFAULT 'reportado' CHECK(estado IN ('reportado', 'en_investigacion', 'recuperado', 'cerrado')),
            numero_denuncia TEXT,
            autoridad_asignada INTEGER,
            fecha_reporte DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (motocicleta_id) REFERENCES motocicletas(id) ON DELETE SET NULL,
            FOREIGN KEY (autoparte_id) REFERENCES autopartes(id) ON DELETE SET NULL,
            FOREIGN KEY (autoridad_asignada) REFERENCES usuarios(id) ON DELETE SET NULL
        );
    `);

    // Tabla de verificaciones
    db.exec(`
        CREATE TABLE IF NOT EXISTS verificaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            autoparte_id INTEGER NOT NULL,
            usuario_verificador_id INTEGER NOT NULL,
            resultado TEXT NOT NULL CHECK(resultado IN ('legitima', 'sospechosa', 'robada', 'no_registrada')),
            notas TEXT,
            ubicacion_verificacion TEXT,
            fecha_verificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (autoparte_id) REFERENCES autopartes(id) ON DELETE CASCADE,
            FOREIGN KEY (usuario_verificador_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );
    `);

    // Tabla de talleres certificados
    db.exec(`
        CREATE TABLE IF NOT EXISTS talleres_certificados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER UNIQUE NOT NULL,
            nombre_taller TEXT NOT NULL,
            direccion TEXT,
            telefono TEXT,
            certificacion TEXT,
            fecha_certificacion DATE,
            estado_certificacion TEXT DEFAULT 'activo' CHECK(estado_certificacion IN ('activo', 'suspendido', 'revocado')),
            fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );
    `);

    // Tabla de notificaciones
    db.exec(`
        CREATE TABLE IF NOT EXISTS notificaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            tipo TEXT NOT NULL CHECK(tipo IN ('alerta_robo', 'verificacion', 'transaccion', 'sistema')),
            titulo TEXT NOT NULL,
            mensaje TEXT NOT NULL,
            leida INTEGER DEFAULT 0,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );
    `);

    // Tabla de auditoría
    db.exec(`
        CREATE TABLE IF NOT EXISTS auditoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            accion TEXT NOT NULL,
            tabla_afectada TEXT,
            registro_id INTEGER,
            detalles TEXT,
            ip_address TEXT,
            fecha_accion DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
        );
    `);

    // Tabla de catálogo de productos (autopartes nuevas para vender)
    db.run(`
        CREATE TABLE IF NOT EXISTS catalogo_productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            categoria TEXT NOT NULL,
            marca TEXT NOT NULL,
            modelo_compatible TEXT,
            descripcion TEXT,
            precio REAL NOT NULL,
            precio_original REAL,
            stock INTEGER DEFAULT 0,
            imagen_url TEXT,
            mas_vendido INTEGER DEFAULT 0,
            puntuacion REAL DEFAULT 5.0,
            numero_ventas INTEGER DEFAULT 0,
            fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Índices para catálogo
    db.run(`CREATE INDEX IF NOT EXISTS idx_catalogo_categoria ON catalogo_productos(categoria)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_catalogo_marca ON catalogo_productos(marca)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_catalogo_vendidos ON catalogo_productos(mas_vendido)`);

    // Tabla de sucursales
    db.run(`
        CREATE TABLE IF NOT EXISTS sucursales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            ciudad TEXT NOT NULL,
            direccion TEXT NOT NULL,
            codigo_postal TEXT,
            telefono TEXT,
            email TEXT,
            latitud REAL,
            longitud REAL,
            horario_apertura TEXT DEFAULT '08:00',
            horario_cierre TEXT DEFAULT '18:00',
            dias_atencion TEXT DEFAULT 'Lunes a Sábado',
            estado TEXT DEFAULT 'activo' CHECK(estado IN ('activo', 'inactivo', 'mantenimiento')),
            encargado TEXT,
            fecha_apertura DATE,
            servicios TEXT
        );
    `);

    // Índices para sucursales
    db.run(`CREATE INDEX IF NOT EXISTS idx_sucursales_ciudad ON sucursales(ciudad)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_sucursales_estado ON sucursales(estado)`);

    // Tabla de ventas de catálogo
    db.run(`
        CREATE TABLE IF NOT EXISTS ventas_catalogo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            producto_id INTEGER NOT NULL,
            usuario_id INTEGER NOT NULL,
            sucursal_id INTEGER,
            cantidad INTEGER DEFAULT 1,
            precio_unitario REAL NOT NULL,
            precio_total REAL NOT NULL,
            estado TEXT DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
            metodo_entrega TEXT DEFAULT 'sucursal' CHECK(metodo_entrega IN ('sucursal', 'domicilio')),
            direccion_entrega TEXT,
            fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
            fecha_entrega DATETIME,
            FOREIGN KEY (producto_id) REFERENCES catalogo_productos(id) ON DELETE CASCADE,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (sucursal_id) REFERENCES sucursales(id) ON DELETE SET NULL
        );
    `);

    // Insertar datos de ejemplo del catálogo
    insertCatalogoData();
    
    // Insertar datos de sucursales
    insertSucursalesData();

    // Guardar cambios
    saveDatabase();
    
    console.log('✅ Tablas de base de datos inicializadas correctamente');
}

// Función para insertar productos más vendidos del catálogo
function insertCatalogoData() {
    // Verificar si ya hay productos
    const checkStmt = db.prepare('SELECT COUNT(*) as count FROM catalogo_productos');
    checkStmt.bind([]);
    if (checkStmt.step()) {
        const result = checkStmt.getAsObject();
        if (result.count > 0) {
            checkStmt.free();
            return; // Ya hay datos
        }
    }
    checkStmt.free();

    // Productos más vendidos de diferentes marcas
    const productos = [
        // YAMAHA - Más vendidos
        ['Llanta Delantera Yamaha YBR 125', 'Llantas', 'Yamaha', 'YBR 125, XTZ 125', 'Llanta delantera original, medida 2.75-18, excelente agarre y durabilidad', 285000, 320000, 45, null, 1, 4.8, 234],
        ['Kit de Frenos Yamaha FZ', 'Frenos', 'Yamaha', 'FZ 16, FZ-S', 'Kit completo de pastillas de freno delantero y trasero, alta calidad', 95000, 110000, 67, null, 1, 4.9, 189],
        ['Espejo Retrovisor Yamaha Original', 'Espejos', 'Yamaha', 'Todos los modelos', 'Espejo retrovisor izquierdo o derecho, rosca universal', 35000, 45000, 120, null, 1, 4.7, 456],
        ['Cadena Yamaha XTZ 125', 'Transmisión', 'Yamaha', 'XTZ 125, YBR 125', 'Cadena de transmisión 428H-116L con piñones', 145000, 165000, 34, null, 1, 4.6, 178],
        ['Filtro de Aire Yamaha', 'Filtros', 'Yamaha', 'YBR 125, FZ 16', 'Filtro de aire de alto flujo, mejor rendimiento del motor', 28000, 35000, 89, null, 1, 4.8, 345],
        
        // HONDA - Más vendidos
        ['Llanta Trasera Honda CB 190', 'Llantas', 'Honda', 'CB 190, CB 160F', 'Llanta trasera 130/70-17, excelente adherencia en cualquier terreno', 320000, 365000, 38, null, 1, 4.9, 267],
        ['Kit de Embrague Honda Wave', 'Embrague', 'Honda', 'Wave 110, Biz 125', 'Kit completo de discos de embrague y resortes', 78000, 92000, 56, null, 1, 4.7, 198],
        ['Faro Delantero Honda CB', 'Iluminación', 'Honda', 'CB 125F, CB 150', 'Faro delantero LED, bajo consumo y alta luminosidad', 165000, 195000, 42, null, 1, 4.8, 223],
        ['Batería Honda Original 12V', 'Eléctrico', 'Honda', 'Todos los modelos', 'Batería YTX7L-BS 12V 7Ah, libre de mantenimiento', 135000, 155000, 73, null, 1, 4.9, 412],
        ['Amortiguador Trasero Honda XR', 'Suspensión', 'Honda', 'XR 150, XR 190', 'Amortiguador trasero ajustable, mejor confort y estabilidad', 245000, 280000, 28, null, 1, 4.6, 156],
        
        // SUZUKI - Más vendidos
        ['Llanta Suzuki GN 125', 'Llantas', 'Suzuki', 'GN 125, AX 100', 'Llanta delantera 3.00-18, diseño clásico resistente', 265000, 295000, 41, null, 1, 4.7, 189],
        ['Kit de Arrastre Suzuki Gixxer', 'Transmisión', 'Suzuki', 'Gixxer 150, Gixxer SF', 'Kit completo: piñón, corona y cadena reforzada', 195000, 225000, 31, null, 1, 4.8, 145],
        ['Manubrio Suzuki DR', 'Manubrios', 'Suzuki', 'DR 200, DR 650', 'Manubrio de aluminio resistente, diseño ergonómico', 85000, 98000, 52, null, 0, 4.5, 98],
        ['Bujía Suzuki Original', 'Eléctrico', 'Suzuki', 'Todos los modelos', 'Bujía NGK CR7HSA, mejor encendido y rendimiento', 18000, 22000, 156, null, 1, 4.9, 567],
        ['Guaya de Freno Suzuki', 'Frenos', 'Suzuki', 'GN 125, EN 125', 'Guaya de freno delantero o trasero, alta resistencia', 22000, 28000, 94, null, 0, 4.6, 234],
        
        // KAWASAKI - Más vendidos
        ['Llanta Kawasaki Ninja 300', 'Llantas', 'Kawasaki', 'Ninja 300, Z250', 'Llanta deportiva 140/70-17, alto desempeño', 385000, 425000, 25, null, 1, 4.9, 178],
        ['Kit de Frenos Kawasaki Z', 'Frenos', 'Kawasaki', 'Z400, Z650', 'Pastillas de freno cerámicas, máxima frenada', 125000, 145000, 36, null, 1, 4.8, 167],
        ['Aceite Kawasaki 10W-40', 'Lubricantes', 'Kawasaki', 'Todos los modelos', 'Aceite sintético 4T, protección superior del motor', 45000, 52000, 145, null, 1, 4.7, 489],
        ['Escape Deportivo Kawasaki', 'Escape', 'Kawasaki', 'Ninja 250, Ninja 300', 'Escape deportivo de acero inoxidable, mejora potencia', 425000, 495000, 18, null, 0, 4.8, 89],
        
        // PRODUCTOS UNIVERSALES - Más vendidos
        ['Casco Integral Certificado', 'Seguridad', 'Universal', 'Todos', 'Casco integral DOT, múltiples colores disponibles', 165000, 195000, 78, null, 1, 4.9, 678],
        ['Kit de Herramientas Moto', 'Herramientas', 'Universal', 'Todos', 'Kit completo de herramientas con estuche', 58000, 68000, 112, null, 1, 4.7, 345],
        ['Guantes de Protección', 'Seguridad', 'Universal', 'Todos', 'Guantes con protección en nudillos, talla ajustable', 45000, 55000, 98, null, 0, 4.6, 289],
        ['Candado de Disco con Alarma', 'Seguridad', 'Universal', 'Todos', 'Candado de disco con alarma sonora 110dB', 85000, 98000, 65, null, 1, 4.8, 234],
        ['Cover Impermeable para Moto', 'Accesorios', 'Universal', 'Todos', 'Cobertor impermeable talla L/XL con bolsa', 35000, 42000, 87, null, 0, 4.5, 412]
    ];

    productos.forEach(p => {
        db.run(`INSERT INTO catalogo_productos 
            (nombre, categoria, marca, modelo_compatible, descripcion, precio, precio_original, stock, imagen_url, mas_vendido, puntuacion, numero_ventas) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, p);
    });

    console.log('✅ Catálogo de productos insertado: 24 productos más vendidos');
}

// Función para insertar sucursales
function insertSucursalesData() {
    // Verificar si ya hay sucursales
    const checkStmt = db.prepare('SELECT COUNT(*) as count FROM sucursales');
    checkStmt.bind([]);
    if (checkStmt.step()) {
        const result = checkStmt.getAsObject();
        if (result.count > 0) {
            checkStmt.free();
            return; // Ya hay datos
        }
    }
    checkStmt.free();

    // Sucursales en principales ciudades de Colombia
    const sucursales = [
        ['MotoSegura Bogotá Centro', 'Bogotá', 'Cra 15 # 45-23, Centro', '110111', '601-234-5678', 'bogota.centro@motosegura.com', 4.6097, -74.0817, '08:00', '19:00', 'Lunes a Sábado', 'activo', 'Carlos Mendoza', '2023-01-15', 'Venta, Instalación, Taller, Verificación QR'],
        ['MotoSegura Bogotá Norte', 'Bogotá', 'Calle 170 # 45-12, Unicentro', '111156', '601-345-6789', 'bogota.norte@motosegura.com', 4.7376, -74.0558, '09:00', '20:00', 'Lunes a Domingo', 'activo', 'María González', '2023-03-10', 'Venta, Instalación, Verificación QR'],
        ['MotoSegura Medellín', 'Medellín', 'Cra 43A # 34-95, El Poblado', '050021', '604-567-8901', 'medellin@motosegura.com', 6.2476, -75.5658, '08:30', '18:30', 'Lunes a Sábado', 'activo', 'Jorge Restrepo', '2023-02-20', 'Venta, Instalación, Taller, Verificación QR, Capacitación'],
        ['MotoSegura Cali', 'Cali', 'Av 6N # 23-45, Granada', '760020', '602-678-9012', 'cali@motosegura.com', 3.4516, -76.5320, '08:00', '18:00', 'Lunes a Sábado', 'activo', 'Andrea Torres', '2023-04-05', 'Venta, Instalación, Verificación QR'],
        ['MotoSegura Barranquilla', 'Barranquilla', 'Calle 98 # 52-165, Riomar', '080020', '605-789-0123', 'barranquilla@motosegura.com', 11.0186, -74.8509, '09:00', '19:00', 'Lunes a Domingo', 'activo', 'Luis Martínez', '2023-05-12', 'Venta, Instalación, Verificación QR'],
        ['MotoSegura Cartagena', 'Cartagena', 'Av Pedro de Heredia # 31-45', '130001', '605-890-1234', 'cartagena@motosegura.com', 10.3997, -75.5144, '08:00', '18:00', 'Lunes a Sábado', 'activo', 'Diana Pérez', '2023-06-18', 'Venta, Instalación, Taller'],
        ['MotoSegura Bucaramanga', 'Bucaramanga', 'Cra 27 # 42-27, Cabecera', '680003', '607-901-2345', 'bucaramanga@motosegura.com', 7.1254, -73.1198, '08:30', '18:30', 'Lunes a Sábado', 'activo', 'Roberto Silva', '2023-07-22', 'Venta, Instalación, Verificación QR, Taller'],
        ['MotoSegura Pereira', 'Pereira', 'Cra 7 # 19-55, Centro', '660003', '606-012-3456', 'pereira@motosegura.com', 4.8133, -75.6961, '08:00', '18:00', 'Lunes a Sábado', 'activo', 'Carolina Ruiz', '2023-08-10', 'Venta, Instalación'],
        ['MotoSegura Manizales', 'Manizales', 'Calle 65 # 23-45, Cable Plaza', '170004', '606-123-4567', 'manizales@motosegura.com', 5.0689, -75.5174, '08:00', '18:00', 'Lunes a Sábado', 'activo', 'Felipe Castro', '2023-09-05', 'Venta, Instalación, Verificación QR'],
        ['MotoSegura Santa Marta', 'Santa Marta', 'Cra 5 # 18-23, Rodadero', '470004', '605-234-5678', 'santamarta@motosegura.com', 11.2408, -74.2099, '09:00', '19:00', 'Lunes a Domingo', 'activo', 'Juliana López', '2023-10-15', 'Venta, Instalación']
    ];

    sucursales.forEach(s => {
        db.run(`INSERT INTO sucursales 
            (nombre, ciudad, direccion, codigo_postal, telefono, email, latitud, longitud, horario_apertura, horario_cierre, dias_atencion, estado, encargado, fecha_apertura, servicios) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, s);
    });

    console.log('✅ Sucursales insertadas: 10 sucursales en principales ciudades');
}

// Wrapper para compatibilidad con MySQL
const dbWrapper = {
    query: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            try {
                if (!db) {
                    reject(new Error('Database not initialized'));
                    return;
                }

                if (sql.trim().toUpperCase().startsWith('SELECT')) {
                    const stmt = db.prepare(sql);
                    stmt.bind(params);
                    const rows = [];
                    while (stmt.step()) {
                        rows.push(stmt.getAsObject());
                    }
                    stmt.free();
                    resolve([rows, null]);
                } else {
                    db.run(sql, params);
                    const changes = db.getRowsModified();
                    saveDatabase();
                    
                    // Para INSERT, obtener el último ID insertado
                    if (sql.trim().toUpperCase().startsWith('INSERT')) {
                        const result = db.exec('SELECT last_insert_rowid() as id');
                        const insertId = result[0]?.values[0]?.[0] || 0;
                        resolve([{ insertId, affectedRows: changes }, null]);
                    } else {
                        resolve([{ affectedRows: changes }, null]);
                    }
                }
            } catch (error) {
                console.error('Database error:', error);
                reject(error);
            }
        });
    },
    
    exec: (sql) => {
        if (db) {
            db.run(sql);
            saveDatabase();
        }
    },
    
    close: () => {
        if (db) {
            saveDatabase();
            db.close();
        }
    }
};

// Exportar módulo
module.exports = {
    init: async () => {
        await initDB();
        initDatabase();
        return dbWrapper;
    },
    getDB: () => dbWrapper
};
