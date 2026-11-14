@echo off
setlocal
cd /d "%~dp0"
title Restart SoleMate Shoe POS Server

echo ========================================================
echo   Restarting SoleMate Shoe Shop POS Server...
echo ========================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$conns = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue; if ($conns) { $pids = $conns.OwningProcess | Select-Object -Unique; foreach ($procId in $pids) { if ($procId -gt 0) { try { Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue; Write-Host ('[OK] Closed old process (PID: ' + $procId + ')') } catch {} } } }"

timeout /t 1 /nobreak >nul

cscript //nologo Start_Silent_Background.vbs

echo [SUCCESS] SoleMate Server restarted cleanly in the background!
echo Opening http://127.0.0.1:8000 in your web browser...
echo.
pause
