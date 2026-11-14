@echo off
setlocal
cd /d "%~dp0"
title Stop SoleMate Shoe POS Server

echo ========================================================
echo   Stopping SoleMate Shoe Shop POS Server...
echo ========================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$conns = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue; if ($conns) { $pids = $conns.OwningProcess | Select-Object -Unique; foreach ($procId in $pids) { if ($procId -gt 0) { try { Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue; Write-Host ('[OK] Stopped Server Process (PID: ' + $procId + ')') } catch {} } } Write-Host '[SUCCESS] SoleMate Server stopped.' } else { Write-Host '[INFO] Server is not currently running.' }"

echo.
pause
