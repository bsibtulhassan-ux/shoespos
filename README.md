# 👟 SoleMate - Shoe Shop POS & Inventory Management System

A web-based Point of Sale (POS), Inventory Control, and Billing software engineered specifically for shoe stores and footwear retailers.

---

## ✨ Features Built for Shoe Stores

1. **Shoe Variant Matrix (Sizes, Colors, SKUs & Barcodes)**
   - Tracks shoes by model, brand, category, gender, color, and size (e.g., US 7 to 12 / EU 38 to 45).
   - Unique SKU and barcode tracking for each variant.
   - Live stock indicator with low-stock warnings (≤ 3 pairs).

2. **Fast Point-of-Sale (POS) Counter Billing**
   - **Barcode Scanner Support**: Scan a barcode or type a SKU and press `Enter` to instantly add shoes to the cart.
   - Quick category pills (Running, Sports, Casual, Formal, Boots, Sandals).
   - Visual size and color selector on product cards with instant out-of-stock disable.
   - Cart adjustments (increment/decrement quantity, remove items, clear cart).
   - Support for customer discount (% or flat amount) and sales tax.

3. **Multi-Method Checkout & Cash Calculator**
   - Supports **Cash**, **Card (Credit/Debit)**, and **Digital Wallet / QR**.
   - Cash Tendered calculator with quick cash buttons ($20, $50, $100, exact) and automatic Change Returned calculation.

4. **Printable Thermal POS Receipts**
   - Formatted for standard 80mm / 58mm thermal receipt printers as well as standard A4/Letter printers.
   - Displays shop name, address, phone, invoice number, itemized shoe sizes/colors/quantities, taxes, discounts, tender/change, and return policy note.
   - One-click "Print Receipt" button using native browser printing.

5. **Shoe Inventory Management & Auto-Variant Generator**
   - Add new shoe models with the built-in **Variant Matrix Generator**: enter sizes (`US 8, US 9, US 10`) and colors (`Black, White`), and the system automatically generates all SKU combinations with initial stock.
   - Quick stock adjustments (+ / -) directly from the inventory table.
   - Low-stock filter toggle to quickly see items that need reordering.

6. **Order History & Returns/Refunds**
   - View past transactions and customer receipts.
   - Reprint any previous receipt anytime.
   - 1-click **Refund** button that automatically restores inventory stock.

7. **Store Analytics & Valuation**
   - Today's revenue, order count, and total pairs sold.
   - Full inventory valuation (Total pairs in stock, retail value, and cost value).
   - Top 5 best selling shoe models by volume and revenue.

---

## 🚀 How to Run

### Method 1: Double-Click Launcher (Windows)
Double-click `start_pos.bat` in the project folder.

### Method 2: Python Command Line
Open PowerShell or Command Prompt in `shoe-shop-pos` and run:

```bash
& "C:\Users\Hassan Bukhari\AppData\Local\Programs\Python\Python312\python.exe" run.py
```
Or if Python is in your PATH:
```bash
python run.py
```

Then open your browser to: **http://127.0.0.1:8000**
