@echo off
cd /d "%~dp0"
node tools\start-local.mjs
echo.
echo Puedes cerrar esta ventana. Si la aplicacion arranco, el servidor seguira activo.
pause
