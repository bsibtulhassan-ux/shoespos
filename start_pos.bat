@echo off
setlocal enabledelayedexpansion
title SoleMate Shoe Shop POS and Inventory

:: Move to current directory
cd /d "%~dp0"

:: If running in silent background mode, bypass UI banners
if "%1"=="--silent" goto :run_silent

echo ========================================================
echo   SoleMate Shoe Shop POS and Inventory Management
echo ========================================================
echo.

:run_silent
:: Detect Python
set "PY_CMD="

:: Check user AppData Python 3.12 first
if exist "%LocalAppData%\Programs\Python\Python312\python.exe" (
    set "PY_CMD=%LocalAppData%\Programs\Python\Python312\python.exe"
    goto :found_python
)

:: Check standard python
python --version >nul 2>&1
if !errorlevel! equ 0 (
    set "PY_CMD=python"
    goto :found_python
)

:: Check py launcher
py --version >nul 2>&1
if !errorlevel! equ 0 (
    set "PY_CMD=py"
    goto :found_python
)

:: Check user AppData Python 3.11
if exist "%LocalAppData%\Programs\Python\Python311\python.exe" (
    set "PY_CMD=%LocalAppData%\Programs\Python\Python311\python.exe"
    goto :found_python
)

:: Check user AppData Python 3.10
if exist "%LocalAppData%\Programs\Python\Python310\python.exe" (
    set "PY_CMD=%LocalAppData%\Programs\Python\Python310\python.exe"
    goto :found_python
)

:found_python
if "%PY_CMD%"=="" (
    echo [ERROR] Python was not found on your system!
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

:: Verify required packages
"%PY_CMD%" -c "import fastapi, uvicorn, pydantic" >nul 2>&1
if !errorlevel! neq 0 (
    if not "%1"=="--silent" echo [INFO] Installing required libraries...
    "%PY_CMD%" -m pip install -r requirements.txt >nul 2>&1
)

if "%1"=="--silent" (
    "%PY_CMD%" run.py --silent
    exit /b 0
)

echo [OK] Using Python: %PY_CMD%
echo [INFO] Starting SoleMate Shoe Shop POS Server...
echo [INFO] Opening http://127.0.0.1:8000 in your web browser...
echo.
echo ========================================================
echo  NOTICE: Do NOT close this window if you want the server
echo  to keep running! (You can minimize it to taskbar).
echo  For completely hidden background mode, run:
echo  Start_Silent_Background.vbs or use the Desktop Shortcut.
echo ========================================================
echo.

"%PY_CMD%" run.py

pause
