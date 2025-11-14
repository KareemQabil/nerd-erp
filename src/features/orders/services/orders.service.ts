import { Order, OrderFilters, OrderStats, OrderActivity, OrderStatus } from '../types/orders.types';
import { SyncService } from '../../../core/services/sync.service';

// Mock data for demonstration
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    orderNumber: '#1234',
    type: 'dineIn',
    status: 'preparing',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    tableId: 'T5',
    tableNumber: '5',
    items: [
      {
        id: 'item-1',
        productId: '2',
        productName: 'لاتيه كلاسيكي',
        productNameEn: 'Classic Latte',
        quantity: 2,
        unitPrice: 17.00,
        total: 34.00,
        modifiers: [
          { id: 'mod-1', name: 'حجم كبير', nameEn: 'Large', price: 2.00 }
        ]
      },
      {
        id: 'item-2',
        productId: '6',
        productName: 'كرواسون بالجبنة',
        productNameEn: 'Cheese Croissant',
        quantity: 1,
        unitPrice: 10.00,
        total: 10.00
      }
    ],
    subtotal: 44.00,
    tax: 6.60,
    taxRate: 0.15,
    discount: 0,
    total: 50.60,
    paymentMethod: 'card',
    paidAmount: 50.60,
    createdBy: 'USR-001',
    createdByName: 'أحمد محمد',
    kitchenStatus: 'preparing',
    estimatedReadyTime: new Date(Date.now() + 10 * 60 * 1000)
  },
  {
    id: 'ORD-002',
    orderNumber: '#1235',
    type: 'takeaway',
    status: 'ready',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 20 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
    customerName: 'سارة أحمد',
    customerPhone: '+966501234567',
    items: [
      {
        id: 'item-3',
        productId: '3',
        productName: 'إسبريسو مميز',
        productNameEn: 'Premium Espresso',
        quantity: 3,
        unitPrice: 8.00,
        total: 24.00
      }
    ],
    subtotal: 24.00,
    tax: 3.60,
    taxRate: 0.15,
    discount: 0,
    total: 27.60,
    paymentMethod: 'cash',
    paidAmount: 30.00,
    changeAmount: 2.40,
    createdBy: 'USR-002',
    createdByName: 'فاطمة علي',
    kitchenStatus: 'ready'
  },
  {
    id: 'ORD-003',
    orderNumber: '#1236',
    type: 'delivery',
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
    customerName: 'محمد خالد',
    customerPhone: '+966507654321',
    deliveryAddress: 'شارع الملك فهد، الرياض',
    deliveryNotes: 'الاتصال عند الوصول',
    items: [
      {
        id: 'item-4',
        productId: '4',
        productName: 'قهوة اليوم',
        productNameEn: 'Daily Brew Coffee',
        quantity: 2,
        unitPrice: 10.00,
        total: 20.00
      },
      {
        id: 'item-5',
        productId: '1',
        productName: 'بيبسي كولا',
        productNameEn: 'Pepsi Cola',
        quantity: 2,
        unitPrice: 5.00,
        total: 10.00
      }
    ],
    subtotal: 30.00,
    tax: 4.50,
    taxRate: 0.15,
    discount: 0,
    deliveryFee: 10.00,
    total: 44.50,
    paymentMethod: 'mada',
    paidAmount: 0,
    createdBy: 'USR-001',
    createdByName: 'أحمد محمد',
    kitchenStatus: 'pending'
  }
];

const MOCK_ORDER_ACTIVITIES: OrderActivity[] = [
  {
    id: 'ACT-001',
    orderId: 'ORD-001',
    action: 'order_created',
    actionAr: 'تم إنشاء الطلب',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    userId: 'USR-001',
    userName: 'أحمد محمد'
  },
  {
    id: 'ACT-002',
    orderId: 'ORD-001',
    action: 'payment_received',
    actionAr: 'تم استلام الدفع',
    description: 'بطاقة ائتمان - 50.60 ر.س',
    timestamp: new Date(Date.now() - 14 * 60 * 1000),
    userId: 'USR-001',
    userName: 'أحمد محمد'
  },
  {
    id: 'ACT-003',
    orderId: 'ORD-001',
    action: 'status_changed',
    actionAr: 'تغير حالة الطلب',
    description: 'من قيد الانتظار إلى قيد التحضير',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    userId: 'KITCHEN',
    userName: 'نظام المطبخ'
  }
];

export class OrdersService {
  // Get all orders with optional filters (includes synced POS orders)
  static async getOrders(filters?: OrderFilters): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Merge mock orders with synced orders from POS
    const syncedOrders = await SyncService.getSyncedOrders();
    let filteredOrders = [...MOCK_ORDERS, ...syncedOrders];
    
    // Remove duplicates based on ID
    filteredOrders = filteredOrders.filter((order, index, self) =>
      index === self.findIndex((o) => o.id === order.id)
    );
    
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === filters.status);
      }
      if (filters.type && filters.type !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.type === filters.type);
      }
      if (filters.paymentStatus && filters.paymentStatus !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.paymentStatus === filters.paymentStatus);
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredOrders = filteredOrders.filter(order => 
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName?.toLowerCase().includes(query) ||
          order.customerPhone?.includes(query)
        );
      }
      if (filters.dateFrom) {
        filteredOrders = filteredOrders.filter(order => order.createdAt >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        filteredOrders = filteredOrders.filter(order => order.createdAt <= filters.dateTo!);
      }
    }
    
    return filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Get a single order by ID
  static async getOrderById(id: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_ORDERS.find(order => order.id === id) || null;
  }
  
  // Get order statistics
  static async getOrderStats(dateFrom?: Date, dateTo?: Date): Promise<OrderStats> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let orders = [...MOCK_ORDERS];
    if (dateFrom) {
      orders = orders.filter(order => order.createdAt >= dateFrom);
    }
    if (dateTo) {
      orders = orders.filter(order => order.createdAt <= dateTo);
    }
    
    const stats: OrderStats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length 
        : 0
    };
    
    return stats;
  }
  
  // Update order status
  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const order = MOCK_ORDERS.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    order.status = status;
    order.updatedAt = new Date();
    
    if (status === 'completed') {
      order.completedAt = new Date();
    }
    
    return order;
  }
  
  // Cancel order
  static async cancelOrder(orderId: string, reason: string): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const order = MOCK_ORDERS.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    order.status = 'cancelled';
    order.updatedAt = new Date();
    order.notes = `ملغي: ${reason}`;
    
    return order;
  }
  
  // Get order activity history
  static async getOrderActivities(orderId: string): Promise<OrderActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_ORDER_ACTIVITIES.filter(activity => activity.orderId === orderId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  // Search orders
  static async searchOrders(query: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = query.toLowerCase();
    return MOCK_ORDERS.filter(order =>
      order.orderNumber.toLowerCase().includes(lowerQuery) ||
      order.customerName?.toLowerCase().includes(lowerQuery) ||
      order.customerPhone?.includes(lowerQuery) ||
      order.id.toLowerCase().includes(lowerQuery)
    );
  }
}