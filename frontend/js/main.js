// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Utilidades para manejar el token
const auth = {
    setToken: (token) => {
        localStorage.setItem('token', token);
    },
    getToken: () => {
        return localStorage.getItem('token');
    },
    removeToken: () => {
        localStorage.removeItem('token');
    },
    isLoggedIn: () => {
        return !!localStorage.getItem('token');
    },
    getUserData: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },
    setUserData: (data) => {
        localStorage.setItem('userData', JSON.stringify(data));
    },
    removeUserData: () => {
        localStorage.removeItem('userData');
    }
};

// Headers para peticiones autenticadas
const getAuthHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.getToken()}`
    };
};

// Función para hacer peticiones a la API
async function apiRequest(endpoint, method = 'GET', data = null, requiresAuth = false) {
    const options = {
        method,
        headers: requiresAuth ? getAuthHeaders() : {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error en la petición');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Mostrar alertas
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Actualizar menú según estado de autenticación
function updateNav() {
    const loginLink = document.getElementById('loginLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (auth.isLoggedIn()) {
        loginLink?.classList.add('hidden');
        dashboardLink?.classList.remove('hidden');
        logoutLink?.classList.remove('hidden');
    } else {
        loginLink?.classList.remove('hidden');
        dashboardLink?.classList.add('hidden');
        logoutLink?.classList.add('hidden');
    }
}

// Cerrar sesión
function logout() {
    auth.removeToken();
    auth.removeUserData();
    showAlert('Sesión cerrada exitosamente', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Event listener para cerrar sesión
document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// Función para formatear fechas
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Función para generar código QR
async function generateQRCode(data) {
    try {
        // En el frontend, usaremos una librería como qrcodejs
        // Por ahora, el QR se genera en el backend
        return data;
    } catch (error) {
        console.error('Error generando QR:', error);
        throw error;
    }
}

// Validación de formularios
function validateForm(formId, fields) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    
    fields.forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (!input || !input.value.trim()) {
            isValid = false;
            input?.classList.add('error');
        } else {
            input?.classList.remove('error');
        }
    });
    
    return isValid;
}

// Mostrar/ocultar loading
function showLoading() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.id = 'loadingSpinner';
    document.body.appendChild(spinner);
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    spinner?.remove();
}

// Redirigir si no está autenticado
function requireAuth() {
    if (!auth.isLoggedIn()) {
        showAlert('Debes iniciar sesión para acceder a esta página', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    return true;
}

// Exportar funciones globales
window.auth = auth;
window.apiRequest = apiRequest;
window.showAlert = showAlert;
window.updateNav = updateNav;
window.logout = logout;
window.formatDate = formatDate;
window.generateQRCode = generateQRCode;
window.validateForm = validateForm;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.requireAuth = requireAuth;
