// Variables globales
let productos = [];
let sucursales = [];
let productoSeleccionado = null;
let ubicacionUsuario = null;

// Cargar datos iniciales
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    cargarFiltros();
    cargarProductos();
    cargarSucursales();
});

// Cargar filtros (marcas y categorías)
async function cargarFiltros() {
    try {
        // Cargar marcas
        const resMarcas = await fetch(`${API_URL}/catalogo/info/marcas`);
        const dataMarcas = await resMarcas.json();
        
        const selectMarca = document.getElementById('filtroMarca');
        dataMarcas.marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            selectMarca.appendChild(option);
        });
        
        // Cargar categorías
        const resCategorias = await fetch(`${API_URL}/catalogo/info/categorias`);
        const dataCategorias = await resCategorias.json();
        
        const selectCategoria = document.getElementById('filtroCategoria');
        dataCategorias.categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            selectCategoria.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar filtros:', error);
    }
}

// Cargar productos con filtros
async function cargarProductos() {
    try {
        const marca = document.getElementById('filtroMarca').value;
        const categoria = document.getElementById('filtroCategoria').value;
        const masVendidos = document.getElementById('filtroMasVendidos').checked;
        
        let url = `${API_URL}/catalogo?`;
        if (marca) url += `marca=${marca}&`;
        if (categoria) url += `categoria=${categoria}&`;
        if (masVendidos) url += `mas_vendidos=true&`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            productos = data.productos;
            mostrarProductos(productos);
            actualizarEstadisticas(productos);
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarError('Error al cargar productos');
    }
}

// Mostrar productos en la grid
function mostrarProductos(productos) {
    const container = document.getElementById('productosContainer');
    
    if (productos.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No se encontraron productos con los filtros seleccionados</p></div>';
        return;
    }
    
    container.innerHTML = productos.map(producto => `
        <div class="producto-card">
            ${producto.mas_vendido ? '<span class="producto-badge">⭐ Más Vendido</span>' : ''}
            
            <div class="producto-header">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-marca">🏷️ ${producto.marca} | 📦 ${producto.categoria}</p>
            </div>
            
            <p class="producto-descripcion">${producto.descripcion || 'Sin descripción'}</p>
            
            <div class="producto-info">
                <span>Modelo: ${producto.modelo_compatible || 'Universal'}</span>
            </div>
            
            <div class="producto-rating">
                ${'⭐'.repeat(Math.floor(producto.puntuacion))} ${producto.puntuacion.toFixed(1)}
                <span style="color: #888;">(${producto.numero_ventas} ventas)</span>
            </div>
            
            <div class="producto-precio">
                $${producto.precio.toLocaleString()}
                ${producto.precio_original ? 
                    `<span class="producto-precio-original">$${producto.precio_original.toLocaleString()}</span>` 
                    : ''}
            </div>
            
            <p class="producto-stock">
                ${producto.stock > 0 ? 
                    `✅ En stock (${producto.stock} unidades)` : 
                    '❌ Agotado'}
            </p>
            
            <div class="producto-footer">
                <button 
                    class="btn-comprar" 
                    onclick="abrirModalCompra(${producto.id})"
                    ${producto.stock === 0 ? 'disabled' : ''}>
                    🛒 Comprar Ahora
                </button>
            </div>
        </div>
    `).join('');
}

// Actualizar estadísticas
function actualizarEstadisticas(productos) {
    document.getElementById('totalProductos').textContent = productos.length;
    
    const marcasUnicas = [...new Set(productos.map(p => p.marca))];
    document.getElementById('totalMarcas').textContent = marcasUnicas.length;
    
    const masVendidos = productos.filter(p => p.mas_vendido === 1);
    document.getElementById('totalMasVendidos').textContent = masVendidos.length;
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('filtroMarca').value = '';
    document.getElementById('filtroCategoria').value = '';
    document.getElementById('filtroMasVendidos').checked = false;
    cargarProductos();
}

// Cargar sucursales
async function cargarSucursales() {
    try {
        const response = await fetch(`${API_URL}/sucursales`);
        const data = await response.json();
        
        if (data.success) {
            sucursales = data.sucursales;
            const select = document.getElementById('sucursalCompra');
            
            // Agrupar por ciudad
            const ciudades = {};
            sucursales.forEach(s => {
                if (!ciudades[s.ciudad]) ciudades[s.ciudad] = [];
                ciudades[s.ciudad].push(s);
            });
            
            // Agregar opciones agrupadas
            Object.keys(ciudades).sort().forEach(ciudad => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = ciudad;
                
                ciudades[ciudad].forEach(sucursal => {
                    const option = document.createElement('option');
                    option.value = sucursal.id;
                    option.textContent = sucursal.nombre;
                    option.dataset.sucursal = JSON.stringify(sucursal);
                    optgroup.appendChild(option);
                });
                
                select.appendChild(optgroup);
            });
            
            // Event listener para mostrar info
            select.addEventListener('change', function() {
                if (this.value) {
                    const sucursal = JSON.parse(this.options[this.selectedIndex].dataset.sucursal);
                    mostrarInfoSucursal(sucursal);
                } else {
                    document.getElementById('infoSucursal').innerHTML = '';
                }
            });
        }
    } catch (error) {
        console.error('Error al cargar sucursales:', error);
    }
}

// Abrir modal de compra
async function abrirModalCompra(productoId) {
    try {
        const response = await fetch(`${API_URL}/catalogo/${productoId}`);
        const data = await response.json();
        
        if (data.success) {
            productoSeleccionado = data.producto;
            
            document.getElementById('productoDetalleCompra').innerHTML = `
                <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="color: #00d4ff;">${productoSeleccionado.nombre}</h3>
                    <p style="color: #888;">🏷️ ${productoSeleccionado.marca} | 📦 ${productoSeleccionado.categoria}</p>
                    <p style="color: #00ff88; font-size: 24px; font-weight: bold; margin: 10px 0;">
                        $${productoSeleccionado.precio.toLocaleString()}
                    </p>
                </div>
            `;
            
            document.getElementById('productoIdCompra').value = productoSeleccionado.id;
            document.getElementById('precioUnitario').value = productoSeleccionado.precio;
            document.getElementById('cantidadCompra').max = productoSeleccionado.stock;
            document.getElementById('stockDisponible').textContent = `Disponible: ${productoSeleccionado.stock} unidades`;
            
            actualizarTotal();
            document.getElementById('modalCompra').style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar producto:', error);
        mostrarError('Error al cargar el producto');
    }
}

// Cerrar modal de compra
function cerrarModalCompra() {
    document.getElementById('modalCompra').style.display = 'none';
    document.getElementById('formCompra').reset();
    document.getElementById('infoSucursal').innerHTML = '';
    productoSeleccionado = null;
}

// Cambiar método de entrega
function cambiarMetodoEntrega() {
    const metodo = document.getElementById('metodoEntrega').value;
    const divSucursal = document.getElementById('seleccionSucursal');
    const divDireccion = document.getElementById('direccionEntrega');
    const selectSucursal = document.getElementById('sucursalCompra');
    const textareaDireccion = document.getElementById('direccionCompra');
    
    if (metodo === 'sucursal') {
        divSucursal.classList.remove('hidden');
        divDireccion.classList.add('hidden');
        selectSucursal.required = true;
        textareaDireccion.required = false;
    } else {
        divSucursal.classList.add('hidden');
        divDireccion.classList.remove('hidden');
        selectSucursal.required = false;
        textareaDireccion.required = true;
    }
}

// Detectar ubicación y encontrar sucursal más cercana
async function detectarUbicacion() {
    if (!navigator.geolocation) {
        mostrarError('Tu navegador no soporta geolocalización');
        return;
    }
    
    const btn = event.target;
    btn.textContent = '🔄 Detectando...';
    btn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            ubicacionUsuario = {
                latitud: position.coords.latitude,
                longitud: position.coords.longitude
            };
            
            try {
                const response = await fetch(`${API_URL}/sucursales/cercana`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ubicacionUsuario)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    const sucursal = data.sucursal_mas_cercana;
                    
                    // Seleccionar la sucursal en el select
                    const select = document.getElementById('sucursalCompra');
                    select.value = sucursal.id;
                    select.dispatchEvent(new Event('change'));
                    
                    mostrarExito(`Sucursal más cercana encontrada: ${sucursal.nombre} (${sucursal.distancia_km} km)`);
                }
            } catch (error) {
                console.error('Error al buscar sucursal cercana:', error);
                mostrarError('Error al buscar sucursal cercana');
            } finally {
                btn.textContent = '📍 Detectar Sucursal Más Cercana';
                btn.disabled = false;
            }
        },
        (error) => {
            mostrarError('No se pudo obtener tu ubicación. Por favor, selecciona una sucursal manualmente.');
            btn.textContent = '📍 Detectar Sucursal Más Cercana';
            btn.disabled = false;
        }
    );
}

// Mostrar información de sucursal
function mostrarInfoSucursal(sucursal) {
    const container = document.getElementById('infoSucursal');
    container.innerHTML = `
        <h4>📍 ${sucursal.nombre}</h4>
        <p><strong>Dirección:</strong> ${sucursal.direccion}, ${sucursal.ciudad}</p>
        <p><strong>Teléfono:</strong> ${sucursal.telefono}</p>
        <p><strong>Horario:</strong> ${sucursal.horario_apertura} - ${sucursal.horario_cierre}</p>
        <p><strong>Días:</strong> ${sucursal.dias_atencion}</p>
        <p><strong>Servicios:</strong> ${sucursal.servicios}</p>
        ${ubicacionUsuario && sucursal.latitud && sucursal.longitud ? 
            `<p><strong>Distancia:</strong> ~${calcularDistanciaAproximada(
                ubicacionUsuario.latitud, 
                ubicacionUsuario.longitud,
                sucursal.latitud,
                sucursal.longitud
            ).toFixed(1)} km</p>` : ''}
    `;
}

// Calcular distancia aproximada
function calcularDistanciaAproximada(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Actualizar total de compra
function actualizarTotal() {
    const cantidad = parseInt(document.getElementById('cantidadCompra').value) || 1;
    const precioUnitario = parseFloat(document.getElementById('precioUnitario').value) || 0;
    const total = cantidad * precioUnitario;
    
    document.getElementById('precioTotal').textContent = total.toLocaleString();
}

// Realizar compra
async function realizarCompra(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        mostrarError('Debes iniciar sesión para comprar');
        window.location.href = 'login.html';
        return;
    }
    
    const formData = {
        producto_id: parseInt(document.getElementById('productoIdCompra').value),
        cantidad: parseInt(document.getElementById('cantidadCompra').value),
        metodo_entrega: document.getElementById('metodoEntrega').value,
        sucursal_id: document.getElementById('metodoEntrega').value === 'sucursal' ? 
            parseInt(document.getElementById('sucursalCompra').value) : null,
        direccion_entrega: document.getElementById('metodoEntrega').value === 'domicilio' ? 
            document.getElementById('direccionCompra').value : null
    };
    
    try {
        const response = await fetch(`${API_URL}/catalogo/comprar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarExito('¡Compra realizada exitosamente! Total: $' + data.total.toLocaleString());
            cerrarModalCompra();
            cargarProductos(); // Actualizar stock
            
            // Mostrar información de la sucursal si es recogida
            if (formData.sucursal_id) {
                const sucursal = sucursales.find(s => s.id === formData.sucursal_id);
                if (sucursal) {
                    setTimeout(() => {
                        alert(`🎉 ¡Compra Confirmada!\n\n` +
                              `Recoge tu producto en:\n` +
                              `📍 ${sucursal.nombre}\n` +
                              `📫 ${sucursal.direccion}, ${sucursal.ciudad}\n` +
                              `📞 ${sucursal.telefono}\n` +
                              `🕐 ${sucursal.horario_apertura} - ${sucursal.horario_cierre}`);
                    }, 1000);
                }
            }
        } else {
            mostrarError(data.message || 'Error al procesar la compra');
        }
    } catch (error) {
        console.error('Error al realizar compra:', error);
        mostrarError('Error al procesar la compra');
    }
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modalCompra');
    if (event.target === modal) {
        cerrarModalCompra();
    }
}
