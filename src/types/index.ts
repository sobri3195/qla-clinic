export type Role = 'Admin / Front Office' | 'Dokter / Aesthetic Doctor' | 'Beautician / Therapist' | 'Kasir' | 'Manager / Owner';

export type AppointmentStatus = 'booked' | 'confirmed' | 'arrived' | 'in-treatment' | 'completed' | 'cancelled' | 'waiting-list';
export type QueueStatus = 'waiting' | 'consultation' | 'treatment' | 'billing' | 'done';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type PermissionModule = 'dashboard' | 'patients' | 'appointments' | 'queue' | 'consultation' | 'medical-records' | 'treatments' | 'products' | 'cashier' | 'invoice' | 'reports' | 'staff' | 'settings';

export interface UserSession {
  name: string;
  role: Role;
  avatar: string;
}

export interface BeforeAfterEntry {
  visitDate: string;
  sessionLabel: string;
  area: string;
  before: string;
  after: string;
  progressNotes: string;
  consentUsage: boolean;
}

export interface Patient {
  id: string;
  medicalRecordNumber: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  gender: 'Female' | 'Male';
  concern: string;
  skinType: string;
  allergies: string[];
  memberTier: 'Non Member' | 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints: number;
  referralCode: string;
  referredBy?: string;
  status: 'Active' | 'Follow Up' | 'VIP';
  joinedAt: string;
  lastVisit: string;
  notes: string;
  beautyGoals: string[];
  avoidedIngredients: string[];
  preferredTreatmentIntensity: 'Gentle' | 'Moderate' | 'Intensive';
  routineCompliance: number;
  selfieReminderOptIn: boolean;
  beforeAfter: BeforeAfterEntry[];
  treatmentHistory: string[];
  purchaseHistory: string[];
}

export interface Staff {
  id: string;
  name: string;
  role: Role | 'Beautician / Therapist';
  specialty: string;
  schedule: string;
  patientsHandled: number;
  rating: number;
  avatar: string;
}

export interface TreatmentConsumable {
  productId: string;
  qty: number;
}

export interface TreatmentCatalog {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  type: 'Doctor' | 'Therapist' | 'Hybrid';
  popularity: number;
  concernTags: string[];
  downtimeDays: number;
  resultWindow: string;
  consumables: TreatmentConsumable[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  regimenStep: string;
  heroIngredient: string;
  price: number;
  stock: number;
  minStock: number;
  supplier: string;
  recommendationFor: string;
  status: 'Ready' | 'Low Stock';
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  therapistId?: string;
  treatmentId: string;
  date: string;
  time: string;
  duration: number;
  roomId: string;
  servicePoint: string;
  status: AppointmentStatus;
  overbookingRisk: 'safe' | 'warning' | 'overbooked';
  waitingList: boolean;
  notes: string;
}

export interface QueueItem {
  id: string;
  patientId: string;
  appointmentId: string;
  queueNumber: string;
  servicePoint: string;
  status: QueueStatus;
  etaMinutes: number;
  updatedBy: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  visitDate: string;
  complaint: string;
  skinCondition: string;
  area: string;
  allergies: string;
  previousTreatment: string;
  diagnosis: string;
  concernTemplate: string;
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  consent: boolean;
  consentChecklist: string[];
  recommendations: string[];
  homecarePlan: string[];
  photos: string[];
}

export interface TransactionItem {
  id: string;
  type: 'treatment' | 'product';
  label: string;
  qty: number;
  price: number;
}

export interface Transaction {
  id: string;
  patientId: string;
  cashierId: string;
  date: string;
  items: TransactionItem[];
  discount: number;
  tax: number;
  pointsRedeemed: number;
  paymentMethod: 'tunai' | 'debit' | 'transfer' | 'e-wallet';
  paymentStatus: PaymentStatus;
  memberPricing: boolean;
}

export interface FollowUp {
  id: string;
  patientId: string;
  dueDate: string;
  status: 'Scheduled' | 'Contacted' | 'Completed';
  progress: string;
  satisfaction: number;
}

export interface TreatmentPackage {
  id: string;
  name: string;
  targetConcern: string;
  bundledTreatmentIds: string[];
  bundledProductIds: string[];
  sessionsIncluded: number;
  expiryDays: number;
  price: number;
  activePatients: {
    patientId: string;
    sessionsUsed: number;
    totalSessions: number;
    expiresAt: string;
    nextSessionDate: string;
  }[];
}

export interface InventoryLog {
  id: string;
  productId: string;
  type: 'sale' | 'consumable' | 'restock' | 'purchase-order';
  qty: number;
  date: string;
  notes: string;
  reference: string;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  expectedDate: string;
  status: 'Draft' | 'Ordered' | 'Received';
  items: {
    productId: string;
    qty: number;
    cost: number;
  }[];
}

export interface ReminderLog {
  id: string;
  patientId: string;
  type: 'appointment-h-1' | 'follow-up-h+3' | 'follow-up-h+7' | 'no-show-recovery' | 'review-request' | 'birthday';
  channel: 'WhatsApp' | 'Email' | 'SMS';
  scheduledFor: string;
  status: 'Scheduled' | 'Sent' | 'Delivered';
  template: string;
  notes: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  module: PermissionModule;
  action: string;
  targetId: string;
  timestamp: string;
}

export interface PermissionMatrixEntry {
  role: Role;
  modules: PermissionModule[];
}

export interface ClinicSettings {
  clinicName: string;
  systemName: string;
  openingHours: string;
  invoicePrefix: string;
  paymentMethods: string[];
  theme: string;
  notifications: boolean;
  servicePoints: {
    id: string;
    name: string;
    capacity: number;
  }[];
}

export interface AppState {
  patients: Patient[];
  staff: Staff[];
  treatments: TreatmentCatalog[];
  treatmentPackages: TreatmentPackage[];
  products: Product[];
  appointments: Appointment[];
  queue: QueueItem[];
  medicalRecords: MedicalRecord[];
  transactions: Transaction[];
  followUps: FollowUp[];
  inventoryLogs: InventoryLog[];
  purchaseOrders: PurchaseOrder[];
  reminders: ReminderLog[];
  auditLogs: AuditLog[];
  permissions: PermissionMatrixEntry[];
  settings: ClinicSettings;
  currentUser: UserSession | null;
}
