/**
 * Centralized Sync Service
 * Integrates POS, Orders, and Inventory modules for real-time synchronization
 */

import type { CartItem } from "../../features/pos/types/pos.types";
import type {
  Order,
  OrderItem,
  OrderStatus,
} from "../../features/orders/types/orders.types";
import type { StockMovement } from "../../features/inventory/types/inventory.types";
import type { Table } from "../../features/pos/types/pos.types";

export type SyncEventType =
  | "sale_completed"
  | "order_created"
  | "order_updated"
  | "inventory_updated"
  | "return_processed"
  | "exchange_processed"
  | "table_updated"
  | "table_occupied"
  | "table_freed";

export interface SyncEvent {
  id: string;
  type: SyncEventType;
  timestamp: Date;
  data: any;
  moduleSource: "pos" | "orders" | "inventory";
}

export interface SaleTransaction {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  orderType: "dineIn" | "takeaway" | "delivery";
  customerName?: string;
  customerPhone?: string;
  tableId?: string;
  tableNumber?: string;
  createdBy: string;
  createdByName: string;
}

// In-memory storage for sync events (would be replaced with real backend)
let syncEvents: SyncEvent[] = [];
let orders: Order[] = [];
let inventoryMovements: StockMovement[] = [];

// Subscribers for real-time updates
type SyncCallback = (event: SyncEvent) => void;
const subscribers: Map<string, SyncCallback[]> = new Map();

/**
 * Sync Service - Orchestrates data synchronization across modules
 */
export class SyncService {
  /**
   * Process a sale from POS - Creates order and updates inventory
   */
  static async processSale(saleTransaction: SaleTransaction): Promise<{
    order: Order;
    inventoryUpdates: StockMovement[];
  }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 1. Create Order from POS sale
    const order = this.createOrderFromSale(saleTransaction);
    orders.push(order);

    // 2. Update Inventory - Reduce stock for each item
    const inventoryUpdates = await this.updateInventoryFromSale(
      saleTransaction
    );
    inventoryMovements.push(...inventoryUpdates);

    // 3. Emit sync event
    const syncEvent: SyncEvent = {
      id: `sync-${Date.now()}`,
      type: "sale_completed",
      timestamp: new Date(),
      data: { order, inventoryUpdates },
      moduleSource: "pos",
    };
    this.emitEvent(syncEvent);

    console.log("✅ Sale processed successfully:", {
      orderNumber: order.orderNumber,
      itemsCount: order.items.length,
      total: order.total,
      inventoryUpdates: inventoryUpdates.length,
    });

    return { order, inventoryUpdates };
  }

  /**
   * Create Order from POS Sale Transaction
   */
  private static createOrderFromSale(sale: SaleTransaction): Order {
    const orderItems: OrderItem[] = sale.items.map((cartItem) => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: cartItem.product.id,
      productName: cartItem.product.name,
      productNameEn: cartItem.product.nameEn || cartItem.product.name,
      quantity: cartItem.quantity,
      unitPrice: cartItem.price,
      total: cartItem.total,
      modifiers: cartItem.modifiers?.map((mod) => ({
        id: `mod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: mod.name,
        nameEn: mod.nameEn || mod.name,
        price: mod.price,
      })),
      notes: cartItem.notes,
    }));

    const order: Order = {
      id: sale.id,
      orderNumber: sale.orderNumber,
      type: sale.orderType,
      status: "pending",
      paymentStatus: "paid",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: orderItems,
      subtotal: sale.subtotal,
      tax: sale.tax,
      taxRate: sale.tax / sale.subtotal,
      discount: sale.discount,
      total: sale.total,
      paymentMethod: sale.paymentMethod as any,
      paidAmount: sale.total,
      createdBy: sale.createdBy,
      createdByName: sale.createdByName,
      kitchenStatus: "pending",
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      tableId: sale.tableId,
      tableNumber: sale.tableNumber,
    };

    return order;
  }

  /**
   * Update Inventory from Sale - Reduce stock quantities
   */
  private static async updateInventoryFromSale(
    sale: SaleTransaction
  ): Promise<StockMovement[]> {
    const movements: StockMovement[] = [];

    for (const item of sale.items) {
      const movement: StockMovement = {
        id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: item.product.id,
        productName: item.product.name,
        type: "sale",
        quantity: -item.quantity, // Negative for outgoing stock
        toWarehouse: "wh-1", // Default warehouse
        reference: sale.orderNumber,
        notes: `بيع عبر نقاط البيع - ${sale.orderNumber}`,
        createdAt: new Date(),
        reason: "",
        user: "",
        timestamp: new Date(),
      };
      movements.push(movement);
    }

    return movements;
  }

  /**
   * Get all orders (synced from POS)
   */
  static async getSyncedOrders(): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...orders].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  /**
   * Get inventory movements
   */
  static async getInventoryMovements(
    productId?: string
  ): Promise<StockMovement[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (productId) {
      return inventoryMovements.filter((m) => m.productId === productId);
    }

    return [...inventoryMovements].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  /**
   * Subscribe to sync events
   */
  static subscribe(
    eventType: SyncEventType,
    callback: SyncCallback
  ): () => void {
    if (!subscribers.has(eventType)) {
      subscribers.set(eventType, []);
    }
    subscribers.get(eventType)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = subscribers.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit sync event to all subscribers
   */
  private static emitEvent(event: SyncEvent): void {
    syncEvents.push(event);

    // Notify all subscribers of this event type
    const callbacks = subscribers.get(event.type);
    if (callbacks) {
      callbacks.forEach((callback) => callback(event));
    }

    // Notify 'all' event subscribers
    const allCallbacks = subscribers.get("sale_completed" as any);
    if (allCallbacks) {
      allCallbacks.forEach((callback) => callback(event));
    }
  }

  /**
   * Get recent sync events
   */
  static async getSyncEvents(limit: number = 50): Promise<SyncEvent[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return syncEvents
      .slice(-limit)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get sync statistics
   */
  static async getSyncStats(): Promise<{
    totalSales: number;
    totalOrders: number;
    totalInventoryMovements: number;
    lastSyncTime: Date | null;
    syncStatus: "active" | "idle";
  }> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const salesEvents = syncEvents.filter((e) => e.type === "sale_completed");
    const lastEvent = syncEvents[syncEvents.length - 1];

    return {
      totalSales: salesEvents.length,
      totalOrders: orders.length,
      totalInventoryMovements: inventoryMovements.length,
      lastSyncTime: lastEvent?.timestamp || null,
      syncStatus:
        Date.now() - (lastEvent?.timestamp.getTime() || 0) < 60000
          ? "active"
          : "idle",
    };
  }

  /**
   * Clear all sync data (for testing/reset)
   */
  static clearAll(): void {
    syncEvents = [];
    orders = [];
    inventoryMovements = [];
    subscribers.clear();
    console.log("🗑️ All sync data cleared");
  }

  /**
   * Process return/refund - Update inventory (add stock back)
   */
  static async processReturn(returnData: {
    orderId: string;
    items: Array<{ productId: string; productName: string; quantity: number }>;
    total: number;
    reason: string;
    processedBy: string;
  }): Promise<{ inventoryUpdates: StockMovement[] }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const inventoryUpdates: StockMovement[] = returnData.items.map((item) => ({
      id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: item.productId,
      productName: item.productName,
      type: "return",
      quantity: item.quantity, // Positive for incoming stock
      warehouseId: "wh-1",
      warehouseName: "المستودع الرئيسي",
      reference: `RET-${returnData.orderId}`,
      notes: `إرجاع بيع - السبب: ${returnData.reason}`,
      createdAt: new Date(),
    }));

    inventoryMovements.push(...inventoryUpdates);

    // Emit sync event
    const syncEvent: SyncEvent = {
      id: `sync-${Date.now()}`,
      type: "return_processed",
      timestamp: new Date(),
      data: { returnData, inventoryUpdates },
      moduleSource: "pos",
    };
    this.emitEvent(syncEvent);

    console.log("✅ Return processed successfully:", {
      orderId: returnData.orderId,
      itemsCount: returnData.items.length,
      inventoryRestored: inventoryUpdates.length,
    });

    return { inventoryUpdates };
  }

  // ============================================================
  // TABLE MANAGEMENT SYNC
  // ============================================================

  /**
   * Occupy table when order is started
   */
  static async occupyTable(tableUpdate: {
    tableId: string;
    tableNumber: string;
    orderId: string;
    orderNumber: string;
    guestCount: number;
    currentBill: number;
  }): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Emit sync event
    const syncEvent: SyncEvent = {
      id: `sync-${Date.now()}`,
      type: "table_occupied",
      timestamp: new Date(),
      data: tableUpdate,
      moduleSource: "pos",
    };
    this.emitEvent(syncEvent);

    console.log("🪑 Table occupied:", {
      tableNumber: tableUpdate.tableNumber,
      orderNumber: tableUpdate.orderNumber,
      guestCount: tableUpdate.guestCount,
    });
  }

  /**
   * Free table when order is completed/paid
   */
  static async freeTable(tableId: string, tableNumber: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Emit sync event
    const syncEvent: SyncEvent = {
      id: `sync-${Date.now()}`,
      type: "table_freed",
      timestamp: new Date(),
      data: { tableId, tableNumber },
      moduleSource: "pos",
    };
    this.emitEvent(syncEvent);

    console.log("🪑 Table freed:", { tableNumber });
  }

  /**
   * Update table status (bill amount, guest count, etc.)
   */
  static async updateTableStatus(tableUpdate: {
    tableId: string;
    tableNumber: string;
    currentBill?: number;
    guestCount?: number;
    status?: Table["status"];
  }): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Emit sync event
    const syncEvent: SyncEvent = {
      id: `sync-${Date.now()}`,
      type: "table_updated",
      timestamp: new Date(),
      data: tableUpdate,
      moduleSource: "pos",
    };
    this.emitEvent(syncEvent);

    console.log("🪑 Table updated:", tableUpdate);
  }
}
