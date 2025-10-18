# Script para verificar configuración de variables de entorno
Write-Host "`n🔍 Verificando configuración de variables de entorno...`n" -ForegroundColor Cyan

$allGood = $true

# Verificar archivos locales
Write-Host "📁 Verificando archivos locales:" -ForegroundColor Yellow

$files = @(
    "frontend\.env",
    "frontend\.env.local",
    "frontend\.env.production"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        Write-Host "  ✅ $file existe" -ForegroundColor Green
        
        # Verificar que contenga NEXT_PUBLIC_API_URL
        $content = Get-Content $fullPath -Raw
        if ($content -match "NEXT_PUBLIC_API_URL") {
            $url = ($content -split "`n" | Where-Object { $_ -match "NEXT_PUBLIC_API_URL" }) -replace ".*=", ""
            Write-Host "     URL: $url" -ForegroundColor Gray
        } else {
            Write-Host "     ⚠️  No contiene NEXT_PUBLIC_API_URL" -ForegroundColor Red
            $allGood = $false
        }
    } else {
        Write-Host "  ❌ $file NO existe" -ForegroundColor Red
        $allGood = $false
    }
}

# Verificar workflows
Write-Host "`n📋 Verificando workflows:" -ForegroundColor Yellow

$workflows = @(
    ".github\workflows\firebase-hosting-merge.yml",
    ".github\workflows\firebase-hosting-pull-request.yml"
)

foreach ($workflow in $workflows) {
    $fullPath = Join-Path $PSScriptRoot $workflow
    if (Test-Path $fullPath) {
        Write-Host "  ✅ $workflow existe" -ForegroundColor Green
        
        # Verificar que use vars.BACKEND_API_URL
        $content = Get-Content $fullPath -Raw
        if ($content -match '\$\{\{ vars\.BACKEND_API_URL \}\}') {
            Write-Host "     ✅ Usa vars.BACKEND_API_URL correctamente" -ForegroundColor Green
        } else {
            Write-Host "     ⚠️  NO usa vars.BACKEND_API_URL" -ForegroundColor Red
            $allGood = $false
        }
    } else {
        Write-Host "  ❌ $workflow NO existe" -ForegroundColor Red
        $allGood = $false
    }
}

# Verificar next.config.ts
Write-Host "`n⚙️  Verificando next.config.ts:" -ForegroundColor Yellow

$configPath = Join-Path $PSScriptRoot "frontend\next.config.ts"
if (Test-Path $configPath) {
    Write-Host "  ✅ next.config.ts existe" -ForegroundColor Green
    
    $content = Get-Content $configPath -Raw
    if ($content -match "NEXT_PUBLIC_API_URL") {
        Write-Host "     ✅ Incluye NEXT_PUBLIC_API_URL en env" -ForegroundColor Green
    } else {
        Write-Host "     ⚠️  No incluye NEXT_PUBLIC_API_URL en env" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ next.config.ts NO existe" -ForegroundColor Red
    $allGood = $false
}

# Probar backend
Write-Host "`n🌐 Probando conexión al backend:" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://backend-monolito-production.up.railway.app/api/health" -Method Get -TimeoutSec 5
    Write-Host "  ✅ Backend responde correctamente" -ForegroundColor Green
    Write-Host "     Status: $($response.status)" -ForegroundColor Gray
    Write-Host "     Service: $($response.service)" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Backend NO responde" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Red
    $allGood = $false
}

# Resumen
Write-Host "`n" -NoNewline
if ($allGood) {
    Write-Host "═══════════════════════════════════════" -ForegroundColor Green
    Write-Host "  ✅ TODO CONFIGURADO CORRECTAMENTE" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "   1. Agrega BACKEND_API_URL en GitHub Settings → Environments" -ForegroundColor White
    Write-Host "   2. Haz commit y push de los cambios" -ForegroundColor White
    Write-Host "   3. Verifica el deploy en GitHub Actions" -ForegroundColor White
} else {
    Write-Host "═══════════════════════════════════════" -ForegroundColor Red
    Write-Host "  ⚠️  HAY PROBLEMAS EN LA CONFIGURACIÓN" -ForegroundColor Red
    Write-Host "═══════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    Write-Host "Revisa los errores arriba y corrígelos." -ForegroundColor Yellow
}

Write-Host ""
