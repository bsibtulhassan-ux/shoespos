import json
import os
import re
import socket
import ssl
import subprocess
import sys
import time
import urllib.request

BASE_DIR = r"C:\Users\Hassan Bukhari\.gemini\antigravity\scratch\shoe-shop-pos"
CF_EXE = os.path.join(BASE_DIR, "cloudflared.exe")
CREDS_FILE = os.path.join(BASE_DIR, "qt_creds.json")
URL_FILE = os.path.join(BASE_DIR, "current_tunnel_url.txt")
LOG_FILE = os.path.join(BASE_DIR, "cf_permanent.log")
DESKTOP_URL = r"C:\Users\Hassan Bukhari\Desktop\Cloudflare_Online_Link.url"


def is_cloudflared_running():
    try:
        out = subprocess.check_output(
            ["tasklist", "/FI", "IMAGENAME eq cloudflared.exe", "/NH"],
            text=True,
            creationflags=0x08000000
        )
        return "cloudflared.exe" in out.lower()
    except Exception:
        return False


def kill_cloudflared():
    subprocess.run(
        ["taskkill", "/F", "/IM", "cloudflared.exe"],
        capture_output=True,
        creationflags=0x08000000
    )


def check_url_alive(url, timeout=4):
    if not url:
        return False
    try:
        req = urllib.request.Request(f"{url.rstrip('/')}/api/settings", method="GET")
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status == 200
    except Exception:
        return False


def fetch_new_quick_tunnel():
    """Call api.trycloudflare.com/tunnel directly over healthy IPv4s (skipping blocked IPs)."""
    # Known good Cloudflare IPs + dynamic DNS IPs
    ips = []
    try:
        infos = socket.getaddrinfo("api.trycloudflare.com", 443, socket.AF_INET, socket.SOCK_STREAM)
        for info in infos:
            ip = info[4][0]
            if ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    for fallback_ip in ["104.16.231.132", "104.16.230.132"]:
        if fallback_ip not in ips:
            ips.append(fallback_ip)
    # Prefer 104.16.231.132 first if present since 230.132 is known slow/blocked on some ISPs
    if "104.16.231.132" in ips:
        ips.remove("104.16.231.132")
        ips.insert(0, "104.16.231.132")

    ctx = ssl.create_default_context()
    last_err = None
    for ip in ips:
        try:
            sock = socket.create_connection((ip, 443), timeout=3)
            sock.settimeout(12)
            ss = ctx.wrap_socket(sock, server_hostname="api.trycloudflare.com")
            req = (
                b"POST /tunnel HTTP/1.1\r\n"
                b"Host: api.trycloudflare.com\r\n"
                b"Content-Type: application/json\r\n"
                b"User-Agent: cloudflared/2026.10.5\r\n"
                b"Content-Length: 2\r\n"
                b"Connection: close\r\n\r\n{}"
            )
            ss.sendall(req)
            chunks = []
            while True:
                data = ss.recv(4096)
                if not data:
                    break
                chunks.append(data)
            ss.close()
            raw = b"".join(chunks).decode("utf-8", errors="ignore")
            if "\r\n\r\n" in raw:
                body = raw.split("\r\n\r\n", 1)[1]
                # Handle chunked encoding if present
                start_brace = body.find("{")
                end_brace = body.rfind("}")
                if start_brace != -1 and end_brace != -1:
                    data = json.loads(body[start_brace:end_brace + 1])
                    if data.get("success") and data.get("result"):
                        return data["result"]
        except Exception as e:
            last_err = e
            continue
    raise RuntimeError(f"Failed to request quick tunnel from all IPs: {last_err}")


def save_tunnel_info(creds, hostname):
    url = f"https://{hostname}" if not hostname.startswith("http") else hostname
    with open(CREDS_FILE, "w", encoding="utf-8") as f:
        json.dump(creds, f, indent=2)
    with open(URL_FILE, "w", encoding="utf-8") as f:
        f.write(url)
    try:
        with open(DESKTOP_URL, "w", encoding="utf-8") as f:
            f.write(f"[InternetShortcut]\nURL={url}\n")
    except Exception:
        pass
    return url


def launch_cloudflared_wmi(tunnel_id):
    kill_cloudflared()
    time.sleep(0.5)
    if os.path.exists(LOG_FILE):
        try:
            os.remove(LOG_FILE)
        except Exception:
            pass

    cmd = (
        f'"{CF_EXE}" tunnel --protocol http2 --edge-ip-version 4 '
        f'--credentials-file "{CREDS_FILE}" '
        f'--url http://127.0.0.1:8000 '
        f'--logfile "{LOG_FILE}" '
        f'run {tunnel_id}'
    )
    ps_script = f'$c = [wmiclass]"Win32_Process"; $r = $c.Create(\'{cmd}\'); Write-Output $r.ReturnValue'
    res = subprocess.run(
        ["powershell", "-NoProfile", "-Command", ps_script],
        capture_output=True,
        text=True,
        creationflags=0x08000000
    )
    if res.returncode != 0 or res.stdout.strip() != "0":
        raise RuntimeError(f"WMI launch failed: {res.stdout} {res.stderr}")


def ensure_tunnel(force_new=False):
    current_url = None
    if os.path.exists(URL_FILE):
        with open(URL_FILE, "r", encoding="utf-8") as f:
            current_url = f.read().strip()

    if not force_new and is_cloudflared_running() and current_url:
        if check_url_alive(current_url, timeout=4):
            return current_url

    # Try reusing existing credentials first unless force_new
    if not force_new and os.path.exists(CREDS_FILE) and current_url:
        try:
            with open(CREDS_FILE, "r", encoding="utf-8") as f:
                creds = json.load(f)
            tid = creds.get("TunnelID")
            if tid:
                launch_cloudflared_wmi(tid)
                for _ in range(10):
                    time.sleep(1)
                    if check_url_alive(current_url, timeout=3):
                        return current_url
        except Exception:
            pass

    # Request brand-new quick tunnel directly via healthy IP
    result = fetch_new_quick_tunnel()
    creds = {
        "AccountTag": result["account_tag"],
        "TunnelSecret": result["secret"],
        "TunnelID": result["id"],
    }
    url = save_tunnel_info(creds, result["hostname"])
    launch_cloudflared_wmi(result["id"])

    for _ in range(12):
        time.sleep(1)
        if check_url_alive(url, timeout=3):
            return url
    return url


if __name__ == "__main__":
    force = "--new" in sys.argv
    url = ensure_tunnel(force_new=force)
    print("ACTIVE_TUNNEL_URL:", url)
