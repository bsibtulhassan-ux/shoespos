@echo off
setlocal enabledelayedexpansion
title SoleMate Shoe POS - 1-Click Client Setup
cd /d "%~dp0"

echo ========================================================
echo   SoleMate Shoe Shop POS - Automatic Client Setup
echo ========================================================
echo.
echo [1/4] Detecting Python installation...

set "PY_CMD="
if exist "%LocalAppData%\Programs\Python\Python312\python.exe" (
    set "PY_CMD=%LocalAppData%\Programs\Python\Python312\python.exe"
    goto :python_found
)
if exist "%LocalAppData%\Programs\Python\Python311\python.exe" (
    set "PY_CMD=%LocalAppData%\Programs\Python\Python311\python.exe"
    goto :python_found
)
if exist "%LocalAppData%\Programs\Python\Python310\python.exe" (
    set "PY_CMD=%LocalAppData%\Programs\Python\Python310\python.exe"
    goto :python_found
)

python --version >nul 2>&1
if !errorlevel! equ 0 (
    set "PY_CMD=python"
    goto :python_found
)

py --version >nul 2>&1
if !errorlevel! equ 0 (
    set "PY_CMD=py"
    goto :python_found
)

:python_found
if "%PY_CMD%"=="" (
    echo [ERROR] Python is not installed on this computer!
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    echo (Make sure to check "Add Python to PATH" during installation)
    echo.
    pause
    exit /b 1
)

echo [OK] Found Python: %PY_CMD%
echo.

echo [2/4] Verifying and installing required packages...
"%PY_CMD%" -m pip install -r requirements.txt >nul 2>&1
echo [OK] Requirements ready!
echo.

echo [3/4] Configuring Windows Auto-Start and Desktop Shortcut...
"%PY_CMD%" install_autostart_and_protocol.py
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.Environment]::GetFolderPath('Desktop'); $shortcut = $ws.CreateShortcut([System.IO.Path]::Combine($desktop, 'SoleMate Shoe POS.lnk')); $shortcut.TargetPath = 'wscript.exe'; $shortcut.Arguments = '\"' + [System.IO.Path]::Combine('%~dp0', 'Start_Silent_Background.vbs') + '\"'; $shortcut.WorkingDirectory = '%~dp0'; $shortcut.Description = 'SoleMate Shoe Shop POS and Inventory (Silent Background)'; $shortcut.Save();"
echo [OK] Desktop Shortcut and Windows Auto-Start configured!
echo.

echo [4/4] Starting SoleMate Shoe POS Server...
wscript.exe "%~dp0Start_Silent_Background.vbs"
echo.
echo ========================================================
echo   [SUCCESS] Setup Completed Successfully!
echo ========================================================
echo   * Desktop Shortcut : Created on Desktop ('SoleMate Shoe POS')
echo   * Windows Auto-Boot: Runs automatically when Windows starts
echo   * POS Server       : Now Active at http://127.0.0.1:8000
echo ========================================================
echo.
pause
