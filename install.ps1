# Script de instalación automática para MotoSegura
# Ejecutar en PowerShell como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   INSTALACIÓN MOTOSEGURA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js no encontrado. Por favor instala Node.js desde https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm instalado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm no encontrado" -ForegroundColor Red
    exit 1
}

# Instalar dependencias
Write-Host ""
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencias instaladas correctamente" -ForegroundColor Green
} else {
    Write-Host "✗ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

# Verificar MySQL
Write-Host ""
Write-Host "Verificando MySQL..." -ForegroundColor Yellow
try {
    $mysqlVersion = mysql --version
    Write-Host "✓ MySQL encontrado" -ForegroundColor Green
} catch {
    Write-Host "⚠ MySQL no encontrado en PATH. Asegúrate de tener MySQL instalado." -ForegroundColor Yellow
}

# Crear archivo .env si no existe
Write-Host ""
if (Test-Path .env) {
    Write-Host "✓ Archivo .env ya existe" -ForegroundColor Green
} else {
    Write-Host "Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ Archivo .env creado. IMPORTANTE: Edita el archivo .env con tus credenciales de MySQL" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   INSTALACIÓN COMPLETADA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Edita el archivo .env con tus credenciales de MySQL" -ForegroundColor White
Write-Host "2. Crea la base de datos ejecutando: mysql -u root -p < database/schema.sql" -ForegroundColor White
Write-Host "3. Inicia el servidor con: npm start" -ForegroundColor White
Write-Host "4. Abre tu navegador en: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Para desarrollo (con auto-reload): npm run dev" -ForegroundColor Cyan
Write-Host ""
