from database import get_connection

def seed_sample_data():
    conn = get_connection()
    cursor = conn.cursor()

    # Check if products already exist
    cursor.execute("SELECT COUNT(*) as cnt FROM products")
    if cursor.fetchone()["cnt"] > 0:
        conn.close()
        return

    shoes = [
        {
            "name": "Air Zoom Pegasus 40",
            "brand": "Nike",
            "category": "Running",
            "gender": "Men",
            "base_price": 130.00,
            "cost_price": 75.00,
            "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
            "description": "Responsive everyday running shoe with dual Zoom Air units and engineered mesh.",
            "variants": [
                {"size": "US 8 / EU 41", "color": "Crimson Red", "sku": "NIKE-PEG40-RD-41", "barcode": "7891001", "stock": 6},
                {"size": "US 9 / EU 42.5", "color": "Crimson Red", "sku": "NIKE-PEG40-RD-42", "barcode": "7891002", "stock": 8},
                {"size": "US 10 / EU 44", "color": "Crimson Red", "sku": "NIKE-PEG40-RD-44", "barcode": "7891003", "stock": 4},
                {"size": "US 8 / EU 41", "color": "Midnight Black", "sku": "NIKE-PEG40-BK-41", "barcode": "7891004", "stock": 10},
                {"size": "US 9 / EU 42.5", "color": "Midnight Black", "sku": "NIKE-PEG40-BK-42", "barcode": "7891005", "stock": 12},
                {"size": "US 10 / EU 44", "color": "Midnight Black", "sku": "NIKE-PEG40-BK-44", "barcode": "7891006", "stock": 2}, # Low stock
            ]
        },
        {
            "name": "Ultraboost Light",
            "brand": "Adidas",
            "category": "Sports",
            "gender": "Unisex",
            "base_price": 160.00,
            "cost_price": 95.00,
            "image_url": "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&auto=format&fit=crop&q=80",
            "description": "Epic energy return with 30% lighter Boost material and Primeknit+ upper.",
            "variants": [
                {"size": "US 8 / EU 41", "color": "Cloud White", "sku": "ADI-UB-WH-41", "barcode": "7892001", "stock": 7},
                {"size": "US 9 / EU 42.5", "color": "Cloud White", "sku": "ADI-UB-WH-42", "barcode": "7892002", "stock": 9},
                {"size": "US 10 / EU 44", "color": "Cloud White", "sku": "ADI-UB-WH-44", "barcode": "7892003", "stock": 1}, # Low stock
                {"size": "US 9 / EU 42.5", "color": "Core Black", "sku": "ADI-UB-BK-42", "barcode": "7892004", "stock": 5},
                {"size": "US 10 / EU 44", "color": "Core Black", "sku": "ADI-UB-BK-44", "barcode": "7892005", "stock": 8},
            ]
        },
        {
            "name": "Tilden Cap Leather Oxford",
            "brand": "Clarks",
            "category": "Formal",
            "gender": "Men",
            "base_price": 95.00,
            "cost_price": 50.00,
            "image_url": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80",
            "description": "Classic dress shoe made from rich full-grain leather with cushioned OrthoLite insole.",
            "variants": [
                {"size": "US 8 / EU 41", "color": "Dark Tan Brown", "sku": "CLK-TIL-TN-41", "barcode": "7893001", "stock": 5},
                {"size": "US 9 / EU 42.5", "color": "Dark Tan Brown", "sku": "CLK-TIL-TN-42", "barcode": "7893002", "stock": 6},
                {"size": "US 10 / EU 44", "color": "Dark Tan Brown", "sku": "CLK-TIL-TN-44", "barcode": "7893003", "stock": 3},
                {"size": "US 8 / EU 41", "color": "Glossy Black", "sku": "CLK-TIL-BK-41", "barcode": "7893004", "stock": 8},
                {"size": "US 9 / EU 42.5", "color": "Glossy Black", "sku": "CLK-TIL-BK-42", "barcode": "7893005", "stock": 7},
                {"size": "US 10 / EU 44", "color": "Glossy Black", "sku": "CLK-TIL-BK-44", "barcode": "7893006", "stock": 4},
            ]
        },
        {
            "name": "Smash V2 Leather Sneaker",
            "brand": "Puma",
            "category": "Casual",
            "gender": "Unisex",
            "base_price": 65.00,
            "cost_price": 35.00,
            "image_url": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
            "description": "Tennis-inspired silhouette with clean leather exterior and durable rubber outsole.",
            "variants": [
                {"size": "US 7 / EU 40", "color": "Puma White / Black", "sku": "PUM-SM-WB-40", "barcode": "7894001", "stock": 6},
                {"size": "US 8 / EU 41", "color": "Puma White / Black", "sku": "PUM-SM-WB-41", "barcode": "7894002", "stock": 10},
                {"size": "US 9 / EU 42.5", "color": "Puma White / Black", "sku": "PUM-SM-WB-42", "barcode": "7894003", "stock": 8},
                {"size": "US 8 / EU 41", "color": "All Black", "sku": "PUM-SM-BK-41", "barcode": "7894004", "stock": 4},
                {"size": "US 9 / EU 42.5", "color": "All Black", "sku": "PUM-SM-BK-42", "barcode": "7894005", "stock": 5},
            ]
        },
        {
            "name": "6-Inch Premium Waterproof Boot",
            "brand": "Timberland",
            "category": "Boots",
            "gender": "Unisex",
            "base_price": 198.00,
            "cost_price": 115.00,
            "image_url": "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80",
            "description": "The original yellow work boot with seam-sealed waterproof construction and PrimaLoft insulation.",
            "variants": [
                {"size": "US 8 / EU 41", "color": "Wheat Nubuck", "sku": "TMB-6IN-WH-41", "barcode": "7895001", "stock": 4},
                {"size": "US 9 / EU 42.5", "color": "Wheat Nubuck", "sku": "TMB-6IN-WH-42", "barcode": "7895002", "stock": 5},
                {"size": "US 10 / EU 44", "color": "Wheat Nubuck", "sku": "TMB-6IN-WH-44", "barcode": "7895003", "stock": 2}, # Low stock
                {"size": "US 9 / EU 42.5", "color": "Black Nubuck", "sku": "TMB-6IN-BK-42", "barcode": "7895004", "stock": 3},
            ]
        },
        {
            "name": "Arizona Birko-Flor Sandal",
            "brand": "Birkenstock",
            "category": "Sandals",
            "gender": "Unisex",
            "base_price": 110.00,
            "cost_price": 60.00,
            "image_url": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
            "description": "Two-strap slide with anatomical cork-latex footbed and soft suede lining.",
            "variants": [
                {"size": "US 7 / EU 40", "color": "Mocha Brown", "sku": "BRK-ARZ-MC-40", "barcode": "7896001", "stock": 8},
                {"size": "US 8 / EU 41", "color": "Mocha Brown", "sku": "BRK-ARZ-MC-41", "barcode": "7896002", "stock": 7},
                {"size": "US 9 / EU 42.5", "color": "Mocha Brown", "sku": "BRK-ARZ-MC-42", "barcode": "7896003", "stock": 9},
                {"size": "US 8 / EU 41", "color": "Black Matte", "sku": "BRK-ARZ-BK-41", "barcode": "7896004", "stock": 6},
                {"size": "US 9 / EU 42.5", "color": "Black Matte", "sku": "BRK-ARZ-BK-42", "barcode": "7896005", "stock": 5},
            ]
        }
    ]

    for shoe in shoes:
        cursor.execute("""
            INSERT INTO products (name, brand, category, gender, base_price, cost_price, image_url, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            shoe["name"], shoe["brand"], shoe["category"], shoe["gender"],
            shoe["base_price"], shoe["cost_price"], shoe["image_url"], shoe["description"]
        ))
        product_id = cursor.lastrowid

        for var in shoe["variants"]:
            cursor.execute("""
                INSERT INTO variants (product_id, sku, barcode, size, color, stock_quantity, price)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                product_id, var["sku"], var["barcode"], var["size"], var["color"], var["stock"], shoe["base_price"]
            ))

    # Add a sample customer
    cursor.execute("""
        INSERT INTO customers (name, phone, email, notes)
        VALUES (?, ?, ?, ?)
    """, ("Hassan Bukhari", "+1 (555) 234-5678", "hassan@example.com", "Regular VIP customer"))

    conn.commit()
    conn.close()
