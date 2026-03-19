import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { initialData } from '@/data/mock-data';
import type { Appointment, AppState, Patient, QueueItem, Transaction, UserSession } from '@/types';

interface AppStore extends AppState {
  login: (session: UserSession) => void;
  logout: () => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateQueueStatus: (id: string, status: QueueItem['status']) => void;
  addTransaction: (transaction: Transaction) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialData,
      login: (session) => set({ currentUser: session }),
      logout: () => set({ currentUser: null }),
      addPatient: (patient) => set((state) => ({ patients: [patient, ...state.patients] })),
      updatePatient: (patient) => set((state) => ({ patients: state.patients.map((item) => item.id === patient.id ? patient : item) })),
      addAppointment: (appointment) => set((state) => ({ appointments: [appointment, ...state.appointments] })),
      updateAppointmentStatus: (id, status) => set((state) => ({ appointments: state.appointments.map((item) => item.id === id ? { ...item, status } : item) })),
      updateQueueStatus: (id, status) => set((state) => ({ queue: state.queue.map((item) => item.id === id ? { ...item, status } : item) })),
      addTransaction: (transaction) => set((state) => ({ transactions: [transaction, ...state.transactions] })),
    }),
    {
      name: 'qla-clinic-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        patients: state.patients,
        staff: state.staff,
        treatments: state.treatments,
        products: state.products,
        appointments: state.appointments,
        queue: state.queue,
        medicalRecords: state.medicalRecords,
        transactions: state.transactions,
        followUps: state.followUps,
        settings: state.settings,
        currentUser: state.currentUser,
      }),
    }
  )
);
