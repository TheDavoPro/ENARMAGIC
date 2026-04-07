@echo off
chcp 65001 >nul
title Extractor de Residuos

:: ═══════════════════════════════════════════════════════════════
::  EXTRAER_RESIDUOS.bat
::
::  INSTRUCCIONES:
::  1. Coloca este archivo (.bat) y extraer_residuos.py en la
::     carpeta MADRE (la que contiene todas las subcarpetas).
::  2. Haz doble clic en este archivo.
::  3. Se creara una carpeta "residuos\" con subcarpetas por tema.
::
::  Archivos que se mueven: PNG, JPG, JPEG, TXT
::
::  Estructura resultante:
::    Carpeta MADRE\
::      residuos\
::        Tema 1\   <- PNG/JPG/TXT que estaban en "Tema 1"
::        Tema 2\   <- PNG/JPG/TXT que estaban en "Tema 2"
::
::  ATENCION: Los archivos se MUEVEN (no se copian).
::            Si necesitas una copia de seguridad, hazla antes.
:: ═══════════════════════════════════════════════════════════════

echo.
echo  ATENCION: Este proceso MUEVE los archivos de sus carpetas originales.
echo  Los archivos PNG, JPG, JPEG y TXT seran trasladados a "residuos\".
echo.
set /p CONFIRMAR= Deseas continuar? (S/N):

if /i "%CONFIRMAR%" neq "S" (
    echo.
    echo  Operacion cancelada.
    echo.
    pause
    exit /b 0
)

:: Verificar que Python este instalado
py --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo  [ERROR] Python no esta instalado o no esta en el PATH.
    echo.
    echo  Descargalo desde: https://www.python.org/downloads/
    echo  Durante la instalacion marca "Add Python to PATH".
    echo.
    pause
    exit /b 1
)

:: Verificar que el script Python exista
if not exist "%~dp0extraer_residuos.py" (
    echo.
    echo  [ERROR] No se encontro el archivo extraer_residuos.py
    echo  Asegurate de que este en la misma carpeta que este .bat
    echo.
    pause
    exit /b 1
)

echo.
echo  Iniciando extraccion...
echo.

py "%~dp0extraer_residuos.py"

exit /b 0
