// ===== CONFIGURACIÓN =====
const ADMIN_PASSWORD = 'admin123'; // Cambia esta clave por la que quieras
let isAuthenticated = false;
let products = [];
let editingProductId = null;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    checkAuthentication();
    
    // Event Listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

// ===== AUTENTICACIÓN =====
function checkAuthentication() {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
        isAuthenticated = true;
        showAdminPanel();
    } else {
        showLoginSection();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', 'true');
        isAuthenticated = true;
        errorDiv.style.display = 'none';
        showAdminPanel();
        document.getElementById('adminPassword').value = '';
    } else {
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

function handleLogout(e) {
    e.preventDefault();
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        sessionStorage.removeItem('adminAuth');
        isAuthenticated = false;
        showLoginSection();
    }
}

function showLoginSection() {
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadProductsList();
    updateStatistics();
}

// ===== GESTIÓN DE PRODUCTOS =====
function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Productos por defecto
        products = [
            {
                id: 1,
                name: 'Kit de Pastillas de Freno Delanteras',
                price: 85000,
                category: 'frenos',
                image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500',
                description: 'Pastillas de freno de alta calidad para motos deportivas y de trabajo',
                stock: 15,
                condition: 'Nuevo',
                year: '2024',
                brand: 'EBC',
                currency: 'COP',
                featured: true
            },
            {
                id: 2,
                name: 'Aceite Motor Sintético 10W-40 (1L)',
                price: 45000,
                category: 'motor',
                image: 'https://images.unsplash.com/photo-1558346547-4439e5b6d8a4?w=500',
                description: 'Aceite sintético premium para motor de moto, protección total',
                stock: 25,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Motul',
                currency: 'COP',
                featured: true
            },
            {
                id: 3,
                name: 'Cadena de Transmisión 520 x 120',
                price: 120000,
                category: 'transmision',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                description: 'Cadena reforzada 520, compatible con mayoría de motos',
                stock: 12,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Regina',
                currency: 'COP',
                featured: true
            },
            {
                id: 4,
                name: 'Batería 12V 7Ah (YTX7A-BS)',
                price: 95000,
                category: 'electrico',
                image: 'https://images.unsplash.com/photo-1609091839311-d2064f51e0dd?w=500',
                description: 'Batería de gel, libre de mantenimiento, alta durabilidad',
                stock: 8,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Duncan',
                currency: 'COP',
                featured: true
            },
            {
                id: 5,
                name: 'Escape Deportivo Universal',
                price: 280000,
                category: 'escape',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                description: 'Escape deportivo en acero, mejora sonido y rendimiento',
                stock: 5,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Leo Vince',
                currency: 'COP',
                featured: true
            },
            {
                id: 6,
                name: 'Amortiguadores Traseros 340mm',
                price: 320000,
                category: 'suspension',
                image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500',
                description: 'Par de amortiguadores traseros con resorte ajustable',
                stock: 6,
                condition: 'Nuevo',
                year: '2024',
                brand: 'YSS',
                currency: 'COP',
                featured: true
            },
            {
                id: 7,
                name: 'Kit de Embrague Completo',
                price: 180000,
                category: 'transmision',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                description: 'Kit completo: discos, separadores y resortes',
                stock: 10,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Vesrah',
                currency: 'COP'
            },
            {
                id: 8,
                name: 'Filtro de Aire Esponja',
                price: 35000,
                category: 'motor',
                image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500',
                description: 'Filtro de aire de alto flujo, lavable y reutilizable',
                stock: 20,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Twin Air',
                currency: 'COP'
            },
            {
                id: 9,
                name: 'Bombillo LED H4 para Faro',
                price: 55000,
                category: 'electrico',
                image: 'https://images.unsplash.com/photo-1609091839311-d2064f51e0dd?w=500',
                description: 'Bombillo LED ultra brillante 6000K luz blanca',
                stock: 15,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Osram',
                currency: 'COP'
            },
            {
                id: 10,
                name: 'Guardabarros Delantero Universal',
                price: 75000,
                category: 'carroceria',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                description: 'Guardabarros en plástico ABS, ajustable a varias motos',
                stock: 4,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Acerbis',
                currency: 'COP'
            },
            {
                id: 11,
                name: 'Manubrios Universales 22mm',
                price: 65000,
                category: 'accesorios',
                image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500',
                description: 'Manubrios en aluminio, diámetro 22mm, varios colores',
                stock: 8,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Renthal',
                currency: 'COP'
            },
            {
                id: 12,
                name: 'Disco de Freno Delantero 220mm',
                price: 95000,
                category: 'frenos',
                image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500',
                description: 'Disco de freno ventilado en acero inoxidable',
                stock: 7,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Sunstar',
                currency: 'COP'
            },
            {
                id: 13,
                name: 'Bujía NGK Estándar',
                price: 18000,
                category: 'motor',
                image: 'https://images.unsplash.com/photo-1558346547-4439e5b6d8a4?w=500',
                description: 'Bujía de alto rendimiento, compatible con mayoría de motos',
                stock: 30,
                condition: 'Nuevo',
                year: '2024',
                brand: 'NGK',
                currency: 'COP'
            },
            {
                id: 14,
                name: 'Kit Piñón y Corona 14/42',
                price: 145000,
                category: 'transmision',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                description: 'Kit completo piñón y corona, acero templado',
                stock: 18,
                condition: 'Nuevo',
                year: '2024',
                brand: 'ESJOT',
                currency: 'COP'
            },
            {
                id: 15,
                name: 'Espejos Retrovisores (Par)',
                price: 42000,
                category: 'accesorios',
                image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500',
                description: 'Par de espejos universales rosca 10mm',
                stock: 12,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Universal',
                currency: 'COP'
            },
            {
                id: 16,
                name: 'Kit Plasticos Completo',
                price: 380000,
                category: 'carroceria',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                description: 'Kit completo de plásticos: guardabarros, tapas laterales',
                stock: 5,
                condition: 'Nuevo',
                year: '2024',
                brand: 'Polisport',
                currency: 'COP'
            }
        ];
        saveProducts();
    }
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
    // También actualizar el data.json para compatibilidad
    updateDataJson();
}

function updateDataJson() {
    // Crear estructura de data.json
    const dataJson = {
        products: products
    };
    localStorage.setItem('dataJson', JSON.stringify(dataJson));
}

function loadProductsList() {
    const container = document.getElementById('productsList');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: var(--card-bg); border-radius: 10px;">
                <i class="fas fa-box-open" style="font-size: 4rem; color: var(--text-secondary); opacity: 0.5; margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary); font-size: 1.2rem;">No hay productos. Agrega el primero.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="admin-product-card" style="background: var(--card-bg); border-radius: 10px; padding: 1.5rem; display: flex; gap: 1.5rem; align-items: center;">
            <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
            
            <div style="flex: 1;">
                <h3 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">${product.name}</h3>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">
                    <span style="background: rgba(0,212,255,0.1); padding: 0.2rem 0.8rem; border-radius: 20px; margin-right: 0.5rem;">
                        ${getCategoryName(product.category)}
                    </span>
                    <span style="font-size: 1.3rem; color: var(--success-color); font-weight: bold;">$${product.price.toFixed(2)}</span>
                </p>
                ${product.description ? `<p style="margin: 0.5rem 0 0 0; color: var(--text-secondary); font-size: 0.85rem;">${product.description}</p>` : ''}
            </div>
            
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="editProduct(${product.id})" class="btn" style="background: var(--primary-color); padding: 0.7rem 1.2rem;">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="deleteProduct(${product.id})" class="btn" style="background: #ff4444; padding: 0.7rem 1.2rem;">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function updateStatistics() {
    document.getElementById('totalProducts').textContent = products.length;
    
    const categories = [...new Set(products.map(p => p.category))];
    document.getElementById('totalCategories').textContent = categories.length;
}

function getCategoryName(category) {
    const names = {
        'motor': 'Motor',
        'frenos': 'Frenos',
        'suspension': 'Suspensión',
        'transmision': 'Transmisión',
        'electrico': 'Sistema Eléctrico',
        'carroceria': 'Carrocería',
        'escape': 'Escape',
        'accesorios': 'Accesorios'
    };
    return names[category] || category;
}

// ===== MODAL =====
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const saveButtonText = document.getElementById('saveButtonText');
    const form = document.getElementById('productForm');
    
    form.reset();
    editingProductId = productId;
    
    if (productId) {
        // Modo edición
        const product = products.find(p => p.id === productId);
        if (product) {
            modalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Producto';
            saveButtonText.textContent = 'Actualizar Producto';
            
            document.getElementById('editProductId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productImage').value = product.image;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productStock').value = product.stock || 10;
            document.getElementById('productCondition').value = product.condition || 'Nuevo';
            document.getElementById('productYear').value = product.year || '2024';
            document.getElementById('productBrand').value = product.brand || '';
            document.getElementById('productFeatured').checked = product.featured || false;
        }
    } else {
        // Modo agregar - valores por defecto
        modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Agregar Producto';
        saveButtonText.textContent = 'Guardar Producto';
        document.getElementById('editProductId').value = '';
        document.getElementById('productStock').value = 10;
        document.getElementById('productCondition').value = 'Nuevo';
        document.getElementById('productYear').value = '2024';
        document.getElementById('productBrand').value = '';
        document.getElementById('productFeatured').checked = false;
    }
    
    modal.style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    editingProductId = null;
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value.trim(),
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productImage').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        stock: parseInt(document.getElementById('productStock').value) || 10,
        condition: document.getElementById('productCondition').value,
        year: document.getElementById('productYear').value.trim(),
        brand: document.getElementById('productBrand').value.trim() || 'Universal',
        currency: 'COP',
        featured: document.getElementById('productFeatured').checked
    };
    
    if (editingProductId) {
        // Actualizar producto existente
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            showNotification('Producto actualizado exitosamente', 'success');
        }
    } else {
        // Agregar nuevo producto
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, ...productData });
        showNotification('Producto agregado exitosamente', 'success');
    }
    
    saveProducts();
    loadProductsList();
    updateStatistics();
    closeProductModal();
}

function editProduct(id) {
    openProductModal(id);
}

function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?\n\nEsta acción no se puede deshacer.`)) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        loadProductsList();
        updateStatistics();
        showNotification('Producto eliminado exitosamente', 'success');
    }
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#00d4ff' : '#ff4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProductModal();
    }
}
