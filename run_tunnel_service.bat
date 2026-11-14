@echo off
cd /d "C:\Users\Hassan Bukhari\.gemini\antigravity\scratch\shoe-shop-pos"
cloudflared.exe tunnel --url http://127.0.0.1:8000 --logfile "C:\Users\Hassan Bukhari\.gemini\antigravity\scratch\shoe-shop-pos\cf_permanent.log"
