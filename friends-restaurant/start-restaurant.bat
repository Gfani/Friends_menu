@echo off
title Mereba Friends Garden - Digital Menu Server
color 0E

echo ========================================================
echo        MEREBA FRIENDS GARDEN (መረባ ፍሬንድስ)
echo      Commercial Digital QR Menu & Admin Suite
echo ========================================================
echo.
echo Starting unified server on port 5000...
echo.

cd /d "%~dp0\backend"
start "" http://localhost:5000

node dist/app.js
pause

