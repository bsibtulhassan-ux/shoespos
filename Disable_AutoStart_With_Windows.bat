@echo off
setlocal
cd /d "%~dp0"
title Disable Auto-Start on Windows Boot

echo ========================================================
echo   Disable SoleMate POS Auto-Start on Windows Boot
echo ========================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$startup = [System.Environment]::GetFolderPath('Startup'); $shortcutPath = [System.IO.Path]::Combine($startup, 'SoleMate Shoe POS (AutoStart).lnk'); if (Test-Path $shortcutPath) { Remove-Item $shortcutPath -Force; Write-Host '[SUCCESS] Auto-start removed from Windows Startup.' } else { Write-Host '[INFO] Auto-start was not enabled.' }"

echo.
pause
