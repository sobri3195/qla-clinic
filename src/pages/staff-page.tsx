import { useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import { Plus, ShieldCheck, Trash2, UserRoundCog } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { AccessGuard } from '@/components/shared/access-guard';
import { useAppStore } from '@/store/app-store';
import type { Role, Staff } from '@/types';
import { toast } from 'sonner';

const roleOptions: Role[] = ['Admin / Front Office', 'Dokter / Aesthetic Doctor', 'Beautician / Therapist', 'Kasir', 'Manager / Owner'];

const emptyStaff = (): Staff => ({
  id: `staff-${nanoid(6)}`,
  name: '',
  role: 'Beautician / Therapist',
  specialty: '',
  schedule: '',
  patientsHandled: 0,
  rating: 4.8,
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
});

export function StaffPage() {
  const { staff, permissions, addStaff, updateStaff, deleteStaff } = useAppStore();
  const [form, setForm] = useState<Staff>(emptyStaff());
  const [editingId, setEditingId] = useState<string | null>(null);

  const submitLabel = editingId ? 'Update staff' : 'Add staff';
  const activeRoleModules = useMemo(() => permissions.find((item) => item.role === form.role)?.modules ?? [], [form.role, permissions]);

  const handleSubmit = () => {
    if (!form.name || !form.specialty || !form.schedule) {
      toast.error('Lengkapi nama, specialty, dan schedule terlebih dahulu.');
      return;
    }
    if (editingId) {
      updateStaff(form);
      toast.success(`Data staf ${form.name} diperbarui.`);
    } else {
      addStaff(form);
      toast.success(`Staf baru ${form.name} ditambahkan.`);
    }
    setForm(emptyStaff());
    setEditingId(null);
  };

  const startEdit = (member: Staff) => {
    setEditingId(member.id);
    setForm(member);
  };

  return (
    <AccessGuard module="staff">
      <PageShell title="Staff Management" description="Sekarang ada CRUD staf plus visual permission matrix agar multi akses level mudah dipahami dan diuji.">
        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">CRUD Staff</p>
                  <h3 className="mt-2 text-xl font-semibold">Tambah atau edit user internal.</h3>
                </div>
                <UserRoundCog className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Nama staf</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: dr. Clara" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Role</label>
                  <Select value={form.role} onChange={(value) => setForm({ ...form, role: value as Role })} options={roleOptions.map((item) => ({ value: item, label: item }))} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Specialty</label>
                  <Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="Injectable, FO, cashier, dll" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Schedule</label>
                  <Input value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Mon-Sat | 10:00-18:00" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Patients handled</label>
                  <Input type="number" value={form.patientsHandled} onChange={(e) => setForm({ ...form, patientsHandled: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Rating</label>
                  <Input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button onClick={handleSubmit} className="sm:flex-1">
                  <Plus className="h-4 w-4" /> {submitLabel}
                </Button>
                <Button variant="secondary" className="sm:flex-1" onClick={() => { setForm(emptyStaff()); setEditingId(null); }}>
                  Reset form
                </Button>
              </div>
            </Card>

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
                  <div className="mt-5 flex gap-2">
                    <Button className="flex-1" variant="secondary" onClick={() => startEdit(member)}>Edit</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        deleteStaff(member.id);
                        toast.success(`Staf ${member.name} dihapus.`);
                        if (editingId === member.id) {
                          setForm(emptyStaff());
                          setEditingId(null);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Permission preview</h3>
                  <p className="mt-1 text-sm text-muted">Saat memilih role di form, modul yang bisa diakses langsung terlihat.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeRoleModules.map((module) => (
                  <Badge key={module} variant="pink">{module}</Badge>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold">Role matrix</h3>
              <div className="mt-4 space-y-3">
                {permissions.map((item) => (
                  <div key={item.role} className="rounded-2xl border border-border p-4">
                    <p className="font-medium">{item.role}</p>
                    <p className="mt-2 text-sm text-muted">{item.modules.join(', ')}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </PageShell>
    </AccessGuard>
  );
}
