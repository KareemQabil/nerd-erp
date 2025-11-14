/**
 * Customer Management Service
 * NerdPOS - Feature-First Architecture
 */

import {
  Customer,
  CustomerStats,
  CustomerFilters,
  CustomerActivity,
  LoyaltyProgram,
  LoyaltyTier,
} from '../types/customers.types';

/**
 * Loyalty Programs Configuration
 */
export const LOYALTY_PROGRAMS: LoyaltyProgram[] = [
  {
    tier: 'bronze',
    name: 'برونزي',
    nameEn: 'Bronze',
    minSpend: 0,
    discountPercentage: 5,
    pointsMultiplier: 1,
    benefits: ['خصم 5%', 'نقاط على المشتريات'],
    color: '#CD7F32',
  },
  {
    tier: 'silver',
    name: 'فضي',
    nameEn: 'Silver',
    minSpend: 5000,
    discountPercentage: 10,
    pointsMultiplier: 1.5,
    benefits: ['خصم 10%', 'نقاط مضاعفة 1.5x', 'عروض حصرية'],
    color: '#C0C0C0',
  },
  {
    tier: 'gold',
    name: 'ذهبي',
    nameEn: 'Gold',
    minSpend: 15000,
    discountPercentage: 15,
    pointsMultiplier: 2,
    benefits: ['خصم 15%', 'نقاط مضاعفة 2x', 'شحن مجاني', 'دعم مخصص'],
    color: '#FFD700',
  },
  {
    tier: 'platinum',
    name: 'بلاتيني',
    nameEn: 'Platinum',
    minSpend: 50000,
    discountPercentage: 20,
    pointsMultiplier: 3,
    benefits: ['خصم 20%', 'نقاط مضاعفة 3x', 'شحن مجاني', 'دعم VIP', 'وصول مبكر'],
    color: '#E5E4E2',
  },
];

/**
 * Mock Customers Data
 */
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    nameEn: 'Ahmed Mohammed',
    phone: '+966501234567',
    email: 'ahmed@example.com',
    loyaltyTier: 'gold',
    loyaltyPoints: 2500,
    totalSpent: 18500,
    totalOrders: 45,
    firstVisit: new Date('2024-01-15'),
    lastVisit: new Date('2025-11-10'),
    favoriteProducts: ['prod_001', 'prod_003'],
    tags: ['vip', 'frequent'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-11-10'),
  },
  {
    id: '2',
    name: 'فاطمة علي',
    nameEn: 'Fatima Ali',
    phone: '+966507654321',
    email: 'fatima@example.com',
    loyaltyTier: 'platinum',
    loyaltyPoints: 8500,
    totalSpent: 65000,
    totalOrders: 120,
    firstVisit: new Date('2023-06-20'),
    lastVisit: new Date('2025-11-12'),
    favoriteProducts: ['prod_002', 'prod_004', 'prod_005'],
    tags: ['vip', 'frequent', 'corporate'],
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2025-11-12'),
  },
  {
    id: '3',
    name: 'محمد عبدالله',
    nameEn: 'Mohammed Abdullah',
    phone: '+966503456789',
    email: 'mohammed@example.com',
    loyaltyTier: 'silver',
    loyaltyPoints: 1200,
    totalSpent: 8500,
    totalOrders: 28,
    firstVisit: new Date('2024-03-10'),
    lastVisit: new Date('2025-11-08'),
    favoriteProducts: ['prod_001'],
    tags: ['regular'],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2025-11-08'),
  },
  {
    id: '4',
    name: 'نورة سعد',
    nameEn: 'Noura Saad',
    phone: '+966509876543',
    loyaltyTier: 'bronze',
    loyaltyPoints: 450,
    totalSpent: 2100,
    totalOrders: 12,
    firstVisit: new Date('2024-08-15'),
    lastVisit: new Date('2025-11-05'),
    favoriteProducts: [],
    tags: ['new'],
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2025-11-05'),
  },
  {
    id: '5',
    name: 'خالد أحمد',
    nameEn: 'Khaled Ahmed',
    phone: '+966502345678',
    email: 'khaled@example.com',
    loyaltyTier: 'gold',
    loyaltyPoints: 3200,
    totalSpent: 22000,
    totalOrders: 58,
    firstVisit: new Date('2023-12-01'),
    lastVisit: new Date('2025-11-11'),
    favoriteProducts: ['prod_003', 'prod_006'],
    tags: ['vip', 'frequent'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2025-11-11'),
  },
  {
    id: '6',
    name: 'سارة محمود',
    nameEn: 'Sara Mahmoud',
    phone: '+966508765432',
    email: 'sara@example.com',
    loyaltyTier: 'platinum',
    loyaltyPoints: 12000,
    totalSpent: 85000,
    totalOrders: 145,
    firstVisit: new Date('2023-05-10'),
    lastVisit: new Date('2025-11-13'),
    favoriteProducts: ['prod_002', 'prod_005', 'prod_007'],
    tags: ['vip', 'frequent', 'corporate'],
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2025-11-13'),
  },
];

/**
 * CustomersService
 * Service layer for customer management operations
 */
export class CustomersService {
  /**
   * Get all customers with optional filters
   */
  static async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    let customers = [...MOCK_CUSTOMERS];

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.nameEn?.toLowerCase().includes(search) ||
          c.phone.includes(search) ||
          c.email?.toLowerCase().includes(search)
      );
    }

    if (filters?.loyaltyTier && filters.loyaltyTier.length > 0) {
      customers = customers.filter((c) => filters.loyaltyTier!.includes(c.loyaltyTier));
    }

    return customers;
  }

  /**
   * Get customer by ID
   */
  static async getCustomerById(id: string): Promise<Customer | null> {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_CUSTOMERS.find((c) => c.id === id) || null;
  }

  /**
   * Get customer statistics
   */
  static async getCustomerStats(): Promise<CustomerStats> {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 400));

    const totalCustomers = MOCK_CUSTOMERS.length;
    const totalSpent = MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrders = MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalOrders, 0);
    const vipCustomers = MOCK_CUSTOMERS.filter(c => c.loyaltyTier === 'gold' || c.loyaltyTier === 'platinum').length;

    return {
      totalCustomers,
      newCustomersThisMonth: 12,
      activeCustomers: totalCustomers - 5,
      vipCustomers,
      averageOrders: totalCustomers > 0 ? totalOrders / totalCustomers : 0,
      averageLifetimeValue: totalSpent / totalCustomers,
      loyaltyDistribution: [
        { tier: 'bronze', count: 45, percentage: 45 },
        { tier: 'silver', count: 30, percentage: 30 },
        { tier: 'gold', count: 20, percentage: 20 },
        { tier: 'platinum', count: 5, percentage: 5 },
      ],
    };
  }

  /**
   * Create new customer
   */
  static async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newCustomer: Customer = {
      ...customer,
      id: `cust_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newCustomer;
  }

  /**
   * Update customer
   */
  static async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const customer = await this.getCustomerById(id);
    if (!customer) throw new Error('Customer not found');

    return {
      ...customer,
      ...updates,
      updatedAt: new Date(),
    };
  }

  /**
   * Get customer activity history
   */
  static async getCustomerActivity(customerId: string): Promise<CustomerActivity[]> {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 400));

    return [
      {
        id: '1',
        customerId,
        type: 'order',
        description: 'Order #ORD-1234 - SAR 285.00',
        createdAt: new Date('2025-11-10'),
      },
      {
        id: '2',
        customerId,
        type: 'points_earned',
        description: 'Earned 285 loyalty points',
        createdAt: new Date('2025-11-10'),
      },
    ];
  }

  /**
   * Calculate loyalty tier based on total spent
   */
  static calculateLoyaltyTier(totalSpent: number): LoyaltyTier {
    if (totalSpent >= 50000) return 'platinum';
    if (totalSpent >= 15000) return 'gold';
    if (totalSpent >= 5000) return 'silver';
    return 'bronze';
  }

  /**
   * Get loyalty program details
   */
  static getLoyaltyProgram(tier: LoyaltyTier): LoyaltyProgram {
    return LOYALTY_PROGRAMS.find((p) => p.tier === tier)!;
  }
}