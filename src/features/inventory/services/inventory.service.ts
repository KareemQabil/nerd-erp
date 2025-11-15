import type {
  Product,
  Category,
  Warehouse,
  StockMovement,
  StockAlert,
  InventoryStats,
  InventoryFilter,
  Supplier,
} from "../types/inventory.types";
import { SyncService } from "../../../core/services/sync.service";

// Mock data generators
const generateMockWarehouses = (): Warehouse[] => [
  {
    id: "wh-1",
    name: "المستودع الرئيسي",
    location: "الرياض - حي السليمانية",
    capacity: 10000,
    used: 7500,
    isDefault: true,
  },
  {
    id: "wh-2",
    name: "مستودع الفرع الثاني",
    location: "جدة - حي الزهراء",
    capacity: 5000,
    used: 3200,
    isDefault: false,
  },
  {
    id: "wh-3",
    name: "مستودع الطوارئ",
    location: "الرياض - حي النخيل",
    capacity: 2000,
    used: 800,
    isDefault: false,
  },
];

const generateMockCategories = (): Category[] => [
  {
    id: "cat-1",
    name: "المشروبات الساخنة",
    nameEn: "Hot Drinks",
    icon: "☕",
    color: "#ef4444",
    productCount: 24,
  },
  {
    id: "cat-2",
    name: "المشروبات الباردة",
    nameEn: "Cold Drinks",
    icon: "🥤",
    color: "#3b82f6",
    productCount: 18,
  },
  {
    id: "cat-3",
    name: "المخبوزات",
    nameEn: "Bakery",
    icon: "🥐",
    color: "#f59e0b",
    productCount: 32,
  },
  {
    id: "cat-4",
    name: "الحلويات",
    nameEn: "Desserts",
    icon: "🍰",
    color: "#ec4899",
    productCount: 28,
  },
  {
    id: "cat-5",
    name: "السلطات",
    nameEn: "Salads",
    icon: "🥗",
    color: "#10b981",
    productCount: 15,
  },
  {
    id: "cat-6",
    name: "الوجبات الرئيسية",
    nameEn: "Main Dishes",
    icon: "🍽️",
    color: "#8b5cf6",
    productCount: 42,
  },
];

const generateMockSuppliers = (): Supplier[] => [
  {
    id: "sup-1",
    name: "شركة البن العربي",
    contact: "أحمد محمد",
    phone: "0501234567",
    email: "info@arabcoffee.sa",
    address: "الرياض - حي الملز",
  },
  {
    id: "sup-2",
    name: "مخبز النخيل الذهبي",
    contact: "خالد السعيد",
    phone: "0509876543",
    email: "sales@goldenpalmbakey.sa",
    address: "جدة - حي الروضة",
  },
  {
    id: "sup-3",
    name: "مزارع الطازج",
    contact: "فهد العتيبي",
    phone: "0551234567",
    email: "fresh@farms.sa",
    address: "الخرج - المنطقة الزراعية",
  },
];

const generateMockProducts = (): Product[] => {
  const categories = generateMockCategories();
  const suppliers = generateMockSuppliers();
  const warehouses = generateMockWarehouses();

  const products: Product[] = [
    // Hot Drinks
    {
      id: "prod-1",
      sku: "HD-001",
      barcode: "6281234567890",
      name: "كابتشينو",
      nameEn: "Cappuccino",
      description: "قهوة إيطالية مع حليب مخفوق",
      category: categories[0],
      price: 15.0,
      cost: 6.0,
      unit: "كوب",
      stockStatus: "in-stock",
      status: "active",
      supplier: suppliers[0],
      minStock: 50,
      maxStock: 500,
      reorderPoint: 100,
      warehouses: [
        {
          warehouseId: "wh-1",
          warehouseName: "المستودع الرئيسي",
          quantity: 250,
          reserved: 20,
          available: 230,
        },
        {
          warehouseId: "wh-2",
          warehouseName: "مستودع الفرع الثاني",
          quantity: 150,
          reserved: 10,
          available: 140,
        },
      ],
      lastRestocked: new Date("2025-11-08"),
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-11-10"),
    },
    {
      id: "prod-2",
      sku: "HD-002",
      barcode: "6281234567891",
      name: "إسبريسو",
      nameEn: "Espresso",
      description: "قهوة إيطالية مركزة",
      category: categories[0],
      price: 12.0,
      cost: 4.5,
      unit: "كوب",
      stockStatus: "in-stock",
      status: "active",
      supplier: suppliers[0],
      minStock: 30,
      maxStock: 300,
      reorderPoint: 80,
      warehouses: [
        {
          warehouseId: "wh-1",
          warehouseName: "المستودع الرئيسي",
          quantity: 180,
          reserved: 15,
          available: 165,
        },
      ],
      lastRestocked: new Date("2025-11-09"),
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-11-10"),
    },
    {
      id: "prod-3",
      sku: "HD-003",
      barcode: "6281234567892",
      name: "لاتيه",
      nameEn: "Latte",
      description: "قهوة مع حليب ساخن",
      category: categories[0],
      price: 16.0,
      cost: 6.5,
      unit: "كوب",
      stockStatus: "low-stock",
      status: "active",
      supplier: suppliers[0],
      minStock: 50,
      maxStock: 400,
      reorderPoint: 100,
      warehouses: [
        {
          warehouseId: "wh-1",
          warehouseName: "المستودع الرئيسي",
          quantity: 75,
          reserved: 5,
          available: 70,
        },
        {
          warehouseId: "wh-2",
          warehouseName: "مستودع الفرع الثاني",
          quantity: 30,
          reserved: 0,
          available: 30,
        },
      ],
      lastRestocked: new Date("2025-11-05"),
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-11-10"),
    },
    // Cold Drinks
    {
      id: "prod-4",
      sku: "CD-001",
      barcode: "6281234567893",
      name: "عصير برتقال طازج",
      nameEn: "Fresh Orange Juice",
      description: "عصير برتقال طبيعي 100%",
      category: categories[1],
      price: 18.0,
      cost: 7.0,
      unit: "كوب",
      stockStatus: "in-stock",
      status: "active",
      supplier: suppliers[2],
      minStock: 40,
      maxStock: 300,
      reorderPoint: 80,
      warehouses: [
        {
          warehouseId: "wh-1",
          warehouseName: "المستودع الرئيسي",
          quantity: 200,
          reserved: 25,
          available: 175,
        },
      ],
      lastRestocked: new Date("2025-11-10"),
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-11-10"),
    },
    {
      id: "prod-5",
      sku: "CD-002",
      barcode: "6281234567894",
      name: "موهيتو",
      nameEn: "Mojito",
      description: "مشروب منعش بالنعناع والليمون",
      category: categories[1],
      price: 22.0,
      cost: 8.5,
      unit: "كوب",
      stockStatus: "in-stock",
      status: "active",
      supplier: suppliers[2],
      minStock: 30,
      maxStock: 250,
      reorderPoint: 70,
      warehouses: [
        {
          warehouseId: "wh-1",
          warehouseName: "المستودع الرئيسي",
          quantity: 150,
          reserved: 10,
          available: 140,
        },
        {
          warehouseId: "wh-2",
          warehouseName: "مستودع الفرع الثاني",
          quantity: 80,
          reserved: 5,
          available: 75,
        },
      ],
      lastRestocked: new Date("2025-11-09"),
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-11-10"),
    },
    // Bakery
    {
      id: "prod-6",
      sku: "BK-001",
      barcode: "6281234567895",
      name: "كروسان زبدة",
      nameEn: "Butter Croissant",
      description: "كروسان فرنسي بالزبدة",
      category: categories[2],
      price: 12.0,
      cost: 4.0,
      unit: "قطعة",
      stockStatus: "in-stock",
      status: "active",
      supplier: suppliers[1],
      minStock: 100,
      maxStock: 800,
      reorderPoint: 200,
      warehouses: [
        {
          warehouseId: "wh-1",
          warehouseName: "المستودع الرئيسي",
          quantity: 450,
          reserved: 30,
          available: 420,
        },
        {
          warehouseId: "wh-2",
          warehouseName: "مستودع الفرع الثاني",
          quantity: 200,
          reserved: 15,
          available: 185,
        },
      ],
      lastRestocked: new Date("2025-11-10"),
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-11-10"),
    },
    {
      id: "prod-7",
      sku: "BK-002",
      barcode: "6281234567896",
      name: "دونات شوكولاتة",
      nameEn: "Chocolate Donut",
      description: "دونات محشو بالشوكولاتة",
      category: categories[2],
      price: 10.0,
      cost: 3.5,
      unit: "قطعة",
      stockStatus: "out-of-stock",
      status: "active",
      supplier: suppliers[1],
      minStock: 80,
      maxStock: 600,
      reorderPoint: 150,
      warehouses: [
        {
          warehouseId: "wh-1",
          warehouseName: "المستودع الرئيسي",
          quantity: 0,
          reserved: 0,
          available: 0,
        },
        {
          warehouseId: "wh-2",
          warehouseName: "مستودع الفرع الثاني",
          quantity: 0,
          reserved: 0,
          available: 0,
        },
      ],
      lastRestocked: new Date("2025-11-07"),
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-11-10"),
    },
    {
      id: "prod-8",
      sku: "BK-003",
      barcode: "6281234567897",
      name: "مافن توت",
      nameEn: "Blueberry Muffin",
      description: "مافن طازج بالتوت الأزرق",
      category: categories[2],
      price: 14.0,
      cost: 5.0,
      unit: "قطعة",
      stockStatus: "low-stock",
      status: "active",
      supplier: suppliers[1],
      minStock: 60,
      maxStock: 500,
      reorderPoint: 120,
      warehouses: [
        {
          warehouseId: "wh-1",
          warehouseName: "المستودع الرئيسي",
          quantity: 85,
          reserved: 10,
          available: 75,
        },
      ],
      lastRestocked: new Date("2025-11-08"),
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-11-10"),
    },
    // Desserts
    {
      id: "prod-9",
      sku: "DS-001",
      barcode: "6281234567898",
      name: "تشيز كيك",
      nameEn: "Cheesecake",
      description: "كيك الجبن الكريمي",
      category: categories[3],
      price: 25.0,
      cost: 10.0,
      unit: "قطعة",
      stockStatus: "in-stock",
      status: "active",
      supplier: suppliers[1],
      minStock: 40,
      maxStock: 300,
      reorderPoint: 80,
      warehouses: [
        {
          warehouseId: "wh-1",
          warehouseName: "المستودع الرئيسي",
          quantity: 120,
          reserved: 8,
          available: 112,
        },
        {
          warehouseId: "wh-2",
          warehouseName: "مستودع الفرع الثاني",
          quantity: 60,
          reserved: 4,
          available: 56,
        },
      ],
      lastRestocked: new Date("2025-11-09"),
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-11-10"),
    },
    {
      id: "prod-10",
      sku: "DS-002",
      barcode: "6281234567899",
      name: "تيراميسو",
      nameEn: "Tiramisu",
      description: "حلى إيطالي بالقهوة",
      category: categories[3],
      price: 28.0,
      cost: 11.0,
      unit: "قطعة",
      stockStatus: "low-stock",
      status: "active",
      supplier: suppliers[1],
      minStock: 30,
      maxStock: 250,
      reorderPoint: 70,
      warehouses: [
        {
          warehouseId: "wh-1",
          warehouseName: "المستودع الرئيسي",
          quantity: 55,
          reserved: 5,
          available: 50,
        },
      ],
      lastRestocked: new Date("2025-11-07"),
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-11-10"),
    },
  ];

  return products;
};

const generateMockStockMovements = (): StockMovement[] => [
  {
    id: "mov-1",
    productId: "prod-1",
    productName: "كابتشينو",
    type: "in",
    quantity: 100,
    toWarehouse: "wh-1",
    reason: "شراء جديد",
    reference: "PO-2025-001",
    user: "أحمد محمد",
    timestamp: new Date("2025-11-08T10:30:00"),
    notes: "دفعة جديدة من المورد",
  },
  {
    id: "mov-2",
    productId: "prod-1",
    productName: "كابتشينو",
    type: "out",
    quantity: 25,
    fromWarehouse: "wh-1",
    reason: "مبيعات",
    user: "فاطمة السعيد",
    timestamp: new Date("2025-11-09T14:20:00"),
  },
  {
    id: "mov-3",
    productId: "prod-3",
    productName: "لاتيه",
    type: "transfer",
    quantity: 50,
    fromWarehouse: "wh-1",
    toWarehouse: "wh-2",
    reason: "نقل بين المستودعات",
    reference: "TR-2025-001",
    user: "خالد العتيبي",
    timestamp: new Date("2025-11-09T16:00:00"),
    notes: "لتغطية احتياج الفرع الثاني",
  },
  {
    id: "mov-4",
    productId: "prod-7",
    productName: "دونات شوكولاتة",
    type: "out",
    quantity: 120,
    fromWarehouse: "wh-1",
    reason: "مبيعات",
    user: "سارة أحمد",
    timestamp: new Date("2025-11-10T09:15:00"),
  },
  {
    id: "mov-5",
    productId: "prod-4",
    productName: "عصير برتقال طازج",
    type: "in",
    quantity: 80,
    toWarehouse: "wh-1",
    reason: "شراء جديد",
    reference: "PO-2025-002",
    user: "أحمد محمد",
    timestamp: new Date("2025-11-10T11:00:00"),
  },
];

const generateMockStockAlerts = (): StockAlert[] => [
  {
    id: "alert-1",
    productId: "prod-3",
    productName: "لاتيه",
    alertType: "low-stock",
    severity: "medium",
    currentStock: 105,
    threshold: 100,
    warehouseId: "wh-1",
    createdAt: new Date("2025-11-10T08:00:00"),
    acknowledged: false,
  },
  {
    id: "alert-2",
    productId: "prod-7",
    productName: "دونات شوكولاتة",
    alertType: "out-of-stock",
    severity: "high",
    currentStock: 0,
    threshold: 150,
    warehouseId: "wh-1",
    createdAt: new Date("2025-11-10T09:30:00"),
    acknowledged: false,
  },
  {
    id: "alert-3",
    productId: "prod-8",
    productName: "مافن توت",
    alertType: "low-stock",
    severity: "medium",
    currentStock: 85,
    threshold: 120,
    warehouseId: "wh-1",
    createdAt: new Date("2025-11-10T10:00:00"),
    acknowledged: false,
  },
  {
    id: "alert-4",
    productId: "prod-10",
    productName: "تيراميسو",
    alertType: "low-stock",
    severity: "medium",
    currentStock: 55,
    threshold: 70,
    warehouseId: "wh-1",
    createdAt: new Date("2025-11-10T10:15:00"),
    acknowledged: false,
  },
];

// Service class
export class InventoryService {
  static async getProducts(filter?: InventoryFilter): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let products = generateMockProducts();

    if (filter) {
      if (filter.search) {
        const search = filter.search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.nameEn?.toLowerCase().includes(search) ||
            p.sku.toLowerCase().includes(search) ||
            p.barcode?.toLowerCase().includes(search)
        );
      }

      if (filter.category) {
        products = products.filter((p) => p.category.id === filter.category);
      }

      if (filter.warehouse) {
        products = products.filter((p) =>
          p.warehouses.some((w) => w.warehouseId === filter.warehouse)
        );
      }

      if (filter.stockStatus) {
        products = products.filter((p) => p.stockStatus === filter.stockStatus);
      }

      if (filter.productStatus) {
        products = products.filter((p) => p.status === filter.productStatus);
      }

      if (filter.supplier) {
        products = products.filter((p) => p.supplier?.id === filter.supplier);
      }
    }

    return products;
  }

  static async getProductById(id: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const products = generateMockProducts();
    return products.find((p) => p.id === id) || null;
  }

  static async getCategories(): Promise<Category[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateMockCategories();
  }

  static async getWarehouses(): Promise<Warehouse[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateMockWarehouses();
  }

  static async getSuppliers(): Promise<Supplier[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateMockSuppliers();
  }

  static async getStockMovements(productId?: string): Promise<StockMovement[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    let movements = generateMockStockMovements();

    // Get synced movements from POS sales
    const syncedMovements = await SyncService.getInventoryMovements(productId);
    movements = [...movements, ...syncedMovements];

    if (productId) {
      movements = movements.filter((m) => m.productId === productId);
    }

    return movements.sort((a, b) => {
      const aTime = a.timestamp?.getTime() ?? 0;
      const bTime = b.timestamp?.getTime() ?? 0;
      return bTime - aTime;
    });
  }

  static async getStockAlerts(): Promise<StockAlert[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateMockStockAlerts().sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  static async getInventoryStats(): Promise<InventoryStats> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const products = generateMockProducts();
    const warehouses = generateMockWarehouses();
    const alerts = generateMockStockAlerts();

    return {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.status === "active").length,
      inStock: products.filter((p) => p.stockStatus === "in-stock").length,
      lowStock: products.filter((p) => p.stockStatus === "low-stock").length,
      outOfStock: products.filter((p) => p.stockStatus === "out-of-stock")
        .length,
      totalValue: products.reduce(
        (sum, p) => sum + p.price * this.getTotalStock(p),
        0
      ),
      totalCost: products.reduce(
        (sum, p) => sum + p.cost * this.getTotalStock(p),
        0
      ),
      warehouses: warehouses.length,
      alerts: alerts.filter((a) => !a.acknowledged).length,
    };
  }

  private static getTotalStock(product: Product): number {
    return product.warehouses.reduce((sum, w) => sum + w.quantity, 0);
  }

  static async acknowledgeAlert(alertId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // In real app, update alert status in backend
    console.log("Alert acknowledged:", alertId);
  }

  static async adjustStock(
    productId: string,
    warehouseId: string,
    quantity: number,
    reason: string
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, create stock movement and update product stock
    console.log("Stock adjusted:", {
      productId,
      warehouseId,
      quantity,
      reason,
    });
  }

  static async transferStock(
    productId: string,
    fromWarehouse: string,
    toWarehouse: string,
    quantity: number
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, create transfer movement and update both warehouses
    console.log("Stock transferred:", {
      productId,
      fromWarehouse,
      toWarehouse,
      quantity,
    });
  }

  // Warehouse Management Methods
  static async createWarehouse(
    warehouse: Partial<Warehouse>
  ): Promise<Warehouse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, save to backend
    const newWarehouse: Warehouse = {
      id: `wh-${Date.now()}`,
      name: warehouse.name!,
      location: warehouse.location!,
      capacity: warehouse.capacity!,
      used: 0,
      isDefault: warehouse.isDefault || false,
    };
    console.log("Warehouse created:", newWarehouse);
    return newWarehouse;
  }

  static async updateWarehouse(
    warehouse: Partial<Warehouse>
  ): Promise<Warehouse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, update in backend
    const updatedWarehouse: Warehouse = {
      id: warehouse.id!,
      name: warehouse.name!,
      location: warehouse.location!,
      capacity: warehouse.capacity!,
      used: warehouse.used || 0,
      isDefault: warehouse.isDefault || false,
    };
    console.log("Warehouse updated:", updatedWarehouse);
    return updatedWarehouse;
  }

  static async deleteWarehouse(warehouseId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, delete from backend
    console.log("Warehouse deleted:", warehouseId);
  }

  static async transferStockWithNotes(
    productId: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    quantity: number,
    notes: string
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, create transfer movement with notes
    console.log("Stock transferred with notes:", {
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity,
      notes,
    });
  }

  // Product Management Methods
  static async createProduct(product: Partial<Product>): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, save to backend
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: product.sku!,
      barcode: product.barcode,
      name: product.name!,
      nameEn: product.nameEn,
      description: product.description,
      category: product.category!,
      price: product.price!,
      cost: product.cost!,
      unit: product.unit!,
      stockStatus: "in-stock",
      status: product.status || "active",
      supplier: product.supplier,
      minStock: product.minStock || 10,
      maxStock: product.maxStock || 1000,
      reorderPoint: product.reorderPoint || 50,
      warehouses: product.warehouses || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log("Product created:", newProduct);
    return newProduct;
  }

  static async updateProduct(product: Partial<Product>): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, update in backend
    const updatedProduct: Product = {
      id: product.id!,
      sku: product.sku!,
      barcode: product.barcode,
      name: product.name!,
      nameEn: product.nameEn,
      description: product.description,
      category: product.category!,
      price: product.price!,
      cost: product.cost!,
      unit: product.unit!,
      stockStatus: product.stockStatus || "in-stock",
      status: product.status || "active",
      supplier: product.supplier,
      minStock: product.minStock || 10,
      maxStock: product.maxStock || 1000,
      reorderPoint: product.reorderPoint || 50,
      warehouses: product.warehouses || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log("Product updated:", updatedProduct);
    return updatedProduct;
  }

  static async deleteProduct(productId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, delete from backend
    console.log("Product deleted:", productId);
  }
}
