export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
export type ProductStatus = "active" | "inactive" | "discontinued";

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  used: number;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  icon?: string;
  color?: string;
  productCount: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  nameEn?: string;
  description?: string;
  category: Category;
  price: number;
  cost: number;
  unit: string;
  stockStatus: StockStatus;
  status: ProductStatus;
  image?: string;
  supplier?: Supplier;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  warehouses: WarehouseStock[];
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WarehouseStock {
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reserved: number;
  available: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: "in" | "out" | "transfer" | "adjustment" | "sale";
  quantity: number;
  fromWarehouse?: string;
  toWarehouse?: string;
  reason: string;
  reference?: string;
  user: string;
  timestamp: Date;
  notes?: string;
  createdAt: Date;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  alertType: "low-stock" | "out-of-stock" | "expiring" | "overstock";
  severity: "low" | "medium" | "high";
  currentStock: number;
  threshold: number;
  warehouseId?: string;
  createdAt: Date;
  acknowledged: boolean;
}

export interface InventoryFilter {
  search?: string;
  category?: string;
  warehouse?: string;
  stockStatus?: StockStatus;
  productStatus?: ProductStatus;
  supplier?: string;
}

export interface InventoryStats {
  totalProducts: number;
  activeProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  totalCost: number;
  warehouses: number;
  alerts: number;
}
