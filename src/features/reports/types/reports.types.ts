/**
 * Reports & Analytics Types
 * NerdPOS - Feature-First Architecture
 */

export type ReportType =
  | 'sales'
  | 'inventory'
  | 'customers'
  | 'employees'
  | 'financial'
  | 'custom';

export type ReportPeriod = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface ReportFilters {
  period: ReportPeriod;
  dateFrom?: Date;
  dateTo?: Date;
  category?: string[];
  employee?: string[];
  customer?: string[];
  paymentMethod?: string[];
}

export interface SalesReport {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalDiscount: number;
  totalTax: number;
  netSales: number;
  byPaymentMethod: {
    method: string;
    amount: number;
    count: number;
  }[];
  byCategory: {
    category: string;
    amount: number;
    count: number;
  }[];
  hourlyBreakdown: {
    hour: number;
    sales: number;
    orders: number;
  }[];
  topProducts: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface InventoryReport {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  byCategory: {
    category: string;
    itemCount: number;
    value: number;
  }[];
  topMoving: {
    productId: string;
    name: string;
    soldQuantity: number;
    remainingStock: number;
  }[];
  slowMoving: {
    productId: string;
    name: string;
    soldQuantity: number;
    remainingStock: number;
    daysInStock: number;
  }[];
}

export interface CustomerReport {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  averageLifetimeValue: number;
  topCustomers: {
    customerId: string;
    name: string;
    totalSpent: number;
    orderCount: number;
  }[];
  loyaltyDistribution: {
    tier: string;
    count: number;
    percentage: number;
  }[];
}

export interface EmployeeReport {
  totalEmployees: number;
  totalSales: number;
  totalOrders: number;
  topPerformers: {
    employeeId: string;
    name: string;
    sales: number;
    orders: number;
    averageOrderValue: number;
  }[];
  attendanceSummary: {
    present: number;
    absent: number;
    late: number;
  };
}

export interface FinancialReport {
  revenue: number;
  expenses: number;
  netProfit: number;
  profitMargin: number;
  taxCollected: number;
  cashFlow: {
    date: Date;
    inflow: number;
    outflow: number;
    balance: number;
  }[];
  expensesByCategory: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export interface CustomReport {
  id: string;
  name: string;
  type: ReportType;
  filters: ReportFilters;
  columns: string[];
  data: Record<string, any>[];
  createdAt: Date;
  updatedAt: Date;
}
