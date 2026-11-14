from pydantic import BaseModel, Field
from typing import List, Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class PinLoginRequest(BaseModel):
    pin: str

class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str
    role: str = "cashier" # "admin" or "cashier"
    pin_code: str = "1234"

class VariantCreate(BaseModel):
    size: str
    color: str
    sku: Optional[str] = None
    barcode: Optional[str] = None
    stock_quantity: int = Field(ge=0, default=5)
    price: Optional[float] = None

class ProductCreate(BaseModel):
    name: str
    brand: str
    category: str
    gender: str = "Unisex"
    base_price: float = Field(gt=0)
    cost_price: float = Field(ge=0, default=0.0)
    image_url: Optional[str] = ""
    description: Optional[str] = ""
    variants: Optional[List[VariantCreate]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    gender: Optional[str] = None
    base_price: Optional[float] = None
    cost_price: Optional[float] = None
    image_url: Optional[str] = None
    description: Optional[str] = None

class VariantStockUpdate(BaseModel):
    variant_id: int
    adjustment: int  # can be positive or negative
    reason: Optional[str] = "Manual Adjustment"

class CustomerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    notes: Optional[str] = ""

class OrderItemRequest(BaseModel):
    variant_id: int
    quantity: int = Field(gt=0)
    unit_price: float

class OrderCreateRequest(BaseModel):
    customer_id: Optional[int] = None
    customer_name: Optional[str] = "Walk-in Customer"
    customer_phone: Optional[str] = ""
    cashier_name: Optional[str] = "Cashier"
    items: List[OrderItemRequest]
    discount_type: str = "none" # "none", "percent", "fixed"
    discount_val: float = 0.0
    tax_percent: float = 0.0
    payment_method: str = "Cash" # "Cash", "Card", "Digital Wallet", "Udhaar"
    amount_tendered: float = 0.0
    notes: Optional[str] = ""
    is_udhaar: bool = False
    udhaar_amount: float = 0.0

class SettingsUpdate(BaseModel):
    store_name: Optional[str] = None
    store_address: Optional[str] = None
    store_phone: Optional[str] = None
    currency_symbol: Optional[str] = None
    tax_rate: Optional[str] = None
    receipt_footer: Optional[str] = None
