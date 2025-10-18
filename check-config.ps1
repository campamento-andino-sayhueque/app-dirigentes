# Script para verificar la configuración de la integración
# Ejecutar con: powershell -ExecutionPolicy Bypass -File check-config.ps1

Write-Host "🔍 Verificando configuración de integración..." -ForegroundColor Cyan
Write-Host ""

# Verificar archivo .env.local
Write-Host "1. Verificando .env.local..." -ForegroundColor Yellow
if (Test-Path "frontend\.env.local") {
    Write-Host "   ✅ Archivo .env.local existe" -ForegroundColor Green
    
    $envContent = Get-Content "frontend\.env.local" -Raw
    
    if ($envContent -match "NEXT_PUBLIC_API_URL=https://backend-monolito-production.up.railway.app") {
        Write-Host "   ✅ URL del backend configurada correctamente" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  URL del backend no encontrada o incorrecta" -ForegroundColor Red
    }
    
    if ($envContent -match "NEXT_PUBLIC_FIREBASE_API_KEY=.+") {
        Write-Host "   ✅ Firebase API Key configurada" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Firebase API Key no configurada" -ForegroundColor Red
        Write-Host "      Edita frontend\.env.local y agrega tus credenciales de Firebase" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Archivo .env.local NO existe" -ForegroundColor Red
    Write-Host "      Ejecuta: Copy-Item frontend\.env.example frontend\.env.local" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2. Verificando conectividad con el backend..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "https://backend-monolito-production.up.railway.app/api/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Backend responde correctamente" -ForegroundColor Green
        $json = $response.Content | ConvertFrom-Json
        Write-Host "   📊 Status: $($json.status)" -ForegroundColor Cyan
        Write-Host "   📝 Message: $($json.message)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ No se puede conectar al backend" -ForegroundColor Red
    Write-Host "      Error: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "      Verifica que el servicio esté corriendo en Railway" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3. Verificando archivos del cliente API..." -ForegroundColor Yellow

$requiredFiles = @(
    "frontend\src\lib\api.ts",
    "frontend\src\components\BackendHealthCheck.tsx"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file NO encontrado" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 RESUMEN" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: https://backend-monolito-production.up.railway.app" -ForegroundColor White
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Completa las credenciales en frontend\.env.local" -ForegroundColor White
Write-Host "2. Configura ALLOWED_ORIGINS en Railway" -ForegroundColor White
Write-Host "3. Ejecuta: cd frontend; npm run dev" -ForegroundColor White
Write-Host "4. Abre: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Documentación:" -ForegroundColor Yellow
Write-Host "- PASOS_RAPIDOS.md - Guía rápida" -ForegroundColor White
Write-Host "- CONECTAR_BACKEND.md - Guía detallada" -ForegroundColor White
Write-Host ""
