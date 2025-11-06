# 🚀 GUÍA DE INSTALACIÓN PASO A PASO - MOTOSEGURA

## ⚡ LO QUE FALTA PARA QUE FUNCIONE AL 100%

### 📊 ESTADO ACTUAL:
✅ Código completado (Backend + Frontend + Base de Datos)
✅ Dependencias instaladas
✅ Archivos configurados
⚠️ **FALTA: Configurar base de datos MySQL**

---

## 🔧 PASOS PARA COMPLETAR LA INSTALACIÓN

### PASO 1: Instalar MySQL (Si no lo tienes)

#### Opción A: MySQL Installer (Recomendado)
1. Descargar de: https://dev.mysql.com/downloads/installer/
2. Ejecutar el instalador
3. Seleccionar "Developer Default"
4. Configurar root password (anotar bien)
5. Completar instalación

#### Opción B: XAMPP (Más fácil)
1. Descargar de: https://www.apachefriends.org/
2. Instalar XAMPP
3. Abrir XAMPP Control Panel
4. Iniciar "MySQL"
5. No requiere password por defecto

---

### PASO 2: Crear la Base de Datos

#### Opción A: Usando MySQL Workbench (Visual)

1. **Abrir MySQL Workbench**
   - Buscar en el menú inicio: "MySQL Workbench"

2. **Conectar al servidor**
   - Click en la conexión "Local instance MySQL"
   - Ingresar password si lo configuraste

3. **Ejecutar el script**
   - Click en "File" → "Open SQL Script"
   - Navegar a: `trabajo 50 mil\motosegura\database\init-complete.sql`
   - Click en el ícono de rayo ⚡ para ejecutar
   - Verás mensaje de éxito

#### Opción B: Usando Línea de Comandos

```powershell
# Si MySQL está en PATH:
cd "c:\Users\Usuario\OneDrive\Escritorio\trabajo 50 mil\motosegura"
mysql -u root -p < database\init-complete.sql

# Si usas XAMPP:
cd "C:\xampp\mysql\bin"
.\mysql.exe -u root < "c:\Users\Usuario\OneDrive\Escritorio\trabajo 50 mil\motosegura\database\init-complete.sql"
```

#### Opción C: Usando phpMyAdmin (XAMPP)

1. Abrir navegador: http://localhost/phpmyadmin
2. Click en "SQL" en la parte superior
3. Copiar y pegar el contenido de `database\init-complete.sql`
4. Click en "Go" o "Ejecutar"

---

### PASO 3: Configurar Credenciales

1. **Editar archivo .env:**
   ```powershell
   notepad .env
   ```

2. **Actualizar las credenciales:**
   ```env
   # Si usas MySQL normal con password:
   DB_USER=root
   DB_PASSWORD=tu_password_aqui
   
   # Si usas XAMPP (sin password):
   DB_USER=root
   DB_PASSWORD=
   ```

3. **Guardar el archivo** (Ctrl+S)

---

### PASO 4: Iniciar el Servidor

```powershell
cd "c:\Users\Usuario\OneDrive\Escritorio\trabajo 50 mil\motosegura"
npm start
```

O usar el script:
```powershell
.\start.ps1
```

Deberías ver:
```
🚀 Servidor MotoSegura corriendo en puerto 3000
📍 URL: http://localhost:3000
✅ Conexión exitosa a la base de datos MySQL
```

---

### PASO 5: Abrir en el Navegador

1. Abrir navegador
2. Ir a: **http://localhost:3000**
3. ¡Listo! 🎉

---

## 📝 VERIFICACIÓN RÁPIDA

### Verificar que todo funciona:

1. **Página principal:** http://localhost:3000
   - ✅ Debe cargar con el diseño azul neón

2. **Registro:** http://localhost:3000/register.html
   - ✅ Crear un usuario de prueba

3. **Login:** http://localhost:3000/login.html
   - ✅ Iniciar sesión con el usuario creado

4. **Dashboard:** http://localhost:3000/dashboard.html
   - ✅ Ver panel de control

5. **Registrar moto:**
   - ✅ Crear una motocicleta de prueba

6. **Registrar autoparte:**
   - ✅ Crear una autoparte y generar QR

7. **Verificar:**
   - ✅ Copiar el código y verificar en /verificar.html

---

## ❓ SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "Cannot connect to database"

**Causa:** MySQL no está corriendo o credenciales incorrectas

**Solución:**
1. Verificar que MySQL esté corriendo:
   - XAMPP: Abrir Control Panel y verificar que MySQL está "Running"
   - MySQL Service: Abrir Servicios de Windows y buscar "MySQL"

2. Verificar credenciales en `.env`:
   ```env
   DB_USER=root
   DB_PASSWORD=  # Dejar vacío si no tiene password
   ```

3. Probar conexión:
   ```powershell
   # Con password:
   mysql -u root -p
   
   # Sin password (XAMPP):
   mysql -u root
   ```

### Error: "Port 3000 already in use"

**Solución:** Cambiar puerto en `.env`:
```env
PORT=3001
```

### Error: "Module not found"

**Solución:**
```powershell
npm install
```

### Error: "Database motosegura does not exist"

**Solución:** Ejecutar nuevamente el script de base de datos:
```powershell
mysql -u root -p < database\init-complete.sql
```

---

## 🎯 CHECKLIST FINAL

Antes de usar en producción:

- [ ] Base de datos creada correctamente
- [ ] Archivo .env configurado con credenciales correctas
- [ ] Servidor inicia sin errores
- [ ] Puedes registrar usuarios
- [ ] Puedes iniciar sesión
- [ ] Puedes registrar motocicletas
- [ ] Puedes generar códigos QR
- [ ] Puedes verificar autopartes
- [ ] Marketplace funciona
- [ ] Sistema de reportes funciona

---

## 📞 SOPORTE

Si algo no funciona:

1. **Revisar logs del servidor** en la consola
2. **Revisar consola del navegador** (F12)
3. **Verificar que MySQL esté corriendo**
4. **Verificar credenciales en .env**

---

## 🎉 ¡TODO LISTO!

Una vez completados estos pasos, tendrás:

✅ Sistema completamente funcional
✅ Base de datos configurada
✅ Frontend operativo
✅ Backend con API REST
✅ Sistema de autenticación
✅ Generación de QR
✅ Verificación de autopartes
✅ Marketplace
✅ Sistema de reportes

**¡MotoSegura está listo para proteger motocicletas!** 🏍️🛡️

---

**Tiempo estimado de configuración:** 10-15 minutos
**Dificultad:** Fácil ⭐⭐
