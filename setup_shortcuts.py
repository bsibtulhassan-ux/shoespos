import os
from pathlib import Path
import subprocess

pos_dir = Path(__file__).resolve().parent
watchdog_vbs = pos_dir / "watchdog.vbs"
startup_dir = Path(os.path.expandvars(r"%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"))

# Use PowerShell script with environment variables
ps_script = f"""
$ws = New-Object -ComObject WScript.Shell
$scPath = Join-Path $env:APPDATA 'Microsoft\\Windows\\Start Menu\\Programs\\Startup\\SoleMate Shoe POS (AutoStart).lnk'
$sc = $ws.CreateShortcut($scPath)
$sc.TargetPath = 'wscript.exe'
$sc.Arguments = '"{watchdog_vbs}"'
$sc.WorkingDirectory = '{pos_dir}'
$sc.Description = 'SoleMate POS 24/7 Auto-Recovery Watchdog'
$sc.Save()

# Also update Desktop shortcut
$desktopPath = Join-Path ([System.Environment]::GetFolderPath('Desktop')) 'SoleMate Shoe POS.lnk'
$dsc = $ws.CreateShortcut($desktopPath)
$dsc.TargetPath = 'wscript.exe'
$dsc.Arguments = '"{pos_dir}\\Start_Silent_Background.vbs"'
$dsc.WorkingDirectory = '{pos_dir}'
$dsc.Description = 'Open SoleMate Shoe POS System'
if (Test-Path '{pos_dir}\\static\\icons\\icon.svg') {{
    # icon if available
}}
$dsc.Save()

Write-Host "Shortcuts successfully configured!"
"""

res = subprocess.run(["powershell", "-NoProfile", "-Command", ps_script], capture_output=True, text=True)
print(res.stdout)
if res.stderr:
    print("ERR:", res.stderr)
