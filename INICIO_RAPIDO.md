# GUÍA DE INICIO RÁPIDO - MOTOSEGURA

## 🚀 Inicio Rápido (5 minutos)

### 1. Instalar Dependencias
```powershell
npm install
```

### 2. Configurar Base de Datos

#### Opción A: Usando PowerShell
```powershell
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE motosegura;"

# Importar esquema
Get-Content database/schema.sql | mysql -u root -p motosegura
```

#### Opción B: Usando MySQL Workbench
1. Abrir MySQL Workbench
2. Crear nueva base de datos: `CREATE DATABASE motosegura;`
3. Abrir el archivo `database/schema.sql`
4. Ejecutar el script completo

### 3. Configurar Variables de Entorno

Copiar `.env.example` a `.env`:
```powershell
Copy-Item .env.example .env
```

Editar `.env` con tus datos:
```env
DB_PASSWORD=tu_password_mysql_aqui
```

### 4. Iniciar la Aplicación

```powershell
# Modo desarrollo (recomendado)
npm run dev

# O modo producción
npm start
```

### 5. Abrir en el Navegador

Ir a: **http://localhost:3000**

---

## 👤 Usuarios de Prueba

Después de configurar, puedes crear un usuario desde la página de registro o usar la consola:

```sql
INSERT INTO usuarios (nombre, email, password, tipo_usuario, verificado) 
VALUES ('Test User', 'test@motosegura.com', '$2a$10$...', 'propietario', TRUE);
```

**Nota**: La contraseña debe ser hasheada. Es mejor crear usuarios desde la aplicación web.

---

## 🆘 Solución de Problemas

### Error: "Cannot connect to MySQL"
- Verifica que MySQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica que la base de datos `motosegura` exista

### Error: "Port 3000 already in use"
- Cambia el puerto en `.env`: `PORT=3001`
- O detén el proceso que usa el puerto 3000

### Error: "Module not found"
- Ejecuta: `npm install`

---

## 📞 Soporte

Si tienes problemas, revisa:
1. `README.md` - Documentación completa
2. Logs del servidor en la consola
3. Errores de la base de datos en MySQL

---

## 🎉 ¡Listo para Usar!

Una vez iniciado, puedes:
- ✅ Registrar usuarios en `/register.html`
- ✅ Iniciar sesión en `/login.html`
- ✅ Ver el dashboard en `/dashboard.html`
- ✅ Verificar autopartes en `/verificar.html`
- ✅ Explorar el marketplace en `/marketplace.html`
