import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/app-store';

export function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, appointments, medicalRecords, transactions, followUps, treatmentPackages, reminders } = useAppStore();
  const patient = useMemo(() => patients.find((item) => item.id === id), [patients, id]);

  if (!patient) {
    return <PageShell title="Patient not found"><Card>Data pasien tidak ditemukan.</Card></PageShell>;
  }

  const patientPrograms = treatmentPackages.filter((item) => item.activePatients.some((entry) => entry.patientId === patient.id));
  const patientReminders = reminders.filter((item) => item.patientId === patient.id);
  const recommendedProducts = useMemo(
    () => transactions
      .filter((item) => item.patientId === patient.id)
      .flatMap((transaction) => transaction.items.filter((entry) => entry.type === 'product').map((entry) => entry.label))
      .slice(0, 4),
    [patient.id, transactions]
  );

  return (
    <PageShell
      title={patient.name}
      description={`Profil pasien premium care • ${patient.medicalRecordNumber}`}
      actions={<div className="flex gap-3"><Button variant="secondary" onClick={() => navigate('/patients')}><ArrowLeft className="h-4 w-4" /> Back</Button><Button onClick={() => navigate(`/patients/${patient.id}/edit`)}><Pencil className="h-4 w-4" /> Edit patient</Button></div>}
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="pink">{patient.memberTier}</Badge>
                <Badge variant={patient.status === 'VIP' ? 'gold' : 'green'}>{patient.status}</Badge>
              </div>
              <h2 className="mt-4 text-3xl font-semibold">{patient.concern}</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">Skin type {patient.skinType}. Alergi: {patient.allergies.join(', ')}. Loyalty points {patient.loyaltyPoints}. Referral code {patient.referralCode}.</p>
            </div>
            <div className="rounded-[24px] bg-secondary p-4 text-sm">
              <p className="font-medium">Last visit</p>
              <p className="mt-1 text-muted">{patient.lastVisit}</p>
              <p className="mt-3 font-medium">Contact</p>
              <p className="mt-1 text-muted">{patient.phone} • {patient.email}</p>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mt-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="visits">Visits</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="photos">Before-After</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-secondary/70">
                  <h3 className="font-semibold">Aesthetic profile</h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted">
                    <li>Concern utama: {patient.concern}</li>
                    <li>Kondisi kulit: {patient.skinType}</li>
                    <li>Beauty goals: {patient.beautyGoals.join(', ')}</li>
                    <li>Avoided ingredients: {patient.avoidedIngredients.join(', ')}</li>
                    <li>Intensity preference: {patient.preferredTreatmentIntensity}</li>
                    <li>Catatan: {patient.notes}</li>
                    <li>Joined at: {patient.joinedAt}</li>
                  </ul>
                </Card>
                <Card className="bg-secondary/70">
                  <h3 className="font-semibold">Follow-up, reminders & loyalty</h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted">
                    <li>Tier member: {patient.memberTier}</li>
                    <li>Poin loyalitas: {patient.loyaltyPoints}</li>
                    <li>Routine compliance: {patient.routineCompliance}%</li>
                    <li>Selfie reminder opt-in: {patient.selfieReminderOptIn ? 'Aktif' : 'Tidak aktif'}</li>
                    <li>Upcoming control: {followUps.find((item) => item.patientId === patient.id)?.dueDate ?? 'Belum ada'}</li>
                    <li>Reminder aktif: {patientReminders.length}</li>
                  </ul>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="visits">
              <div className="space-y-3">
                {medicalRecords.filter((item) => item.patientId === patient.id).map((record) => (
                  <Card key={record.id} className="bg-secondary/70">
                    <p className="text-sm text-muted">{record.visitDate} • {record.concernTemplate}</p>
                    <h3 className="mt-2 font-semibold">{record.diagnosis}</h3>
                    <p className="mt-2 text-sm text-muted">SOAP plan: {record.soap.plan}</p>
                    <p className="mt-2 text-sm text-muted">Consent checklist: {record.consentChecklist.join(', ')}</p>
                  </Card>
                ))}
                {appointments.filter((item) => item.patientId === patient.id).map((appointment) => (
                  <Card key={appointment.id} className="bg-white">
                    <p className="font-medium">Appointment {appointment.date} • {appointment.time}</p>
                    <p className="mt-2 text-sm text-muted">Status {appointment.status}. {appointment.notes}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="programs">
              <div className="space-y-3">
                <Card className="bg-secondary/70">
                  <h3 className="font-semibold">Recommended beauty routine</h3>
                  <p className="mt-2 text-sm text-muted">
                    Produk yang paling relevan dari histori pembelian pasien: {recommendedProducts.length > 0 ? recommendedProducts.join(', ') : 'Belum ada produk yang dibeli.'}
                  </p>
                </Card>
                {patientPrograms.map((program) => {
                  const progress = program.activePatients.find((entry) => entry.patientId === patient.id);
                  return (
                    <Card key={program.id} className="bg-secondary/70">
                      <p className="font-medium">{program.name}</p>
                      <p className="mt-2 text-sm text-muted">{progress?.sessionsUsed}/{progress?.totalSessions} sesi • Expiry {progress?.expiresAt}</p>
                      <p className="mt-2 text-sm text-muted">Bundling homecare & treatment untuk concern {program.targetConcern}.</p>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="photos">
              <div className="space-y-4">
                {patient.beforeAfter.map((image, index) => (
                  <Card key={index} className="overflow-hidden p-0">
                    <div className="border-b border-border px-6 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{image.sessionLabel}</p>
                          <p className="text-sm text-muted">{image.visitDate} • Area {image.area}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="pink">Compare</Badge>
                          <Badge variant={image.consentUsage ? 'green' : 'gold'}>{image.consentUsage ? 'Consent signed' : 'Internal only'}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-0">
                      <img src={image.before} alt="Before" className="h-56 w-full object-cover" />
                      <img src={image.after} alt="After" className="h-56 w-full object-cover" />
                    </div>
                    <div className="px-6 py-4 text-sm text-muted">
                      <p>Outcome summary: {image.progressNotes}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold">Treatment history</h3>
            <div className="mt-4 space-y-3">
              {patient.treatmentHistory.map((item) => (
                <div key={item} className="rounded-2xl border border-border p-4 text-sm">
                  <p className="font-medium">{item}</p>
                  <p className="mt-1 text-muted">Progress monitored in premium aesthetic care workflow sesuai target: {patient.beautyGoals.join(', ')}.</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">Purchase history</h3>
            <div className="mt-4 space-y-3">
              {transactions.filter((item) => item.patientId === patient.id).map((transaction) => (
                <div key={transaction.id} className="rounded-2xl border border-border p-4 text-sm">
                  <p className="font-medium">{transaction.id}</p>
                  <p className="mt-1 text-muted">{transaction.items.map((item) => item.label).join(', ')}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">Reminder timeline</h3>
            <div className="mt-4 space-y-3">
              {patientReminders.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border p-4 text-sm">
                  <p className="font-medium">{item.type}</p>
                  <p className="mt-1 text-muted">{item.channel} • {item.scheduledFor}</p>
                  <p className="mt-1 text-muted">{item.notes}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
