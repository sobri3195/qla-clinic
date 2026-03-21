import { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Boxes,
  Camera,
  ClipboardCheck,
  FilePenLine,
  Map,
  MessageSquareQuote,
  NotebookPen,
  PackageCheck,
  ReceiptText,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCog,
} from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { AccessGuard } from '@/components/shared/access-guard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/app-store';
import { toast } from 'sonner';

const soapTemplateCatalog = {
  facial: {
    label: 'Template Facial',
    promo: 'Template SOAP dapat disesuaikan dengan jenis layanan klinik kecantikan agar pencatatan lebih cepat dan seragam.',
    subjectivePrompt: 'Keluhan utama, riwayat facial sebelumnya, skincare aktif, alergi, dan target glow pasien.',
    objectivePoints: ['Hidrasi kulit', 'Pori besar T-zone', 'Komedo / sebum', 'Face mapping area bermasalah'],
    assessmentPoints: ['Kondisi kulit stabil untuk facial maintenance', 'Perlu fokus deep cleansing + calming'],
    planPoints: ['Signature Hydra Facial', 'Homecare gentle cleanser + sunscreen', 'Kontrol 4 minggu'],
    focusArea: 'Full face',
  },
  peeling: {
    label: 'Template Peeling',
    promo: 'Memudahkan pencatatan keluhan, riwayat treatment, alergi, dan kebutuhan estetika pasien secara lengkap dan terstruktur.',
    subjectivePrompt: 'Keluhan kusam, noda pasca jerawat, riwayat peeling, serta toleransi kulit terhadap acid.',
    objectivePoints: ['Tone tidak merata', 'PIH ringan', 'Barrier kulit perlu dipantau', 'Foto progres per kunjungan'],
    assessmentPoints: ['Cocok untuk peeling bertahap', 'Perlu monitoring downtime dan sensitivitas'],
    planPoints: ['Glow Peeling Therapy', 'Pre/post treatment instruction', 'Reminder follow up H+3'],
    focusArea: 'Cheek & forehead',
  },
  laser: {
    label: 'Template Laser',
    promo: 'Dokumentasi objektif lebih akurat dengan foto klinis, face mapping, dan pencatatan kondisi kulit secara detail.',
    subjectivePrompt: 'Keluhan pigmentasi, scar, ekspektasi downtime, dan riwayat tindakan laser sebelumnya.',
    objectivePoints: ['Pigment mapping', 'Scar depth', 'Skin analyzer result', 'Area tindakan terukur'],
    assessmentPoints: ['Kasus estetik menengah', 'Perlu serial laser dengan evaluasi respons'],
    planPoints: ['Laser Rejuvenation', 'Consent digital', 'Jadwal review 2 minggu'],
    focusArea: 'Full face & neck',
  },
  injectables: {
    label: 'Template Botox / Filler',
    promo: 'Membantu dokter menyusun assessment secara cepat, konsisten, dan terdokumentasi dengan baik.',
    subjectivePrompt: 'Keluhan garis halus, contour wajah, keinginan hasil natural, serta riwayat filler/botox sebelumnya.',
    objectivePoints: ['Fine lines dinamis', 'Volume loss', 'Simetri wajah', 'Body / face mapping area injeksi'],
    assessmentPoints: ['Cocok untuk contour refinement', 'Perlu informed consent per tindakan'],
    planPoints: ['Botox Sculpting / Filler Contour Deluxe', 'Kontrol 14 hari', 'Estimasi biaya treatment'],
    focusArea: 'Jawline & peri-oral',
  },
  acne: {
    label: 'Template Acne Treatment',
    promo: 'Rencana tindakan, resep, edukasi, dan kontrol pasien tersusun rapi dalam satu alur kerja yang terintegrasi.',
    subjectivePrompt: 'Keluhan jerawat aktif, produk yang dipakai, riwayat obat, alergi, pola tidur, dan paparan matahari.',
    objectivePoints: ['Acne grade', 'Eritema / inflamasi', 'Scar & PIE', 'Dokumentasi before-after'],
    assessmentPoints: ['Acne inflamasi ringan-sedang', 'Barrier membutuhkan pendekatan bertahap'],
    planPoints: ['Acne Reset Program', 'Resep skincare terintegrasi stok', 'Follow up otomatis via WhatsApp'],
    focusArea: 'Cheek, chin, forehead',
  },
  hair: {
    label: 'Template Hair Treatment',
    promo: 'Riwayat treatment pasien, respon tindakan, dan dokumentasi progres tersimpan dalam satu rekam medis estetika.',
    subjectivePrompt: 'Keluhan kerontokan, perawatan rambut sebelumnya, obat yang digunakan, dan target kepadatan rambut.',
    objectivePoints: ['Density area frontal', 'Kondisi scalp', 'Foto progres per area'],
    assessmentPoints: ['Perlu serial treatment hair revitalization', 'Evaluasi respons tiap kunjungan'],
    planPoints: ['Hair treatment package', 'Homecare scalp regimen', 'Reminder sesi berikutnya'],
    focusArea: 'Scalp frontal',
  },
  slimming: {
    label: 'Template Slimming',
    promo: 'Plan treatment bertahap, paket bundling, dan tracking sesi memudahkan program body contour jangka panjang.',
    subjectivePrompt: 'Keluhan area tubuh, target contour, kebiasaan olahraga, pola makan, dan harapan hasil.',
    objectivePoints: ['Body mapping area tindakan', 'Lingkar tubuh', 'Foto progres body contour'],
    assessmentPoints: ['Cocok untuk program slimming bertahap', 'Perlu paket treatment dan evaluasi ukuran'],
    planPoints: ['Slimming Body Sculpt package', 'Jadwal mingguan', 'Follow up kepuasan pasien'],
    focusArea: 'Abdomen & thigh',
  },
} as const;

const consentOptions = [
  'Efek samping & downtime dijelaskan',
  'Foto dokumentasi klinis disetujui',
  'Instruksi pre-treatment dipahami',
  'Instruksi post-treatment dipahami',
  'Persetujuan tindakan digital sudah ditandatangani',
];

const supportiveFeatures = [
  {
    title: 'Foto medis before-after',
    description: 'Upload foto setiap kunjungan, bandingkan hasil treatment, dan simpan aman di rekam medis pasien.',
    icon: Camera,
  },
  {
    title: 'Face & body mapping',
    description: 'Tandai area jerawat, scar, pigmentasi, injeksi, atau laser agar progres mudah dipantau.',
    icon: Map,
  },
  {
    title: 'Informed consent digital',
    description: 'Checklist persetujuan, tanda tangan digital, dan arsip consent otomatis tersimpan per treatment.',
    icon: BadgeCheck,
  },
  {
    title: 'Integrasi SOAP dengan rekam medis elektronik',
    description: 'Semua catatan SOAP langsung masuk ke rekam medis pasien, tersimpan kronologis, dan mudah dicari saat pasien datang kembali.',
    icon: NotebookPen,
  },
  {
    title: 'Integrasi SOAP dengan billing',
    description: 'Tindakan dari plan langsung masuk ke tagihan, resep dan produk diteruskan ke kasir, sehingga input ulang dapat dikurangi.',
    icon: ReceiptText,
  },
  {
    title: 'Integrasi SOAP dengan inventory',
    description: 'Produk dan bahan treatment otomatis mengurangi stok agar pemakaian bahan medis maupun estetik tetap termonitor dan akurat.',
    icon: Boxes,
  },
  {
    title: 'Multiuser & hak akses',
    description: 'Dokter, perawat, terapis, dan admin hanya melihat modul sesuai peran, dengan audit trail untuk menjaga keamanan data SOAP.',
    icon: UserCog,
  },
  {
    title: 'Laporan & evaluasi',
    description: 'Pantau jumlah tindakan, diagnosis estetik terbanyak, treatment favorit, progres pasien, dan produktivitas dokter atau terapis.',
    icon: ShieldCheck,
  },
  {
    title: 'Paket treatment & membership',
    description: 'Tracking sisa sesi, deposit, membership, dan pengingat masa aktif paket dalam satu workflow.',
    icon: PackageCheck,
  },
  {
    title: 'Reminder kontrol & follow up',
    description: 'Pengingat kontrol, reminder pasca tindakan, dan follow up hasil dapat dijalankan otomatis.',
    icon: Send,
  },
];

export function ConsultationPage() {
  const { medicalRecords, patients, staff, treatments, currentUser, saveMedicalRecord, treatmentPackages, followUps, reminders } = useAppStore();
  const [patientId, setPatientId] = useState(patients[0]?.id ?? '');
  const [template, setTemplate] = useState<keyof typeof soapTemplateCatalog>('acne');
  const [complaint, setComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [area, setArea] = useState(soapTemplateCatalog.acne.focusArea);
  const [subjectiveNotes, setSubjectiveNotes] = useState('');
  const [objectiveNotes, setObjectiveNotes] = useState('');
  const [assessmentNotes, setAssessmentNotes] = useState('');
  const [planNotes, setPlanNotes] = useState('');
  const [recommendation, setRecommendation] = useState(treatments.slice(0, 3).map((item) => item.name).join(', '));
  const [homecare, setHomecare] = useState('Gentle cleanser\nBarrier moisturizer\nSunscreen reapply tiap 4 jam');
  const [consentChecklist, setConsentChecklist] = useState<string[]>([consentOptions[0], consentOptions[1], consentOptions[2]]);

  const selectedPatient = patients.find((item) => item.id === patientId);
  const patientHistory = useMemo(() => medicalRecords.filter((item) => item.patientId === patientId), [medicalRecords, patientId]);
  const actingDoctor = staff.find((item) => item.role === 'Dokter / Aesthetic Doctor');
  const activeTemplate = soapTemplateCatalog[template];
  const activePackage = treatmentPackages.find((pkg) => pkg.activePatients.some((entry) => entry.patientId === patientId));
  const activeFollowUp = followUps.find((item) => item.patientId === patientId);
  const activeReminder = reminders.find((item) => item.patientId === patientId);

  useEffect(() => {
    if (!selectedPatient) return;

    setComplaint(
      `Keluhan utama: ${selectedPatient.concern}. Riwayat treatment sebelumnya: ${selectedPatient.treatmentHistory.join(', ') || '-'}\. ` +
        `Riwayat skincare/obat: ${selectedPatient.purchaseHistory.join(', ') || '-'}\. ` +
        `Alergi: ${selectedPatient.allergies.join(', ')}. Target hasil: ${selectedPatient.beautyGoals.join(', ')}.`,
    );
    setDiagnosis(`Assessment awal untuk ${selectedPatient.concern}`);
    setArea(activeTemplate.focusArea);
    setSubjectiveNotes(
      `${activeTemplate.subjectivePrompt}\nKebiasaan pasien: kepatuhan skincare ${selectedPatient.routineCompliance}% • intensitas treatment ${selectedPatient.preferredTreatmentIntensity}.`,
    );
    setObjectiveNotes(
      `Tipe kulit: ${selectedPatient.skinType}. Temuan utama: ${activeTemplate.objectivePoints.join(', ')}.`,
    );
    setAssessmentNotes(
      `Ringkasan kondisi pasien: ${activeTemplate.assessmentPoints.join('; ')}. Riwayat kunjungan sebelumnya menunjukkan progres bertahap.`,
    );
    setPlanNotes(
      `Rencana treatment: ${activeTemplate.planPoints.join(', ')}. Edukasi pasien dan jadwal kontrol akan dikirim otomatis.`,
    );
    setRecommendation(
      treatments
        .filter((item) => item.concernTags.some((tag) => selectedPatient.concern.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(template)))
        .slice(0, 3)
        .map((item) => item.name)
        .join(', ') || treatments.slice(0, 3).map((item) => item.name).join(', '),
    );
  }, [activeTemplate, patientId, selectedPatient, template, treatments]);

  const toggleConsent = (item: string) => {
    setConsentChecklist((current) => (current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]));
  };

  const handleSave = () => {
    if (!selectedPatient || !actingDoctor) return;

    saveMedicalRecord(
      {
        id: `mr-${crypto.randomUUID().slice(0, 8)}`,
        patientId: selectedPatient.id,
        doctorId: actingDoctor.id,
        visitDate: new Date().toISOString().slice(0, 10),
        complaint: complaint || selectedPatient.concern,
        skinCondition: `${selectedPatient.skinType} • ${activeTemplate.objectivePoints.join(', ')}`,
        area,
        allergies: selectedPatient.allergies.join(', '),
        previousTreatment: selectedPatient.treatmentHistory[0] ?? '-',
        diagnosis: diagnosis || `Clinical impression for ${selectedPatient.concern}`,
        concernTemplate: activeTemplate.label,
        soap: {
          subjective: subjectiveNotes,
          objective: objectiveNotes,
          assessment: assessmentNotes,
          plan: planNotes,
        },
        consent: consentChecklist.length >= 4,
        consentChecklist,
        recommendations: recommendation.split(',').map((item) => item.trim()).filter(Boolean),
        homecarePlan: homecare.split('\n').map((item) => item.trim()).filter(Boolean),
        photos: selectedPatient.beforeAfter.flatMap((item) => [item.before, item.after]),
      },
      currentUser?.name ?? 'Dokter',
    );

    toast.success('Medical record berhasil disimpan dengan SOAP klinik kecantikan yang lebih terstruktur.');
  };

  return (
    <AccessGuard module="consultation">
      <PageShell
        title="Consultation"
        description="Workspace SOAP klinik kecantikan dengan form konsultasi awal terstruktur, dokumentasi objektif, assessment cepat, dan plan treatment yang terintegrasi."
      >
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">SOAP editor khusus estetika</h3>
                <p className="mt-1 text-sm text-muted">Subjective, objective, assessment, dan plan dirancang untuk alur konsultasi klinik kecantikan.</p>
              </div>
              <FilePenLine className="h-5 w-5 text-primary" />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Pasien</label>
                <Select value={patientId} onChange={setPatientId} options={patients.map((item) => ({ value: item.id, label: item.name }))} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Template SOAP</label>
                <Select
                  value={template}
                  onChange={(value) => setTemplate(value as keyof typeof soapTemplateCatalog)}
                  options={Object.entries(soapTemplateCatalog).map(([value, item]) => ({ value, label: item.label }))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Area tindakan / concern</label>
                <Input value={area} onChange={(e) => setArea(e.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Diagnosis kerja</label>
                <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Masukkan diagnosis klinis / estetik" />
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-border bg-secondary/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-primary">{activeTemplate.label}</p>
                  <p className="mt-2 text-sm text-muted">{activeTemplate.promo}</p>
                </div>
                <Sparkles className="mt-1 h-5 w-5 text-primary" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <MessageSquareQuote className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Subjective</h4>
                    <p className="text-sm text-muted">Keluhan utama, riwayat treatment, skincare, alergi, dan target hasil.</p>
                  </div>
                </div>
                <Textarea value={subjectiveNotes} onChange={(e) => setSubjectiveNotes(e.target.value)} className="mt-4 min-h-[150px]" />
              </div>

              <div className="rounded-3xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Objective</h4>
                    <p className="text-sm text-muted">Kondisi kulit, face/body mapping, foto klinis, dan hasil pemeriksaan.</p>
                  </div>
                </div>
                <Textarea value={objectiveNotes} onChange={(e) => setObjectiveNotes(e.target.value)} className="mt-4 min-h-[150px]" />
              </div>

              <div className="rounded-3xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Assessment</h4>
                    <p className="text-sm text-muted">Diagnosis kerja, tingkat keparahan, dan rekomendasi tindakan awal.</p>
                  </div>
                </div>
                <Textarea value={assessmentNotes} onChange={(e) => setAssessmentNotes(e.target.value)} className="mt-4 min-h-[150px]" />
              </div>

              <div className="rounded-3xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <NotebookPen className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Plan</h4>
                    <p className="text-sm text-muted">Rencana treatment, resep/homecare, jadwal kontrol, dan follow up pasien.</p>
                  </div>
                </div>
                <Textarea value={planNotes} onChange={(e) => setPlanNotes(e.target.value)} className="mt-4 min-h-[150px]" />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium">Ringkasan konsultasi awal</label>
              <Textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} className="min-h-[120px]" />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Rekomendasi treatment / produk</label>
                <Textarea value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className="min-h-[120px]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Homecare & edukasi pasien</label>
                <Textarea value={homecare} onChange={(e) => setHomecare(e.target.value)} className="min-h-[120px]" />
              </div>
            </div>

            <div className="mt-6 rounded-[24px] bg-secondary p-5">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-semibold">Informed consent digital</h4>
                  <p className="text-sm text-muted">Persetujuan tindakan, foto klinis, dan instruksi perawatan tersimpan untuk audit medis dan legal.</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {consentOptions.map((item) => (
                  <label key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm">
                    <input type="checkbox" checked={consentChecklist.includes(item)} onChange={() => toggleConsent(item)} />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button className="mt-6" onClick={handleSave}>
              Save medical record
            </Button>
          </Card>

          <div className="space-y-4">
            <Card>
              <h3 className="text-lg font-semibold">Patient insight & readiness</h3>
              <div className="mt-4 rounded-2xl bg-secondary p-4">
                <p className="font-medium">{selectedPatient?.name}</p>
                <p className="mt-1 text-sm text-muted">
                  MR {selectedPatient?.medicalRecordNumber} • {selectedPatient?.concern}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="pink">{selectedPatient?.memberTier}</Badge>
                  <Badge variant="green">{selectedPatient?.loyaltyPoints} pts</Badge>
                  <Badge>{selectedPatient?.skinType}</Badge>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border p-4 text-sm">
                  <p className="font-medium">Beauty goals</p>
                  <p className="mt-2 text-muted">{selectedPatient?.beautyGoals.join(', ')}</p>
                </div>
                <div className="rounded-2xl border border-border p-4 text-sm">
                  <p className="font-medium">Alergi / ingredients</p>
                  <p className="mt-2 text-muted">{selectedPatient?.allergies.join(', ')} • Avoid: {selectedPatient?.avoidedIngredients.join(', ')}</p>
                </div>
                <div className="rounded-2xl border border-border p-4 text-sm">
                  <p className="font-medium">Riwayat treatment</p>
                  <p className="mt-2 text-muted">{selectedPatient?.treatmentHistory.join(', ')}</p>
                </div>
                <div className="rounded-2xl border border-border p-4 text-sm">
                  <p className="font-medium">Kepatuhan homecare</p>
                  <p className="mt-2 text-muted">{selectedPatient?.routineCompliance}% • Preferensi intensitas: {selectedPatient?.preferredTreatmentIntensity}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold">Treatment plan integration</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl border border-border p-4">
                  <p className="font-medium">Paket aktif</p>
                  <p className="mt-2 text-muted">
                    {activePackage
                      ? `${activePackage.name} • ${activePackage.activePatients.find((entry) => entry.patientId === patientId)?.sessionsUsed}/${activePackage.activePatients.find((entry) => entry.patientId === patientId)?.totalSessions} sesi terpakai`
                      : 'Belum ada paket aktif.'}
                  </p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="font-medium">Follow up berikutnya</p>
                  <p className="mt-2 text-muted">{activeFollowUp ? `${activeFollowUp.dueDate} • ${activeFollowUp.progress}` : 'Belum ada follow up terjadwal.'}</p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="font-medium">Reminder otomatis</p>
                  <p className="mt-2 text-muted">{activeReminder ? `${activeReminder.channel} • ${activeReminder.scheduledFor}` : 'Reminder belum diatur.'}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold">Riwayat SOAP pasien</h3>
              <div className="mt-4 space-y-3">
                {patientHistory.map((record) => (
                  <div key={record.id} className="rounded-2xl border border-border p-4">
                    <p className="text-sm text-muted">
                      {record.visitDate} • {record.concernTemplate}
                    </p>
                    <p className="mt-2 font-medium">{record.diagnosis}</p>
                    <p className="mt-2 text-sm text-muted">Plan: {record.soap.plan}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold">Fitur pendukung SOAP estetika</h3>
              <div className="mt-4 grid gap-3">
                {supportiveFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="rounded-2xl border border-border p-4">
                      <div className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{feature.title}</p>
                          <p className="mt-1 text-sm text-muted">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </PageShell>
    </AccessGuard>
  );
}
