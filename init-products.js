// Script para inicializar productos con precios actualizados
// Ejecutar este script una vez para cargar los productos en localStorage

const defaultProducts = [
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

// Guardar productos en localStorage solo si no existen
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(defaultProducts));
    console.log('✅ Productos inicializados con precios actualizados:', defaultProducts.length);
} else {
    console.log('ℹ️ Productos ya existen en localStorage');
}
