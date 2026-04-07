@echo off
chcp 65001 >nul
title Eliminador de Archivos Word

:: ─────────────────────────────────────────────────────────────
::  ELIMINAR_WORD.bat
::  Coloca este archivo en la carpeta raiz y haz doble clic.
::  Elimina todos los .doc y .docx, incluyendo subcarpetas.
::  PIDE CONFIRMACION antes de borrar cualquier archivo.
:: ─────────────────────────────────────────────────────────────

cd /d "%~dp0"

py "%~dp0eliminar_word.py"

exit /b 0
