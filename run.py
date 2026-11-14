import os
import sys
import webbrowser
import threading
import time
import socket
import urllib.request
from pathlib import Path

# Always guarantee working directory is the project directory
BASE_DIR = Path(__file__).resolve().parent
os.chdir(BASE_DIR)
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Ensure stdout/stderr are safe for pythonw.exe or windowless execution
class SafeWriter:
    def write(self, s):
        pass
    def flush(self):
        pass
    def reconfigure(self, **kwargs):
        pass

if sys.stdout is None:
    sys.stdout = SafeWriter()
else:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

if sys.stderr is None:
    sys.stderr = SafeWriter()
else:
    try:
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def is_server_already_running(port=8000):
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/api/settings", timeout=1.5) as r:
            return r.status == 200
    except Exception:
        return False

def open_browser():
    time.sleep(1.2)
    print("Opening SoleMate POS in your default web browser...")
    webbrowser.open("http://127.0.0.1:8000")

if __name__ == "__main__":
    is_silent = "--silent" in sys.argv

    # If server is already running, open browser (if not silent) and exit cleanly (no crash!)
    if is_server_already_running(8000):
        print("SoleMate POS server is already running and active on port 8000.")
        if not is_silent:
            open_browser()
        sys.exit(0)

    import uvicorn
    local_ip = get_local_ip()
    if not is_silent:
        threading.Thread(target=open_browser, daemon=True).start()

    print("=" * 65)
    print("  SoleMate Shoe Shop POS & Inventory Management System")
    print("=" * 65)
    print(f"  [PC Local Access]    : http://127.0.0.1:8000")
    print(f"  [Android / Phone App]: http://{local_ip}:8000")
    print("=" * 65)
    print("  * To use on Android: Connect to the same Wi-Fi / Hotspot,")
    print(f"    open Chrome on your phone, go to: http://{local_ip}:8000")
    print("    and tap 'Install App' / 'Add to Home screen'.")
    print("  * Security enabled: Admin PIN (1234), Cashier PIN (0000)")
    print("  * 100% Fully Offline - No internet required!")
    print("=" * 65)
    print("  Press CTRL+C to stop the server\n")

    import traceback
    try:
        # Bind to 0.0.0.0 to enable Android phone/tablet access on Wi-Fi
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
    except Exception as e:
        with open(BASE_DIR / "server_error.log", "a", encoding="utf-8") as f:
            f.write(traceback.format_exc())
