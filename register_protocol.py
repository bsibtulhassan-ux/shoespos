import winreg
from pathlib import Path

pos_dir = Path(__file__).resolve().parent
vbs_path = pos_dir / "Start_Silent_Background.vbs"

# 1. Create HKCU\Software\Classes\solemate
key_path = r"Software\Classes\solemate"
with winreg.CreateKey(winreg.HKEY_CURRENT_USER, key_path) as key:
    winreg.SetValueEx(key, "", 0, winreg.REG_SZ, "URL:SoleMate POS Protocol")
    winreg.SetValueEx(key, "URL Protocol", 0, winreg.REG_SZ, "")

# 2. Create HKCU\Software\Classes\solemate\shell\open\command
cmd_key_path = r"Software\Classes\solemate\shell\open\command"
with winreg.CreateKey(winreg.HKEY_CURRENT_USER, cmd_key_path) as key:
    cmd_val = f'wscript.exe "{vbs_path}"'
    winreg.SetValueEx(key, "", 0, winreg.REG_SZ, cmd_val)

print(f"Protocol 'solemate://' registered successfully to: {cmd_val}")
