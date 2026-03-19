import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { PageShell } from '@/components/shared/page-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/app-store';
import type { Patient } from '@/types';
import { toast } from 'sonner';

export function PatientFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, addPatient, updatePatient } = useAppStore();
  const existingPatient = useMemo(() => patients.find((item) => item.id === id), [patients, id]);
  const [form, setForm] = useState<Patient>(existingPatient ?? {
    id: `pt-${nanoid(6)}`,
    medicalRecordNumber: `MR-${Math.floor(Math.random() * 900000 + 100000)}`,
    name: '', age: 25, phone: '', email: '', gender: 'Female', concern: '', skinType: '', allergies: [], memberTier: 'Non Member', loyaltyPoints: 0, status: 'Active', joinedAt: new Date().toISOString().slice(0,10), lastVisit: new Date().toISOString().slice(0,10), notes: '', beforeAfter: [{ before: 'https://placehold.co/600x400/f9e3e8/6f4d57?text=Before', after: 'https://placehold.co/600x400/e9f6f1/3f8f6b?text=After' }], treatmentHistory: [], purchaseHistory: []
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (existingPatient) {
      updatePatient(form);
      toast.success('Data pasien diperbarui');
    } else {
      addPatient(form);
      toast.success('Pasien baru berhasil ditambahkan');
    }
    navigate('/patients');
  };

  return (
    <PageShell title={existingPatient ? 'Edit patient' : 'Add patient'} description="Frontend-only CRUD pasien dengan localStorage persistence.">
      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium">Nama pasien</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Usia</label>
            <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Telepon</label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Concern utama</label>
            <Input value={form.concern} onChange={(e) => setForm({ ...form, concern: e.target.value })} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Jenis kulit</label>
            <Input value={form.skinType} onChange={(e) => setForm({ ...form, skinType: e.target.value })} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Member tier</label>
            <Select value={form.memberTier} onChange={(value) => setForm({ ...form, memberTier: value as Patient['memberTier'] })} options={['Non Member','Silver','Gold','Platinum'].map((item) => ({ value: item, label: item }))} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Status pasien</label>
            <Select value={form.status} onChange={(value) => setForm({ ...form, status: value as Patient['status'] })} options={['Active','Follow Up','VIP'].map((item) => ({ value: item, label: item }))} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Catatan klinis singkat</label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/patients')}>Cancel</Button>
            <Button type="submit">Save patient</Button>
          </div>
        </form>
      </Card>
    </PageShell>
  );
}
