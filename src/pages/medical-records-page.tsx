import { Camera, ClipboardList, Map, PackageCheck, Send, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/app-store';

const supportingModules = [
  {
    title: 'Template SOAP khusus estetika',
    detail: 'Template untuk facial, peeling, laser, botox/filler, acne, hair treatment, dan slimming treatment.',
    icon: Sparkles,
  },
  {
    title: 'Foto medis before-after',
    detail: 'Upload foto setiap kunjungan, perbandingan hasil treatment, dan penyimpanan terhubung ke rekam medis pasien.',
    icon: Camera,
  },
  {
    title: 'Face mapping & body mapping',
    detail: 'Penandaan area jerawat, scar, pigmentasi, area injeksi, atau laser dengan riwayat perubahan area masalah.',
    icon: Map,
  },
  {
    title: 'Informed consent digital',
    detail: 'Persetujuan tindakan digital, tanda tangan pasien, dan arsip consent otomatis per treatment.',
    icon: ShieldCheck,
  },
  {
    title: 'Paket treatment & membership',
    detail: 'Tracking sisa sesi, membership, deposit, dan pengingat masa aktif paket pasien.',
    icon: PackageCheck,
  },
  {
    title: 'Kontrol & follow up otomatis',
    detail: 'Reminder kontrol, evaluasi hasil, dan follow up kepuasan pasien via WhatsApp, SMS, atau email.',
    icon: Send,
  },
];

export function MedicalRecordsPage() {
  const { medicalRecords, patients, treatmentPackages, followUps, reminders } = useAppStore();

  return (
    <PageShell
      title="Medical Records"
      description="Rekam medis estetika dengan SOAP yang terstruktur, dokumentasi foto klinis, riwayat treatment, consent digital, dan follow up pasien."
    >
      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">SOAP Records</TabsTrigger>
          <TabsTrigger value="photos">Before-After</TabsTrigger>
          <TabsTrigger value="journey">Treatment Journey</TabsTrigger>
          <TabsTrigger value="support">Supporting Features</TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <div className="space-y-4">
            {medicalRecords.map((record) => {
              const patient = patients.find((item) => item.id === record.patientId);

              return (
                <Card key={record.id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{patient?.name}</h3>
                        <Badge variant="pink">{record.concernTemplate}</Badge>
                        <Badge>{record.visitDate}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        Alergi: {record.allergies} • Previous treatment: {record.previousTreatment} • Area: {record.area}
                      </p>
                      <p className="mt-3 text-sm">
                        <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border px-4 py-3 text-sm text-muted">
                      Consent {record.consent ? 'lengkap' : 'parsial'} • {record.consentChecklist.length} item tersimpan
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-4">
                    {[
                      { label: 'Subjective', value: record.soap.subjective, icon: ClipboardList },
                      { label: 'Objective', value: record.soap.objective, icon: Stethoscope },
                      { label: 'Assessment', value: record.soap.assessment, icon: Sparkles },
                      { label: 'Plan', value: record.soap.plan, icon: Send },
                    ].map((section) => {
                      const Icon = section.icon;
                      return (
                        <div key={section.label} className="rounded-3xl border border-border p-4">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <p className="font-medium">{section.label}</p>
                          </div>
                          <p className="mt-3 text-sm text-muted">{section.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl bg-secondary/60 p-4">
                      <p className="font-medium">Rekomendasi treatment / produk</p>
                      <ul className="mt-3 space-y-2 text-sm text-muted">
                        {record.recommendations.map((recommendation) => (
                          <li key={recommendation}>• {recommendation}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-3xl bg-secondary/60 p-4">
                      <p className="font-medium">Homecare & edukasi</p>
                      <ul className="mt-3 space-y-2 text-sm text-muted">
                        {record.homecarePlan.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <div className="grid gap-4 lg:grid-cols-3">
            {patients.flatMap((patient) =>
              patient.beforeAfter.map((entry) => ({
                patientName: patient.name,
                sessionLabel: entry.sessionLabel,
                visitDate: entry.visitDate,
                area: entry.area,
                before: entry.before,
                after: entry.after,
                progressNotes: entry.progressNotes,
                consentUsage: entry.consentUsage,
              })),
            ).map((item) => (
              <Card key={`${item.patientName}-${item.visitDate}-${item.sessionLabel}`} className="overflow-hidden p-0">
                <div className="grid grid-cols-2 gap-px bg-border">
                  <img src={item.before} alt={`Before ${item.patientName}`} className="h-56 w-full bg-white object-cover" />
                  <img src={item.after} alt={`After ${item.patientName}`} className="h-56 w-full bg-white object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{item.patientName}</p>
                    <Badge variant={item.consentUsage ? 'green' : 'slate'}>{item.consentUsage ? 'Consent OK' : 'Internal only'}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {item.visitDate} • {item.sessionLabel} • {item.area}
                  </p>
                  <p className="mt-3 text-sm text-muted">{item.progressNotes}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="journey">
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <h3 className="text-lg font-semibold">Riwayat treatment pasien</h3>
              <div className="mt-4 space-y-4">
                {patients.map((patient) => (
                  <div key={patient.id} className="rounded-3xl border border-border p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="font-semibold">{patient.name}</p>
                        <p className="mt-1 text-sm text-muted">
                          {patient.concern} • {patient.skinType} • Last visit {patient.lastVisit}
                        </p>
                      </div>
                      <Badge variant="pink">{patient.memberTier}</Badge>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium">Tindakan yang pernah dilakukan</p>
                        <ul className="mt-2 space-y-2 text-sm text-muted">
                          {patient.treatmentHistory.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Produk / skincare yang digunakan</p>
                        <ul className="mt-2 space-y-2 text-sm text-muted">
                          {patient.purchaseHistory.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              <Card>
                <h3 className="text-lg font-semibold">Paket treatment & membership</h3>
                <div className="mt-4 space-y-3">
                  {treatmentPackages.map((pkg) => (
                    <div key={pkg.id} className="rounded-3xl border border-border p-4">
                      <p className="font-medium">{pkg.name}</p>
                      <p className="mt-1 text-sm text-muted">{pkg.targetConcern}</p>
                      <div className="mt-3 space-y-2 text-sm text-muted">
                        {pkg.activePatients.map((entry) => (
                          <p key={entry.patientId}>
                            {patients.find((patient) => patient.id === entry.patientId)?.name}: {entry.sessionsUsed}/{entry.totalSessions} sesi • exp {entry.expiresAt}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold">Kontrol & follow up</h3>
                <div className="mt-4 space-y-3 text-sm">
                  {followUps.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-border p-4">
                      <p className="font-medium">{patients.find((patient) => patient.id === item.patientId)?.name}</p>
                      <p className="mt-1 text-muted">{item.dueDate} • {item.status}</p>
                      <p className="mt-2 text-muted">{item.progress}</p>
                    </div>
                  ))}
                  {reminders.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-border p-4">
                      <p className="font-medium">{patients.find((patient) => patient.id === item.patientId)?.name}</p>
                      <p className="mt-1 text-muted">{item.channel} • {item.scheduledFor}</p>
                      <p className="mt-2 text-muted">{item.template}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="support">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {supportingModules.map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.title}>
                  <div className="flex items-start gap-3">
                    <Icon className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="mt-2 text-sm text-muted">{module.detail}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
