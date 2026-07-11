export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  pricePerKg: number; // Rupiah per Kg
  isWeighable: boolean;
  stockQty: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  id: number;
  productId: number;
  productNameSnapshot: string;
  weightKg: number | null;
  quantity: number | null;
  unitPrice: number; // Price per unit or price per Kg snapshot
  subtotal: number; // Rounded to nearest Rupiah
  isManualWeight: boolean;
}

export type PaymentMethod = "CASH" | "QRIS" | "CARD";
export type TransactionStatus = "COMPLETED" | "VOIDED";

export interface Transaction {
  id: number;
  transactionCode: string; // TRX-YYYYMMDD-####
  transactionDate: string; // ISO-8601
  totalAmount: number;
  paidAmount: number;
  changeAmount: number;
  paymentMethod: PaymentMethod;
  cashierUserId: number;
  cashierName: string;
  status: TransactionStatus;
  items: TransactionItem[];
  createdAt: string;
}

export type UserRole = "ADMIN" | "KASIR";

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export type ScaleBrand = "CAS_SW" | "DIGI_SM";
export type ScaleTransmissionMode = "Continuous" | "OnDemand";

export interface ScaleConfig {
  id: number;
  brandKey: ScaleBrand;
  portName: string;
  baudRate: number;
  dataBits: number;
  parity: "None" | "Odd" | "Even";
  stopBits: "One" | "Two";
  transmissionMode: ScaleTransmissionMode;
  isActiveConfig: boolean;
}

export interface AuditLog {
  id: number;
  userId: number | null;
  username: string | null;
  actionType: "LOGIN" | "LOGOUT" | "VOID_TRANSACTION" | "MANUAL_WEIGHT" | "PRODUCT_UPDATE" | "PRODUCT_CREATE" | "USER_CREATE" | "SCALE_CONFIG_UPDATE";
  description: string;
  timestamp: string; // ISO-8601
}

export type ScaleConnectionState = "Disconnected" | "Connecting" | "Connected" | "Error";
export type WeightStatus = "Unstable" | "Stable";
export type WeightType = "Gross" | "Net";

export interface WeightReading {
  weightKg: number;
  status: WeightStatus;
  type: WeightType;
  isNegative: boolean;
  timestamp: string;
}

export interface CSharpFile {
  path: string;
  name: string;
  project: string;
  content: string;
  language: "csharp" | "xml" | "ini" | "markdown";
}
