# Script para probar la conexion con el backend de Railway
Write-Host "`n🔍 Probando conexion con el backend...`n" -ForegroundColor Cyan

$backendUrl = "https://backend-monolito-production.up.railway.app"

Write-Host "📡 URL del backend: $backendUrl" -ForegroundColor Yellow

# Test 1: Health check
Write-Host "`n✅ Test 1: Health Check" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/health" -Method Get -ContentType "application/json"
    Write-Host "   Estado: $($response.status)" -ForegroundColor Green
    Write-Host "   Servicio: $($response.service)" -ForegroundColor Green
    Write-Host "   Mensaje: $($response.message)" -ForegroundColor Green
    Write-Host "   Timestamp: $($response.timestamp)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Ping
Write-Host "`n✅ Test 2: Ping" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/api/health/ping" -Method Get -ContentType "application/json"
    Write-Host "   Mensaje: $($response.message)" -ForegroundColor Green
    Write-Host "   Timestamp: $($response.timestamp)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✨ Pruebas completadas!`n" -ForegroundColor Cyan
Write-Host "📱 Ahora abre tu navegador en: http://localhost:3000" -ForegroundColor Yellow
Write-Host "   El componente BackendHealthCheck hara la prueba desde el frontend.`n" -ForegroundColor Gray
