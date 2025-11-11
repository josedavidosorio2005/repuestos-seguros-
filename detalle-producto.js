// ===== Variables Globales =====
let data = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;

// ===== Inicialización =====
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    loadProductDetail();
    updateCartCount();
});

// Escuchar cuando init-products.js cargue los productos
window.addEventListener('productsLoaded', async () => {
    console.log('🔄 Recargando datos después de inicialización de productos...');
    await loadData();
    loadProductDetail();
});

// ===== Carga de Datos =====
async function loadData() {
    try {
        const localProducts = localStorage.getItem('products');
        
        if (localProducts) {
            data = {
                products: JSON.parse(localProducts)
            };
            console.log('✅ Datos cargados:', data.products.length, 'productos');
        } else {
            console.warn('⚠️ No hay productos en localStorage');
            data = { products: [] };
        }
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        data = { products: [] };
    }
}

// ===== Cargar Detalle del Producto =====
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId || !data || !data.products) {
        showError('Producto no encontrado');
        return;
    }
    
    currentProduct = data.products.find(p => p.id === productId);
    
    if (!currentProduct) {
        showError('Producto no encontrado');
        return;
    }
    
    displayProductDetail(currentProduct);
    loadRelatedProducts(currentProduct);
}

// ===== Mostrar Detalle del Producto =====
function displayProductDetail(product) {
    const container = document.getElementById('productDetail');
    
    const stock = product.stock !== undefined ? product.stock : 10;
    const stockStatus = stock > 5 ? 'in-stock' : stock > 0 ? 'low-stock' : 'out-stock';
    const stockText = stock > 5 ? 'En stock' : stock > 0 ? `Solo ${stock} disponibles` : 'Agotado';
    
    const description = product.description || 'Producto de calidad para tu motocicleta';
    const condition = product.condition || 'Nuevo';
    const year = product.year || '2024';
    const brand = product.brand || '';
    const currency = product.currency || 'COP';
    
    let priceFormatted;
    if (currency === 'COP') {
        priceFormatted = `$${parseFloat(product.price).toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})} COP`;
    } else {
        priceFormatted = `${currency}${parseFloat(product.price).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    container.innerHTML = `
        <!-- Columna de Imagen -->
        <div style="position: sticky; top: 2rem;">
            <div style="background: var(--accent-color); border-radius: 15px; overflow: hidden; aspect-ratio: 1/1;">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.src='https://via.placeholder.com/500/1a1a2e/00d4ff?text=Imagen+No+Disponible'">
            </div>
        </div>
        
        <!-- Columna de Información -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                    <span style="background: var(--gradient-1); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: bold;">
                        ${product.category || 'Universal'}
                    </span>
                    ${product.featured ? '<span style="background: var(--gradient-2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: bold;"><i class="fas fa-star"></i> Destacado</span>' : ''}
                </div>
                
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-color);">
                    ${product.name}
                </h1>
                
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    ${brand ? `<span style="color: var(--text-secondary);"><i class="fas fa-tag"></i> Marca: <strong>${brand}</strong></span>` : ''}
                    <span style="color: var(--text-secondary);"><i class="fas fa-check-circle"></i> Condición: <strong>${condition}</strong></span>
                    <span style="color: var(--text-secondary);"><i class="fas fa-calendar"></i> Año: <strong>${year}</strong></span>
                </div>
            </div>
            
            <div style="border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 1.5rem 0;">
                <div style="font-size: 3rem; font-weight: bold; color: var(--success-color); margin-bottom: 0.5rem;">
                    ${priceFormatted}
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="product-stock ${stockStatus}" style="font-size: 1rem; padding: 0.5rem 1rem;">
                        <i class="fas fa-box"></i> ${stockText}
                    </span>
                </div>
            </div>
            
            <div>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">
                    <i class="fas fa-info-circle"></i> Descripción
                </h3>
                <p style="color: var(--text-secondary); line-height: 1.8; font-size: 1.1rem;">
                    ${description}
                </p>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: auto;">
                <button onclick="addToCart(${product.id})" 
                        class="btn-primary" 
                        style="flex: 1; padding: 1.2rem; font-size: 1.1rem; ${stock === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
                        ${stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </button>
                <button onclick="buyNow(${product.id})" 
                        class="btn" 
                        style="flex: 1; padding: 1.2rem; font-size: 1.1rem; background: var(--gradient-2);"
                        ${stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-bolt"></i> Comprar Ahora
                </button>
            </div>
            
            <div style="background: rgba(0,212,255,0.1); padding: 1.5rem; border-radius: 10px; border-left: 4px solid var(--primary-color);">
                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">
                    <i class="fas fa-shield-alt"></i> Garantía de Seguridad
                </h4>
                <ul style="color: var(--text-secondary); line-height: 2;">
                    <li><i class="fas fa-check"></i> Producto verificado sin reporte de robo</li>
                    <li><i class="fas fa-check"></i> Código QR de autenticidad incluido</li>
                    <li><i class="fas fa-check"></i> Garantía del fabricante</li>
                </ul>
            </div>
        </div>
    `;
    
    // Actualizar título de la página
    document.title = `${product.name} - AutoPartes Moto`;
}

// ===== Cargar Productos Relacionados =====
function loadRelatedProducts(product) {
    const container = document.getElementById('relatedProducts');
    if (!container || !data) return;
    
    // Buscar productos de la misma categoría, excluyendo el actual
    let related = data.products.filter(p => 
        p.category === product.category && p.id !== product.id
    ).slice(0, 4);
    
    // Si no hay suficientes, agregar productos aleatorios
    if (related.length < 4) {
        const remaining = data.products
            .filter(p => p.id !== product.id && !related.includes(p))
            .slice(0, 4 - related.length);
        related = [...related, ...remaining];
    }
    
    container.innerHTML = '';
    
    related.forEach(p => {
        const card = createProductCard(p);
        container.appendChild(card);
    });
}

// ===== Crear Tarjeta de Producto =====
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.style.cursor = 'pointer';
    
    const stock = product.stock !== undefined ? product.stock : 10;
    const stockStatus = stock > 5 ? 'in-stock' : stock > 0 ? 'low-stock' : 'out-stock';
    const stockText = stock > 5 ? 'En stock' : stock > 0 ? `Solo ${stock} disponibles` : 'Agotado';
    
    const description = product.description || 'Producto de calidad para tu motocicleta';
    const condition = product.condition || 'Nuevo';
    const year = product.year || '2024';
    const brand = product.brand || '';
    const currency = product.currency || 'COP';
    
    let priceFormatted;
    if (currency === 'COP') {
        priceFormatted = `$${parseFloat(product.price).toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})} COP`;
    } else {
        priceFormatted = `${currency}${parseFloat(product.price).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    const img = document.createElement('img');
    img.className = 'product-image';
    img.alt = product.name;
    img.loading = 'lazy';
    img.src = product.image;
    img.onerror = function() {
        this.src = 'https://via.placeholder.com/300x250/1a1a2e/00d4ff?text=Imagen+No+Disponible';
    };
    
    const productInfo = document.createElement('div');
    productInfo.className = 'product-info';
    productInfo.innerHTML = `
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${description}</p>
        <div class="product-meta">
            ${brand ? `<span class="product-badge"><i class="fas fa-tag"></i> ${brand}</span>` : ''}
            <span class="product-badge"><i class="fas fa-check-circle"></i> ${condition}</span>
            <span class="product-badge"><i class="fas fa-calendar"></i> ${year}</span>
        </div>
        <div class="product-details">
            <span class="product-price">${priceFormatted}</span>
            <span class="product-stock ${stockStatus}"><i class="fas fa-box"></i> ${stockText}</span>
        </div>
        <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})" ${stock === 0 ? 'disabled' : ''}>
            <i class="fas fa-shopping-cart"></i> ${stock === 0 ? 'Agotado' : 'Agregar al carrito'}
        </button>
    `;
    
    card.appendChild(img);
    card.appendChild(productInfo);
    
    // Click en toda la tarjeta lleva al detalle
    card.addEventListener('click', () => {
        window.location.href = `detalle-producto.html?id=${product.id}`;
    });
    
    return card;
}

// ===== Carrito de Compras =====
function addToCart(productId) {
    const product = data.products.find(p => p.id === productId);
    if (!product) return;
    
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            showNotification('No hay más stock disponible', 'warning');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Producto agregado al carrito', 'success');
}

function buyNow(productId) {
    addToCart(productId);
    setTimeout(() => {
        window.location.href = 'carrito.html';
    }, 500);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// ===== Notificaciones =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#00d4ff' : type === 'warning' ? '#ffaa00' : '#ff4444'};
        color: #1a1a2e;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showError(message) {
    const container = document.getElementById('productDetail');
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
            <i class="fas fa-exclamation-circle" style="font-size: 5rem; color: #ff4444; margin-bottom: 1rem;"></i>
            <h2 style="color: var(--primary-color); margin-bottom: 1rem;">Error</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">${message}</p>
            <a href="productos.html" class="btn-primary">
                <i class="fas fa-arrow-left"></i> Volver a Productos
            </a>
        </div>
    `;
}

// Menú móvil
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const nav = document.querySelector('.nav');
        nav.classList.toggle('active');
    });
}
