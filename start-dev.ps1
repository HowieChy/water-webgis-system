# Water WebGIS System - Development Mode Startup Script
# This script will start both frontend and backend services

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Water WebGIS System - Dev Mode" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Java
Write-Host "[1/4] Checking Java..." -ForegroundColor Yellow
$javaCheck = Get-Command java -ErrorAction SilentlyContinue
if ($javaCheck) {
    Write-Host "  Java OK" -ForegroundColor Green
} else {
    Write-Host "  WARNING: Java not found" -ForegroundColor Red
}
Write-Host ""

# Check Node.js
Write-Host "[2/4] Checking Node.js..." -ForegroundColor Yellow
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCheck) {
    Write-Host "  Node.js OK" -ForegroundColor Green
} else {
    Write-Host "  WARNING: Node.js not found" -ForegroundColor Red
}
Write-Host ""

# Start Backend
Write-Host "[3/4] Starting Backend..." -ForegroundColor Yellow
Write-Host "  Backend URL: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Starting Spring Boot...' -ForegroundColor Green; mvn spring-boot:run"

# Wait for backend
Write-Host "  Waiting 15 seconds for backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Start Frontend
Write-Host "[4/4] Starting Frontend..." -ForegroundColor Yellow
Write-Host "  Frontend URL: http://localhost:5599" -ForegroundColor Cyan
Write-Host ""
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Starting Vite...' -ForegroundColor Green; yarn dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  System Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5599" -ForegroundColor White
Write-Host "  Backend:  http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "Tip: Close terminal windows to stop services" -ForegroundColor Yellow
Write-Host ""
