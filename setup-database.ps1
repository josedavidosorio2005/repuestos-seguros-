# Script para inicializar la base de datos de MotoSegura
# Ejecutar en PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CONFIGURACIÓN BASE DE DATOS" -ForegroundColor Cyan
Write-Host "   MOTOSEGURA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Solicitar credenciales
$dbUser = Read-Host "Usuario MySQL (default: root)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "root"
}

$dbPassword = Read-Host "Password MySQL (dejar vacío si no tiene)" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

Write-Host ""
Write-Host "Creando base de datos..." -ForegroundColor Yellow

# Crear base de datos
$createDbCommand = "CREATE DATABASE IF NOT EXISTS motosegura CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if ([string]::IsNullOrWhiteSpace($dbPasswordPlain)) {
    mysql -u $dbUser -e $createDbCommand 2>&1 | Out-Null
} else {
    mysql -u $dbUser -p"$dbPasswordPlain" -e $createDbCommand 2>&1 | Out-Null
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Base de datos creada correctamente" -ForegroundColor Green
} else {
    Write-Host "✗ Error al crear la base de datos. Verifica tus credenciales." -ForegroundColor Red
    Write-Host "  Intenta manualmente: mysql -u $dbUser -p" -ForegroundColor Yellow
    exit 1
}

Write-Host "Importando esquema..." -ForegroundColor Yellow

# Importar esquema
if ([string]::IsNullOrWhiteSpace($dbPasswordPlain)) {
    Get-Content database\schema.sql | mysql -u $dbUser motosegura 2>&1 | Out-Null
} else {
    Get-Content database\schema.sql | mysql -u $dbUser -p"$dbPasswordPlain" motosegura 2>&1 | Out-Null
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Esquema importado correctamente" -ForegroundColor Green
} else {
    Write-Host "⚠ Advertencia al importar esquema" -ForegroundColor Yellow
}

# Actualizar archivo .env
Write-Host ""
Write-Host "Actualizando archivo .env..." -ForegroundColor Yellow

$envContent = Get-Content .env -Raw
$envContent = $envContent -replace "DB_USER=.*", "DB_USER=$dbUser"
$envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$dbPasswordPlain"
$envContent | Set-Content .env -NoNewline

Write-Host "✓ Archivo .env actualizado" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CONFIGURACIÓN COMPLETADA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Base de datos lista. Ahora puedes:" -ForegroundColor Green
Write-Host "  1. Iniciar el servidor: npm start" -ForegroundColor White
Write-Host "  2. Abrir http://localhost:3000" -ForegroundColor White
Write-Host ""
