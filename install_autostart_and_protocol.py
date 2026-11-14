import winreg
import os
from pathlib import Path

pos_dir = Path(__file__).resolve().parent
python_exe = Path(os.path.expandvars(r"%LocalAppData%\Programs\Python\Python312\python.exe"))
run_py = pos_dir / "run.py"
watchdog_vbs = pos_dir / "watchdog.vbs"
wscript_exe = Path(os.path.expandvars(r"%SystemRoot%\System32\wscript.exe"))

# Protocol launch command (direct python execution with --silent)
protocol_cmd = f'"{python_exe}" "{run_py}" --silent'

# Watchdog launch command for background persistence (zero window)
watchdog_cmd = f'"{wscript_exe}" "{watchdog_vbs}"'

print(f"Watchdog cmd: {watchdog_cmd}")
print(f"Protocol cmd: {protocol_cmd}")

# 1. Register Watchdog in HKCU\Software\Microsoft\Windows\CurrentVersion\Run
run_key_path = r"Software\Microsoft\Windows\CurrentVersion\Run"
with winreg.OpenKey(winreg.HKEY_CURRENT_USER, run_key_path, 0, winreg.KEY_SET_VALUE) as key:
    winreg.SetValueEx(key, "SoleMatePOS", 0, winreg.REG_SZ, watchdog_cmd)
print("[OK] HKCU Windows Auto-Run key updated to launch 24/7 Watchdog on boot")

# 2. Register 'solemate://' protocol for 1-click start from browser
protocol_key_path = r"Software\Classes\solemate"
with winreg.CreateKey(winreg.HKEY_CURRENT_USER, protocol_key_path) as key:
    winreg.SetValueEx(key, "", 0, winreg.REG_SZ, "URL:SoleMate POS Protocol")
    winreg.SetValueEx(key, "URL Protocol", 0, winreg.REG_SZ, "")

cmd_key_path = r"Software\Classes\solemate\shell\open\command"
with winreg.CreateKey(winreg.HKEY_CURRENT_USER, cmd_key_path) as key:
    winreg.SetValueEx(key, "", 0, winreg.REG_SZ, protocol_cmd)
print("[OK] Registered 'solemate://' custom protocol for in-browser instant starter")

# 3. Create SoleMate_AutoStart.bat in Windows Startup folder (Dual backup)
startup_folder = Path(os.path.expandvars(r"%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"))
startup_bat = startup_folder / "SoleMate_AutoStart.bat"
with open(startup_bat, "w", encoding="utf-8") as f:
    f.write(f'@echo off\ncd /d "{pos_dir}"\nstart "" {watchdog_cmd}\nexit\n')
print(f"[OK] Startup folder batch created: {startup_bat}")

# 4. Clean up any obsolete test files
for temp_file in ["create_task.py", "test_exec.py", "out.log"]:
    p = pos_dir / temp_file
    if p.exists():
        p.unlink()

print("[SUCCESS] All Auto-Recovery & Startup mechanisms configured successfully!")
