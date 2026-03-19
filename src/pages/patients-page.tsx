import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, UserRound } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useAppStore } from '@/store/app-store';
import { toast } from 'sonner';

export function PatientsPage() {
  const navigate = useNavigate();
  const { patients, deletePatient } = useAppStore();
  const [query, setQuery] = useState('');

  const filteredPatients = useMemo(
    () => patients.filter((patient) => [patient.name, patient.concern, patient.memberTier, patient.medicalRecordNumber].join(' ').toLowerCase().includes(query.toLowerCase())),
    [patients, query]
  );

  return (
    <PageShell
      title="Patients"
      description="Manajemen pasien kini lebih jelas: ada ringkasan journey, CRUD pasien, dan tampilan data yang nyaman di desktop maupun mobile."
      actions={
        <Button onClick={() => navigate('/patients/new')}>
          <Plus className="h-4 w-4" /> Add patient
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" placeholder="Cari nama, MRN, concern, member tier..." />
          </div>
          <div className="mt-5 hidden overflow-x-auto lg:block">
            <Table>
              <THead>
                <TR>
                  <TH>Patient</TH>
                  <TH>Concern</TH>
                  <TH>Skin Type</TH>
                  <TH>Membership</TH>
                  <TH>Last Visit</TH>
                  <TH>Status</TH>
                  <TH>Aksi</TH>
                </TR>
              </THead>
              <TBody>
                {filteredPatients.map((patient) => (
                  <TR key={patient.id}>
                    <TD>
                      <Link to={`/patients/${patient.id}`} className="font-medium hover:text-primary">{patient.name}</Link>
                      <p className="mt-1 text-xs text-muted">{patient.medicalRecordNumber} • {patient.phone}</p>
                    </TD>
                    <TD>{patient.concern}</TD>
                    <TD>{patient.skinType}</TD>
                    <TD><Badge variant={patient.memberTier === 'Platinum' ? 'gold' : 'pink'}>{patient.memberTier}</Badge></TD>
                    <TD>{patient.lastVisit}</TD>
                    <TD><Badge variant={patient.status === 'VIP' ? 'gold' : patient.status === 'Follow Up' ? 'green' : 'slate'}>{patient.status}</Badge></TD>
                    <TD>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => navigate(`/patients/${patient.id}/edit`)}>Edit</Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            deletePatient(patient.id);
                            toast.success(`Pasien ${patient.name} dihapus.`);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>

          <div className="mt-5 grid gap-3 lg:hidden">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="rounded-[24px] border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/patients/${patient.id}`} className="font-semibold hover:text-primary">{patient.name}</Link>
                    <p className="mt-1 text-sm text-muted">{patient.medicalRecordNumber} • {patient.phone}</p>
                  </div>
                  <UserRound className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-3 text-sm text-muted">{patient.concern}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant={patient.memberTier === 'Platinum' ? 'gold' : 'pink'}>{patient.memberTier}</Badge>
                  <Badge variant={patient.status === 'VIP' ? 'gold' : patient.status === 'Follow Up' ? 'green' : 'slate'}>{patient.status}</Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1" variant="secondary" onClick={() => navigate(`/patients/${patient.id}/edit`)}>Edit</Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => {
                      deletePatient(patient.id);
                      toast.success(`Pasien ${patient.name} dihapus.`);
                    }}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Journey snapshot</p>
          <h3 className="mt-2 text-xl font-semibold">Alur pasien terlihat lebih jelas.</h3>
          <div className="mt-5 space-y-3">
            {[
              ['Baru daftar', `${patients.filter((item) => item.status === 'Active').length} profil aktif siap dijadwalkan`],
              ['Perlu kontrol', `${patients.filter((item) => item.status === 'Follow Up').length} pasien masuk follow-up`],
              ['VIP loyalty', `${patients.filter((item) => item.status === 'VIP').length} pasien prioritas dengan value tinggi`],
            ].map(([title, value]) => (
              <div key={title} className="rounded-2xl border border-border p-4">
                <p className="font-medium">{title}</p>
                <p className="mt-2 text-sm text-muted">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[24px] bg-secondary p-5 text-sm text-muted">
            CRUD pasien tersimpan di localStorage sehingga data dummy tetap bertahan saat halaman di-refresh.
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
