import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';

export function ConsultationPage() {
  const { medicalRecords, patients, staff } = useAppStore();

  return (
    <PageShell title="Consultation" description="Konsultasi dokter aesthetic lengkap dengan concern, diagnosis estetika, SOAP note, consent, dan rekomendasi treatment.">
      <div className="space-y-4">
        {medicalRecords.map((record) => {
          const patient = patients.find((item) => item.id === record.patientId);
          const doctor = staff.find((item) => item.id === record.doctorId);
          return (
            <Card key={record.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">{record.visitDate}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{patient?.name}</h2>
                  <p className="mt-2 text-sm text-muted">Dokter: {doctor?.name}</p>
                </div>
                <Badge variant="green">Consent {record.consent ? 'signed' : 'pending'}</Badge>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-secondary p-4"><p className="text-sm text-muted">Keluhan</p><p className="mt-2 font-medium">{record.complaint}</p></div>
                <div className="rounded-2xl bg-secondary p-4"><p className="text-sm text-muted">Kondisi kulit</p><p className="mt-2 font-medium">{record.skinCondition}</p></div>
                <div className="rounded-2xl bg-secondary p-4"><p className="text-sm text-muted">Area</p><p className="mt-2 font-medium">{record.area}</p></div>
                <div className="rounded-2xl bg-secondary p-4"><p className="text-sm text-muted">Diagnosis</p><p className="mt-2 font-medium">{record.diagnosis}</p></div>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {Object.entries(record.soap).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-border p-4">
                    <p className="text-sm capitalize text-muted">{key}</p>
                    <p className="mt-2 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
