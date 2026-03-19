import { PageShell } from '@/components/shared/page-shell';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/app-store';

export function MedicalRecordsPage() {
  const { medicalRecords, patients } = useAppStore();

  return (
    <PageShell title="Medical Records" description="Rekam medis estetika, foto dummy, riwayat alergi, SOAP note, serta rekomendasi treatment & skincare.">
      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        <TabsContent value="records">
          <div className="space-y-4">
            {medicalRecords.map((record) => (
              <Card key={record.id}>
                <h3 className="text-lg font-semibold">{patients.find((item) => item.id === record.patientId)?.name}</h3>
                <p className="mt-2 text-sm text-muted">Alergi: {record.allergies} • Previous treatment: {record.previousTreatment}</p>
                <p className="mt-3 text-sm">Diagnosis: {record.diagnosis}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="photos">
          <div className="grid gap-4 md:grid-cols-2">
            {medicalRecords.flatMap((record) => record.photos.map((photo) => ({ photo, patientId: record.patientId }))).map((item) => (
              <Card key={item.photo} className="overflow-hidden p-0">
                <img src={item.photo} alt="Medical record" className="h-72 w-full object-cover" />
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recommendations">
          <div className="grid gap-4 md:grid-cols-2">
            {medicalRecords.map((record) => (
              <Card key={record.id}>
                <h3 className="font-semibold">{patients.find((item) => item.id === record.patientId)?.name}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {record.recommendations.map((recommendation) => <li key={recommendation}>• {recommendation}</li>)}
                </ul>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
