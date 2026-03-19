import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { initialData } from '@/data/mock-data';
import { getLowStockStatus, getTierFromPoints } from '@/lib/utils';
import type { Appointment, AppState, MedicalRecord, Patient, QueueItem, Transaction, UserSession } from '@/types';

interface AppStore extends AppState {
  login: (session: UserSession) => void;
  logout: () => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
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

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialData,
      login: (session) => set({ currentUser: session }),
      logout: () => set({ currentUser: null }),
      addPatient: (patient) => set((state) => ({ patients: [patient, ...state.patients] })),
      updatePatient: (patient) => set((state) => ({ patients: state.patients.map((item) => (item.id === patient.id ? patient : item)) })),
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [appointment, ...state.appointments],
          auditLogs: [
            {
              id: `audit-${crypto.randomUUID().slice(0, 8)}`,
              actor: state.currentUser?.name ?? 'System',
              module: 'appointments',
              action: appointment.waitingList ? 'Create waiting list booking' : 'Create booking',
              targetId: appointment.id,
              timestamp: new Date().toISOString(),
            },
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
            auditLogs: [
              { id: `audit-${crypto.randomUUID().slice(0, 8)}`, actor, module: 'queue', action: 'Check-in from appointment', targetId: appointmentId, timestamp: new Date().toISOString() },
              ...state.auditLogs,
            ],
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
            auditLogs: [
              { id: `audit-${crypto.randomUUID().slice(0, 8)}`, actor, module: 'queue', action: `Move queue to ${nextStatus}`, targetId: id, timestamp: new Date().toISOString() },
              ...state.auditLogs,
            ],
          };
        }),
      saveMedicalRecord: (record, actor) =>
        set((state) => {
          const exists = state.medicalRecords.some((item) => item.id === record.id);
          return {
            medicalRecords: exists ? state.medicalRecords.map((item) => (item.id === record.id ? record : item)) : [record, ...state.medicalRecords],
            auditLogs: [
              { id: `audit-${crypto.randomUUID().slice(0, 8)}`, actor, module: 'consultation', action: exists ? 'Update medical record' : 'Create medical record', targetId: record.id, timestamp: new Date().toISOString() },
              ...state.auditLogs,
            ],
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
                    purchaseHistory: [
                      ...transaction.items.filter((entry) => entry.type === 'product').map((entry) => entry.label),
                      ...item.purchaseHistory,
                    ].slice(0, 8),
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
            auditLogs: [
              { id: `audit-${crypto.randomUUID().slice(0, 8)}`, actor, module: 'cashier', action: 'Checkout transaction', targetId: transaction.id, timestamp: new Date().toISOString() },
              ...state.auditLogs,
            ],
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
