@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo   Setting up SoleMate Shoe POS on your Desktop
echo ========================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.Environment]::GetFolderPath('Desktop'); $shortcut = $ws.CreateShortcut([System.IO.Path]::Combine($desktop, 'SoleMate Shoe POS.lnk')); $shortcut.TargetPath = 'wscript.exe'; $shortcut.Arguments = '\"' + [System.IO.Path]::Combine('%~dp0', 'Start_Silent_Background.vbs') + '\"'; $shortcut.WorkingDirectory = '%~dp0'; $shortcut.Description = 'SoleMate Shoe Shop POS and Inventory (Silent Background)'; $shortcut.Save(); Write-Host '[OK] Shortcut created successfully on your Windows Desktop!'"

echo.
echo You can now open 'SoleMate Shoe POS' directly from your Desktop.
echo It runs silently in the background with no annoying command prompt window!
echo.
pause
