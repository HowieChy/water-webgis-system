@echo off
chcp 65001 >nul
cls
echo ========================================
echo   Water WebGIS System - Dev Mode
echo ========================================
echo.

echo [1/3] Checking environment...
where java >nul 2>&1
if %errorlevel% == 0 (
    echo   [OK] Java found
) else (
    echo   [WARNING] Java not found
)

where node >nul 2>&1
if %errorlevel% == 0 (
    echo   [OK] Node.js found
) else (
    echo   [WARNING] Node.js not found
)
echo.

echo [2/3] Starting Backend (http://localhost:8080)...
start "Backend Server" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"
echo   Backend starting in new window...
echo.

echo [3/3] Waiting 15 seconds for backend...
timeout /t 15 /nobreak >nul
echo.

echo Starting Frontend (http://localhost:5599)...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && yarn dev"
echo   Frontend starting in new window...
echo.

echo ========================================
echo   System Started!
echo ========================================
echo.
echo Access URLs:
echo   Frontend: http://localhost:5599
echo   Backend:  http://localhost:8080
echo.
echo Press any key to exit this window...
echo (Backend and Frontend will keep running)
pause >nul
