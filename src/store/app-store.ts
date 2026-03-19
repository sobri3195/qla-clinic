import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { initialData } from '@/data/mock-data';
import { getLowStockStatus, getTierFromPoints } from '@/lib/utils';
import type { Appointment, AppState, MedicalRecord, Patient, Product, QueueItem, Role, Staff, Transaction, UserSession } from '@/types';

interface AppStore extends AppState {
  login: (session: UserSession) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  addStaff: (staff: Staff) => void;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  checkInAppointment: (appointmentId: string, actor: string) => void;
  advanceQueueStatus: (id: string, actor: string) => void;
  saveMedicalRecord: (record: MedicalRecord, actor: string) => void;
  addTransaction: (transaction: Transaction, actor: string) => void;
}

const nextQueueStatusMap: Record<QueueItem['status'], QueueItem['status']> = {
  waiting: 'consultation',
  consultation: 'treatment',
  treatment: 'billing',
  billing: 'done',
  done: 'done',
};

const appointmentStatusByQueue: Record<QueueItem['status'], Appointment['status']> = {
  waiting: 'arrived',
  consultation: 'arrived',
  treatment: 'in-treatment',
  billing: 'in-treatment',
  done: 'completed',
};

const createAudit = (actor: string, module: AppState['auditLogs'][number]['module'], action: string, targetId: string) => ({
  id: `audit-${crypto.randomUUID().slice(0, 8)}`,
  actor,
  module,
  action,
  targetId,
  timestamp: new Date().toISOString(),
});

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialData,
      login: (session) => set({ currentUser: session }),
      logout: () => set({ currentUser: null }),
      switchRole: (role) =>
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, role } : state.currentUser,
        })),
      addPatient: (patient) =>
        set((state) => ({
          patients: [patient, ...state.patients],
          auditLogs: [createAudit(state.currentUser?.name ?? 'System', 'patients', 'Create patient', patient.id), ...state.auditLogs],
        })),
      updatePatient: (patient) =>
        set((state) => ({
          patients: state.patients.map((item) => (item.id === patient.id ? patient : item)),
          auditLogs: [createAudit(state.currentUser?.name ?? 'System', 'patients', 'Update patient', patient.id), ...state.auditLogs],
        })),
      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((item) => item.id !== id),
          appointments: state.appointments.filter((item) => item.patientId !== id),
          queue: state.queue.filter((item) => item.patientId !== id),
          medicalRecords: state.medicalRecords.filter((item) => item.patientId !== id),
          transactions: state.transactions.filter((item) => item.patientId !== id),
          followUps: state.followUps.filter((item) => item.patientId !== id),
          reminders: state.reminders.filter((item) => item.patientId !== id),
          treatmentPackages: state.treatmentPackages.map((pkg) => ({
            ...pkg,
            activePatients: pkg.activePatients.filter((entry) => entry.patientId !== id),
          })),
          auditLogs: [createAudit(state.currentUser?.name ?? 'System', 'patients', 'Delete patient', id), ...state.auditLogs],
        })),
      addStaff: (staff) =>
        set((state) => ({
          staff: [staff, ...state.staff],
          auditLogs: [createAudit(state.currentUser?.name ?? 'System', 'staff', 'Create staff', staff.id), ...state.auditLogs],
        })),
      updateStaff: (staff) =>
        set((state) => ({
          staff: state.staff.map((item) => (item.id === staff.id ? staff : item)),
          auditLogs: [createAudit(state.currentUser?.name ?? 'System', 'staff', 'Update staff', staff.id), ...state.auditLogs],
        })),
      deleteStaff: (id) =>
        set((state) => ({
          staff: state.staff.filter((item) => item.id !== id),
          auditLogs: [createAudit(state.currentUser?.name ?? 'System', 'staff', 'Delete staff', id), ...state.auditLogs],
        })),
      addProduct: (product) =>
        set((state) => ({
          products: [product, ...state.products],
          auditLogs: [createAudit(state.currentUser?.name ?? 'System', 'products', 'Create product', product.id), ...state.auditLogs],
        })),
      updateProduct: (product) =>
        set((state) => ({
          products: state.products.map((item) => (item.id === product.id ? { ...product, status: getLowStockStatus(product.stock, product.minStock) } : item)),
          auditLogs: [createAudit(state.currentUser?.name ?? 'System', 'products', 'Update product', product.id), ...state.auditLogs],
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((item) => item.id !== id),
          inventoryLogs: state.inventoryLogs.filter((item) => item.productId !== id),
          purchaseOrders: state.purchaseOrders.map((order) => ({
            ...order,
            items: order.items.filter((item) => item.productId !== id),
          })),
          treatments: state.treatments.map((treatment) => ({
            ...treatment,
            consumables: treatment.consumables.filter((entry) => entry.productId !== id),
          })),
          auditLogs: [createAudit(state.currentUser?.name ?? 'System', 'products', 'Delete product', id), ...state.auditLogs],
        })),
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [appointment, ...state.appointments],
          auditLogs: [
            createAudit(state.currentUser?.name ?? 'System', 'appointments', appointment.waitingList ? 'Create waiting list booking' : 'Create booking', appointment.id),
            ...state.auditLogs,
          ],
        })),
      updateAppointmentStatus: (id, status) => set((state) => ({ appointments: state.appointments.map((item) => (item.id === id ? { ...item, status } : item)) })),
      checkInAppointment: (appointmentId, actor) =>
        set((state) => {
          const appointment = state.appointments.find((item) => item.id === appointmentId);
          if (!appointment || state.queue.some((item) => item.appointmentId === appointmentId)) return state;
          const nextNumber = `A-${String(state.queue.length + 1).padStart(2, '0')}`;
          return {
            appointments: state.appointments.map((item) => (item.id === appointmentId ? { ...item, status: 'arrived' } : item)),
            queue: [
              {
                id: `q-${crypto.randomUUID().slice(0, 6)}`,
                patientId: appointment.patientId,
                appointmentId,
                queueNumber: nextNumber,
                servicePoint: appointment.servicePoint,
                status: 'waiting',
                etaMinutes: 15,
                updatedBy: actor,
                updatedAt: new Date().toISOString(),
              },
              ...state.queue,
            ],
            auditLogs: [createAudit(actor, 'queue', 'Check-in from appointment', appointmentId), ...state.auditLogs],
          };
        }),
      advanceQueueStatus: (id, actor) =>
        set((state) => {
          const queueItem = state.queue.find((item) => item.id === id);
          if (!queueItem) return state;
          const nextStatus = nextQueueStatusMap[queueItem.status];
          return {
            queue: state.queue.map((item) =>
              item.id === id
                ? {
                    ...item,
                    status: nextStatus,
                    etaMinutes: nextStatus === 'done' ? 0 : Math.max(item.etaMinutes - 10, 5),
                    updatedBy: actor,
                    updatedAt: new Date().toISOString(),
                  }
                : item
            ),
            appointments: state.appointments.map((appointment) =>
              appointment.id === queueItem.appointmentId ? { ...appointment, status: appointmentStatusByQueue[nextStatus] } : appointment
            ),
            auditLogs: [createAudit(actor, 'queue', `Move queue to ${nextStatus}`, id), ...state.auditLogs],
          };
        }),
      saveMedicalRecord: (record, actor) =>
        set((state) => {
          const exists = state.medicalRecords.some((item) => item.id === record.id);
          return {
            medicalRecords: exists ? state.medicalRecords.map((item) => (item.id === record.id ? record : item)) : [record, ...state.medicalRecords],
            auditLogs: [createAudit(actor, 'consultation', exists ? 'Update medical record' : 'Create medical record', record.id), ...state.auditLogs],
          };
        }),
      addTransaction: (transaction, actor) =>
        set((state) => {
          const earnedPoints = Math.floor(transaction.items.reduce((sum, item) => sum + item.qty * item.price, 0) / 100000);
          const patient = state.patients.find((item) => item.id === transaction.patientId);
          const nextPoints = Math.max((patient?.loyaltyPoints ?? 0) - transaction.pointsRedeemed + earnedPoints, 0);

          return {
            transactions: [transaction, ...state.transactions],
            patients: state.patients.map((item) =>
              item.id === transaction.patientId
                ? {
                    ...item,
                    loyaltyPoints: nextPoints,
                    memberTier: getTierFromPoints(nextPoints),
                    purchaseHistory: [...transaction.items.filter((entry) => entry.type === 'product').map((entry) => entry.label), ...item.purchaseHistory].slice(0, 8),
                  }
                : item
            ),
            products: state.products.map((product) => {
              const directSaleQty = transaction.items
                .filter((item) => item.type === 'product' && item.label === product.name)
                .reduce((sum, item) => sum + item.qty, 0);
              const consumableQty = transaction.items
                .filter((item) => item.type === 'treatment')
                .reduce((sum, item) => {
                  const treatment = state.treatments.find((catalog) => catalog.name === item.label);
                  const consumable = treatment?.consumables.find((entry) => entry.productId === product.id);
                  return sum + (consumable?.qty ?? 0) * item.qty;
                }, 0);
              const nextStock = Math.max(product.stock - directSaleQty - consumableQty, 0);
              return { ...product, stock: nextStock, status: getLowStockStatus(nextStock, product.minStock) };
            }),
            inventoryLogs: [
              ...transaction.items.flatMap((item) => {
                if (item.type === 'product') {
                  const product = state.products.find((entry) => entry.name === item.label);
                  return product
                    ? [{ id: `inv-${crypto.randomUUID().slice(0, 8)}`, productId: product.id, type: 'sale' as const, qty: -item.qty, date: transaction.date, notes: 'Auto deduction from cashier checkout', reference: transaction.id }]
                    : [];
                }
                const treatment = state.treatments.find((entry) => entry.name === item.label);
                return (treatment?.consumables ?? []).map((consumable) => ({
                  id: `inv-${crypto.randomUUID().slice(0, 8)}`,
                  productId: consumable.productId,
                  type: 'consumable' as const,
                  qty: -(consumable.qty * item.qty),
                  date: transaction.date,
                  notes: `Consumable usage from ${item.label}`,
                  reference: transaction.id,
                }));
              }),
              ...state.inventoryLogs,
            ],
            auditLogs: [createAudit(actor, 'cashier', 'Checkout transaction', transaction.id), ...state.auditLogs],
          };
        }),
    }),
    {
      name: 'qla-clinic-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        patients: state.patients,
        staff: state.staff,
        treatments: state.treatments,
        treatmentPackages: state.treatmentPackages,
        products: state.products,
        appointments: state.appointments,
        queue: state.queue,
        medicalRecords: state.medicalRecords,
        transactions: state.transactions,
        followUps: state.followUps,
        inventoryLogs: state.inventoryLogs,
        purchaseOrders: state.purchaseOrders,
        reminders: state.reminders,
        auditLogs: state.auditLogs,
        permissions: state.permissions,
        settings: state.settings,
        currentUser: state.currentUser,
      }),
    }
  )
);
