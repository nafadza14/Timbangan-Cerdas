import { Product, User, ScaleConfig, AuditLog, Transaction } from "./types";

// Seed Products
const initialProducts: Product[] = [
  {
    id: 1,
    sku: "BRG-001",
    name: "Apel Fuji Super",
    category: "Buah",
    pricePerKg: 45000,
    isWeighable: true,
    stockQty: 120.5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    sku: "BRG-002",
    name: "Mangga Harum Manis",
    category: "Buah",
    pricePerKg: 35000,
    isWeighable: true,
    stockQty: 80.0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    sku: "BRG-003",
    name: "Wortel Organik Lokal",
    category: "Sayur",
    pricePerKg: 18000,
    isWeighable: true,
    stockQty: 50.0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    sku: "BRG-004",
    name: "Bayam Segar Ikat",
    category: "Sayur",
    pricePerKg: 5000,
    isWeighable: false,
    stockQty: 100,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    sku: "BRG-005",
    name: "Daging Sapi Sirloin Australia",
    category: "Daging",
    pricePerKg: 135000,
    isWeighable: true,
    stockQty: 25.4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 6,
    sku: "BRG-006",
    name: "Ayam Broiler Utuh Bersih",
    category: "Daging",
    pricePerKg: 42000,
    isWeighable: false,
    stockQty: 40,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 7,
    sku: "BRG-007",
    name: "Jeruk Medan Manis",
    category: "Buah",
    pricePerKg: 28000,
    isWeighable: true,
    stockQty: 95.0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 8,
    sku: "BRG-008",
    name: "Kentang Dieng Ukuran Sedang",
    category: "Sayur",
    pricePerKg: 22000,
    isWeighable: true,
    stockQty: 150.0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Seed Users
const initialUsers: User[] = [
  {
    id: 1,
    username: "admin",
    fullName: "Ahmad Rivai (Administrator)",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    username: "kasir1",
    fullName: "Siti Rahma (Kasir Utama)",
    role: "KASIR",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    username: "kasir2",
    fullName: "Budi Santoso (Kasir Shift Sore)",
    role: "KASIR",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Seed ScaleConfig
const initialScaleConfig: ScaleConfig = {
  id: 1,
  brandKey: "CAS_SW",
  portName: "COM3",
  baudRate: 9600,
  dataBits: 8,
  parity: "None",
  stopBits: "One",
  transmissionMode: "Continuous",
  isActiveConfig: true
};

// Seed AuditLog
const initialAuditLogs: AuditLog[] = [
  {
    id: 1,
    userId: null,
    username: "SYSTEM",
    actionType: "LOGIN",
    description: "Sistem Timbangan Cerdas berhasil dijalankan. Database SQLite diinisialisasi.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 2,
    userId: 1,
    username: "admin",
    actionType: "PRODUCT_UPDATE",
    description: "Inisialisasi seed data produk berhasil diselesaikan.",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

// Seed Transactions
const initialTransactions: Transaction[] = [
  {
    id: 1,
    transactionCode: "TRX-20260710-0001",
    transactionDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    totalAmount: 110000,
    paidAmount: 150000,
    changeAmount: 40000,
    paymentMethod: "CASH",
    cashierUserId: 2,
    cashierName: "Siti Rahma (Kasir Utama)",
    status: "COMPLETED",
    items: [
      {
        id: 101,
        productId: 1,
        productNameSnapshot: "Apel Fuji Super",
        weightKg: 1.5,
        quantity: null,
        unitPrice: 45000,
        subtotal: 67500,
        isManualWeight: false
      },
      {
        id: 102,
        productId: 6,
        productNameSnapshot: "Ayam Broiler Utuh Bersih",
        weightKg: null,
        quantity: 1,
        unitPrice: 42000,
        subtotal: 42000,
        isManualWeight: false
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 2,
    transactionCode: "TRX-20260710-0002",
    transactionDate: new Date(Date.now() - 3600000 * 3).toISOString(),
    totalAmount: 41250,
    paidAmount: 50000,
    changeAmount: 8750,
    paymentMethod: "CASH",
    cashierUserId: 2,
    cashierName: "Siti Rahma (Kasir Utama)",
    status: "COMPLETED",
    items: [
      {
        id: 103,
        productId: 2,
        productNameSnapshot: "Mangga Harum Manis",
        weightKg: 1.25,
        quantity: null,
        unitPrice: 35000,
        subtotal: 43750, // 1.25 * 35000 = 43750
        isManualWeight: false
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Gagal menyimpan ke localStorage", e);
  }
}

export const dbStore = {
  getProducts: () => getStorageItem<Product[]>("tc_products", initialProducts),
  setProducts: (p: Product[]) => setStorageItem("tc_products", p),

  getUsers: () => getStorageItem<User[]>("tc_users", initialUsers),
  setUsers: (u: User[]) => setStorageItem("tc_users", u),

  getScaleConfig: () => getStorageItem<ScaleConfig>("tc_scale_config", initialScaleConfig),
  setScaleConfig: (c: ScaleConfig) => setStorageItem("tc_scale_config", c),

  getTransactions: () => getStorageItem<Transaction[]>("tc_transactions", initialTransactions),
  setTransactions: (t: Transaction[]) => setStorageItem("tc_transactions", t),

  getAuditLogs: () => getStorageItem<AuditLog[]>("tc_audit_logs", initialAuditLogs),
  setAuditLogs: (l: AuditLog[]) => setStorageItem("tc_audit_logs", l),

  addAuditLog: (userId: number | null, username: string | null, actionType: AuditLog["actionType"], description: string) => {
    const logs = getStorageItem<AuditLog[]>("tc_audit_logs", initialAuditLogs);
    const newLog: AuditLog = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      userId,
      username: username || "SYSTEM",
      actionType,
      description,
      timestamp: new Date().toISOString()
    };
    setStorageItem("tc_audit_logs", [newLog, ...logs]);
  }
};
