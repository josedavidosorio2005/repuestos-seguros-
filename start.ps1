# Script de inicio completo para MotoSegura
# Ejecutar: .\start.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "        MOTOSEGURA" -ForegroundColor Cyan
Write-Host "   Iniciando Sistema..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "[1/5] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "      ✓ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "      ✗ Node.js no encontrado" -ForegroundColor Red
    Write-Host "      Instala desde: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Verificar dependencias
Write-Host "[2/5] Verificando dependencias..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "      Instalando dependencias..." -ForegroundColor Yellow
    npm install | Out-Null
    Write-Host "      ✓ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "      ✓ Dependencias OK" -ForegroundColor Green
}

# Verificar archivo .env
Write-Host "[3/5] Verificando configuración..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "      Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "      ⚠ IMPORTANTE: Edita el archivo .env con tus credenciales de MySQL" -ForegroundColor Yellow
}
Write-Host "      ✓ Configuración OK" -ForegroundColor Green

# Verificar MySQL
Write-Host "[4/5] Verificando MySQL..." -ForegroundColor Yellow
try {
    mysql --version | Out-Null
    Write-Host "      ✓ MySQL encontrado" -ForegroundColor Green
    
    # Verificar si existe la base de datos
    $dbExists = mysql -u root -e "SHOW DATABASES LIKE 'motosegura';" 2>&1
    if ($dbExists -like "*motosegura*") {
        Write-Host "      ✓ Base de datos existe" -ForegroundColor Green
    } else {
        Write-Host "      ⚠ Base de datos no encontrada" -ForegroundColor Yellow
        Write-Host "      Ejecuta: .\setup-database.ps1" -ForegroundColor Yellow
    }
} catch {
    Write-Host "      ⚠ MySQL no encontrado en PATH" -ForegroundColor Yellow
    Write-Host "      Asegúrate de tener MySQL instalado" -ForegroundColor Yellow
}

# Iniciar servidor
Write-Host "[5/5] Iniciando servidor..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✓ SERVIDOR INICIANDO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URL: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Para detener: Presiona Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "Logs del servidor:" -ForegroundColor Gray
Write-Host "----------------------------------------" -ForegroundColor Gray

# Iniciar el servidor
npm start
