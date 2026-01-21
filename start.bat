@echo off
title Ebenezer Launcher
echo ==========================================
echo   INICIANDO EBENEZER UNIFICADO
echo ==========================================

:: Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no esta en el PATH.
    pause
    exit
)

:: Ejecutar el sistema unificado
:: Esto iniciara la voz y el puente de mensajes en un solo proceso
python ebenezer.py

pause
