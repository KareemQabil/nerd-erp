import type {
  Product,
  Category,
  Table,
  Discount,
  Customer,
  Warehouse,
  WarehouseStock,
  CartItem,
  ModifierGroup,
  ReturnTransaction,
  ReturnItem,
  ReturnReason,
  RefundMethod,
  ExchangeTransaction,
  KitchenOrder,
  KitchenOrderStatus,
  KitchenStation,
  BillSplit,
  BillSplitPart,
  Payment,
} from "../types/pos.types";

interface HeldOrder {
  id: string;
  orderNumber: string;
  timestamp: Date;
  itemsCount: number;
  total: number;
  customerName?: string;
  items: CartItem[];
  orderType: "takeaway" | "dineIn" | "delivery";
  selectedTable?: Table;
  appliedDiscount?: { discount: Discount; value: number };
}

const MOCK_CATEGORIES: Category[] = [
  { id: "all", name: "الكل", nameEn: "All", count: 8 },
  { id: "hot", name: "ساخن", nameEn: "Hot", count: 2 },
  { id: "cold", name: "بارد", nameEn: "Cold", count: 3 },
  { id: "bakery", name: "المخبوزات", nameEn: "Bakery", count: 1 },
  { id: "desserts", name: "الحلويات", nameEn: "Desserts", count: 1 },
  { id: "salads", name: "السلطات", nameEn: "Salads", count: 1 },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "بيبسي كولا",
    nameEn: "Pepsi Cola",
    price: 5.0,
    categoryId: "cold",
    stock: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop",
    isCustomizable: false,
    isActive: true,
    isAvailable: true,
  },
  {
    id: "2",
    name: "لاتيه كلاسيكي",
    nameEn: "Classic Latte",
    price: 15.0,
    categoryId: "hot",
    stock: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop",
    isCustomizable: true,
    isActive: true,
    isAvailable: true,
  },
  {
    id: "3",
    name: "إسبريسو مميز",
    nameEn: "Premium Espresso",
    price: 8.0,
    categoryId: "hot",
    stock: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop",
    isCustomizable: true,
    isActive: true,
    isAvailable: true,
  },
  {
    id: "4",
    name: "قهوة اليوم",
    nameEn: "Daily Brew Coffee",
    price: 10.0,
    categoryId: "hot",
    stock: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop",
    isCustomizable: true,
    isActive: true,
    isAvailable: true,
  },
  {
    id: "5",
    name: "مياه معدنية طبيعية",
    nameEn: "Natural Spring Water",
    price: 2.0,
    categoryId: "cold",
    stock: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop",
    isCustomizable: false,
    isActive: true,
    isAvailable: true,
  },
  {
    id: "6",
    name: "كرواسون بالجبنة",
    nameEn: "Cheese Croissant",
    price: 10.0,
    categoryId: "bakery",
    stock: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop",
    isCustomizable: false,
    isActive: true,
    isAvailable: false,
  },
  {
    id: "7",
    name: "كيكة العسل الطبيعي",
    nameEn: "Natural Honey Cake",
    price: 22.0,
    categoryId: "desserts",
    stock: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    isCustomizable: false,
    isActive: true,
    isAvailable: true,
  },
  {
    id: "8",
    name: "سلطة سيزر طازجة",
    nameEn: "Fresh Caesar Salad",
    price: 30.0,
    categoryId: "salads",
    stock: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop",
    isCustomizable: false,
    isActive: true,
    isAvailable: true,
  },
];

export class POSService {
  static async getCategories(): Promise<Category[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_CATEGORIES;
  }

  static async getProducts(categoryId?: string): Promise<Product[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!categoryId || categoryId === "all") {
      return MOCK_PRODUCTS;
    }

    return MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId);
  }

  static async getProductById(id: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_PRODUCTS.find((p) => p.id === id) || null;
  }

  static async searchProducts(query: string): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.nameEn.toLowerCase().includes(lowerQuery)
    );
  }
}

// Tables Mock Data
const MOCK_TABLES: Table[] = [
  {
    id: "t1",
    number: "1",
    name: "طاولة ٢",
    nameEn: "Table 1",
    capacity: 4,
    status: "available",
    zone: "indoor",
  },
  {
    id: "t2",
    number: "2",
    name: "طاولة ٢",
    nameEn: "Table 2",
    capacity: 4,
    status: "occupied",
    currentBill: 125.5,
    guestCount: 3,
    startTime: new Date(Date.now() - 45 * 60000),
    zone: "indoor",
  },
  {
    id: "t3",
    number: "3",
    name: "طاولة ٣",
    nameEn: "Table 3",
    capacity: 2,
    status: "available",
    zone: "indoor",
  },
  {
    id: "t4",
    number: "4",
    name: "طاولة ٤",
    nameEn: "Table 4",
    capacity: 6,
    status: "reserved",
    guestCount: 5,
    zone: "indoor",
  },
  {
    id: "t5",
    number: "5",
    name: "طاولة ٥",
    nameEn: "Table 5",
    capacity: 4,
    status: "occupied",
    currentBill: 89.75,
    guestCount: 2,
    startTime: new Date(Date.now() - 20 * 60000),
    zone: "indoor",
  },
  {
    id: "t6",
    number: "6",
    name: "طاولة ٦",
    nameEn: "Table 6",
    capacity: 8,
    status: "available",
    zone: "outdoor",
  },
  {
    id: "t7",
    number: "7",
    name: "طاولة ٧",
    nameEn: "Table 7",
    capacity: 4,
    status: "cleaning",
    zone: "outdoor",
  },
  {
    id: "t8",
    number: "8",
    name: "طاولة ٨",
    nameEn: "Table 8",
    capacity: 4,
    status: "available",
    zone: "outdoor",
  },
  {
    id: "t9",
    number: "9",
    name: "طاولة ٩",
    nameEn: "Table 9",
    capacity: 2,
    status: "occupied",
    currentBill: 45.0,
    guestCount: 2,
    startTime: new Date(Date.now() - 10 * 60000),
    zone: "vip",
  },
  {
    id: "t10",
    number: "10",
    name: "طاولة ٢٠",
    nameEn: "Table 10",
    capacity: 6,
    status: "available",
    zone: "vip",
  },
];

const MOCK_DISCOUNTS: Discount[] = [
  { id: "d1", name: "٥٪ خصم", nameEn: "5% Off", type: "percentage", value: 5 },
  {
    id: "d2",
    name: "١٠٪ خصم",
    nameEn: "10% Off",
    type: "percentage",
    value: 10,
  },
  {
    id: "d3",
    name: "١٥٪ خصم",
    nameEn: "15% Off",
    type: "percentage",
    value: 15,
  },
  {
    id: "d4",
    name: "٢٠٪ خصم",
    nameEn: "20% Off",
    type: "percentage",
    value: 20,
  },
  {
    id: "d5",
    name: "٢٥٪ خصم",
    nameEn: "25% Off",
    type: "percentage",
    value: 25,
  },
  {
    id: "d6",
    name: "٥ ريال خصم",
    nameEn: "5 SAR Off",
    type: "fixed",
    value: 5,
  },
  {
    id: "d7",
    name: "١٠ ريال خصم",
    nameEn: "10 SAR Off",
    type: "fixed",
    value: 10,
  },
  {
    id: "d8",
    name: "٢٠ ريال خصم",
    nameEn: "20 SAR Off",
    type: "fixed",
    value: 20,
  },
  {
    id: "d9",
    name: "٥٠ ريال خصم",
    nameEn: "50 SAR Off",
    type: "fixed",
    value: 50,
  },
  {
    id: "d10",
    name: "خصم مخصص",
    nameEn: "Custom Discount",
    type: "fixed",
    value: 0,
  },
];

const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: "wh1",
    name: "المستودع الرئيسي",
    nameEn: "Main Warehouse",
    code: "WH-MAIN",
    isActive: true,
    zones: [
      {
        id: "z1",
        name: "مبردات",
        nameEn: "Refrigerated",
        type: "refrigerated",
        capacity: 1000,
        currentStock: 750,
      },
      {
        id: "z2",
        name: "مجمدات",
        nameEn: "Frozen",
        type: "frozen",
        capacity: 500,
        currentStock: 320,
      },
      {
        id: "z3",
        name: "جافة",
        nameEn: "Dry",
        type: "dry",
        capacity: 2000,
        currentStock: 1450,
      },
      {
        id: "z4",
        name: "مشروبات",
        nameEn: "Beverages",
        type: "beverages",
        capacity: 800,
        currentStock: 600,
      },
    ],
  },
  {
    id: "wh2",
    name: "مستودع الفرع",
    nameEn: "Branch Warehouse",
    code: "WH-BR01",
    isActive: true,
    zones: [
      {
        id: "z5",
        name: "مبردات",
        nameEn: "Refrigerated",
        type: "refrigerated",
        capacity: 300,
        currentStock: 180,
      },
      {
        id: "z6",
        name: "جافة",
        nameEn: "Dry",
        type: "dry",
        capacity: 500,
        currentStock: 280,
      },
    ],
  },
];

export class TableService {
  static async getTables(): Promise<Table[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_TABLES;
  }

  static async getTableById(id: string): Promise<Table | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_TABLES.find((t) => t.id === id) || null;
  }

  static async updateTableStatus(
    id: string,
    status: Table["status"]
  ): Promise<Table> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const table = MOCK_TABLES.find((t) => t.id === id);
    if (table) {
      table.status = status;
    }
    return table!;
  }

  static async createTable(table: Partial<Table>): Promise<Table> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newTable: Table = {
      id: `t-${Date.now()}`,
      number: table.number!,
      zone: table.zone!,
      capacity: table.capacity!,
      status: "available",
      guestCount: 0,
      name: "",
      nameEn: "",
    };
    MOCK_TABLES.push(newTable);
    console.log("Table created:", newTable);
    return newTable;
  }

  static async updateTable(table: Partial<Table>): Promise<Table> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = MOCK_TABLES.findIndex((t) => t.id === table.id);
    if (index !== -1) {
      MOCK_TABLES[index] = {
        ...MOCK_TABLES[index],
        ...table,
      };
      console.log("Table updated:", MOCK_TABLES[index]);
      return MOCK_TABLES[index];
    }
    throw new Error("Table not found");
  }

  static async deleteTable(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = MOCK_TABLES.findIndex((t) => t.id === id);
    if (index !== -1) {
      // Only allow deleting if not occupied
      if (MOCK_TABLES[index].status === "occupied") {
        throw new Error("Cannot delete occupied table");
      }
      MOCK_TABLES.splice(index, 1);
      console.log("Table deleted:", id);
    }
  }

  static async occupyTable(
    id: string,
    guestCount: number,
    orderId?: string,
    currentBill?: number
  ): Promise<Table> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const table = MOCK_TABLES.find((t) => t.id === id);
    if (table) {
      table.status = "occupied";
      table.guestCount = guestCount;
      table.startTime = new Date();
      if (currentBill !== undefined) table.currentBill = currentBill;
      console.log("Table occupied:", table);
      return table;
    }
    throw new Error("Table not found");
  }

  static async freeTable(id: string): Promise<Table> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const table = MOCK_TABLES.find((t) => t.id === id);
    if (table) {
      table.status = "available";
      table.guestCount = 0;
      table.startTime = undefined;
      table.currentBill = undefined;
      console.log("Table freed:", table);
      return table;
    }
    throw new Error("Table not found");
  }

  static async updateTableBill(
    id: string,
    currentBill: number
  ): Promise<Table> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const table = MOCK_TABLES.find((t) => t.id === id);
    if (table) {
      table.currentBill = currentBill;
      return table;
    }
    throw new Error("Table not found");
  }
}

export class DiscountService {
  static async getDiscounts(): Promise<Discount[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_DISCOUNTS;
  }
}

export class WarehouseService {
  static async getWarehouses(): Promise<Warehouse[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_WAREHOUSES;
  }

  static async getProductStock(productId: string): Promise<WarehouseStock[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Mock warehouse stock for a product
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) return [];

    return [
      {
        warehouseId: "wh1",
        warehouseName: "المستودع الرئيسي",
        warehouseNameEn: "Main Warehouse",
        zone: "مبردات",
        quantity: Math.floor(product.stock * 0.7),
        reserved: Math.floor(product.stock * 0.1),
        available: Math.floor(product.stock * 0.6),
      },
      {
        warehouseId: "wh2",
        warehouseName: "مستودع الفرع",
        warehouseNameEn: "Branch Warehouse",
        zone: "جافة",
        quantity: Math.floor(product.stock * 0.3),
        reserved: Math.floor(product.stock * 0.05),
        available: Math.floor(product.stock * 0.25),
      },
    ];
  }
}

// Mock Customers
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "أحمد محمد السعيد",
    nameEn: "Ahmed Mohammed AlSaeed",
    phone: "+966 50 123 4567",
    email: "ahmed@example.com",
    loyaltyPoints: 850,
    tier: "gold",
  },
  {
    id: "c2",
    name: "فاطمة أحمد الزهراني",
    nameEn: "Fatima Ahmed AlZahrani",
    phone: "+966 55 987 6543",
    email: "fatima@example.com",
    loyaltyPoints: 1500,
    tier: "platinum",
  },
  {
    id: "c3",
    name: "خالد عبدالله القحطاني",
    nameEn: "Khaled Abdullah AlQahtani",
    phone: "+966 54 555 1234",
    loyaltyPoints: 320,
    tier: "silver",
  },
  {
    id: "c4",
    name: "نورة سعد العتيبي",
    nameEn: "Noura Saad AlOtaibi",
    phone: "+966 56 444 9876",
    email: "noura@example.com",
    loyaltyPoints: 150,
    tier: "bronze",
  },
  {
    id: "c5",
    name: "محمد خالد البلوي",
    nameEn: "Mohammed Khaled AlBalawi",
    phone: "+966 50 777 8888",
    loyaltyPoints: 45,
  },
];

// In-memory held orders storage
let heldOrders: HeldOrder[] = [];
let orderCounter = 1;

export class CustomerService {
  static async getCustomers(): Promise<Customer[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_CUSTOMERS;
  }

  static async getCustomerById(id: string): Promise<Customer | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_CUSTOMERS.find((c) => c.id === id) || null;
  }

  static async searchCustomers(query: string): Promise<Customer[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const lowerQuery = query.toLowerCase();
    return MOCK_CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) || c.phone.includes(query)
    );
  }
}

export class HeldOrderService {
  static async holdOrder(
    items: CartItem[],
    orderType: "takeaway" | "dineIn" | "delivery",
    selectedTable?: Table,
    appliedDiscount?: { discount: Discount; value: number },
    customerName?: string
  ): Promise<HeldOrder> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.15;
    const discount = appliedDiscount
      ? appliedDiscount.discount.type === "percentage"
        ? (subtotal * appliedDiscount.value) / 100
        : appliedDiscount.value
      : 0;
    const total = subtotal + tax - discount;

    const order: HeldOrder = {
      id: `hold-${Date.now()}`,
      orderNumber: `H${orderCounter.toString().padStart(3, "0")}`,
      timestamp: new Date(),
      itemsCount,
      total,
      customerName,
      items: JSON.parse(JSON.stringify(items)), // Deep clone
      orderType,
      selectedTable,
      appliedDiscount,
    };

    orderCounter++;
    heldOrders.push(order);
    return order;
  }

  static async getHeldOrders(): Promise<HeldOrder[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return heldOrders;
  }

  static async retrieveOrder(orderId: string): Promise<HeldOrder | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const order = heldOrders.find((o) => o.id === orderId);
    if (order) {
      // Remove from held orders
      heldOrders = heldOrders.filter((o) => o.id !== orderId);
      return order;
    }
    return null;
  }

  static async deleteHeldOrder(orderId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const initialLength = heldOrders.length;
    heldOrders = heldOrders.filter((o) => o.id !== orderId);
    return heldOrders.length < initialLength;
  }
}

// Product Modifiers Mock Data
const MOCK_MODIFIER_GROUPS: Record<string, ModifierGroup[]> = {
  "2": [
    // Latte
    {
      id: "mg1",
      name: "الحجم",
      nameEn: "Size",
      category: "size",
      options: [
        {
          id: "size-s",
          name: "صغير",
          nameEn: "Small",
          price: 0,
          category: "size",
        },
        {
          id: "size-m",
          name: "وسط",
          nameEn: "Medium",
          price: 2,
          category: "size",
        },
        {
          id: "size-l",
          name: "كبير",
          nameEn: "Large",
          price: 5,
          category: "size",
        },
      ],
      minSelection: 1,
      maxSelection: 1,
      isRequired: true,
    },
    {
      id: "mg2",
      name: "إضافات",
      nameEn: "Add-ons",
      category: "addon",
      options: [
        {
          id: "addon-1",
          name: "شوت إسبريسو",
          nameEn: "Espresso Shot",
          price: 3,
          category: "addon",
        },
        {
          id: "addon-2",
          name: "حليب إضافي",
          nameEn: "Extra Milk",
          price: 2,
          category: "addon",
        },
        {
          id: "addon-3",
          name: "كريمة",
          nameEn: "Whipped Cream",
          price: 2,
          category: "addon",
        },
        {
          id: "addon-4",
          name: "شوكولاتة",
          nameEn: "Chocolate",
          price: 3,
          category: "addon",
        },
      ],
      minSelection: 0,
      maxSelection: 3,
      isRequired: false,
    },
  ],
  "3": [
    // Espresso
    {
      id: "mg3",
      name: "النوع",
      nameEn: "Type",
      category: "variation",
      options: [
        {
          id: "var-1",
          name: "مفرد",
          nameEn: "Single",
          price: 0,
          category: "variation",
        },
        {
          id: "var-2",
          name: "مزدوج",
          nameEn: "Double",
          price: 3,
          category: "variation",
        },
      ],
      minSelection: 1,
      maxSelection: 1,
      isRequired: true,
    },
  ],
};

export class ModifierService {
  static async getModifierGroups(productId: string): Promise<ModifierGroup[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_MODIFIER_GROUPS[productId] || [];
  }
}

// Returns & Exchanges Service
let returnTransactions: ReturnTransaction[] = [];
let returnCounter = 1;

export class ReturnService {
  static async createReturn(
    orderId: string,
    orderNumber: string,
    items: ReturnItem[],
    refundMethod: RefundMethod
  ): Promise<ReturnTransaction> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    const requiresApproval = total > 100; // Large returns need manager approval

    const returnTx: ReturnTransaction = {
      id: `ret-${Date.now()}`,
      orderId,
      orderNumber,
      timestamp: new Date(),
      items,
      subtotal,
      tax,
      total,
      refundMethod,
      requiresApproval,
      status: requiresApproval ? "pending" : "approved",
    };

    returnTransactions.push(returnTx);
    return returnTx;
  }

  static async approveReturn(
    returnId: string,
    approverName: string
  ): Promise<ReturnTransaction | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const returnTx = returnTransactions.find((r) => r.id === returnId);
    if (returnTx) {
      returnTx.status = "approved";
      returnTx.approvedBy = approverName;
    }
    return returnTx || null;
  }

  static async completeReturn(
    returnId: string
  ): Promise<ReturnTransaction | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const returnTx = returnTransactions.find((r) => r.id === returnId);
    if (returnTx && returnTx.status === "approved") {
      returnTx.status = "completed";
    }
    return returnTx || null;
  }
}

// Kitchen Display Service
let kitchenOrders: KitchenOrder[] = [];
let kitchenOrderCounter = 1;

export class KitchenService {
  static async sendToKitchen(
    items: CartItem[],
    orderType: "takeaway" | "dineIn" | "delivery",
    tableNumber?: string,
    notes?: string
  ): Promise<KitchenOrder> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const order: KitchenOrder = {
      id: `kitchen-${Date.now()}`,
      orderNumber: `K${kitchenOrderCounter.toString().padStart(3, "0")}`,
      items,
      orderType,
      tableNumber,
      timestamp: new Date(),
      status: "pending",
      station: "general",
      priority: orderType === "dineIn" ? 2 : 1,
      notes,
    };

    kitchenOrderCounter++;
    kitchenOrders.push(order);
    return order;
  }

  static async getKitchenOrders(): Promise<KitchenOrder[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return kitchenOrders;
  }

  static async updateOrderStatus(
    orderId: string,
    status: KitchenOrderStatus
  ): Promise<KitchenOrder | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const order = kitchenOrders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
    }
    return order || null;
  }
}

// Split Bill Service
export class SplitBillService {
  static createEqualSplit(
    items: CartItem[],
    parts: number,
    total: number
  ): BillSplit {
    const amountPerPart = total / parts;
    const splitParts: BillSplitPart[] = [];

    for (let i = 0; i < parts; i++) {
      splitParts.push({
        id: `part-${i + 1}`,
        amount: amountPerPart,
        paid: false,
      });
    }

    return {
      id: `split-${Date.now()}`,
      type: "equal",
      parts: splitParts,
      totalAmount: total,
    };
  }

  static createItemSplit(items: CartItem[]): BillSplit {
    // Group items per person
    const splitParts: BillSplitPart[] = [];

    // For demo, split items into 2 groups
    const mid = Math.ceil(items.length / 2);
    const group1 = items.slice(0, mid);
    const group2 = items.slice(mid);

    if (group1.length > 0) {
      splitParts.push({
        id: "part-1",
        items: group1,
        amount: group1.reduce((sum, item) => sum + item.total, 0) * 1.15, // with tax
        paid: false,
      });
    }

    if (group2.length > 0) {
      splitParts.push({
        id: "part-2",
        items: group2,
        amount: group2.reduce((sum, item) => sum + item.total, 0) * 1.15,
        paid: false,
      });
    }

    return {
      id: `split-${Date.now()}`,
      type: "by_item",
      parts: splitParts,
      totalAmount: splitParts.reduce((sum, part) => sum + part.amount, 0),
    };
  }
}
