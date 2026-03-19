import { useState } from 'react';
import { Save, ShieldCheck, Smartphone, Workflow } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { AccessGuard } from '@/components/shared/access-guard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app-store';
import { getBirthdayPromoLabel } from '@/lib/utils';
import { toast } from 'sonner';

export function SettingsPage() {
  const store = useAppStore();
  const [clinicName, setClinicName] = useState(store.settings.clinicName);
  const [openingHours, setOpeningHours] = useState(store.settings.openingHours);
  const [theme, setTheme] = useState(store.settings.theme);

  return (
    <AccessGuard module="settings">
      <PageShell title="System Settings" description="Konfigurasi klinik, permission matrix per role, reminder center, service point capacity, dan audit log untuk kesiapan production.">
        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <Card>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Clinic name</label>
                  <Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Opening hours</label>
                  <Input value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Invoice prefix</label>
                  <Input value={store.settings.invoicePrefix} readOnly />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">UI theme</label>
                  <Select value={theme} onChange={setTheme} options={[{ value: 'Premium Rose', label: 'Premium Rose' }, { value: 'Soft Nude', label: 'Soft Nude' }, { value: 'Light Luxe', label: 'Light Luxe' }]} />
                </div>
              </div>
              <div className="mt-6 rounded-[24px] bg-secondary p-5 text-sm text-muted">
                Service point capacity aktif: {store.settings.servicePoints.map((item) => `${item.name} (${item.capacity})`).join(', ')}.
              </div>
              <Button className="mt-6" onClick={() => toast.success(`Settings dummy tersimpan: ${clinicName}, ${openingHours}, ${theme}`)}><Save className="h-4 w-4" /> Save settings</Button>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Permission matrix per role</h3>
                  <p className="mt-1 text-sm text-muted">Role quick switch di header terhubung ke matrix ini untuk simulasi multi akses level.</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {store.permissions.map((item) => (
                  <div key={item.role} className="rounded-2xl border border-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium">{item.role}</p>
                      <Badge variant={store.currentUser?.role === item.role ? 'gold' : 'slate'}>{store.currentUser?.role === item.role ? 'Role aktif' : 'Preview'}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.modules.map((module) => (
                        <Badge key={module} variant="pink">{module}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <div className="flex items-center gap-3">
                <Workflow className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Improvement checklist</h3>
                  <p className="mt-1 text-sm text-muted">Perubahan utama yang diminta kini dirangkum di satu panel.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  ['Logo & favicon', 'Branding baru aktif di browser dan aplikasi.'],
                  ['UI/UX lebih menarik', 'Header, sidebar, dashboard, dan login dibuat lebih premium.'],
                  ['Alur pasien jelas', 'Patient journey divisualkan dari registrasi hingga follow-up.'],
                  ['Multi akses level', 'Quick role switch + permission matrix.'],
                  ['CRUD operasional', 'Pasien, staf, dan produk sudah bisa create, update, delete.'],
                  ['Responsive mobile', 'Tabel penting punya fallback card untuk layar kecil.'],
                ].map(([title, detail]) => (
                  <div key={title} className="rounded-2xl border border-border p-4 text-sm">
                    <p className="font-medium">{title}</p>
                    <p className="mt-2 text-muted">{detail}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Reminder center</h3>
                  <p className="mt-1 text-sm text-muted">Tetap responsif dan mudah dibaca saat dibuka dari tablet atau mobile.</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {store.reminders.map((item) => {
                  const patient = store.patients.find((entry) => entry.id === item.patientId);
                  return (
                    <div key={item.id} className="rounded-2xl border border-border p-4 text-sm">
                      <p className="font-medium">{item.type}</p>
                      <p className="mt-2 text-muted">{patient?.name} • {item.channel} • {item.scheduledFor}</p>
                      <p className="mt-1 text-muted">{item.template}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 rounded-2xl bg-secondary p-4 text-sm text-muted">
                Birthday / anniversary promo policy: {getBirthdayPromoLabel(store.currentUser?.role ?? 'Admin / Front Office')}.
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold">Audit log</h3>
              <div className="mt-4 space-y-3">
                {store.auditLogs.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-border p-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{item.action}</p>
                      <span className="text-xs text-muted">{item.module}</span>
                    </div>
                    <p className="mt-2 text-muted">Actor: {item.actor}</p>
                    <p className="mt-1 text-muted">Target: {item.targetId}</p>
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
