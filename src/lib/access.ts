import type { PermissionModule, Role } from '@/types';

export const rolePermissions: Record<Role, PermissionModule[]> = {
  'Admin / Front Office': ['dashboard', 'patients', 'appointments', 'queue', 'medical-records', 'treatments', 'products', 'invoice'],
  'Dokter / Aesthetic Doctor': ['dashboard', 'patients', 'queue', 'consultation', 'medical-records'],
  'Beautician / Therapist': ['dashboard', 'patients', 'queue', 'treatments'],
  Kasir: ['dashboard', 'cashier', 'invoice', 'products'],
  'Manager / Owner': ['dashboard', 'patients', 'appointments', 'queue', 'consultation', 'medical-records', 'treatments', 'products', 'cashier', 'invoice', 'reports', 'staff', 'settings'],
};

export function canAccessModule(role: Role | undefined, module: PermissionModule) {
  if (!role) return false;
  return rolePermissions[role]?.includes(module) ?? false;
}
