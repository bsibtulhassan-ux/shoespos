@echo off
setlocal
title Push SoleMate POS to GitHub for Railway Deployment
cd /d "%~dp0"

echo ========================================================
echo   Push SoleMate POS to GitHub for Railway
echo ========================================================
echo.

set "GIT_CMD=C:\Program Files\Git\bin\git.exe"
if not exist "%GIT_CMD%" set "GIT_CMD=git"

echo 1. Pehle GitHub (https://github.com/new) par ja kar ek Naya Repository banayein (e.g. shoe-pos).
echo 2. Wahan se apna repository link copy karein (e.g. https://github.com/username/shoe-pos.git).
echo.
set /p REPO_URL="Apna GitHub Repository URL yahan paste karein: "

if "%REPO_URL%"=="" (
    echo [ERROR] URL enter nahi kiya gaya!
    pause
    exit /b 1
)

"%GIT_CMD%" remote remove origin >nul 2>&1
"%GIT_CMD%" remote add origin %REPO_URL%
"%GIT_CMD%" branch -M main
echo.
echo Code GitHub par upload ho raha hai...
"%GIT_CMD%" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  [SUCCESS] Code kamyabi se GitHub par upload ho gaya!
    echo  Ab Railway.com par ja kar 'Deploy from GitHub' select karein.
    echo ========================================================
) else (
    echo.
    echo [NOTE] Agar login prompt aaye to browser mein GitHub authenticate karein.
)

echo.
pause
