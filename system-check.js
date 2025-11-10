// ===== Verificación y Carga de Librerías =====
// Este script asegura que las librerías necesarias estén cargadas

(function() {
    'use strict';
    
    console.log('🔍 Verificando librerías del sistema...');
    
    // Verificar QRCode.js
    function checkQRCode() {
        if (typeof QRCode !== 'undefined') {
            console.log('✅ QRCode.js está disponible');
            return true;
        } else {
            console.warn('⚠️ QRCode.js no está disponible');
            return false;
        }
    }
    
    // Verificar Html5Qrcode
    function checkHtml5Qrcode() {
        if (typeof Html5Qrcode !== 'undefined') {
            console.log('✅ Html5Qrcode está disponible');
            return true;
        } else {
            console.warn('⚠️ Html5Qrcode no está disponible');
            return false;
        }
    }
    
    // Verificar localStorage
    function checkLocalStorage() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            console.log('✅ localStorage está disponible');
            return true;
        } catch(e) {
            console.error('❌ localStorage NO está disponible');
            return false;
        }
    }
    
    // Cargar librería alternativa si la principal falla
    function loadAlternativeQRCode() {
        return new Promise((resolve, reject) => {
            if (typeof QRCode !== 'undefined') {
                resolve();
                return;
            }
            
            console.log('🔄 Intentando cargar QRCode.js desde CDN alternativo...');
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
            script.crossOrigin = 'anonymous';
            script.onload = () => {
                console.log('✅ QRCode.js cargado desde CDN alternativo');
                resolve();
            };
            script.onerror = () => {
                console.error('❌ Error al cargar QRCode.js desde CDN alternativo');
                reject();
            };
            document.head.appendChild(script);
        });
    }
    
    // Ejecutar verificaciones cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runChecks);
    } else {
        runChecks();
    }
    
    function runChecks() {
        console.log('🚀 Iniciando verificaciones del sistema...');
        
        // Verificar localStorage
        const hasLocalStorage = checkLocalStorage();
        if (!hasLocalStorage) {
            alert('⚠️ Advertencia: El almacenamiento local no está disponible. Las funcionalidades pueden estar limitadas.');
        }
        
        // Verificar librerías específicas según la página
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'reporte-robo.html') {
            setTimeout(() => {
                if (!checkQRCode()) {
                    console.log('🔄 Intentando cargar librería alternativa...');
                    loadAlternativeQRCode().catch(() => {
                        alert('❌ Error: No se pudo cargar la librería de códigos QR. Por favor, recarga la página o verifica tu conexión a internet.');
                    });
                }
            }, 1000);
        }
        
        if (currentPage === 'verificar-qr.html') {
            setTimeout(() => {
                checkHtml5Qrcode();
            }, 1000);
        }
        
        console.log('✅ Verificaciones completadas');
    }
    
    // Hacer disponibles las funciones de verificación globalmente
    window.checkSystemLibraries = function() {
        console.log('\n=== ESTADO DE LAS LIBRERÍAS ===');
        console.log('QRCode.js:', checkQRCode() ? '✅ OK' : '❌ No disponible');
        console.log('Html5Qrcode:', checkHtml5Qrcode() ? '✅ OK' : '❌ No disponible');
        console.log('localStorage:', checkLocalStorage() ? '✅ OK' : '❌ No disponible');
        console.log('\nPara más información, abre la consola del navegador (F12)');
    };
    
})();
