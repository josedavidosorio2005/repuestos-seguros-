// Sistema de Verificación de Autopartes - Sin funciones de e-commerce

// Estado global de la aplicación
let data = {
    stolenParts: JSON.parse(localStorage.getItem('stolenParts')) || []
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar datos
    await loadData();
    
    // Inicializar menú móvil
    initMobileMenu();
    
    // Inicializar según la página actual
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
        initHomePage();
    } else if (currentPage === 'reporte-robo.html') {
        initReportPage();
    } else if (currentPage === 'verificar-qr.html') {
        initVerifyPage();
    } else if (currentPage === 'contacto.html') {
        initContactPage();
    }
});

// Cargar datos del sistema
async function loadData() {
    try {
        // Cargar partes robadas desde localStorage
        const localStolenParts = localStorage.getItem('stolenParts');
        
        if (localStolenParts) {
            data.stolenParts = JSON.parse(localStolenParts);
            console.log('✅ Datos cargados:', data.stolenParts.length, 'partes robadas registradas');
        } else {
            console.log('ℹ️ No hay partes robadas registradas');
        }
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
    }
}

// Inicializar menú móvil
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Inicializar página de inicio
function initHomePage() {
    console.log('✅ Página de inicio inicializada');
}

// Inicializar página de reportar robo
function initReportPage() {
    const form = document.getElementById('reportForm');
    if (form) {
        form.addEventListener('submit', handleReportSubmit);
    }
}

// Manejar envío de reporte de robo
async function handleReportSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reportData = {
        id: Date.now(),
        date: new Date().toISOString(),
        partType: formData.get('partType'),
        brand: formData.get('brand'),
        model: formData.get('model'),
        serial: formData.get('serial'),
        description: formData.get('description'),
        reporterName: formData.get('reporterName'),
        reporterContact: formData.get('reporterContact'),
        qrCode: generateQRData(formData)
    };
    
    // Guardar en localStorage
    data.stolenParts.push(reportData);
    localStorage.setItem('stolenParts', JSON.stringify(data.stolenParts));
    
    // Mostrar mensaje de éxito
    showNotification('✅ Reporte enviado exitosamente. Se ha generado un código QR.', 'success');
    
    // Limpiar formulario
    e.target.reset();
    
    // Mostrar QR (si hay librería QR disponible)
    if (typeof QRCode !== 'undefined') {
        displayQRCode(reportData.qrCode);
    }
}

// Generar datos para QR
function generateQRData(formData) {
    return JSON.stringify({
        type: 'stolen_part',
        partType: formData.get('partType'),
        brand: formData.get('brand'),
        model: formData.get('model'),
        serial: formData.get('serial'),
        timestamp: Date.now()
    });
}

// Mostrar código QR
function displayQRCode(qrData) {
    // Implementar con librería QRCode.js si está disponible
    console.log('QR Data:', qrData);
}

// Inicializar página de verificación
function initVerifyPage() {
    const scanBtn = document.getElementById('startScan');
    const manualBtn = document.getElementById('manualCheck');
    
    if (scanBtn) {
        scanBtn.addEventListener('click', startQRScan);
    }
    
    if (manualBtn) {
        manualBtn.addEventListener('click', showManualCheckForm);
    }
}

// Iniciar escaneo de QR
async function startQRScan() {
    // Implementar escaneo con Html5Qrcode si está disponible
    if (typeof Html5Qrcode !== 'undefined') {
        const html5QrCode = new Html5Qrcode("qr-reader");
        
        try {
            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                onScanSuccess,
                onScanError
            );
        } catch (err) {
            console.error('Error al iniciar cámara:', err);
            showNotification('❌ No se pudo acceder a la cámara', 'error');
        }
    } else {
        showNotification('⚠️ Librería de escaneo no disponible', 'warning');
    }
}

// Callback de escaneo exitoso
function onScanSuccess(decodedText, decodedResult) {
    console.log(`Código escaneado: ${decodedText}`, decodedResult);
    
    try {
        const qrData = JSON.parse(decodedText);
        checkIfStolen(qrData);
    } catch (e) {
        showNotification('⚠️ Código QR no válido', 'warning');
    }
}

// Callback de error de escaneo
function onScanError(error) {
    // No mostrar errores continuos de escaneo
}

// Verificar si una parte está robada
function checkIfStolen(qrData) {
    const isStolen = data.stolenParts.some(part => 
        part.serial === qrData.serial &&
        part.brand === qrData.brand &&
        part.model === qrData.model
    );
    
    if (isStolen) {
        showNotification('⚠️ ¡ALERTA! Esta parte ha sido reportada como ROBADA', 'error');
    } else {
        showNotification('✅ Esta parte NO está reportada como robada', 'success');
    }
}

// Mostrar formulario de verificación manual
function showManualCheckForm() {
    showNotification('ℹ️ Ingrese los datos para verificación manual', 'info');
}

// Inicializar página de contacto
function initContactPage() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleContactSubmit);
    }
}

// Manejar envío de formulario de contacto
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Simular envío (en producción, enviar a servidor)
    console.log('Mensaje de contacto:', {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    });
    
    showNotification('✅ Mensaje enviado exitosamente', 'success');
    e.target.reset();
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Exportar funciones para uso global
window.showNotification = showNotification;
window.checkIfStolen = checkIfStolen;
