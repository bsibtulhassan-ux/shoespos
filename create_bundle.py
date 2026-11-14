import os
import shutil
import zipfile
from pathlib import Path

base_dir = Path(__file__).resolve().parent
mobile_dir = base_dir / 'mobile_apk_bundle'
if mobile_dir.exists():
    shutil.rmtree(mobile_dir)
mobile_dir.mkdir(parents=True)

# Create folders
(mobile_dir / 'vendor').mkdir()
(mobile_dir / 'css').mkdir()
(mobile_dir / 'js').mkdir()
(mobile_dir / 'icons').mkdir()

# Copy files
shutil.copy(base_dir / 'static' / 'vendor' / 'tailwind.js', mobile_dir / 'vendor' / 'tailwind.js')
shutil.copy(base_dir / 'static' / 'vendor' / 'lucide.min.js', mobile_dir / 'vendor' / 'lucide.min.js')
shutil.copy(base_dir / 'static' / 'css' / 'style.css', mobile_dir / 'css' / 'style.css')
shutil.copy(base_dir / 'static' / 'js' / 'app.js', mobile_dir / 'js' / 'app.js')
shutil.copy(base_dir / 'static' / 'icons' / 'icon.svg', mobile_dir / 'icons' / 'icon.svg')

# Adjust index.html for relative offline paths
with open(base_dir / 'static' / 'index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('/static/css/style.css', './css/style.css')
html = html.replace('/static/vendor/tailwind.js', './vendor/tailwind.js')
html = html.replace('/static/vendor/lucide.min.js', './vendor/lucide.min.js')
html = html.replace('/static/js/app.js', './js/app.js')
html = html.replace('/static/manifest.json', './manifest.json')
html = html.replace('/static/icons/icon.svg', './icons/icon.svg')

with open(mobile_dir / 'index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Manifest
manifest_content = """{
  "name": "SoleMate Shoe POS",
  "short_name": "Shoe POS",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "description": "Standalone 100% Offline Shoe Shop POS and Inventory Management App",
  "icons": [
    {
      "src": "icons/icon.svg",
      "sizes": "192x192 512x512",
      "type": "image/svg+xml"
    }
  ]
}"""
with open(mobile_dir / 'manifest.json', 'w', encoding='utf-8') as f:
    f.write(manifest_content)

# Config.xml for APK builders (Cordova / WebIntoApp / AppsGeyser)
config_xml = """<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" id="com.solemate.shoepos" version="2.5.0">
    <name>SoleMate Shoe POS</name>
    <description>SoleMate Shoe Store POS and Inventory Management System</description>
    <author email="support@solemate.pos" href="http://localhost">SoleMate Retail</author>
    <content src="index.html" />
    <preference name="Orientation" value="default" />
    <preference name="Fullscreen" value="true" />
</widget>"""
with open(mobile_dir / 'config.xml', 'w', encoding='utf-8') as f:
    f.write(config_xml)

# Create Zip on Desktop
desktop_zip = Path(r"C:\Users\Hassan Bukhari\Desktop\SoleMate-Mobile-APK-Bundle.zip")
with zipfile.ZipFile(desktop_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(mobile_dir):
        for file in files:
            p = Path(root) / file
            arcname = p.relative_to(mobile_dir)
            z.write(p, arcname)

print("Mobile APK bundle created successfully:", desktop_zip.stat().st_size, "bytes")
