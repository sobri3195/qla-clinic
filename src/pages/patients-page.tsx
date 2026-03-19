import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useAppStore } from '@/store/app-store';

export function PatientsPage() {
  const navigate = useNavigate();
  const patients = useAppStore((state) => state.patients);
  const [query, setQuery] = useState('');

  const filteredPatients = useMemo(() => patients.filter((patient) => [patient.name, patient.concern, patient.memberTier, patient.medicalRecordNumber].join(' ').toLowerCase().includes(query.toLowerCase())), [patients, query]);

  return (
    <PageShell
      title="Patients"
      description="Manajemen pasien baru, lama, loyal member, concern utama, dan histori klinis estetika."
      actions={<Button onClick={() => navigate('/patients/new')}><Plus className="h-4 w-4" /> Add patient</Button>}
    >
      <Card>
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-10" placeholder="Cari nama, MRN, concern, member tier..." />
        </div>
        <div className="mt-5 overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH>Patient</TH>
                <TH>Concern</TH>
                <TH>Skin Type</TH>
                <TH>Membership</TH>
                <TH>Last Visit</TH>
                <TH>Status</TH>
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
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
