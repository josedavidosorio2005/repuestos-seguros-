# 🔧 Solución de Problemas - Sistema Anti-Robo

## ⚠️ Problemas Comunes y Soluciones

---

## 🚫 Problema: No se puede generar el QR

### Síntomas:
- Al hacer clic en "Generar Reporte" no aparece el código QR
- Aparece un mensaje de error
- La página se queda en blanco

### Soluciones:

#### 1. Verifica la Consola del Navegador
```
1. Presiona F12 para abrir las herramientas de desarrollo
2. Ve a la pestaña "Console"
3. Busca mensajes de error
4. Si ves "❌ QRCode.js no se cargó", sigue al paso 2
```

#### 2. Recarga la Página Completamente
```
- Presiona Ctrl + Shift + R (Windows/Linux)
- Presiona Cmd + Shift + R (Mac)
- Esto forzará una recarga limpia sin caché
```

#### 3. Verifica tu Conexión a Internet
```
- El sistema necesita conexión para cargar las librerías CDN
- Una vez cargadas, funcionará sin internet
```

#### 4. Prueba con Otro Navegador
```
Navegadores recomendados:
✅ Google Chrome (actualizado)
✅ Microsoft Edge (actualizado)
✅ Firefox (actualizado)
✅ Safari (actualizado)
```

#### 5. Desactiva Extensiones que Bloqueen Scripts
```
- AdBlock
- Privacy Badger
- NoScript
- uBlock Origin

Solución: Agrega el sitio a la lista blanca o desactiva temporalmente
```

---

## 📥 Problema: No se puede descargar el QR

### Síntomas:
- El QR aparece pero no se descarga al hacer clic
- No pasa nada al hacer clic en "Descargar QR"
- Aparece error en la consola

### Soluciones:

#### 1. Verifica Permisos del Navegador
```
1. Asegúrate de que el navegador permita descargas
2. En Chrome: Settings → Privacy and security → Site settings → Downloads
3. Debe estar en "Ask" o "Allowed"
```

#### 2. Método Alternativo: Guardar Manualmente
```
1. Haz clic derecho sobre el código QR
2. Selecciona "Guardar imagen como..." o "Save image as..."
3. Guarda el archivo en tu computadora
```

#### 3. Espera un Momento Más
```
- El sistema espera 500ms para renderizar completamente el QR
- Si tu computadora es lenta, espera 2-3 segundos después de generarlo
- Luego haz clic en "Descargar QR"
```

#### 4. Revisa la Carpeta de Descargas
```
- Es posible que se haya descargado pero no lo notaste
- Busca archivos tipo: qr-parte-robada-[números].png
```

---

## 📷 Problema: La cámara no funciona para escanear

### Síntomas:
- No se activa la cámara
- Aparece mensaje "Error al acceder a la cámara"
- La cámara está negra o congelada

### Soluciones:

#### 1. Concede Permisos de Cámara
```
1. El navegador debe pedir permiso para usar la cámara
2. Haz clic en "Permitir" o "Allow"
3. Si lo bloqueaste por error:
   - Chrome: Haz clic en el ícono de candado en la barra de direcciones
   - Busca "Camera" o "Cámara"
   - Cambia de "Block" a "Allow"
   - Recarga la página
```

#### 2. Verifica que tu Dispositivo Tenga Cámara
```
- En PC de escritorio, necesitas una webcam
- En laptop, la cámara integrada debería funcionar
- En móvil, usa la cámara trasera
```

#### 3. Cierra Otras Aplicaciones que Usen la Cámara
```
Cierra:
- Zoom
- Skype
- Teams
- Discord
- Otras apps de videollamada
```

#### 4. Usa Métodos Alternativos
```
Si la cámara no funciona, tienes otras opciones:
✅ Subir imagen del QR
✅ Ingresar código manualmente
```

---

## 📤 Problema: No se puede subir imagen del QR

### Síntomas:
- Al seleccionar archivo no pasa nada
- Error al procesar la imagen
- El QR no se lee

### Soluciones:

#### 1. Verifica el Formato de la Imagen
```
Formatos soportados:
✅ PNG (recomendado)
✅ JPG / JPEG
✅ GIF
✅ WebP

❌ No soportados: PDF, TIFF, BMP
```

#### 2. Asegúrate de que la Imagen sea Clara
```
- La imagen debe estar enfocada
- Buena iluminación
- El QR completo debe ser visible
- Sin reflejos ni sombras
```

#### 3. Tamaño de Imagen Adecuado
```
Recomendado:
- Mínimo: 300x300 píxeles
- Máximo: 2000x2000 píxeles
- Tamaño archivo: Menos de 5MB
```

#### 4. Intenta con el Código Manual
```
Si tienes el código (ej: STOLEN-1699000000001):
1. Ve a la pestaña "Código Manual"
2. Ingresa el código
3. Haz clic en "Verificar Código"
```

---

## 💾 Problema: Los reportes no se guardan

### Síntomas:
- Al recargar la página, los reportes desaparecen
- No se pueden verificar QR previamente creados
- localStorage no funciona

### Soluciones:

#### 1. Verifica que localStorage Esté Habilitado
```
En la consola (F12), escribe:
> checkSystemLibraries()

Debe mostrar:
✅ localStorage: OK
```

#### 2. No Uses Modo Incógnito/Privado
```
❌ El modo incógnito borra datos al cerrar
✅ Usa ventana normal del navegador
```

#### 3. Verifica el Espacio de Almacenamiento
```
1. Abre la consola (F12)
2. Ve a Application → Storage → Local Storage
3. Busca el dominio de tu sitio
4. Verifica que haya espacio disponible
```

#### 4. No Limpies Datos del Navegador
```
❌ Evita borrar caché y cookies del sitio
✅ Los datos se almacenan localmente en tu navegador
```

---

## 🌐 Problema: El sitio no carga en GitHub Pages

### Síntomas:
- Error 404
- Página en blanco
- "There isn't a GitHub Pages site here"

### Soluciones:

#### 1. Verifica que GitHub Pages Esté Activado
```
1. Ve a: https://github.com/josedavidosorio2005/repuestos-seguros-
2. Haz clic en Settings
3. Ve a Pages (menú izquierdo)
4. Debe estar configurado:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
5. Haz clic en Save si no está guardado
```

#### 2. Espera 2-5 Minutos
```
- GitHub Pages puede tardar en actualizarse
- La primera vez puede tardar hasta 10 minutos
- Refresca la página después de esperar
```

#### 3. Verifica la URL Correcta
```
Tu sitio debería estar en:
https://josedavidosorio2005.github.io/repuestos-seguros-/

⚠️ Nota el guion al final: "repuestos-seguros-"
```

#### 4. Revisa Actions
```
1. Ve a la pestaña "Actions" en GitHub
2. Verifica que no haya errores en el build
3. Si hay errores, revisa los logs
```

---

## 🔍 Verificación del Sistema

### Comando de Diagnóstico
```javascript
// Abre la consola (F12) y ejecuta:
checkSystemLibraries()

// Debería mostrar:
✅ QRCode.js: OK
✅ Html5Qrcode: OK
✅ localStorage: OK
```

### Información de Reportes
```javascript
// Ver cuántos reportes hay almacenados:
const reportes = JSON.parse(localStorage.getItem('stolenParts')) || [];
console.log('Total de reportes:', reportes.length);
console.log('Reportes:', reportes);
```

### Limpiar Datos de Prueba
```javascript
// ⚠️ CUIDADO: Esto borrará TODOS los reportes
localStorage.removeItem('stolenParts');
console.log('✅ Reportes eliminados');
```

---

## 📱 Problemas en Móvil

### La página no se ve bien
```
✅ Solución: El sitio es responsive, prueba rotar el dispositivo
✅ Solución: Haz zoom out (pellizca con dos dedos)
✅ Solución: Actualiza el navegador móvil
```

### Los botones no responden
```
✅ Solución: Espera a que la página cargue completamente
✅ Solución: Recarga la página
✅ Solución: Cierra otras pestañas para liberar memoria
```

### El teclado cubre los campos
```
✅ Solución: Desplázate hacia arriba después de escribir
✅ Solución: Cierra el teclado y revisa el formulario
```

---

## 🆘 Si Nada Funciona

### Método de Último Recurso:

1. **Limpia el caché del navegador:**
   ```
   Chrome: Settings → Privacy and security → Clear browsing data
   Selecciona:
   ✅ Cached images and files
   ✅ Cookies and other site data
   ```

2. **Reinicia el navegador completamente**

3. **Prueba en modo incógnito (solo para probar, no para usar)**

4. **Actualiza el navegador a la última versión**

5. **Prueba desde otro dispositivo**

6. **Reporta el problema:**
   - Usa la página de contacto
   - Incluye:
     * Navegador y versión
     * Sistema operativo
     * Mensaje de error exacto (captura de pantalla)
     * Pasos para reproducir el problema

---

## ✅ Sistema Funcionando Correctamente Si:

- ✅ Puedes completar el formulario de reporte
- ✅ El QR se genera y aparece en el modal
- ✅ Puedes descargar el QR como imagen PNG
- ✅ Al verificar un código, muestra información completa
- ✅ Los reportes persisten después de recargar
- ✅ Las notificaciones aparecen correctamente

---

## 📞 Soporte Adicional

Si sigues teniendo problemas:

1. **Abre la consola del navegador (F12)**
2. **Copia TODOS los mensajes de error**
3. **Toma captura de pantalla**
4. **Envía a través de la página de contacto**

---

**Documento**: SOLUCION-PROBLEMAS.md  
**Última actualización**: 10 de noviembre de 2025  
**Versión**: 1.1 - Mejorada para GitHub Pages
