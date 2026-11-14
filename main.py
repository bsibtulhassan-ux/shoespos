from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import List, Optional
import datetime
import random
import string
import secrets
import socket

from database import (
    init_db, get_connection, get_settings, update_setting,
    hash_password, verify_password
)
from models import (
    LoginRequest, PinLoginRequest, UserCreate,
    ProductCreate, ProductUpdate, VariantCreate, VariantStockUpdate,
    OrderCreateRequest, CustomerCreate, SettingsUpdate
)
from seed_data import seed_sample_data

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="SoleMate - Shoe Shop POS & Inventory System", version="2.5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    seed_sample_data()

# Helper: Get Local Network IP for Android App connection
def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

# Helper: Auth Dependency (Optional, defaults to Cashier if None)
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        return {"role": "cashier", "full_name": "Counter Staff", "username": "cashier"}
    token = authorization.replace("Bearer ", "").strip()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sessions WHERE token = ?", (token,))
    session = cursor.fetchone()
    conn.close()
    if session:
        return dict(session)
    return {"role": "cashier", "full_name": "Counter Staff", "username": "cashier"}

def ensure_user_dict(u) -> dict:
    if isinstance(u, dict):
        return u
    return {"role": "cashier", "full_name": "Counter Staff", "username": "cashier"}

# ----------------- Auth & Security Endpoints -----------------
@app.post("/api/auth/admin-pin")
def verify_admin_pin(req: PinLoginRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE role = 'admin' AND pin_code = ? AND is_active = 1", (req.pin.strip(),))
    user = cursor.fetchone()

    if not user:
        conn.close()
        raise HTTPException(status_code=401, detail="Incorrect Admin PIN")

    token = secrets.token_hex(24)
    cursor.execute("""
        INSERT INTO sessions (token, user_id, username, full_name, role)
        VALUES (?, ?, ?, ?, ?)
    """, (token, user["id"], user["username"], user["full_name"], "admin"))
    conn.commit()
    conn.close()

    return {
        "token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "full_name": user["full_name"],
            "role": "admin"
        }
    }

@app.get("/api/auth/me")
def get_me(user: dict = Depends(get_current_user)):
    return user

@app.post("/api/auth/logout")
def logout(authorization: Optional[str] = Header(None)):
    if authorization:
        token = authorization.replace("Bearer ", "").strip()
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()
        conn.close()
    return {"message": "Logged out to counter mode"}

@app.get("/api/network-ip")
def api_network_ip():
    ip = get_local_ip()
    return {
        "local_ip": ip,
        "android_url": f"http://{ip}:8000"
    }

# ----------------- Settings Endpoints -----------------
@app.get("/api/settings")
def api_get_settings():
    return get_settings()

@app.put("/api/settings")
def api_update_settings(settings: SettingsUpdate, user: dict = Depends(get_current_user)):
    user = ensure_user_dict(user)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin authorization required to change store settings")

    for key, value in settings.dict(exclude_unset=True).items():
        if value is not None:
            update_setting(key, str(value))
    return {"message": "Settings updated successfully", "settings": get_settings()}

# ----------------- Products & Variants Endpoints -----------------
@app.get("/api/products")
def get_products(q: Optional[str] = None, category: Optional[str] = None, low_stock_only: bool = False, user: dict = Depends(get_current_user)):
    user = ensure_user_dict(user)
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT p.*,
               COUNT(v.id) as variant_count,
               COALESCE(SUM(v.stock_quantity), 0) as total_stock
        FROM products p
        LEFT JOIN variants v ON p.id = v.product_id
        WHERE 1=1
    """
    params = []

    if category and category.lower() != "all":
        query += " AND LOWER(p.category) = LOWER(?)"
        params.append(category)

    if q:
        query += """ AND (
            LOWER(p.name) LIKE ? OR
            LOWER(p.brand) LIKE ? OR
            LOWER(p.category) LIKE ? OR
            p.id IN (
                SELECT product_id FROM variants
                WHERE LOWER(sku) LIKE ? OR LOWER(barcode) LIKE ? OR LOWER(color) LIKE ? OR LOWER(size) LIKE ?
            )
        )"""
        term = f"%{q.lower()}%"
        params.extend([term, term, term, term, term, term, term])

    query += " GROUP BY p.id ORDER BY p.id DESC"

    cursor.execute(query, params)
    products_rows = cursor.fetchall()

    is_admin = user.get("role") == "admin"

    products = []
    for prow in products_rows:
        pid = prow["id"]
        v_query = "SELECT * FROM variants WHERE product_id = ? ORDER BY id ASC"
        cursor.execute(v_query, (pid,))
        v_rows = cursor.fetchall()
        variants = [dict(v) for v in v_rows]

        p_dict = dict(prow)
        p_dict["variants"] = variants

        # Cost price is hidden from regular counter staff
        if not is_admin:
            p_dict["cost_price"] = 0.0

        if low_stock_only:
            has_low = any(v["stock_quantity"] <= 3 for v in variants)
            if not has_low:
                continue

        products.append(p_dict)

    conn.close()
    return products

@app.post("/api/products")
def create_product(product: ProductCreate, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin authorization required to add new shoe models")

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO products (name, brand, category, gender, base_price, cost_price, image_url, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            product.name, product.brand, product.category, product.gender,
            product.base_price, product.cost_price, product.image_url or "", product.description or ""
        ))
        product_id = cursor.lastrowid

        for v in product.variants:
            sku = v.sku or f"{product.brand[:3].upper()}-{product.name[:3].upper()}-{v.color[:2].upper()}-{v.size.replace(' ', '')}"
            barcode = v.barcode or f"{random.randint(1000000, 9999999)}"
            price = v.price if v.price is not None else product.base_price

            cursor.execute("""
                INSERT INTO variants (product_id, sku, barcode, size, color, stock_quantity, price)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (product_id, sku, barcode, v.size, v.color, v.stock_quantity, price))

        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))

    conn.close()
    return {"message": "Product created successfully", "product_id": product_id}

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin authorization required to delete shoes")

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    return {"message": "Product deleted successfully"}

@app.put("/api/variants/{variant_id}/stock")
def update_variant_stock(variant_id: int, update: VariantStockUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT stock_quantity FROM variants WHERE id = ?", (variant_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Variant not found")

    new_stock = max(0, row["stock_quantity"] + update.adjustment)
    cursor.execute("UPDATE variants SET stock_quantity = ? WHERE id = ?", (new_stock, variant_id))
    conn.commit()
    conn.close()
    return {"message": "Stock updated", "new_stock": new_stock}

# ----------------- Customers Endpoints -----------------
@app.get("/api/customers")
def get_customers(q: Optional[str] = None):
    conn = get_connection()
    cursor = conn.cursor()
    if q:
        term = f"%{q.lower()}%"
        cursor.execute("SELECT * FROM customers WHERE LOWER(name) LIKE ? OR phone LIKE ? ORDER BY name ASC", (term, term))
    else:
        cursor.execute("SELECT * FROM customers ORDER BY id DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/customers")
def create_customer(customer: CustomerCreate):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO customers (name, phone, email, notes)
            VALUES (?, ?, ?, ?)
        """, (customer.name, customer.phone, customer.email or "", customer.notes or ""))
        conn.commit()
        cust_id = cursor.lastrowid
    except Exception:
        conn.close()
        raise HTTPException(status_code=400, detail="Customer with this phone number already exists")
    conn.close()
    return {"message": "Customer created", "customer_id": cust_id}

# ----------------- POS Checkout & Orders Endpoints -----------------
@app.post("/api/orders")
def create_order(order_req: OrderCreateRequest, user: dict = Depends(get_current_user)):
    user = ensure_user_dict(user)
    conn = get_connection()
    cursor = conn.cursor()

    if not order_req.items:
        conn.close()
        raise HTTPException(status_code=400, detail="Cart is empty")

    cashier_display = user.get("full_name") or order_req.cashier_name or "Counter Staff"

    order_items_data = []
    subtotal = 0.0

    for item in order_req.items:
        cursor.execute("""
            SELECT v.*, p.name as product_name, p.brand
            FROM variants v
            JOIN products p ON v.product_id = p.id
            WHERE v.id = ?
        """, (item.variant_id,))
        var_row = cursor.fetchone()

        if not var_row:
            conn.close()
            raise HTTPException(status_code=404, detail=f"Variant #{item.variant_id} not found")

        if var_row["stock_quantity"] < item.quantity:
            conn.close()
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {var_row['product_name']} ({var_row['size']}, {var_row['color']}). Only {var_row['stock_quantity']} pairs in stock."
            )

        line_total = item.unit_price * item.quantity
        subtotal += line_total
        order_items_data.append({
            "variant_id": item.variant_id,
            "product_id": var_row["product_id"],
            "product_name": var_row["product_name"],
            "brand": var_row["brand"],
            "size": var_row["size"],
            "color": var_row["color"],
            "sku": var_row["sku"],
            "unit_price": item.unit_price,
            "quantity": item.quantity,
            "line_total": line_total
        })

    # Discount
    discount_amount = 0.0
    if order_req.discount_type == "percent" and order_req.discount_val > 0:
        discount_amount = round(subtotal * (order_req.discount_val / 100.0), 2)
    elif order_req.discount_type == "fixed" and order_req.discount_val > 0:
        discount_amount = min(subtotal, round(order_req.discount_val, 2))

    after_discount = max(0.0, subtotal - discount_amount)

    # Tax (Permanently removed / 0% Tax-Free)
    tax_amount = 0.0
    order_req.tax_percent = 0.0
    total_amount = round(after_discount, 2)

    # Change & Udhaar Handling
    is_udhaar = order_req.is_udhaar or order_req.payment_method == "Udhaar"
    udhaar_amount = 0.0
    change_amount = 0.0
    status = "completed"

    if is_udhaar:
        payment_method = "Udhaar"
        advance = min(total_amount, max(0.0, order_req.amount_tendered or 0.0))
        udhaar_amount = round(total_amount - advance, 2)
        status = "pending_udhaar" if udhaar_amount > 0 else "completed"
        order_req.amount_tendered = advance
        change_amount = 0.0
        # Customer name is mandatory for Udhaar
        if not order_req.customer_name or order_req.customer_name.strip() in ["", "Walk-in Customer"]:
            conn.close()
            raise HTTPException(status_code=400, detail="Customer name is required for Udhaar / Khata entry.")
    elif order_req.payment_method == "Cash":
        payment_method = "Cash"
        if order_req.amount_tendered < total_amount:
            conn.close()
            raise HTTPException(
                status_code=400,
                detail=f"Cash tendered (${order_req.amount_tendered:.2f}) is less than total amount (${total_amount:.2f})"
            )
        change_amount = round(order_req.amount_tendered - total_amount, 2)
    else:
        payment_method = order_req.payment_method
        order_req.amount_tendered = total_amount
        change_amount = 0.0

    now = datetime.datetime.now()
    date_str = now.strftime("%Y%m%d")
    random_suffix = ''.join(random.choices(string.digits, k=4))
    invoice_no = f"INV-{date_str}-{random_suffix}"

    try:
        cursor.execute("""
            INSERT INTO orders (
                invoice_no, customer_id, customer_name, customer_phone, cashier_name,
                subtotal, discount_type, discount_val, discount_amount,
                tax_percent, tax_amount, total_amount, payment_method,
                amount_tendered, change_amount, notes, status,
                udhaar_amount, udhaar_paid
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            invoice_no, order_req.customer_id, order_req.customer_name.strip(), order_req.customer_phone or "", cashier_display,
            subtotal, order_req.discount_type, order_req.discount_val, discount_amount,
            order_req.tax_percent, tax_amount, total_amount, payment_method,
            order_req.amount_tendered, change_amount, order_req.notes or "", status,
            udhaar_amount, 0.0
        ))
        order_id = cursor.lastrowid

        for item in order_items_data:
            cursor.execute("""
                INSERT INTO order_items (
                    order_id, product_id, variant_id, product_name, brand,
                    size, color, sku, unit_price, quantity, line_total
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                order_id, item["product_id"], item["variant_id"], item["product_name"], item["brand"],
                item["size"], item["color"], item["sku"], item["unit_price"], item["quantity"], item["line_total"]
            ))

            cursor.execute("""
                UPDATE variants SET stock_quantity = stock_quantity - ? WHERE id = ?
            """, (item["quantity"], item["variant_id"]))

        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Transaction failed: {str(e)}")

    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    order_data = dict(cursor.fetchone())
    cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,))
    order_data["items"] = [dict(i) for i in cursor.fetchall()]

    conn.close()
    return order_data

@app.post("/api/orders/{order_id}/settle-udhaar")
def settle_udhaar_order(order_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    order = cursor.fetchone()
    if not order:
        conn.close()
        raise HTTPException(status_code=404, detail="Order not found")

    cursor.execute("""
        UPDATE orders
        SET status = 'completed',
            udhaar_paid = udhaar_amount,
            notes = CASE WHEN notes = '' THEN 'Udhaar Cleared / Wusool' ELSE notes || ' [Udhaar Cleared]' END
        WHERE id = ?
    """, (order_id,))
    conn.commit()

    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    updated_order = dict(cursor.fetchone())
    conn.close()
    return {"message": "Udhaar settled successfully", "order": updated_order}

@app.get("/api/orders")
def get_orders(q: Optional[str] = None, limit: int = 50):
    conn = get_connection()
    cursor = conn.cursor()

    if q:
        term = f"%{q.lower()}%"
        cursor.execute("""
            SELECT * FROM orders
            WHERE LOWER(invoice_no) LIKE ? OR LOWER(customer_name) LIKE ? OR customer_phone LIKE ?
            ORDER BY id DESC LIMIT ?
        """, (term, term, term, limit))
    else:
        cursor.execute("SELECT * FROM orders ORDER BY id DESC LIMIT ?", (limit,))

    orders = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return orders

@app.get("/api/orders/{order_id}")
def get_order_detail(order_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    order_row = cursor.fetchone()
    if not order_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Order not found")

    order_dict = dict(order_row)
    cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,))
    order_dict["items"] = [dict(i) for i in cursor.fetchall()]

    conn.close()
    return order_dict

@app.post("/api/orders/{order_id}/refund")
def refund_order(order_id: int, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Refund authorization required: Only Admins can issue refunds")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    order = cursor.fetchone()
    if not order:
        conn.close()
        raise HTTPException(status_code=404, detail="Order not found")

    if order["status"] == "refunded":
        conn.close()
        raise HTTPException(status_code=400, detail="Order is already refunded")

    cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,))
    items = cursor.fetchall()

    for item in items:
        cursor.execute("""
            UPDATE variants SET stock_quantity = stock_quantity + ? WHERE id = ?
        """, (item["quantity"], item["variant_id"]))

    cursor.execute("UPDATE orders SET status = 'refunded' WHERE id = ?", (order_id,))
    conn.commit()
    conn.close()
    return {"message": "Order refunded and stock restored"}

# ----------------- Analytics & Stats (Admin Only) -----------------
@app.get("/api/stats")
def get_stats(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Analytics are restricted to Store Admins")

    conn = get_connection()
    cursor = conn.cursor()

    today_str = datetime.date.today().strftime("%Y-%m-%d")

    cursor.execute("""
        SELECT
            COALESCE(SUM(total_amount), 0) as today_sales,
            COUNT(*) as today_orders
        FROM orders
        WHERE DATE(created_at) = DATE(?) AND status = 'completed'
    """, (today_str,))
    today_res = cursor.fetchone()

    cursor.execute("""
        SELECT COALESCE(SUM(oi.quantity), 0) as pairs_sold_today
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE DATE(o.created_at) = DATE(?) AND o.status = 'completed'
    """, (today_str,))
    pairs_today_res = cursor.fetchone()

    cursor.execute("""
        SELECT
            COALESCE(SUM(v.stock_quantity), 0) as total_pairs_in_stock,
            COALESCE(SUM(v.stock_quantity * v.price), 0) as total_retail_value,
            COALESCE(SUM(v.stock_quantity * p.cost_price), 0) as total_cost_value
        FROM variants v
        JOIN products p ON v.product_id = p.id
    """)
    stock_res = cursor.fetchone()

    cursor.execute("""
        SELECT COUNT(*) as low_stock_count
        FROM variants
        WHERE stock_quantity <= 3
    """)
    low_stock_res = cursor.fetchone()

    cursor.execute("""
        SELECT oi.product_name, oi.brand, SUM(oi.quantity) as total_sold, SUM(oi.line_total) as revenue
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = 'completed'
        GROUP BY oi.product_id
        ORDER BY total_sold DESC
        LIMIT 5
    """)
    top_selling = [dict(r) for r in cursor.fetchall()]

    cursor.execute("""
        SELECT COALESCE(SUM(udhaar_amount - udhaar_paid), 0) as total_udhaar_pending
        FROM orders
        WHERE status = 'pending_udhaar'
    """)
    udhaar_res = cursor.fetchone()

    conn.close()

    return {
        "today_sales": round(today_res["today_sales"], 2),
        "today_orders": today_res["today_orders"],
        "pairs_sold_today": pairs_today_res["pairs_sold_today"],
        "total_pairs_in_stock": stock_res["total_pairs_in_stock"],
        "total_retail_value": round(stock_res["total_retail_value"], 2),
        "total_cost_value": round(stock_res["total_cost_value"], 2),
        "low_stock_count": low_stock_res["low_stock_count"],
        "total_udhaar_pending": round(udhaar_res["total_udhaar_pending"], 2),
        "top_selling": top_selling
    }

# ----------------- Static Frontend & PWA -----------------
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

@app.get("/")
def serve_index():
    return FileResponse(str(BASE_DIR / "static" / "index.html"))

@app.get("/manifest.json")
def serve_manifest():
    return FileResponse(str(BASE_DIR / "static" / "manifest.json"))

@app.get("/sw.js")
def serve_sw():
    return FileResponse(str(BASE_DIR / "static" / "sw.js"), media_type="application/javascript")

if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting SoleMate POS server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
