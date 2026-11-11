@echo off
setlocal enabledelayedexpansion
title Mereba Friends Garden - Digital Menu Server
color 0E

echo ========================================================
echo        MEREBA FRIENDS GARDEN (መረባ ፍሬንድስ)
echo      Commercial Digital QR Menu & Admin Suite
echo ========================================================
echo.

set "LOCAL_IP=localhost"
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i /c:"IPv4"') do (
    if "!LOCAL_IP!"=="localhost" (
        set "TEMP_IP=%%a"
        set "LOCAL_IP=!TEMP_IP: =!"
    )
)

echo  📡 Local Wi-Fi Network IP:  !LOCAL_IP!
echo.
echo  📱 Customer Menu URL:       http://!LOCAL_IP!:5000
echo  🔐 Manager Admin Portal:    http://!LOCAL_IP!:5000/admin/login
echo  🖥️  Cashier Browser Access:   http://localhost:5000
echo.
echo ========================================================
echo Starting unified server on port 5000...
echo Keep this window open during restaurant operating hours.
echo ========================================================
echo.

cd /d "%~dp0\backend"
start "" http://localhost:5000

node dist/app.js
pause
