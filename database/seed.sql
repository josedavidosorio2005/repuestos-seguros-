-- Datos de ejemplo para testing

-- Usuarios de prueba (contraseña: 123456 para todos)
INSERT INTO usuarios (nombre, email, password, telefono, tipo_usuario, verificado) VALUES
('Juan Pérez', 'juan@test.com', '$2a$10$YourHashedPassword', '3001234567', 'propietario', TRUE),
('Taller Motocentro', 'taller@test.com', '$2a$10$YourHashedPassword', '3007654321', 'taller', TRUE),
('Oficial García', 'oficial@test.com', '$2a$10$YourHashedPassword', '3009876543', 'autoridad', TRUE);

-- Motocicletas de ejemplo
INSERT INTO motocicletas (usuario_id, marca, modelo, año, color, numero_serie, placa, numero_motor) VALUES
(1, 'Yamaha', 'FZ-16', 2020, 'Negro', 'YAM2020FZ16001', 'ABC123', 'FZ16-2020-001'),
(1, 'Honda', 'CB 190R', 2021, 'Rojo', 'HON2021CB190001', 'DEF456', 'CB190-2021-001');

-- Autopartes de ejemplo
INSERT INTO autopartes (motocicleta_id, tipo_parte, nombre_parte, numero_serie, codigo_unico, marca, estado) VALUES
(1, 'Motor', 'Motor Completo FZ-16', 'FZ16-2020-001', 'AP-' || UUID(), 'Yamaha', 'registrada'),
(1, 'Escape', 'Escape Original Yamaha', 'ESC-YAM-001', 'AP-' || UUID(), 'Yamaha', 'registrada'),
(2, 'Motor', 'Motor CB 190R', 'CB190-2021-001', 'AP-' || UUID(), 'Honda', 'registrada');

-- Nota: Los códigos QR se generarán automáticamente al registrar en la aplicación
