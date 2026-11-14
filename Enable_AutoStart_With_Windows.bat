@echo off
setlocal
cd /d "%~dp0"
title Enable Auto-Start on Windows Boot

echo ========================================================
echo   Enable SoleMate POS Auto-Start on Windows Boot
echo ========================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $startup = [System.Environment]::GetFolderPath('Startup'); $shortcutPath = [System.IO.Path]::Combine($startup, 'SoleMate Shoe POS (AutoStart).lnk'); $shortcut = $ws.CreateShortcut($shortcutPath); $shortcut.TargetPath = [System.IO.Path]::Combine('%~dp0', 'Start_Silent_Background.vbs'); $shortcut.WorkingDirectory = '%~dp0'; $shortcut.Description = 'SoleMate Shoe POS Background Server'; $shortcut.Save(); Write-Host '[SUCCESS] SoleMate Shoe POS will now automatically start in the background whenever your computer turns on or reboots!'"

echo.
echo Location: %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
echo.
pause
