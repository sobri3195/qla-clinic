import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';

export function StaffPage() {
  const staff = useAppStore((state) => state.staff);

  return (
    <PageShell title="Staff Management" description="Data dokter, beautician, therapist, kasir, manager, jadwal kerja, role tampilan, dan profil staff.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm text-muted">{member.specialty}</p>
              </div>
              <Badge variant={member.role.includes('Dokter') ? 'gold' : member.role.includes('Kasir') ? 'green' : 'pink'}>{member.role}</Badge>
            </div>
            <div className="mt-5 space-y-3 text-sm text-muted">
              <p>Schedule: {member.schedule}</p>
              <p>Patients handled: {member.patientsHandled}</p>
              <p>Rating: {member.rating}</p>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
