# CONFIGURACIÓN PARA EMPRESA - MOTOSEGURA

## 📋 Checklist de Despliegue Empresarial

### ✅ COMPLETADO
- [x] Backend Node.js con Express
- [x] Base de datos MySQL
- [x] Sistema de autenticación JWT
- [x] Frontend responsive
- [x] Generación de códigos QR
- [x] Sistema de reportes
- [x] Marketplace integrado
- [x] Documentación completa

### 🔧 CONFIGURACIONES ADICIONALES NECESARIAS

#### 1. Base de Datos
```bash
# Ejecutar el script de configuración:
.\setup-database.ps1

# O manualmente:
mysql -u root -p
CREATE DATABASE motosegura CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE motosegura;
source database/schema.sql;
```

#### 2. Variables de Entorno (.env)
```env
# Producción
NODE_ENV=production
PORT=80  # O 443 para HTTPS

# Base de datos (actualizar con credenciales reales)
DB_HOST=localhost
DB_USER=motosegura_user
DB_PASSWORD=PASSWORD_SEGURO_AQUI
DB_NAME=motosegura

# JWT (generar clave segura única)
JWT_SECRET=CLAVE_SECRETA_UNICA_PARA_PRODUCCION
```

#### 3. Usuario MySQL Dedicado (Recomendado)
```sql
-- Crear usuario específico para la aplicación
CREATE USER 'motosegura_user'@'localhost' IDENTIFIED BY 'PASSWORD_SEGURO';
GRANT ALL PRIVILEGES ON motosegura.* TO 'motosegura_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 4. Seguridad Adicional

**A. HTTPS/SSL**
```javascript
// Agregar en server.js para producción
const https = require('https');
const fs = require('fs');

const httpsOptions = {
    key: fs.readFileSync('path/to/private-key.pem'),
    cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(httpsOptions, app).listen(443);
```

**B. Rate Limiting**
```bash
npm install express-rate-limit
```

**C. Helmet (Seguridad Headers)**
```bash
npm install helmet
```

#### 5. Servidor de Producción

**Opción A: PM2 (Recomendado)**
```bash
npm install -g pm2
pm2 start backend/server.js --name motosegura
pm2 startup
pm2 save
```

**Opción B: Windows Service**
```bash
npm install -g node-windows
node install-windows-service.js
```

#### 6. Backup Automático de Base de Datos

**Script de Backup (backup-db.ps1):**
```powershell
$date = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "backups/motosegura_$date.sql"
mysqldump -u motosegura_user -p motosegura > $backupFile
```

**Automatizar con Task Scheduler:**
- Ejecutar backup-db.ps1 diariamente a las 2 AM

#### 7. Monitoreo y Logs

**A. Logging con Winston:**
```bash
npm install winston
```

**B. Monitoreo con PM2:**
```bash
pm2 logs motosegura
pm2 monit
```

#### 8. Dominio y DNS

**A. Configurar dominio:**
- Registrar: www.motosegura.com
- Apuntar DNS a IP del servidor
- Configurar en .env:
  ```env
  APP_URL=https://www.motosegura.com
  FRONTEND_URL=https://www.motosegura.com
  ```

**B. Certificado SSL:**
- Let's Encrypt (gratis): https://letsencrypt.org/
- Certbot: https://certbot.eff.org/

#### 9. Optimizaciones de Performance

**A. Compresión:**
```bash
npm install compression
```

**B. Caché:**
```bash
npm install redis
npm install connect-redis
```

**C. CDN para archivos estáticos:**
- Cloudflare (recomendado)
- AWS CloudFront

#### 10. Email (Notificaciones)

```bash
npm install nodemailer
```

Configurar en .env:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=notificaciones@motosegura.com
EMAIL_PASSWORD=password_app
```

---

## 🚀 PASOS PARA DESPLIEGUE INMEDIATO

### Setup Rápido (Desarrollo/Testing):

1. **Ejecutar script de configuración:**
   ```powershell
   .\setup-database.ps1
   ```

2. **Iniciar servidor:**
   ```powershell
   npm start
   ```

3. **Abrir navegador:**
   ```
   http://localhost:3000
   ```

### Setup Producción (Servidor Real):

1. **Configurar servidor Windows/Linux**
2. **Instalar Node.js, MySQL, PM2**
3. **Clonar proyecto**
4. **Ejecutar setup-database.ps1**
5. **Configurar .env para producción**
6. **Instalar certificado SSL**
7. **Iniciar con PM2:**
   ```bash
   pm2 start backend/server.js --name motosegura
   ```
8. **Configurar firewall (puertos 80, 443)**
9. **Configurar backup automático**
10. **Testing completo**

---

## 📊 MANTENIMIENTO

### Tareas Diarias:
- [ ] Verificar logs de errores
- [ ] Revisar reportes de robo

### Tareas Semanales:
- [ ] Revisar estadísticas de uso
- [ ] Backup manual de seguridad
- [ ] Actualizar dependencias: `npm update`

### Tareas Mensuales:
- [ ] Auditoría de seguridad
- [ ] Optimización de base de datos
- [ ] Revisión de performance

---

## 💼 COSTOS ESTIMADOS (Mensual)

### Opción Económica:
- Servidor VPS: $10-20/mes
- Dominio: $12/año
- SSL: Gratis (Let's Encrypt)
- **Total: ~$15/mes**

### Opción Empresarial:
- Servidor dedicado: $50-100/mes
- Dominio premium: $50/año
- SSL empresarial: $100/año
- Backup cloud: $10/mes
- **Total: ~$75/mes**

---

## 📞 SOPORTE TÉCNICO

### Contacto:
- Email: soporte@motosegura.com
- Tel: +57 XXX XXX XXXX

### Recursos:
- Documentación: README.md
- Inicio rápido: INICIO_RAPIDO.md
- Base de conocimiento: wiki.motosegura.com (próximamente)

---

## ✅ SISTEMA LISTO PARA:

✅ Desarrollo local
✅ Testing
✅ Demostración a clientes
✅ Producción (con configuraciones adicionales de seguridad)

**Estado Actual:** FUNCIONAL - Listo para usar en desarrollo
**Para Producción:** Aplicar configuraciones de seguridad adicionales

---

**Última actualización:** Noviembre 2024
**Versión:** 1.0.0
