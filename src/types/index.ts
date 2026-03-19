export type Role = 'Admin / Front Office' | 'Dokter / Aesthetic Doctor' | 'Beautician / Therapist' | 'Kasir' | 'Manager / Owner';

export type AppointmentStatus = 'booked' | 'confirmed' | 'arrived' | 'in-treatment' | 'completed' | 'cancelled';
export type QueueStatus = 'waiting' | 'screening' | 'consultation' | 'treatment' | 'billing' | 'done';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface UserSession {
  name: string;
  role: Role;
  avatar: string;
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
  status: 'Active' | 'Follow Up' | 'VIP';
  joinedAt: string;
  lastVisit: string;
  notes: string;
  beforeAfter: { before: string; after: string }[];
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

export interface TreatmentCatalog {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  type: 'Doctor' | 'Therapist' | 'Hybrid';
  popularity: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
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
  status: AppointmentStatus;
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
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  consent: boolean;
  recommendations: string[];
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

export interface ClinicSettings {
  clinicName: string;
  systemName: string;
  openingHours: string;
  invoicePrefix: string;
  paymentMethods: string[];
  theme: string;
  notifications: boolean;
}

export interface AppState {
  patients: Patient[];
  staff: Staff[];
  treatments: TreatmentCatalog[];
  products: Product[];
  appointments: Appointment[];
  queue: QueueItem[];
  medicalRecords: MedicalRecord[];
  transactions: Transaction[];
  followUps: FollowUp[];
  settings: ClinicSettings;
  currentUser: UserSession | null;
}
