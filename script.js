// ===== Variables Globales =====
let data = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===== Inicialización =====
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initializeApp();
    updateCartCount();
});

// Escuchar cuando init-products.js cargue los productos
window.addEventListener('productsLoaded', async () => {
    console.log('🔄 Recargando datos después de inicialización de productos...');
    await loadData();
    initializeApp();
});

// ===== Carga de Datos desde JSON =====
async function loadData() {
    try {
        // Cargar productos desde localStorage
        const localProducts = localStorage.getItem('products');
        
        if (localProducts) {
            // Usar productos del localStorage
            data = {
                products: JSON.parse(localProducts),
                categories: [] // Ya no usamos categories, ahora son marcas
            };
            console.log('✅ Datos cargados desde localStorage:', data.products.length, 'productos');
        } else {
            // Si no hay productos en localStorage, mostrar mensaje
            console.warn('⚠️ No hay productos en localStorage. Espera a que init-products.js los cargue.');
            data = {
                products: [],
                categories: []
            };
        }
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        data = {
            products: [],
            categories: []
        };
    }
}

// ===== Inicialización de la Aplicación =====
function initializeApp() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Menú móvil
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Inicializar según la página
    if (currentPage === 'index.html' || currentPage === '') {
        initHomePage();
    } else if (currentPage === 'productos.html') {
        initProductsPage();
    } else if (currentPage === 'contacto.html') {
        initContactPage();
    } else if (currentPage === 'carrito.html') {
        initCartPage();
    }
}

// ===== Página de Inicio =====
function initHomePage() {
    loadCategories();
    loadFeaturedProducts();
    loadFooterCategories();
}

// Cargar categorías (ahora son marcas)
function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid || !data || !data.products) return;

    categoriesGrid.innerHTML = '';
    
    // Obtener marcas únicas de los productos
    const brands = [...new Set(data.products.map(p => p.category))].filter(Boolean).sort();
    
    // Iconos para cada marca
    const brandIcons = {
        'Yamaha': 'fas fa-motorcycle',
        'Honda': 'fas fa-motorcycle',
        'Suzuki': 'fas fa-motorcycle',
        'Kawasaki': 'fas fa-motorcycle',
        'KTM': 'fas fa-motorcycle',
        'Bajaj': 'fas fa-motorcycle',
        'TVS': 'fas fa-motorcycle',
        'AKT': 'fas fa-motorcycle',
        'Universal': 'fas fa-cog',
        'Accesorios': 'fas fa-helmet-safety'
    };
    
    brands.forEach(brand => {
        const productCount = data.products.filter(p => p.category === brand).length;
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card fade-in';
        categoryCard.innerHTML = `
            <i class="${brandIcons[brand] || 'fas fa-box'}"></i>
            <h3>${brand}</h3>
            <p>${productCount} producto${productCount !== 1 ? 's' : ''} disponible${productCount !== 1 ? 's' : ''}</p>
        `;
        categoryCard.addEventListener('click', () => {
            window.location.href = `productos.html?category=${encodeURIComponent(brand)}`;
        });
        categoriesGrid.appendChild(categoryCard);
    });
}

// Cargar productos destacados
function loadFeaturedProducts() {
    const featuredProducts = document.getElementById('featuredProducts');
    if (!featuredProducts) return;
    
    // Si no hay datos aún, mostrar mensaje de carga
    if (!data || !data.products || data.products.length === 0) {
        featuredProducts.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="color: var(--text-secondary);">Cargando productos destacados...</p>
            </div>
        `;
        return;
    }

    featuredProducts.innerHTML = '';
    
    // Mostrar productos destacados o los primeros 6 si no hay destacados
    let featured = data.products.filter(p => p.featured);
    if (featured.length === 0) {
        // Si no hay productos destacados, mostrar los primeros 6
        featured = data.products.slice(0, 6);
    } else {
        featured = featured.slice(0, 6);
    }
    
    featured.forEach(product => {
        const productCard = createProductCard(product);
        featuredProducts.appendChild(productCard);
    });
}

// Cargar categorías en el footer (ahora marcas)
function loadFooterCategories() {
    const footerCategories = document.getElementById('footerCategories');
    if (!footerCategories || !data || !data.products) return;

    footerCategories.innerHTML = '';
    
    // Obtener las primeras 4 marcas únicas
    const brands = [...new Set(data.products.map(p => p.category))].filter(Boolean).sort().slice(0, 4);
    
    brands.forEach(brand => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="productos.html?category=${encodeURIComponent(brand)}">${brand}</a>`;
        footerCategories.appendChild(li);
    });
}

// ===== Página de Productos =====
function initProductsPage() {
    // Pequeño retraso para asegurar que los productos están cargados
    setTimeout(() => {
        setupFilters();
        loadAllProducts();
        loadFooterCategories();
    }, 100);
}

// Cargar todos los productos
function loadAllProducts(filterCategory = null, searchTerm = '') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Verificar si hay datos
    if (!data || !data.products || data.products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                <i class="fas fa-box-open" style="font-size: 5rem; color: var(--text-secondary); opacity: 0.3; margin-bottom: 1rem;"></i>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Cargando catálogo...</h3>
                <p style="color: var(--text-secondary);">Espera un momento mientras cargamos los productos</p>
                <div style="margin-top: 2rem;">
                    <div class="loading-spinner" style="border: 3px solid rgba(0, 212, 255, 0.1); border-top: 3px solid var(--primary-color); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                </div>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = '';
    
    let filteredProducts = data.products;
    
    // Filtrar por categoría (ahora son marcas)
    if (filterCategory) {
        filteredProducts = filteredProducts.filter(p => p.category === filterCategory);
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }
    
    // Mostrar productos
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                <i class="fas fa-search" style="font-size: 4rem; color: var(--text-secondary); opacity: 0.3; margin-bottom: 1rem;"></i>
                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">No se encontraron productos</h3>
                <p style="color: var(--text-secondary);">Intenta con otros filtros o términos de búsqueda</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Configurar filtros
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');
    
    // Cargar categorías en filtros (ahora son marcas)
    if (categoryFilter && data) {
        categoryFilter.innerHTML = '<option value="">Todas las marcas</option>';
        
        // Obtener marcas únicas de los productos
        const brands = [...new Set(data.products.map(p => p.category))].sort();
        
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            categoryFilter.appendChild(option);
        });
        
        // Verificar parámetro de URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            categoryFilter.value = categoryParam;
        }
        
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // Aplicar filtros iniciales
    applyFilters();
}

// Aplicar filtros
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');
    
    const category = categoryFilter ? categoryFilter.value : null;
    const search = searchInput ? searchInput.value : '';
    
    loadAllProducts(category, search);
}

// ===== Crear Tarjeta de Producto =====
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    
    // Manejar productos del admin (sin stock) y del data.json (con stock)
    const stock = product.stock !== undefined ? product.stock : 10; // Default 10 si no está definido
    const stockStatus = stock > 5 ? 'in-stock' : stock > 0 ? 'low-stock' : 'out-stock';
    const stockText = stock > 5 ? 'En stock' : stock > 0 ? `Solo ${stock} disponibles` : 'Agotado';
    
    const description = product.description || 'Producto de calidad para tu motocicleta';
    const condition = product.condition || 'Nuevo';
    const year = product.year || '2024';
    const brand = product.brand || '';
    const currency = product.currency || 'COP';
    
    // Formatear precio según moneda
    let priceFormatted;
    if (currency === 'COP') {
        priceFormatted = `$${parseFloat(product.price).toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})} COP`;
    } else {
        priceFormatted = `${currency}${parseFloat(product.price).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    // Hacer que toda la tarjeta sea clickeable excepto el botón
    card.style.cursor = 'pointer';
    
    // Crear imagen con placeholder mientras carga
    const img = document.createElement('img');
    img.className = 'product-image';
    img.alt = product.name;
    img.loading = 'lazy'; // Carga diferida
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
        <a href="detalle-producto.html?id=${product.id}" class="btn" style="display: block; text-align: center; margin-bottom: 0.5rem; text-decoration: none; background: var(--gradient-1);">
            <i class="fas fa-eye"></i> Ver Detalles
        </a>
        <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})" ${stock === 0 ? 'disabled' : ''}>
            <i class="fas fa-shopping-cart"></i> ${stock === 0 ? 'Agotado' : 'Agregar al carrito'}
        </button>
    `;
    
    card.appendChild(img);
    card.appendChild(productInfo);
    
    // Click en toda la tarjeta lleva al detalle (excepto en botones)
    card.addEventListener('click', (e) => {
        // No navegar si se hizo click en un botón o link
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && !e.target.closest('button') && !e.target.closest('a')) {
            window.location.href = `detalle-producto.html?id=${product.id}`;
        }
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
    
    saveCart();
    updateCartCount();
    showNotification('Producto agregado al carrito', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    
    if (window.location.pathname.includes('carrito.html')) {
        initCartPage();
    }
}

function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;
    
    const product = data.products.find(p => p.id === productId);
    const newQuantity = cartItem.quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > product.stock) {
        showNotification('No hay más stock disponible', 'warning');
        return;
    }
    
    cartItem.quantity = newQuantity;
    saveCart();
    initCartPage();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// ===== Página del Carrito =====
function initCartPage() {
    if (!data) return;
    
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos para comenzar tu compra</p>
                <a href="productos.html" class="btn-primary">Ver Productos</a>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const product = data.products.find(p => p.id === item.id);
        if (!product) return;
        
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        const currency = product.currency || 'COP';
        const pricePerUnit = currency === 'COP' 
            ? `$${product.price.toLocaleString('es-CO', {minimumFractionDigits: 0})} COP`
            : `${currency}${product.price.toLocaleString()}`;
        const itemTotalFormatted = currency === 'COP'
            ? `$${itemTotal.toLocaleString('es-CO', {minimumFractionDigits: 0})} COP`
            : `${currency}${itemTotal.toLocaleString()}`;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item fade-in';
        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3 class="cart-item-name">${product.name}</h3>
                <p>${product.brand || ''} ${product.condition || 'Nuevo'} - ${product.year || '2024'}</p>
                <p class="cart-item-price">${pricePerUnit} c/u</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${product.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
            <div class="cart-item-total">
                <strong>${itemTotalFormatted}</strong>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Actualizar resumen en pesos colombianos
    if (cartSummary) {
        const tax = subtotal * 0.19; // 19% IVA Colombia
        const shipping = subtotal > 50000 ? 0 : 15000; // Envío gratis sobre $50.000
        const total = subtotal + tax + shipping;
        
        cartSummary.innerHTML = `
            <h3>Resumen del Pedido</h3>
            <div class="summary-line">
                <span>Subtotal:</span>
                <span>$${subtotal.toLocaleString('es-CO', {minimumFractionDigits: 0})} COP</span>
            </div>
            <div class="summary-line">
                <span>IVA (19%):</span>
                <span>$${tax.toLocaleString('es-CO', {minimumFractionDigits: 0})} COP</span>
            </div>
            <div class="summary-line">
                <span>Envío:</span>
                <span>${shipping === 0 ? '¡Gratis!' : '$' + shipping.toLocaleString('es-CO') + ' COP'}</span>
            </div>
            <div class="summary-line summary-total">
                <span><strong>Total:</strong></span>
                <span><strong>$${total.toLocaleString('es-CO', {minimumFractionDigits: 0})} COP</strong></span>
            </div>
            <button class="btn-primary" onclick="checkout()">
                <i class="fas fa-credit-card"></i> Proceder al Pago
            </button>
            <p style="text-align: center; margin-top: 1rem; color: var(--text-secondary); font-size: 0.85rem;">
                <i class="fas fa-truck"></i> Envío gratis en compras superiores a $50.000 COP
            </p>
        `;
    }
    
    loadFooterCategories();
}

function checkout() {
    showNotification('Funcionalidad de pago en desarrollo', 'info');
}

// ===== Página de Contacto =====
function initContactPage() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    loadFooterCategories();
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    console.log('Formulario enviado:', formData);
    showNotification('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
    
    e.target.reset();
}

// ===== Menú Móvil =====
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}

// ===== Notificaciones =====
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#00ff88' : type === 'warning' ? '#ffaa00' : '#00d4ff'};
        color: #1a1a2e;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff4444;
        color: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        z-index: 10000;
        max-width: 500px;
    `;
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h3>Error</h3>
        <p>${message}</p>
        <button onclick="location.reload()" class="btn-primary" style="margin-top: 1rem;">
            Recargar Página
        </button>
    `;
    
    document.body.appendChild(errorDiv);
}

// ===== Estilos adicionales para animaciones =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
