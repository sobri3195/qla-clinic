import { addDays, format } from 'date-fns';
import type { AppState } from '@/types';

const today = new Date();

export const initialData: AppState = {
  currentUser: {
    name: 'Nadya Prameswari',
    role: 'Admin / Front Office',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  settings: {
    clinicName: 'QLA Clinic',
    systemName: 'QLA Clinic Management System',
    openingHours: '09:00 - 21:00',
    invoicePrefix: 'QLA-INV',
    paymentMethods: ['tunai', 'debit', 'transfer', 'e-wallet'],
    theme: 'Premium Rose',
    notifications: true,
  },
  staff: [
    { id: 'staff-1', name: 'dr. Keisya Larasati', role: 'Dokter / Aesthetic Doctor', specialty: 'Injectable & Anti-aging', schedule: 'Mon-Sat | 10:00-18:00', patientsHandled: 24, rating: 4.9, avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80' },
    { id: 'staff-2', name: 'dr. Alicia Wibowo', role: 'Dokter / Aesthetic Doctor', specialty: 'Acne & Brightening', schedule: 'Tue-Sun | 11:00-19:00', patientsHandled: 18, rating: 4.8, avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80' },
    { id: 'staff-3', name: 'Mey Tan', role: 'Beautician / Therapist', specialty: 'Facial Premium & Peeling', schedule: 'Daily | 09:00-17:00', patientsHandled: 31, rating: 4.9, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
    { id: 'staff-4', name: 'Vania Liem', role: 'Beautician / Therapist', specialty: 'Laser & Microneedling', schedule: 'Daily | 12:00-20:00', patientsHandled: 27, rating: 4.7, avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=200&q=80' },
    { id: 'staff-5', name: 'Raka Putra', role: 'Kasir', specialty: 'Cashier & Membership', schedule: 'Daily | 09:00-21:00', patientsHandled: 46, rating: 4.8, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  ],
  treatments: [
    { id: 'tr-1', name: 'Signature Hydra Facial', category: 'facial', price: 850000, duration: 60, type: 'Therapist', popularity: 92 },
    { id: 'tr-2', name: 'Glow Peeling Therapy', category: 'peeling', price: 650000, duration: 45, type: 'Doctor', popularity: 80 },
    { id: 'tr-3', name: 'Microdermabrasion Pro', category: 'mikrodermabrasi', price: 780000, duration: 50, type: 'Therapist', popularity: 76 },
    { id: 'tr-4', name: 'Laser Rejuvenation', category: 'laser', price: 1850000, duration: 75, type: 'Doctor', popularity: 88 },
    { id: 'tr-5', name: 'Botox Sculpting', category: 'botox', price: 3250000, duration: 40, type: 'Doctor', popularity: 84 },
    { id: 'tr-6', name: 'Filler Contour Deluxe', category: 'filler', price: 4500000, duration: 50, type: 'Doctor', popularity: 67 },
    { id: 'tr-7', name: 'PRP Skin Revival', category: 'PRP', price: 2750000, duration: 70, type: 'Hybrid', popularity: 71 },
    { id: 'tr-8', name: 'Microneedling Glass Skin', category: 'microneedling', price: 2100000, duration: 80, type: 'Hybrid', popularity: 90 },
    { id: 'tr-9', name: 'Infus Whitening Luxe', category: 'infus whitening', price: 950000, duration: 55, type: 'Therapist', popularity: 65 },
    { id: 'tr-10', name: 'Slimming Body Sculpt', category: 'slimming treatment', price: 1500000, duration: 60, type: 'Therapist', popularity: 58 },
    { id: 'tr-11', name: 'Acne Reset Program', category: 'acne treatment', price: 720000, duration: 50, type: 'Doctor', popularity: 87 },
    { id: 'tr-12', name: 'Brightening Infusion', category: 'brightening treatment', price: 1180000, duration: 65, type: 'Hybrid', popularity: 82 }
  ],
  products: [
    { id: 'prd-1', name: 'QLA Gentle Cleanser', category: 'Cleanser', price: 185000, stock: 42, recommendationFor: 'Sensitive skin', status: 'Ready' },
    { id: 'prd-2', name: 'QLA Acne Defense Serum', category: 'Serum', price: 325000, stock: 18, recommendationFor: 'Acne prone', status: 'Ready' },
    { id: 'prd-3', name: 'QLA Brightening Essence', category: 'Essence', price: 410000, stock: 10, recommendationFor: 'Dull skin', status: 'Low Stock' },
    { id: 'prd-4', name: 'QLA Barrier Repair Moisturizer', category: 'Moisturizer', price: 295000, stock: 24, recommendationFor: 'Dry & compromised skin', status: 'Ready' },
    { id: 'prd-5', name: 'QLA UV Shield SPF50', category: 'Sunscreen', price: 265000, stock: 30, recommendationFor: 'Post-treatment', status: 'Ready' },
  ],
  patients: [
    {
      id: 'pt-1', medicalRecordNumber: 'MR-240301', name: 'Nabila Amara', age: 27, phone: '0812-1111-2222', email: 'nabila@qla-demo.com', gender: 'Female', concern: 'Acne scars & uneven texture', skinType: 'Combination Acne-Prone', allergies: ['AHA tinggi'], memberTier: 'Gold', loyaltyPoints: 420, status: 'VIP', joinedAt: '2025-09-12', lastVisit: format(today, 'yyyy-MM-dd'), notes: 'Prefer afternoon sessions. Comfortable with microneedling + LED.', beforeAfter: [{ before: 'https://placehold.co/600x400/f9e3e8/6f4d57?text=Before+Week+1', after: 'https://placehold.co/600x400/e9f6f1/3f8f6b?text=After+Week+8' }], treatmentHistory: ['Microneedling Glass Skin', 'Acne Reset Program', 'LED calming therapy'], purchaseHistory: ['QLA Acne Defense Serum', 'QLA UV Shield SPF50']
    },
    {
      id: 'pt-2', medicalRecordNumber: 'MR-240302', name: 'Catherine Wijaya', age: 34, phone: '0813-3333-4444', email: 'catherine@qla-demo.com', gender: 'Female', concern: 'Fine lines & skin dullness', skinType: 'Dry Mature', allergies: ['Fragrance'], memberTier: 'Platinum', loyaltyPoints: 890, status: 'Follow Up', joinedAt: '2024-12-20', lastVisit: format(addDays(today, -3), 'yyyy-MM-dd'), notes: 'Interested in anti-aging package and homecare recommendations.', beforeAfter: [{ before: 'https://placehold.co/600x400/f6ebe6/7d5c61?text=Before+Contour', after: 'https://placehold.co/600x400/f5f7ec/53735f?text=After+Contour' }], treatmentHistory: ['Botox Sculpting', 'Laser Rejuvenation'], purchaseHistory: ['QLA Brightening Essence', 'QLA Barrier Repair Moisturizer']
    },
    {
      id: 'pt-3', medicalRecordNumber: 'MR-240303', name: 'Michelle Santoso', age: 29, phone: '0812-5555-8888', email: 'michelle@qla-demo.com', gender: 'Female', concern: 'Hyperpigmentation & glow maintenance', skinType: 'Normal', allergies: ['None'], memberTier: 'Silver', loyaltyPoints: 190, status: 'Active', joinedAt: '2025-05-03', lastVisit: format(addDays(today, -12), 'yyyy-MM-dd'), notes: 'Often books weekend appointments with therapist Mey.', beforeAfter: [{ before: 'https://placehold.co/600x400/f7e9e8/7a5b67?text=Before+Pigment', after: 'https://placehold.co/600x400/ecf7f2/507562?text=After+Brightening' }], treatmentHistory: ['Brightening Infusion', 'Signature Hydra Facial'], purchaseHistory: ['QLA Gentle Cleanser', 'QLA UV Shield SPF50']
    }
  ],
  appointments: [
    { id: 'apt-1', patientId: 'pt-1', doctorId: 'staff-2', therapistId: 'staff-4', treatmentId: 'tr-8', date: format(today, 'yyyy-MM-dd'), time: '10:00', status: 'arrived', notes: 'Review progress post session 2.' },
    { id: 'apt-2', patientId: 'pt-2', doctorId: 'staff-1', therapistId: 'staff-3', treatmentId: 'tr-5', date: format(today, 'yyyy-MM-dd'), time: '13:30', status: 'confirmed', notes: 'Botox retouch and skin hydration add-on.' },
    { id: 'apt-3', patientId: 'pt-3', doctorId: 'staff-2', therapistId: 'staff-3', treatmentId: 'tr-12', date: format(addDays(today, 1), 'yyyy-MM-dd'), time: '15:00', status: 'booked', notes: 'Brightening package monthly visit.' }
  ],
  queue: [
    { id: 'q-1', patientId: 'pt-1', appointmentId: 'apt-1', queueNumber: 'A-01', servicePoint: 'Consultation Room 2', status: 'consultation', etaMinutes: 5 },
    { id: 'q-2', patientId: 'pt-2', appointmentId: 'apt-2', queueNumber: 'A-02', servicePoint: 'Lobby Waiting Area', status: 'waiting', etaMinutes: 25 }
  ],
  medicalRecords: [
    { id: 'mr-1', patientId: 'pt-1', doctorId: 'staff-2', visitDate: format(today, 'yyyy-MM-dd'), complaint: 'Bekas jerawat kemerahan dan tekstur kasar', skinCondition: 'Post acne erythema, mild inflammation', area: 'Cheek & forehead', allergies: 'AHA tinggi', previousTreatment: 'Microneedling session #2', diagnosis: 'Acne scarring with compromised skin barrier', soap: { subjective: 'Patient reports redness improved 40% since last visit.', objective: 'Texture smoother, pores still visible on cheeks.', assessment: 'Suitable for session #3 with calming serum.', plan: 'Continue microneedling, add barrier repair homecare and sunscreen.' }, consent: true, recommendations: ['Microneedling Glass Skin', 'QLA Barrier Repair Moisturizer', 'QLA UV Shield SPF50'], photos: ['https://placehold.co/600x400/f9e3e8/6f4d57?text=Patient+Photo+1', 'https://placehold.co/600x400/e9f6f1/3f8f6b?text=Patient+Photo+2'] }
  ],
  transactions: [
    { id: 'txn-1', patientId: 'pt-2', cashierId: 'staff-5', date: format(addDays(today, -1), 'yyyy-MM-dd'), items: [{ id: 'i-1', type: 'treatment', label: 'Laser Rejuvenation', qty: 1, price: 1850000 }, { id: 'i-2', type: 'product', label: 'QLA Brightening Essence', qty: 1, price: 410000 }], discount: 150000, tax: 0.11, paymentMethod: 'debit', paymentStatus: 'paid', memberPricing: true },
    { id: 'txn-2', patientId: 'pt-1', cashierId: 'staff-5', date: format(today, 'yyyy-MM-dd'), items: [{ id: 'i-3', type: 'treatment', label: 'Microneedling Glass Skin', qty: 1, price: 2100000 }, { id: 'i-4', type: 'product', label: 'QLA UV Shield SPF50', qty: 1, price: 265000 }], discount: 200000, tax: 0.11, paymentMethod: 'transfer', paymentStatus: 'partial', memberPricing: true }
  ],
  followUps: [
    { id: 'fu-1', patientId: 'pt-1', dueDate: format(addDays(today, 14), 'yyyy-MM-dd'), status: 'Scheduled', progress: 'Check redness, hydration level, and acne scar response.', satisfaction: 5 },
    { id: 'fu-2', patientId: 'pt-2', dueDate: format(addDays(today, 7), 'yyyy-MM-dd'), status: 'Contacted', progress: 'Botox movement review and top-up decision pending.', satisfaction: 4 }
  ]
};
