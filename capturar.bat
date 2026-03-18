@echo off
:: capturar.bat
:: Ejecuta el script de captura desde WSL,
:: luego abre la imagen generada automáticamente.

set "DIR=%~dp0"
set "WSL_DIR=%DIR:\=/%"
set "WSL_DIR=%WSL_DIR:C:/=/mnt/c/%"
:: Quitar barra final
if "%WSL_DIR:~-1%"=="/" set "WSL_DIR=%WSL_DIR:~0,-1%"

echo Generando imagen...
wsl -e bash -c "cd '%WSL_DIR%' && node capturar.js"

echo.
echo Abriendo imagen...
start "" "%DIR%escrito-HD.png"

echo Listo. Presiona cualquier tecla para cerrar.
pause > nul