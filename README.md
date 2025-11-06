# MotoSegura - Sistema de Protección contra Autopartes Robadas

![MotoSegura](https://img.shields.io/badge/version-1.1-blue) ![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green) ![License](https://img.shields.io/badge/license-MIT-blue)

Sistema completo para combatir el comercio ilegal de autopartes de motocicletas mediante tecnología de verificación QR y una red de sucursales en Colombia.

## 🚀 Características

- ✅ **Autenticación JWT** con roles (Propietarios, Talleres, Autoridades)
- ✅ **Gestión de motocicletas y autopartes** con códigos QR
- ✅ **Catálogo con 24 productos** de Yamaha, Honda, Suzuki, Kawasaki
- ✅ **10 sucursales** en Colombia con geolocalización GPS
- ✅ **E-commerce completo** con carrito y métodos de entrega
- ✅ **Verificación QR** instantánea de legitimidad
- ✅ **Sistema de reportes** de robos
- ✅ **Marketplace** de autopartes verificadas
- ✅ **Base de datos SQLite** auto-configurable

## 📦 Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/josedavidosorio2005/repuestos-seguros-.git
cd repuestos-seguros-

# Instalar dependencias
npm install

# Iniciar servidor
npm start
```

Abre http://localhost:3000 - ¡La base de datos se crea automáticamente!

## 🛠️ Tecnologías

- **Backend**: Node.js + Express.js
- **Base de Datos**: SQLite (sql.js)
- **Autenticación**: JWT + bcrypt
- **Frontend**: HTML5 + CSS3 + JavaScript ES6+
- **QR Codes**: qrcode library

## 📁 Estructura

```
motosegura/
├── backend/          # API y lógica de negocio
├── frontend/         # Páginas web y UI
├── data/             # Base de datos SQLite
└── package.json      # Dependencias
```

## 🌐 Sucursales

10 sucursales en: Bogotá, Medellín, Cali, Barranquilla, Cartagena, Bucaramanga, Pereira, Manizales, Santa Marta.

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt
- Tokens JWT con expiración
- SQL Injection protection
- Auditoría completa

## 📱 API Endpoints

Más de 25 endpoints para gestión completa de:
- Usuarios y autenticación
- Motocicletas y autopartes
- Catálogo y compras
- Sucursales y geolocalización
- Reportes y verificaciones

Ver documentación completa en el código.

## 🎯 Uso

1. **Registrarse** como propietario
2. **Registrar motocicleta** y autopartes
3. **Generar códigos QR** automáticamente
4. **Comprar productos** del catálogo
5. **Verificar legitimidad** escaneando QR
6. **Reportar robos** si es necesario

## 🚀 Despliegue

Compatible con Heroku, DigitalOcean, AWS, Google Cloud. Sin configuración compleja de base de datos.

## 📄 Licencia

MIT

---

**MotoSegura - Protegiendo motocicletas, combatiendo el comercio ilegal** 🏍️🔒
