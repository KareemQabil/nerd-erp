export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';
export type TableShape = 'square' | 'round' | 'rectangle';

export interface Table {
  id: string;
  number: string;
  name: string;
  nameEn: string;
  capacity: number;
  shape: TableShape;
  status: TableStatus;
  section: string;
  floor: string;
  position?: {
    x: number;
    y: number;
  };
  currentOrder?: string; // Order ID if occupied
  reservedBy?: string; // Customer name if reserved
  reservedAt?: string; // ISO date string
  occupiedAt?: string; // ISO date string
  qrCode?: string;
  minSpend?: number;
  isVIP?: boolean;
}

export interface Section {
  id: string;
  name: string;
  nameEn: string;
  floor: string;
  tableCount: number;
  color: string;
}

export interface Floor {
  id: string;
  name: string;
  nameEn: string;
  sectionCount: number;
  tableCount: number;
}

export interface TableReservation {
  id: string;
  tableId: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  date: string;
  time: string;
  duration: number; // in minutes
  notes?: string;
  status: 'pending' | 'confirmed' | 'arrived' | 'cancelled' | 'completed';
  createdAt: string;
  createdBy: string;
}

export interface TableStats {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  cleaning: number;
  occupancyRate: number;
  averageTurnover: number; // in minutes
  todayReservations: number;
  totalRevenue: number;
}

export interface TableFilter {
  status?: TableStatus[];
  section?: string;
  floor?: string;
  capacity?: { min?: number; max?: number };
  search?: string;
}
