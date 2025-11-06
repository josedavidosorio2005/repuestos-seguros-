// Verificar autenticación
if (!requireAuth()) {
    // requireAuth ya redirige si no está autenticado
}

// Cargar datos del dashboard
async function cargarDashboard() {
    try {
        showLoading();

        // Cargar perfil
        const perfil = await apiRequest('/usuarios/perfil', 'GET', null, true);
        mostrarPerfil(perfil.data);

        // Cargar estadísticas
        const stats = await apiRequest('/usuarios/estadisticas', 'GET', null, true);
        mostrarEstadisticas(stats.data);

        // Cargar motocicletas
        const motos = await apiRequest('/motos/mis-motos', 'GET', null, true);
        mostrarMotocicletas(motos.data);

        // Cargar autopartes
        const partes = await apiRequest('/autopartes/mis-partes', 'GET', null, true);
        mostrarAutopartes(partes.data);

        hideLoading();
    } catch (error) {
        hideLoading();
        showAlert('Error al cargar el dashboard: ' + error.message, 'danger');
    }
}

// Mostrar perfil
function mostrarPerfil(data) {
    const perfilInfo = document.getElementById('perfilInfo');
    perfilInfo.innerHTML = `
        <div class="grid">
            <div>
                <strong>Nombre:</strong> ${data.nombre}
            </div>
            <div>
                <strong>Email:</strong> ${data.email}
            </div>
            <div>
                <strong>Tipo:</strong> <span class="badge badge-info">${data.tipo_usuario}</span>
            </div>
            <div>
                <strong>Estado:</strong> <span class="badge badge-success">${data.estado}</span>
            </div>
        </div>
    `;
}

// Mostrar estadísticas
function mostrarEstadisticas(data) {
    document.getElementById('totalMotos').textContent = data.motocicletas || 0;
    document.getElementById('totalPartes').textContent = data.autopartes || 0;
    document.getElementById('totalReportes').textContent = data.reportes || 0;
    document.getElementById('totalVerificaciones').textContent = data.verificaciones || 0;
}

// Mostrar motocicletas
function mostrarMotocicletas(motos) {
    const container = document.getElementById('motosContainer');
    
    if (!motos || motos.length === 0) {
        container.innerHTML = `
            <p style="color: var(--text-gray); text-align: center; padding: 2rem;">
                No tienes motocicletas registradas. 
                <a href="#" onclick="mostrarRegistroMoto()" style="color: var(--primary-color);">Registra tu primera moto</a>
            </p>
        `;
        return;
    }

    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Año</th>
                    <th>Placa</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${motos.map(moto => `
                    <tr>
                        <td>${moto.marca}</td>
                        <td>${moto.modelo}</td>
                        <td>${moto.año}</td>
                        <td>${moto.placa || 'N/A'}</td>
                        <td>
                            <span class="badge badge-${moto.estado === 'activa' ? 'success' : 'danger'}">
                                ${moto.estado}
                            </span>
                        </td>
                        <td>
                            <button onclick="verDetalleMoto(${moto.id})" class="btn btn-secondary" style="padding: 0.3rem 0.8rem; font-size: 0.9rem;">
                                Ver Detalles
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Mostrar autopartes
function mostrarAutopartes(partes) {
    const container = document.getElementById('partesContainer');
    
    if (!partes || partes.length === 0) {
        container.innerHTML = `
            <p style="color: var(--text-gray); text-align: center; padding: 2rem;">
                No tienes autopartes registradas. 
                <a href="#" onclick="mostrarRegistroParte()" style="color: var(--primary-color);">Registra tu primera autoparte</a>
            </p>
        `;
        return;
    }

    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Nombre</th>
                    <th>Motocicleta</th>
                    <th>Código</th>
                    <th>Estado</th>
                    <th>QR</th>
                </tr>
            </thead>
            <tbody>
                ${partes.map(parte => `
                    <tr>
                        <td>${parte.tipo_parte}</td>
                        <td>${parte.nombre_parte}</td>
                        <td>${parte.moto_marca} ${parte.moto_modelo}</td>
                        <td style="font-family: monospace;">${parte.codigo_unico}</td>
                        <td>
                            <span class="badge badge-${getBadgeClass(parte.estado)}">
                                ${parte.estado}
                            </span>
                        </td>
                        <td>
                            <button onclick="verQR('${parte.codigo_qr}', '${parte.nombre_parte}')" 
                                    class="btn btn-primary" style="padding: 0.3rem 0.8rem; font-size: 0.9rem;">
                                Ver QR
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function getBadgeClass(estado) {
    switch(estado) {
        case 'registrada':
        case 'verificada':
            return 'success';
        case 'reportada_robada':
            return 'danger';
        case 'vendida':
            return 'warning';
        default:
            return 'info';
    }
}

// Ver QR Code
function verQR(qrCode, nombre) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 2000; display: flex; align-items: center; justify-content: center;';
    modal.innerHTML = `
        <div class="card" style="max-width: 500px;">
            <h2 class="card-header">Código QR - ${nombre}</h2>
            <div class="qr-container">
                <img src="${qrCode}" alt="QR Code" style="max-width: 100%; height: auto;">
            </div>
            <p style="text-align: center; color: var(--text-gray); margin: 1rem 0;">
                Comparte este código QR para verificar la autoparte
            </p>
            <button onclick="this.closest('div[style*=fixed]').remove()" class="btn btn-secondary" style="width: 100%;">
                Cerrar
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Mostrar modal de registro de moto
function mostrarRegistroMoto() {
    document.getElementById('modalRegistroMoto').classList.remove('hidden');
}

// Mostrar modal de registro de parte
async function mostrarRegistroParte() {
    try {
        // Cargar motocicletas para el selector
        const motos = await apiRequest('/motos/mis-motos', 'GET', null, true);
        const select = document.getElementById('motocicleta_id');
        
        select.innerHTML = '<option value="">Seleccione una motocicleta</option>';
        motos.data.forEach(moto => {
            select.innerHTML += `<option value="${moto.id}">${moto.marca} ${moto.modelo} (${moto.placa || moto.numero_serie})</option>`;
        });
        
        document.getElementById('modalRegistroParte').classList.remove('hidden');
    } catch (error) {
        showAlert('Error al cargar motocicletas: ' + error.message, 'danger');
    }
}

// Cerrar modal
function cerrarModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Registrar motocicleta
document.getElementById('formRegistroMoto').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        año: parseInt(document.getElementById('año').value),
        color: document.getElementById('color').value,
        numero_serie: document.getElementById('numero_serie').value,
        placa: document.getElementById('placa').value,
        numero_motor: document.getElementById('numero_motor').value,
        numero_chasis: document.getElementById('numero_chasis').value
    };

    try {
        showLoading();
        const response = await apiRequest('/motos/registrar', 'POST', formData, true);
        hideLoading();
        
        if (response.success) {
            showAlert('Motocicleta registrada exitosamente', 'success');
            cerrarModal('modalRegistroMoto');
            e.target.reset();
            cargarDashboard(); // Recargar datos
        }
    } catch (error) {
        hideLoading();
        showAlert('Error al registrar motocicleta: ' + error.message, 'danger');
    }
});

// Registrar autoparte
document.getElementById('formRegistroParte').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        motocicleta_id: parseInt(document.getElementById('motocicleta_id').value),
        tipo_parte: document.getElementById('tipo_parte').value,
        nombre_parte: document.getElementById('nombre_parte').value,
        numero_serie: document.getElementById('numero_serie_parte').value,
        marca: document.getElementById('marca_parte').value,
        descripcion: document.getElementById('descripcion').value
    };

    try {
        showLoading();
        const response = await apiRequest('/autopartes/registrar', 'POST', formData, true);
        hideLoading();
        
        if (response.success) {
            showAlert('Autoparte registrada exitosamente con código QR', 'success');
            cerrarModal('modalRegistroParte');
            e.target.reset();
            
            // Mostrar QR generado
            if (response.data.qr_code) {
                verQR(response.data.qr_code, formData.nombre_parte);
            }
            
            cargarDashboard(); // Recargar datos
        }
    } catch (error) {
        hideLoading();
        showAlert('Error al registrar autoparte: ' + error.message, 'danger');
    }
});

// Cargar dashboard al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarDashboard();
});

// Exportar funciones
window.mostrarRegistroMoto = mostrarRegistroMoto;
window.mostrarRegistroParte = mostrarRegistroParte;
window.cerrarModal = cerrarModal;
window.verQR = verQR;
