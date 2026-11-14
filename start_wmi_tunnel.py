import subprocess
import time
import re
import os

pos_dir = r"C:\Users\Hassan Bukhari\.gemini\antigravity\scratch\shoe-shop-pos"
cf_exe = os.path.join(pos_dir, "cloudflared.exe")
log_file = os.path.join(pos_dir, "cf_permanent.log")
url_file = os.path.join(pos_dir, "current_tunnel_url.txt")
desktop_url = r"C:\Users\Hassan Bukhari\Desktop\Cloudflare_Online_Link.url"

# Kill old cloudflared processes
subprocess.run(["taskkill", "/F", "/IM", "cloudflared.exe"], capture_output=True)

if os.path.exists(log_file):
    try:
        os.remove(log_file)
    except:
        pass

# Launch via WMI Win32_Process.Create so it is detached from Antigravity
full_cmd = f'"{cf_exe}" tunnel --url http://127.0.0.1:8000 --logfile "{log_file}"'
ps_script = f"""
$class = [wmiclass]"Win32_Process"
$res = $class.Create('cmd.exe /c "{full_cmd}"')
Write-Host "WMI Return:" $res.ReturnValue
Write-Host "Process ID:" $res.ProcessId
"""

res = subprocess.run(["powershell", "-NoProfile", "-Command", ps_script], capture_output=True, text=True)
print("PowerShell WMI output:", res.stdout)

# Now wait and read the URL from log_file
tunnel_url = None
for i in range(25):
    time.sleep(1)
    if os.path.exists(log_file):
        with open(log_file, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            m = re.search(r'https://[a-zA-Z0-9\-]+\.trycloudflare\.com', content)
            if m:
                tunnel_url = m.group(0)
                break

if tunnel_url:
    print("SUCCESS: TUNNEL URL IS:", tunnel_url)
    with open(url_file, "w", encoding="utf-8") as f:
        f.write(tunnel_url)
    with open(desktop_url, "w", encoding="utf-8") as f:
        f.write(f"[InternetShortcut]\nURL={tunnel_url}\n")
else:
    print("Could not find tunnel URL in log within 25 seconds")
