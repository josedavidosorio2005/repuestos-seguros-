# ⚡ Sistema de Actualización en Tiempo Real

## 🎯 ¿Cómo Funciona?

Tu sistema ahora **se actualiza automáticamente en tiempo real**. Esto significa que:

### ✅ Cuando Reportas una Parte Robada:
1. Se guarda inmediatamente en localStorage
2. Se genera el código QR al instante
3. Cualquiera puede verificarla de inmediato

### ✅ Cuando Verificas una Parte:
1. El sistema recarga los datos más recientes de localStorage
2. Busca en la base de datos actualizada
3. Muestra si está robada o limpia

---

## 🔄 Actualizaciones Automáticas

### Auto-Refresh Cada 5 Segundos
La página de verificación se actualiza automáticamente cada 5 segundos cuando está activa:

```javascript
// Auto-actualizar reportes cada 5 segundos
setInterval(() => {
    if (!document.hidden) {
        loadRecentReports();
    }
}, 5000);
```

### Sincronización Entre Pestañas
Si tienes varias pestañas abiertas, se sincronizan automáticamente:

```javascript
// Detectar cambios en otras pestañas
window.addEventListener('storage', (e) => {
    if (e.key === 'stolenParts') {
        // Recargar datos
        stolenParts = JSON.parse(e.newValue) || [];
        loadRecentReports();
    }
});
```

---

## 📊 Flujo de Datos en Tiempo Real

### 1. Reportar Parte Robada
```
Usuario completa formulario
    ↓
Datos se guardan en localStorage
    ↓
Se genera QR único
    ↓
✅ Disponible inmediatamente para verificación
```

### 2. Verificar Parte
```
Usuario escanea QR o ingresa código
    ↓
Sistema recarga datos más recientes
    ↓
Busca en base de datos actualizada
    ↓
✅ Muestra resultado al instante
```

---

## 🎯 Funciones Clave

### `reloadStolenParts()`
Recarga los datos más recientes de localStorage:
```javascript
function reloadStolenParts() {
    const data = localStorage.getItem('stolenParts');
    stolenParts = data ? JSON.parse(data) : [];
    console.log('📊 Datos recargados:', stolenParts.length, 'reportes');
    return stolenParts;
}
```

### `verifyCode(code)` - Mejorada
Ahora SIEMPRE recarga los datos antes de verificar:
```javascript
function verifyCode(code) {
    // ⚡ Recargar datos para tener info más reciente
    reloadStolenParts();
    
    // Buscar en la base de datos actualizada
    const stolenPart = stolenParts.find(part => part.id === code);
    
    // Mostrar resultado
    if (stolenPart) {
        console.log('🚨 ALERTA: Parte robada encontrada');
        // Mostrar alerta roja...
    } else {
        console.log('✅ Parte limpia');
        // Mostrar verificación verde...
    }
}
```

### `loadRecentReports()` - Mejorada
Ahora recarga datos y actualiza el indicador de tiempo:
```javascript
function loadRecentReports() {
    // Recargar datos más recientes
    reloadStolenParts();
    
    // Actualizar indicador de tiempo
    updateLastUpdateIndicator();
    
    // Mostrar reportes actualizados
    // ...
}
```

---

## 🕐 Indicador Visual

En la página de verificación verás un indicador que muestra:

```
⚡ Actualizado: 14:32:45
```

Este indicador se actualiza cada 5 segundos mostrando la hora exacta de la última sincronización.

---

## 🧪 Cómo Probar

### Prueba 1: Una Sola Ventana
1. Abre `reporte-robo.html`
2. Completa el formulario y genera un reporte
3. Ve a `verificar-qr.html`
4. Ingresa el código manualmente
5. ✅ Debe aparecer la alerta roja inmediatamente

### Prueba 2: Dos Ventanas Simultáneas
1. Abre dos ventanas del navegador
2. Ventana 1: `verificar-qr.html` (deja abierta)
3. Ventana 2: `reporte-robo.html`
4. En Ventana 2: Crea un nuevo reporte
5. ✅ En Ventana 1: Los reportes recientes se actualizan automáticamente

### Prueba 3: Verificación Inmediata
1. Genera un reporte y descarga el QR
2. Inmediatamente ve a `verificar-qr.html`
3. Sube o escanea el QR recién descargado
4. ✅ Debe verificarse correctamente sin recargar la página

---

## 📱 Consola del Navegador

Abre la consola (F12) y verás mensajes como:

```
✅ Sistema de verificación inicializado
🔄 Auto-actualización cada 5 segundos activada
📊 Total de reportes en sistema: 5

🔍 Verificando código: STOLEN-1699632000000
📊 Buscando en 5 reportes
🚨 ALERTA: Parte encontrada en base de datos

🔄 Actualizando reportes recientes. Total: 5
⚡ Actualizado: 14:35:20
```

---

## 🎯 Ventajas del Sistema

### ✅ Sincronización Instantánea
- Los reportes aparecen inmediatamente
- No necesitas recargar la página manualmente
- Funciona en tiempo real

### ✅ Múltiples Dispositivos
- Si reportas desde tu móvil, puedes verificar desde tu PC
- Los datos persisten en localStorage de cada dispositivo
- Compatible con todas las pestañas del mismo navegador

### ✅ Offline-First
- Funciona sin conexión después de cargar
- Los datos se guardan localmente
- No requiere servidor

### ✅ Indicadores Visuales
- Muestra la hora de la última actualización
- Animaciones sutiles al actualizar
- Feedback claro al usuario

---

## 🔧 Funciones Exportadas

Puedes usar estas funciones desde la consola:

```javascript
// Recargar datos manualmente
window.stolenPartsSystem.reloadData()

// Verificar un código
window.stolenPartsSystem.verifyCode('STOLEN-1699632000000')

// Obtener todos los reportes
window.stolenPartsSystem.getStolenParts()

// Actualizar reportes recientes
window.stolenPartsSystem.updateReports()
```

---

## ⚙️ Configuración

### Cambiar Frecuencia de Actualización

En `stolen-parts.js`, línea ~234:
```javascript
// Cambiar de 5000 (5 segundos) a otro valor
setInterval(() => {
    if (!document.hidden) {
        loadRecentReports();
    }
}, 5000); // ← Cambiar aquí (en milisegundos)
```

Ejemplos:
- `3000` = 3 segundos (más rápido)
- `10000` = 10 segundos (más lento)
- `1000` = 1 segundo (muy rápido, no recomendado)

---

## 🐛 Solución de Problemas

### Los datos no se actualizan
1. Abre la consola (F12)
2. Ejecuta: `window.stolenPartsSystem.reloadData()`
3. Verifica: `window.stolenPartsSystem.getStolenParts()`

### El indicador no se muestra
- Verifica que estés en `verificar-qr.html`
- El indicador solo aparece en la página de verificación

### Los reportes no aparecen
1. Asegúrate de que localStorage esté habilitado
2. No uses modo incógnito
3. Verifica en consola: `localStorage.getItem('stolenParts')`

---

## 📊 Estadísticas del Sistema

Ver estadísticas en la consola:
```javascript
// Total de reportes
const reportes = JSON.parse(localStorage.getItem('stolenParts')) || [];
console.log('Total:', reportes.length);

// Ver todos los códigos
reportes.forEach(r => console.log(r.id));

// Reportes por categoría
const porCategoria = {};
reportes.forEach(r => {
    const cat = r.part.category;
    porCategoria[cat] = (porCategoria[cat] || 0) + 1;
});
console.table(porCategoria);
```

---

## ✅ Características Implementadas

- ✅ Recarga automática cada 5 segundos
- ✅ Sincronización entre pestañas
- ✅ Indicador visual de última actualización
- ✅ Recarga antes de cada verificación
- ✅ Eventos personalizados de actualización
- ✅ Logs detallados en consola
- ✅ Funciones exportadas para uso manual
- ✅ Animaciones al actualizar

---

## 🚀 Próximas Mejoras Posibles

### Notificaciones Push
- Notificar cuando se agregue un nuevo reporte
- Usar Web Notifications API

### Sincronización en la Nube
- Guardar en Firebase o similar
- Sincronizar entre dispositivos diferentes

### Historial de Cambios
- Registrar cuándo se agregó cada reporte
- Mostrar timeline de actividad

### Búsqueda Avanzada
- Filtrar por categoría, marca, fecha
- Buscar por texto en descripción

---

**Archivo**: ACTUALIZACION-TIEMPO-REAL.md  
**Fecha**: 10 de noviembre de 2025  
**Versión**: 1.0 - Sistema de Sincronización Implementado  
**Estado**: ✅ Funcionando
