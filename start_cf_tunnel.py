import subprocess
import re
import sys
import time
import os

cf_exe = r"C:\Users\Hassan Bukhari\.gemini\antigravity\scratch\shoe-shop-pos\cloudflared.exe"
out_file = r"C:\Users\Hassan Bukhari\.gemini\antigravity\scratch\shoe-shop-pos\tunnel_url.txt"

if not os.path.exists(cf_exe):
    print("cloudflared.exe not found at", cf_exe)
    sys.exit(1)

# Start process
proc = subprocess.Popen(
    [cf_exe, "tunnel", "--url", "http://127.0.0.1:8000"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

tunnel_url = None
start_time = time.time()

for line in iter(proc.stdout.readline, ''):
    print(line, end='', flush=True)
    match = re.search(r'https://[a-zA-Z0-9\-]+\.trycloudflare\.com', line)
    if match:
        tunnel_url = match.group(0)
        print("\n" + "="*50)
        print("FOUND TUNNEL URL:", tunnel_url)
        print("="*50 + "\n")
        with open(out_file, "w", encoding="utf-8") as f:
            f.write(tunnel_url)
        break
    if time.time() - start_time > 60:
        print("Timeout waiting for tunnel URL")
        break

if not tunnel_url:
    print("Failed to get tunnel URL")
    sys.exit(1)

# Keep process running in background
while True:
    time.sleep(10)
    if proc.poll() is not None:
        print("cloudflared exited with code", proc.returncode)
        break
