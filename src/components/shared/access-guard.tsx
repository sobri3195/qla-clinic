import type React from 'react';
import { ShieldAlert } from 'lucide-react';
import { canAccessModule } from '@/lib/access';
import { useAppStore } from '@/store/app-store';
import { Card } from '@/components/ui/card';
import type { PermissionModule } from '@/types';

export function AccessGuard({ module, children }: { module: PermissionModule; children: React.ReactNode }) {
  const currentUser = useAppStore((state) => state.currentUser);
  if (canAccessModule(currentUser?.role, module)) return <>{children}</>;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-1 h-5 w-5 text-rose-500" />
        <div>
          <h3 className="text-lg font-semibold">Access restricted</h3>
          <p className="mt-2 text-sm text-muted">Role {currentUser?.role ?? 'Unknown'} tidak memiliki izin untuk modul {module}. Gunakan akun yang sesuai sesuai permission matrix.</p>
        </div>
      </div>
    </Card>
  );
}
