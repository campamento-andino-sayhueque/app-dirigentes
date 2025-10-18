# Script para iniciar el servidor de desarrollo con la configuracion correcta
Set-Location $PSScriptRoot
Write-Host "Directorio actual: $PWD" -ForegroundColor Cyan
Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
npm run dev
