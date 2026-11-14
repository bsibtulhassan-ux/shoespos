import sqlite3
import os
import hashlib
import secrets
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

DB_PATH = Path(os.environ.get("DATABASE_PATH", Path(__file__).resolve().parent / "shoeshop.db"))

def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return key.hex(), salt

def verify_password(password: str, salt: str, expected_hash: str) -> bool:
    hashed, _ = hash_password(password, salt)
    return secrets.compare_digest(hashed, expected_hash)

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Users & Security Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'cashier',
        pin_code TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Active Auth Sessions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # Settings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );
    """)

    # Products table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        category TEXT NOT NULL,
        gender TEXT DEFAULT 'Unisex',
        base_price REAL NOT NULL,
        cost_price REAL DEFAULT 0.0,
        image_url TEXT DEFAULT '',
        description TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Variants table (size, color, barcode, stock)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS variants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        barcode TEXT NOT NULL,
        size TEXT NOT NULL,
        color TEXT NOT NULL,
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        price REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
    """)

    # Customers table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT UNIQUE,
        email TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Orders table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_no TEXT UNIQUE NOT NULL,
        customer_id INTEGER,
        customer_name TEXT DEFAULT 'Walk-in Customer',
        customer_phone TEXT DEFAULT '',
        cashier_name TEXT DEFAULT 'Cashier',
        subtotal REAL NOT NULL,
        discount_type TEXT DEFAULT 'none',
        discount_val REAL DEFAULT 0.0,
        discount_amount REAL DEFAULT 0.0,
        tax_percent REAL DEFAULT 0.0,
        tax_amount REAL DEFAULT 0.0,
        total_amount REAL NOT NULL,
        payment_method TEXT NOT NULL,
        amount_tendered REAL DEFAULT 0.0,
        change_amount REAL DEFAULT 0.0,
        notes TEXT DEFAULT '',
        status TEXT DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
    );
    """)

    # Order items table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER,
        variant_id INTEGER,
        product_name TEXT NOT NULL,
        brand TEXT NOT NULL,
        size TEXT NOT NULL,
        color TEXT NOT NULL,
        sku TEXT NOT NULL,
        unit_price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        line_total REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
    """)

    # Auto-migration: ensure cashier_name and udhaar columns exist in existing database
    cursor.execute("PRAGMA table_info(orders)")
    order_cols = [row["name"] for row in cursor.fetchall()]
    if "cashier_name" not in order_cols:
        cursor.execute("ALTER TABLE orders ADD COLUMN cashier_name TEXT DEFAULT 'Cashier'")
    if "udhaar_amount" not in order_cols:
        cursor.execute("ALTER TABLE orders ADD COLUMN udhaar_amount REAL DEFAULT 0.0")
    if "udhaar_paid" not in order_cols:
        cursor.execute("ALTER TABLE orders ADD COLUMN udhaar_paid REAL DEFAULT 0.0")

    # Initialize default settings if empty (Tax set to 0.0% permanently)
    default_settings = {
        "store_name": "SoleMate Shoe Store & Footwear",
        "store_address": "123 Commercial Plaza, Main Boulevard",
        "store_phone": "+1 (555) 789-2436",
        "currency_symbol": "PKR",
        "tax_rate": "0.0",
        "receipt_footer": "Thank you for shopping with us! Shoes can be exchanged within 7 days in unworn condition with box & receipt."
    }

    for key, val in default_settings.items():
        cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", (key, val))

    # Always enforce 0.0% tax
    cursor.execute("UPDATE settings SET value = '0.0' WHERE key = 'tax_rate'")

    # Initialize Default Users (Admin & Cashier) if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM users")
    if cursor.fetchone()["cnt"] == 0:
        admin_hash, admin_salt = hash_password("admin123")
        cursor.execute("""
            INSERT INTO users (username, password_hash, salt, full_name, role, pin_code)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ("admin", admin_hash, admin_salt, "Store Manager (Admin)", "admin", "1234"))

        cashier_hash, cashier_salt = hash_password("cashier123")
        cursor.execute("""
            INSERT INTO users (username, password_hash, salt, full_name, role, pin_code)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ("cashier", cashier_hash, cashier_salt, "Counter Staff", "cashier", "0000"))

    conn.commit()
    conn.close()

def get_settings() -> Dict[str, str]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT key, value FROM settings")
    rows = cursor.fetchall()
    conn.close()
    return {row["key"]: row["value"] for row in rows}

def update_setting(key: str, value: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (key, value))
    conn.commit()
    conn.close()
