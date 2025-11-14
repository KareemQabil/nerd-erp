export type OrderType = 'dineIn' | 'takeaway' | 'delivery';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'mada' | 'stcPay' | 'applePay' | 'tabby' | 'tamara' | 'multiple';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productNameEn: string;
  quantity: number;
  unitPrice: number;
  total: number;
  modifiers?: OrderModifier[];
  specialInstructions?: string;
}

export interface OrderModifier {
  id: string;
  name: string;
  nameEn: string;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  
  // Customer info
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  
  // Table info (for dine-in)
  tableId?: string;
  tableNumber?: string;
  
  // Delivery info
  deliveryAddress?: string;
  deliveryNotes?: string;
  driverId?: string;
  driverName?: string;
  
  // Items
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountType?: 'percentage' | 'fixed';
  deliveryFee?: number;
  tip?: number;
  total: number;
  
  // Payment
  paymentMethod?: PaymentMethod;
  paidAmount: number;
  changeAmount?: number;
  
  // Staff
  createdBy: string;
  createdByName: string;
  
  // Kitchen
  kitchenStatus?: 'pending' | 'preparing' | 'ready';
  estimatedReadyTime?: Date;
  
  // Notes
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus | 'all';
  type?: OrderType | 'all';
  paymentStatus?: PaymentStatus | 'all';
  dateFrom?: Date;
  dateTo?: Date;
  customerId?: string;
  searchQuery?: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  preparing: number;
  ready: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface OrderActivity {
  id: string;
  orderId: string;
  action: string;
  actionAr: string;
  description?: string;
  timestamp: Date;
  userId: string;
  userName: string;
}
