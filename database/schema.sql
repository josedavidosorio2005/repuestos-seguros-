-- Base de datos MotoSegura
CREATE DATABASE IF NOT EXISTS motosegura;
USE motosegura;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    tipo_usuario ENUM('propietario', 'taller', 'autoridad') DEFAULT 'propietario',
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    verificado BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_conexion TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_tipo (tipo_usuario)
);

-- Tabla de motocicletas
CREATE TABLE motocicletas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    año INT NOT NULL,
    color VARCHAR(30),
    numero_serie VARCHAR(100) UNIQUE NOT NULL,
    placa VARCHAR(20) UNIQUE,
    numero_motor VARCHAR(100),
    numero_chasis VARCHAR(100),
    estado ENUM('activa', 'reportada_robada', 'inactiva') DEFAULT 'activa',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado),
    INDEX idx_serie (numero_serie)
);

-- Tabla de autopartes
CREATE TABLE autopartes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    motocicleta_id INT NOT NULL,
    tipo_parte VARCHAR(50) NOT NULL,
    nombre_parte VARCHAR(100) NOT NULL,
    numero_serie VARCHAR(100),
    codigo_unico VARCHAR(100) UNIQUE NOT NULL,
    codigo_qr TEXT,
    marca VARCHAR(50),
    modelo_compatible VARCHAR(100),
    estado ENUM('registrada', 'vendida', 'reportada_robada', 'verificada') DEFAULT 'registrada',
    descripcion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_verificacion TIMESTAMP NULL,
    FOREIGN KEY (motocicleta_id) REFERENCES motocicletas(id) ON DELETE CASCADE,
    INDEX idx_motocicleta (motocicleta_id),
    INDEX idx_codigo (codigo_unico),
    INDEX idx_estado (estado),
    INDEX idx_tipo (tipo_parte)
);

-- Tabla de transacciones de autopartes
CREATE TABLE transacciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    autoparte_id INT NOT NULL,
    vendedor_id INT NOT NULL,
    comprador_id INT,
    precio DECIMAL(10, 2),
    estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'pendiente',
    fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verificada BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (autoparte_id) REFERENCES autopartes(id) ON DELETE CASCADE,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (comprador_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_autoparte (autoparte_id),
    INDEX idx_vendedor (vendedor_id),
    INDEX idx_fecha (fecha_transaccion)
);

-- Tabla de reportes de robo
CREATE TABLE reportes_robo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    motocicleta_id INT,
    autoparte_id INT,
    descripcion TEXT NOT NULL,
    fecha_robo DATE,
    lugar_robo VARCHAR(200),
    estado ENUM('reportado', 'en_investigacion', 'recuperado', 'cerrado') DEFAULT 'reportado',
    numero_denuncia VARCHAR(50),
    autoridad_asignada INT,
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (motocicleta_id) REFERENCES motocicletas(id) ON DELETE SET NULL,
    FOREIGN KEY (autoparte_id) REFERENCES autopartes(id) ON DELETE SET NULL,
    FOREIGN KEY (autoridad_asignada) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_reporte)
);

-- Tabla de verificaciones
CREATE TABLE verificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    autoparte_id INT NOT NULL,
    usuario_verificador_id INT NOT NULL,
    resultado ENUM('legitima', 'sospechosa', 'robada', 'no_registrada') NOT NULL,
    notas TEXT,
    ubicacion_verificacion VARCHAR(200),
    fecha_verificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autoparte_id) REFERENCES autopartes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_verificador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_autoparte (autoparte_id),
    INDEX idx_resultado (resultado),
    INDEX idx_fecha (fecha_verificacion)
);

-- Tabla de talleres certificados
CREATE TABLE talleres_certificados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE NOT NULL,
    nombre_taller VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    certificacion VARCHAR(100),
    fecha_certificacion DATE,
    estado_certificacion ENUM('activo', 'suspendido', 'revocado') DEFAULT 'activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_estado (estado_certificacion)
);

-- Tabla de notificaciones
CREATE TABLE notificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('alerta_robo', 'verificacion', 'transaccion', 'sistema') NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_leida (leida),
    INDEX idx_fecha (fecha_creacion)
);

-- Tabla de auditoría
CREATE TABLE auditoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(50),
    registro_id INT,
    detalles TEXT,
    ip_address VARCHAR(45),
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha_accion),
    INDEX idx_tabla (tabla_afectada)
);

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, tipo_usuario, verificado) 
VALUES ('Administrador', 'admin@motosegura.com', '$2a$10$YourHashedPasswordHere', 'autoridad', TRUE);
