import type {
  Table,
  Section,
  Floor,
  TableReservation,
  TableStats,
  TableFilter,
  TableStatus,
} from "../types/table.types";

// Mock data
const mockFloors: Floor[] = [
  {
    id: "1",
    name: "الطابق الأرضي",
    nameEn: "Ground Floor",
    sectionCount: 3,
    tableCount: 20,
  },
  {
    id: "2",
    name: "الطابق الأول",
    nameEn: "First Floor",
    sectionCount: 2,
    tableCount: 15,
  },
  {
    id: "3",
    name: "الحديقة",
    nameEn: "Garden",
    sectionCount: 1,
    tableCount: 10,
  },
];

const mockSections: Section[] = [
  {
    id: "1",
    name: "الصالة الرئيسية",
    nameEn: "Main Hall",
    floor: "1",
    tableCount: 10,
    color: "#22d3ee",
  },
  {
    id: "2",
    name: "منطقة VIP",
    nameEn: "VIP Area",
    floor: "1",
    tableCount: 5,
    color: "#f59e0b",
  },
  {
    id: "3",
    name: "منطقة العائلات",
    nameEn: "Family Area",
    floor: "1",
    tableCount: 5,
    color: "#10b981",
  },
  {
    id: "4",
    name: "الطابق العلوي",
    nameEn: "Upper Floor",
    floor: "2",
    tableCount: 10,
    color: "#8b5cf6",
  },
  {
    id: "5",
    name: "القاعة الخاصة",
    nameEn: "Private Hall",
    floor: "2",
    tableCount: 5,
    color: "#ec4899",
  },
  {
    id: "6",
    name: "الحديقة الخارجية",
    nameEn: "Outdoor Garden",
    floor: "3",
    tableCount: 10,
    color: "#84cc16",
  },
];

const mockTables: Table[] = [
  // Ground Floor - Main Hall
  {
    id: "1",
    number: "1",
    name: "طاولة 1",
    nameEn: "Table 1",
    capacity: 4,
    shape: "square",
    status: "occupied",
    section: "1",
    floor: "1",
    currentOrder: "ORD-001",
    occupiedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    position: { x: 50, y: 50 },
  },
  {
    id: "2",
    number: "2",
    name: "طاولة 2",
    nameEn: "Table 2",
    capacity: 2,
    shape: "round",
    status: "available",
    section: "1",
    floor: "1",
    position: { x: 150, y: 50 },
  },
  {
    id: "3",
    number: "3",
    name: "طاولة 3",
    nameEn: "Table 3",
    capacity: 6,
    shape: "rectangle",
    status: "reserved",
    section: "1",
    floor: "1",
    reservedBy: "أحمد محمد",
    reservedAt: new Date(Date.now() + 2 * 60 * 60000).toISOString(),
    position: { x: 250, y: 50 },
  },
  {
    id: "4",
    number: "4",
    name: "طاولة 4",
    nameEn: "Table 4",
    capacity: 4,
    shape: "square",
    status: "cleaning",
    section: "1",
    floor: "1",
    position: { x: 50, y: 150 },
  },
  {
    id: "5",
    number: "5",
    name: "طاولة 5",
    nameEn: "Table 5",
    capacity: 8,
    shape: "rectangle",
    status: "occupied",
    section: "1",
    floor: "1",
    currentOrder: "ORD-002",
    occupiedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    position: { x: 150, y: 150 },
  },
  // VIP Area
  {
    id: "6",
    number: "VIP-1",
    name: "طاولة VIP 1",
    nameEn: "VIP Table 1",
    capacity: 6,
    shape: "round",
    status: "available",
    section: "2",
    floor: "1",
    isVIP: true,
    minSpend: 500,
    position: { x: 400, y: 50 },
  },
  {
    id: "7",
    number: "VIP-2",
    name: "طاولة VIP 2",
    nameEn: "VIP Table 2",
    capacity: 8,
    shape: "rectangle",
    status: "reserved",
    section: "2",
    floor: "1",
    isVIP: true,
    minSpend: 800,
    reservedBy: "خالد العلي",
    reservedAt: new Date(Date.now() + 1 * 60 * 60000).toISOString(),
    position: { x: 500, y: 50 },
  },
  // Family Area
  {
    id: "8",
    number: "F-1",
    name: "طاولة عائلية 1",
    nameEn: "Family Table 1",
    capacity: 6,
    shape: "rectangle",
    status: "occupied",
    section: "3",
    floor: "1",
    currentOrder: "ORD-003",
    occupiedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    position: { x: 50, y: 300 },
  },
  {
    id: "9",
    number: "F-2",
    name: "طاولة عائلية 2",
    nameEn: "Family Table 2",
    capacity: 8,
    shape: "rectangle",
    status: "available",
    section: "3",
    floor: "1",
    position: { x: 150, y: 300 },
  },
  // Upper Floor
  {
    id: "10",
    number: "U-1",
    name: "طاولة علوية 1",
    nameEn: "Upper Table 1",
    capacity: 4,
    shape: "square",
    status: "available",
    section: "4",
    floor: "2",
    position: { x: 50, y: 50 },
  },
];

const mockReservations: TableReservation[] = [
  {
    id: "1",
    tableId: "3",
    customerName: "أحمد محمد",
    customerPhone: "+966501234567",
    guestCount: 6,
    date: new Date().toISOString().split("T")[0],
    time: "19:00",
    duration: 120,
    status: "confirmed",
    notes: "عيد ميلاد",
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    createdBy: "admin",
  },
  {
    id: "2",
    tableId: "7",
    customerName: "خالد العلي",
    customerPhone: "+966507654321",
    guestCount: 8,
    date: new Date().toISOString().split("T")[0],
    time: "20:00",
    duration: 180,
    status: "confirmed",
    notes: "اجتماع عمل",
    createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    createdBy: "admin",
  },
];

export class TableService {
  static async getTables(filter?: TableFilter): Promise<Table[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...mockTables];

    if (filter) {
      if (filter.status && filter.status.length > 0) {
        filtered = filtered.filter((t) => filter.status!.includes(t.status));
      }
      if (filter.section) {
        filtered = filtered.filter((t) => t.section === filter.section);
      }
      if (filter.floor) {
        filtered = filtered.filter((t) => t.floor === filter.floor);
      }
      if (filter.capacity) {
        filtered = filtered.filter((t) => {
          const min = filter.capacity!.min || 0;
          const max = filter.capacity!.max || Infinity;
          return t.capacity >= min && t.capacity <= max;
        });
      }
      if (filter.search) {
        const search = filter.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.number.toLowerCase().includes(search) ||
            t.name.toLowerCase().includes(search) ||
            t.nameEn.toLowerCase().includes(search)
        );
      }
    }

    return filtered;
  }

  static async getTableById(id: string): Promise<Table | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockTables.find((t) => t.id === id) || null;
  }

  static async getSections(): Promise<Section[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockSections;
  }

  static async getFloors(): Promise<Floor[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockFloors;
  }

  static async getReservations(date?: string): Promise<TableReservation[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (date) {
      return mockReservations.filter((r) => r.date === date);
    }
    return mockReservations;
  }

  static async getTableStats(): Promise<TableStats> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const total = mockTables.length;
    const available = mockTables.filter((t) => t.status === "available").length;
    const occupied = mockTables.filter((t) => t.status === "occupied").length;
    const reserved = mockTables.filter((t) => t.status === "reserved").length;
    const cleaning = mockTables.filter((t) => t.status === "cleaning").length;

    return {
      total,
      available,
      occupied,
      reserved,
      cleaning,
      occupancyRate: (occupied / total) * 100,
      averageTurnover: 45,
      todayReservations: mockReservations.length,
      totalRevenue: 15680.5,
    };
  }

  static async updateTableStatus(
    tableId: string,
    status: TableStatus
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const table = mockTables.find((t) => t.id === tableId);
    if (table) {
      table.status = status;
      if (status === "available") {
        table.currentOrder = undefined;
        table.occupiedAt = undefined;
        table.reservedBy = undefined;
        table.reservedAt = undefined;
      }
    }
  }

  static async createReservation(
    reservation: Omit<TableReservation, "id" | "createdAt">
  ): Promise<TableReservation> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newReservation: TableReservation = {
      ...reservation,
      id: `RSV-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    mockReservations.push(newReservation);
    return newReservation;
  }

  static async updateReservation(
    id: string,
    updates: Partial<TableReservation>
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockReservations.findIndex((r) => r.id === id);
    if (index !== -1) {
      mockReservations[index] = { ...mockReservations[index], ...updates };
    }
  }

  static async mergeTable(tableIds: string[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Logic for merging tables
  }

  static async splitTable(tableId: string, splitCount: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Logic for splitting tables
  }

  static async transferOrder(
    fromTableId: string,
    toTableId: string
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const fromTable = mockTables.find((t) => t.id === fromTableId);
    const toTable = mockTables.find((t) => t.id === toTableId);

    if (fromTable && toTable && fromTable.currentOrder) {
      toTable.currentOrder = fromTable.currentOrder;
      toTable.status = "occupied";
      toTable.occupiedAt = fromTable.occupiedAt;

      fromTable.currentOrder = undefined;
      fromTable.status = "available";
      fromTable.occupiedAt = undefined;
    }
  }
}
