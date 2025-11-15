export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl?: string;
  isCustomizable: boolean;
  isActive: boolean;
  isAvailable: boolean;
  sku?: string;
  barcode?: string;
  warehouseStock?: WarehouseStock[];
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  count: number;
  icon?: string;
  color?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
  modifiers?: ProductModifier[];
  specialInstructions?: string;
  forKitchen?: boolean;
}

// Product Customization
export type ModifierCategory = "size" | "addon" | "variation" | "special";

export interface ProductModifier {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  category?: ModifierCategory;
  isRequired?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  nameEn: string;
  category: ModifierCategory;
  options: ProductModifier[];
  minSelection: number;
  maxSelection: number;
  isRequired: boolean;
}

export type OrderType = "dineIn" | "takeaway" | "delivery";

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  orderType: OrderType;
  tableId?: string;
  customerId?: string;
}

// Table Management
export type TableStatus = "available" | "occupied" | "reserved" | "cleaning";

export interface Table {
  id: string;
  number: string;
  name: string;
  nameEn: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  currentBill?: number;
  guestCount?: number;
  startTime?: Date;
  zone?: string;
  position?: { x: number; y: number };
}

export interface TableZone {
  id: string;
  name: string;
  nameEn: string;
  tables: string[];
  color: string;
}

// Payment
export type PaymentMethod =
  | "cash"
  | "visa"
  | "mada"
  | "stcpay"
  | "tabby"
  | "tamara"
  | "applepay"
  | "googlepay"
  | "giftcard";

export interface Payment {
  id: string;
  method: PaymentMethod;
  amount: number;
  timestamp: Date;
  reference?: string;
  tip?: number;
}

export interface PaymentSplit {
  payments: Payment[];
  totalPaid: number;
  remaining: number;
  tip: number;
}

export interface ReceiptOptions {
  print: boolean;
  email?: string;
  sms?: string;
}

// Warehouse & Stock
export interface WarehouseStock {
  warehouseId: string;
  warehouseName: string;
  warehouseNameEn: string;
  zone: string;
  quantity: number;
  reserved: number;
  available: number;
  expiryDate?: Date;
  batchNumber?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  zones: WarehouseZone[];
  isActive: boolean;
}

export interface WarehouseZone {
  id: string;
  name: string;
  nameEn: string;
  type: "refrigerated" | "frozen" | "dry" | "beverages";
  capacity: number;
  currentStock: number;
}

// Discount
export interface Discount {
  id: string;
  name: string;
  nameEn: string;
  type: "percentage" | "fixed";
  value: number;
  icon?: string;
}

// Customer
export interface Customer {
  id: string;
  name: string;
  nameEn?: string;
  phone: string;
  email?: string;
  loyaltyPoints?: number;
  tier?: "bronze" | "silver" | "gold" | "platinum";
  totalOrders?: number;
  totalSpent?: number;
}

// Held Orders
export interface HeldOrder {
  id: string;
  orderNumber: string;
  timestamp: Date;
  itemsCount: number;
  total: number;
  customerName?: string;
  items: CartItem[];
  orderType: OrderType;
  selectedTable?: Table;
  appliedDiscount?: { discount: Discount; value: number };
}

// Returns & Exchanges
export type ReturnReason =
  | "wrong_item"
  | "quality_issue"
  | "customer_request"
  | "damaged"
  | "other";
export type RefundMethod = "original" | "cash" | "store_credit";

export interface ReturnItem {
  cartItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  reason: ReturnReason;
  notes?: string;
}

export interface ReturnTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  timestamp: Date;
  items: ReturnItem[];
  subtotal: number;
  tax: number;
  total: number;
  refundMethod: RefundMethod;
  requiresApproval: boolean;
  approvedBy?: string;
  status: "pending" | "approved" | "completed" | "rejected";
}

export interface ExchangeTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  timestamp: Date;
  returnedItems: ReturnItem[];
  newItems: CartItem[];
  refundAmount: number;
  additionalCharge: number;
  status: "pending" | "completed";
}

// Kitchen Display
export type KitchenOrderStatus = "pending" | "preparing" | "ready" | "served";
export type KitchenStation =
  | "grill"
  | "fryer"
  | "salad"
  | "dessert"
  | "drinks"
  | "general";

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  orderType: OrderType;
  tableNumber?: string;
  timestamp: Date;
  status: KitchenOrderStatus;
  station: KitchenStation;
  priority: number;
  preparationTime?: number;
  notes?: string;
}

// Split Bill
export interface BillSplit {
  id: string;
  type: "equal" | "by_item" | "by_amount" | "custom";
  parts: BillSplitPart[];
  totalAmount: number;
}

export interface BillSplitPart {
  id: string;
  items?: CartItem[];
  amount: number;
  paid: boolean;
  payment?: Payment;
}
