import { useState } from 'react';
import { Save } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAppStore } from '@/store/app-store';
import { toast } from 'sonner';

export function SettingsPage() {
  const store = useAppStore();
  const [clinicName, setClinicName] = useState(store.settings.clinicName);
  const [openingHours, setOpeningHours] = useState(store.settings.openingHours);
  const [theme, setTheme] = useState(store.settings.theme);

  return (
    <PageShell title="System Settings" description="Profil klinik, logo QLA Clinic, jam operasional, invoice prefix, metode pembayaran, tema UI, dan notifikasi dummy.">
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
          QLA Clinic Management System dirancang frontend-only, siap dideploy ke Vercel, dan mudah dikembangkan ke fullstack pada fase berikutnya.
        </div>
        <Button className="mt-6" onClick={() => toast.success(`Settings dummy tersimpan: ${clinicName}, ${openingHours}, ${theme}`)}><Save className="h-4 w-4" /> Save dummy settings</Button>
      </Card>
    </PageShell>
  );
}
