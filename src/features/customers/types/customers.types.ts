/**
 * Customer Management Types
 * NerdPOS - Feature-First Architecture
 */

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Customer {
  id: string;
  name: string;
  nameEn?: string;
  phone: string;
  email?: string;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  totalSpent: number;
  totalOrders: number;
  firstVisit: Date;
  lastVisit: Date;
  favoriteProducts: string[];
  address?: CustomerAddress;
  dateOfBirth?: Date;
  notes?: string;
  tags: string[];
  membershipExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerAddress {
  street: string;
  district: string;
  city: string;
  postalCode?: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface LoyaltyProgram {
  tier: LoyaltyTier;
  name: string;
  nameEn: string;
  minSpend: number;
  discountPercentage: number;
  pointsMultiplier: number;
  benefits: string[];
  color: string;
}

export interface CustomerStats {
  totalCustomers: number;
  newCustomersThisMonth: number;
  activeCustomers: number;
  vipCustomers: number;
  averageOrders: number;
  averageLifetimeValue: number;
  loyaltyDistribution: {
    tier: LoyaltyTier;
    count: number;
    percentage: number;
  }[];
}

export interface CustomerFilters {
  search?: string;
  loyaltyTier?: LoyaltyTier[];
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  minSpent?: number;
  maxSpent?: number;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  type: 'order' | 'points_earned' | 'points_redeemed' | 'tier_upgrade' | 'note_added';
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}