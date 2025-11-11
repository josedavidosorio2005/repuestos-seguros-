// Script para inicializar productos con precios actualizados
// Ejecutar este script una vez para cargar los productos en localStorage

const defaultProducts = [
    {
        id: 1,
        name: 'Kit de Pastillas de Freno Delanteras',
        price: 85000,
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2017/03/27/13/28/brake-pads-2178650_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2016/11/29/13/39/auto-1868726_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2020/05/11/14/31/chain-5158270_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2016/03/31/17/35/battery-1293447_960_720.png',
        description: 'Batería de gel libre de mantenimiento',
        stock: 8,
        condition: 'Nuevo',
        year: '2024',
        brand: 'Yuasa',
        currency: 'COP',
        featured: true
    },
    {
        id: 5,
        name: 'Escape Deportivo Universal',
        price: 280000,
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2016/02/19/10/56/exhaust-1209882_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2016/11/29/03/35/shock-absorber-1867089_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2017/08/01/00/38/clutch-2562555_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2017/01/03/02/07/car-1948636_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2016/11/21/16/21/bright-1846450_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2020/06/26/17/16/tires-5343294_960_720.jpg',
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
        category: 'Accesorios',
        image: 'https://cdn.pixabay.com/photo/2020/06/26/17/16/tires-5343294_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2017/01/03/02/07/car-1948636_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2016/11/29/03/35/shock-absorber-1867089_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2017/03/27/13/28/brake-pads-2178650_960_720.jpg',
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
        category: 'Accesorios',
        image: 'https://cdn.pixabay.com/photo/2020/05/11/14/31/chain-5158270_960_720.jpg',
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
        category: 'Universal',
        image: 'https://cdn.pixabay.com/photo/2016/02/19/10/56/exhaust-1209882_960_720.jpg',
        description: 'Kit completo de plásticos: guardabarros, tapas laterales',
        stock: 5,
        condition: 'Nuevo',
        year: '2024',
        brand: 'Polisport',
        currency: 'COP'
    }
];

// Agregar más productos completos
const moreProducts = [
    // Yamaha
    { id: 17, name: 'Kit Pastillas Freno Yamaha FZ 16', price: 75000, category: 'Yamaha', image: 'https://cdn.pixabay.com/photo/2017/08/01/00/38/clutch-2562555_960_720.jpg', description: 'Pastillas originales para Yamaha FZ 16', stock: 12, condition: 'Nuevo', year: '2024', brand: 'Yamaha', currency: 'COP' },
    { id: 18, name: 'Filtro Aceite Yamaha R15', price: 28000, category: 'Yamaha', image: 'https://cdn.pixabay.com/photo/2015/05/15/14/46/handlebar-768973_960_720.jpg', description: 'Filtro de aceite original Yamaha', stock: 25, condition: 'Nuevo', year: '2024', brand: 'Yamaha', currency: 'COP' },
    { id: 19, name: 'Bujía Yamaha MT-03', price: 22000, category: 'Yamaha', image: 'https://cdn.pixabay.com/photo/2016/11/21/16/21/bright-1846450_960_720.jpg', description: 'Bujía NGK especial para Yamaha MT', stock: 30, condition: 'Nuevo', year: '2024', brand: 'Yamaha', currency: 'COP' },
    
    // Honda
    { id: 20, name: 'Kit Embrague Honda CB 190', price: 195000, category: 'Honda', image: 'https://cdn.pixabay.com/photo/2017/03/27/13/28/brake-pads-2178650_960_720.jpg', description: 'Kit completo embrague Honda CB', stock: 8, condition: 'Nuevo', year: '2024', brand: 'Honda', currency: 'COP' },
    { id: 21, name: 'Pastillas Freno Honda CBR 250', price: 92000, category: 'Honda', image: 'https://cdn.pixabay.com/photo/2020/05/11/14/31/chain-5158270_960_720.jpg', description: 'Pastillas de freno deportivas Honda', stock: 15, condition: 'Nuevo', year: '2024', brand: 'Honda', currency: 'COP' },
    { id: 22, name: 'Filtro Aire Honda XR 150', price: 38000, category: 'Honda', image: 'https://cdn.pixabay.com/photo/2017/01/03/02/07/car-1948636_960_720.jpg', description: 'Filtro de aire original Honda', stock: 20, condition: 'Nuevo', year: '2024', brand: 'Honda', currency: 'COP' },
    { id: 23, name: 'Cadena Honda Wave 110', price: 65000, category: 'Honda', image: 'https://cdn.pixabay.com/photo/2016/03/31/17/35/battery-1293447_960_720.png', description: 'Cadena original Honda para Wave', stock: 18, condition: 'Nuevo', year: '2024', brand: 'Honda', currency: 'COP' },
    
    // Suzuki
    { id: 24, name: 'Kit Arrastre Suzuki GN 125', price: 135000, category: 'Suzuki', image: 'https://cdn.pixabay.com/photo/2016/11/29/03/35/shock-absorber-1867089_960_720.jpg', description: 'Kit piñón, corona y cadena Suzuki', stock: 10, condition: 'Nuevo', year: '2024', brand: 'Suzuki', currency: 'COP' },
    { id: 25, name: 'Amortiguador Suzuki Gixxer 150', price: 285000, category: 'Suzuki', image: 'https://cdn.pixabay.com/photo/2020/06/26/17/16/tires-5343294_960_720.jpg', description: 'Amortiguador trasero Suzuki Gixxer', stock: 6, condition: 'Nuevo', year: '2024', brand: 'Suzuki', currency: 'COP' },
    { id: 26, name: 'Batería Suzuki GSX-R 150', price: 105000, category: 'Suzuki', image: 'https://cdn.pixabay.com/photo/2016/02/19/10/56/exhaust-1209882_960_720.jpg', description: 'Batería 12V 5Ah para Suzuki GSX', stock: 8, condition: 'Nuevo', year: '2024', brand: 'Suzuki', currency: 'COP' },
    
    // Kawasaki
    { id: 27, name: 'Escape Kawasaki Ninja 300', price: 450000, category: 'Kawasaki', image: 'https://cdn.pixabay.com/photo/2017/03/27/13/28/brake-pads-2178650_960_720.jpg', description: 'Escape deportivo Kawasaki Ninja', stock: 4, condition: 'Nuevo', year: '2024', brand: 'Kawasaki', currency: 'COP', featured: true },
    { id: 28, name: 'Disco Freno Kawasaki Z400', price: 125000, category: 'Kawasaki', image: 'https://cdn.pixabay.com/photo/2015/05/15/14/46/handlebar-768973_960_720.jpg', description: 'Disco de freno delantero Kawasaki', stock: 7, condition: 'Nuevo', year: '2024', brand: 'Kawasaki', currency: 'COP' },
    { id: 29, name: 'Filtro Aceite Kawasaki Versys 650', price: 32000, category: 'Kawasaki', image: 'https://cdn.pixabay.com/photo/2017/08/01/00/38/clutch-2562555_960_720.jpg', description: 'Filtro de aceite Kawasaki Versys', stock: 15, condition: 'Nuevo', year: '2024', brand: 'Kawasaki', currency: 'COP' },
    
    // KTM
    { id: 30, name: 'Pastillas Freno KTM Duke 200', price: 98000, category: 'KTM', image: 'https://cdn.pixabay.com/photo/2020/05/11/14/31/chain-5158270_960_720.jpg', description: 'Pastillas de freno KTM Duke', stock: 10, condition: 'Nuevo', year: '2024', brand: 'KTM', currency: 'COP' },
    { id: 31, name: 'Cadena KTM Duke 390', price: 185000, category: 'KTM', image: 'https://cdn.pixabay.com/photo/2017/01/03/02/07/car-1948636_960_720.jpg', description: 'Cadena reforzada KTM Duke 390', stock: 8, condition: 'Nuevo', year: '2024', brand: 'KTM', currency: 'COP' },
    { id: 32, name: 'Manubrio KTM Adventure', price: 175000, category: 'KTM', image: 'https://cdn.pixabay.com/photo/2016/11/29/03/35/shock-absorber-1867089_960_720.jpg', description: 'Manubrio touring KTM Adventure', stock: 5, condition: 'Nuevo', year: '2024', brand: 'KTM', currency: 'COP' },
    
    // Bajaj
    { id: 33, name: 'Kit Embrague Bajaj Pulsar 180', price: 165000, category: 'Bajaj', image: 'https://cdn.pixabay.com/photo/2020/06/26/17/16/tires-5343294_960_720.jpg', description: 'Kit embrague completo Bajaj Pulsar', stock: 12, condition: 'Nuevo', year: '2024', brand: 'Bajaj', currency: 'COP' },
    { id: 34, name: 'Pastillas Freno Bajaj Dominar 400', price: 88000, category: 'Bajaj', image: 'https://cdn.pixabay.com/photo/2016/02/19/10/56/exhaust-1209882_960_720.jpg', description: 'Pastillas freno Bajaj Dominar', stock: 14, condition: 'Nuevo', year: '2024', brand: 'Bajaj', currency: 'COP' },
    { id: 35, name: 'Batería Bajaj Pulsar NS 200', price: 98000, category: 'Bajaj', image: 'https://cdn.pixabay.com/photo/2017/03/27/13/28/brake-pads-2178650_960_720.jpg', description: 'Batería gel Bajaj Pulsar NS', stock: 10, condition: 'Nuevo', year: '2024', brand: 'Bajaj', currency: 'COP' },
    
    // TVS
    { id: 36, name: 'Pastillas Freno TVS Apache 160', price: 72000, category: 'TVS', image: 'https://cdn.pixabay.com/photo/2016/03/31/17/35/battery-1293447_960_720.png', description: 'Pastillas originales TVS Apache', stock: 16, condition: 'Nuevo', year: '2024', brand: 'TVS', currency: 'COP' },
    { id: 37, name: 'Filtro Aire TVS Apache RTR 200', price: 42000, category: 'TVS', image: 'https://cdn.pixabay.com/photo/2020/05/11/14/31/chain-5158270_960_720.jpg', description: 'Filtro de aire TVS Apache RTR', stock: 18, condition: 'Nuevo', year: '2024', brand: 'TVS', currency: 'COP' },
    
    // AKT
    { id: 38, name: 'Cadena AKT NKD 125', price: 58000, category: 'AKT', image: 'https://cdn.pixabay.com/photo/2017/08/01/00/38/clutch-2562555_960_720.jpg', description: 'Cadena transmisión AKT NKD', stock: 20, condition: 'Nuevo', year: '2024', brand: 'AKT', currency: 'COP' },
    { id: 39, name: 'Kit Pistón AKT TT 150', price: 145000, category: 'AKT', image: 'https://cdn.pixabay.com/photo/2016/11/21/16/21/bright-1846450_960_720.jpg', description: 'Kit pistón completo AKT TT', stock: 8, condition: 'Nuevo', year: '2024', brand: 'AKT', currency: 'COP' },
    { id: 40, name: 'Batería AKT Evo R3', price: 85000, category: 'AKT', image: 'https://cdn.pixabay.com/photo/2016/11/29/03/35/shock-absorber-1867089_960_720.jpg', description: 'Batería gel AKT Evo', stock: 12, condition: 'Nuevo', year: '2024', brand: 'AKT', currency: 'COP' },
    
    // Accesorios y Universales
    { id: 41, name: 'Casco Integral LS2', price: 350000, category: 'Accesorios', image: 'https://cdn.pixabay.com/photo/2017/03/27/13/28/brake-pads-2178650_960_720.jpg', description: 'Casco integral certificado DOT', stock: 15, condition: 'Nuevo', year: '2024', brand: 'LS2', currency: 'COP', featured: true },
    { id: 42, name: 'Guantes Moto Probiker', price: 85000, category: 'Accesorios', image: 'https://cdn.pixabay.com/photo/2017/01/03/02/07/car-1948636_960_720.jpg', description: 'Guantes de cuero con protecciones', stock: 25, condition: 'Nuevo', year: '2024', brand: 'Probiker', currency: 'COP' },
    { id: 43, name: 'Chaqueta Moto Alpinestars', price: 420000, category: 'Accesorios', image: 'https://cdn.pixabay.com/photo/2020/06/26/17/16/tires-5343294_960_720.jpg', description: 'Chaqueta con protecciones certificadas', stock: 10, condition: 'Nuevo', year: '2024', brand: 'Alpinestars', currency: 'COP' },
    { id: 44, name: 'Maletas Laterales Givi', price: 580000, category: 'Accesorios', image: 'https://cdn.pixabay.com/photo/2016/02/19/10/56/exhaust-1209882_960_720.jpg', description: 'Par de maletas rígidas 30L c/u', stock: 6, condition: 'Nuevo', year: '2024', brand: 'Givi', currency: 'COP' },
    { id: 45, name: 'Cargador USB Moto Dual', price: 45000, category: 'Accesorios', image: 'https://cdn.pixabay.com/photo/2020/05/11/14/31/chain-5158270_960_720.jpg', description: 'Cargador USB doble puerto impermeable', stock: 30, condition: 'Nuevo', year: '2024', brand: 'Universal', currency: 'COP' },
    { id: 46, name: 'Soporte Celular Moto', price: 35000, category: 'Accesorios', image: 'https://cdn.pixabay.com/photo/2016/03/31/17/35/battery-1293447_960_720.png', description: 'Soporte giratorio antivibración', stock: 35, condition: 'Nuevo', year: '2024', brand: 'Universal', currency: 'COP' },
    { id: 47, name: 'Alarma Moto con Control', price: 95000, category: 'Accesorios', image: 'https://cdn.pixabay.com/photo/2017/08/01/00/38/clutch-2562555_960_720.jpg', description: 'Sistema de alarma con 2 controles', stock: 20, condition: 'Nuevo', year: '2024', brand: 'Universal', currency: 'COP' },
    { id: 48, name: 'Kit Herramientas Moto', price: 65000, category: 'Accesorios', image: 'https://cdn.pixabay.com/photo/2015/05/15/14/46/handlebar-768973_960_720.jpg', description: 'Set 12 herramientas básicas', stock: 15, condition: 'Nuevo', year: '2024', brand: 'Universal', currency: 'COP' }
];

// Combinar todos los productos
const allProducts = [...defaultProducts, ...moreProducts];

// Sistema de versión para forzar actualización automática
const PRODUCT_VERSION = '2.2.0'; // Versión de productos - imágenes reales de repuestos (Pixabay)
const currentVersion = localStorage.getItem('productVersion');

// Verificar si necesita actualización
const needsUpdate = currentVersion !== PRODUCT_VERSION;

if (needsUpdate) {
    console.log('🔄 Nueva versión de productos detectada. Actualizando...');
    console.log('📦 Versión anterior:', currentVersion || 'ninguna');
    console.log('📦 Nueva versión:', PRODUCT_VERSION);
}

// SIEMPRE actualizar productos en localStorage
console.log('🔄 Inicializando catálogo de productos...');
localStorage.setItem('products', JSON.stringify(allProducts));
localStorage.setItem('productVersion', PRODUCT_VERSION);
console.log('✅ Catálogo completo inicializado:', allProducts.length, 'productos');
console.log('📦 Por marcas: Yamaha, Honda, Suzuki, Kawasaki, KTM, Bajaj, TVS, AKT, Universal, Accesorios');

// Disparar evento para que script.js recargue los datos
window.dispatchEvent(new Event('productsLoaded'));

// Mensaje de confirmación para el usuario
if (needsUpdate) {
    console.log('✨ ¡Productos actualizados exitosamente!');
}








