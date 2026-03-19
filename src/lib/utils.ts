import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Appointment, Product, Role } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export function calculateTransactionTotal(subtotal: number, discount: number, tax: number) {
  return subtotal - discount + subtotal * tax;
}

export function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export function addMinutesToTime(value: string, minutesToAdd: number) {
  const total = timeToMinutes(value) + minutesToAdd;
  const hours = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (total % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function parseOpeningHours(value: string) {
  const [start, end] = value.split('-').map((item) => item.trim());
  return { start, end };
}

export function isWithinOperatingHours(startTime: string, duration: number, openingHours: string) {
  const { start, end } = parseOpeningHours(openingHours);
  return timeToMinutes(startTime) >= timeToMinutes(start) && timeToMinutes(startTime) + duration <= timeToMinutes(end);
}

export function appointmentsOverlap(first: Pick<Appointment, 'date' | 'time' | 'duration'>, second: Pick<Appointment, 'date' | 'time' | 'duration'>) {
  if (first.date !== second.date) return false;
  const firstStart = timeToMinutes(first.time);
  const firstEnd = firstStart + first.duration;
  const secondStart = timeToMinutes(second.time);
  const secondEnd = secondStart + second.duration;
  return firstStart < secondEnd && secondStart < firstEnd;
}

export function getTierFromPoints(points: number): 'Non Member' | 'Silver' | 'Gold' | 'Platinum' {
  if (points >= 700) return 'Platinum';
  if (points >= 400) return 'Gold';
  if (points >= 150) return 'Silver';
  return 'Non Member';
}

export function getLowStockStatus(stock: number, minStock: number): Product['status'] {
  return stock <= minStock ? 'Low Stock' : 'Ready';
}

export function getBirthdayPromoLabel(role: Role) {
  return role === 'Manager / Owner' ? 'Manager approval required' : 'Eligible for auto campaign';
}

export function downloadCsv(filename: string, rows: string[][]) {
  const csvContent = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
