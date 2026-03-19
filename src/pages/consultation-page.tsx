import { useMemo, useState } from 'react';
import { ClipboardCheck, FilePenLine } from 'lucide-react';
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

const soapTemplates = {
  'Acne & scar control': {
    subjective: 'Keluhan jerawat aktif, kemerahan, dan tekstur belum rata.',
    objective: 'PIE ringan, pori membesar, barrier sedikit compromised.',
    assessment: 'Respon baik terhadap protocol calming + resurfacing bertahap.',
    plan: 'Lanjutkan program acne reset, homecare barrier repair, dan SPF ketat.',
  },
  'Anti-aging contour': {
    subjective: 'Keluhan garis halus, kulit tampak lelah, ingin contour lebih tegas.',
    objective: 'Fine lines peri-oral, skin laxity ringan, hidrasi kurang.',
    assessment: 'Cocok untuk kombinasi rejuvenation + injectable follow-up.',
    plan: 'Schedule laser + contour session, monitor hydration dan aftercare.',
  },
  'Brightening maintenance': {
    subjective: 'Keluhan kusam dan pigment ringan berulang.',
    objective: 'Tone tidak merata, hidrasi cukup, tidak ada inflamasi aktif.',
    assessment: 'Maintenance brightening dapat dilanjutkan 4 mingguan.',
    plan: 'Infusion / peeling ringan + homecare brightening bertahap.',
  },
};

const consentOptions = ['Efek samping & downtime dijelaskan', 'Foto dokumentasi klinis disetujui', 'Instruksi homecare pasca tindakan dipahami'];

export function ConsultationPage() {
  const { medicalRecords, patients, staff, treatments, currentUser, saveMedicalRecord } = useAppStore();
  const [patientId, setPatientId] = useState(patients[0]?.id ?? '');
  const [template, setTemplate] = useState<keyof typeof soapTemplates>('Acne & scar control');
  const [complaint, setComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [area, setArea] = useState('Full face');
  const [recommendation, setRecommendation] = useState(treatments.slice(0, 3).map((item) => item.name).join(', '));
  const [homecare, setHomecare] = useState('Gentle cleanser\nBarrier moisturizer\nSunscreen reapply tiap 4 jam');
  const [consentChecklist, setConsentChecklist] = useState<string[]>([consentOptions[0], consentOptions[1]]);

  const selectedPatient = patients.find((item) => item.id === patientId);
  const patientHistory = useMemo(() => medicalRecords.filter((item) => item.patientId === patientId), [medicalRecords, patientId]);
  const actingDoctor = staff.find((item) => item.role === 'Dokter / Aesthetic Doctor');
  const activeTemplate = soapTemplates[template];

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
        skinCondition: selectedPatient.skinType,
        area,
        allergies: selectedPatient.allergies.join(', '),
        previousTreatment: selectedPatient.treatmentHistory[0] ?? '-',
        diagnosis: diagnosis || `Clinical impression for ${selectedPatient.concern}`,
        concernTemplate: template,
        soap: activeTemplate,
        consent: consentChecklist.length === consentOptions.length,
        consentChecklist,
        recommendations: recommendation.split(',').map((item) => item.trim()).filter(Boolean),
        homecarePlan: homecare.split('\n').map((item) => item.trim()).filter(Boolean),
        photos: selectedPatient.beforeAfter.map((item) => item.after),
      },
      currentUser?.name ?? 'Dokter'
    );
    toast.success('Medical record berhasil disimpan dan terhubung ke patient history.');
  };

  return (
    <AccessGuard module="consultation">
      <PageShell title="Consultation" description="Editor consultation lengkap dengan create/edit medical record, template SOAP, consent digital checklist, rekomendasi treatment & homecare, dan patient history linkage.">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Medical record editor</h3>
              <p className="mt-1 text-sm text-muted">Halaman consultation berubah dari viewer menjadi workspace dokter.</p>
            </div>
            <FilePenLine className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Pasien</label>
              <Select value={patientId} onChange={setPatientId} options={patients.map((item) => ({ value: item.id, label: item.name }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">SOAP template</label>
              <Select value={template} onChange={(value) => setTemplate(value as keyof typeof soapTemplates)} options={Object.keys(soapTemplates).map((item) => ({ value: item, label: item }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Area concern</label>
              <Input value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Diagnosis</label>
              <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Masukkan diagnosis klinis" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium">Keluhan / complaint</label>
            <Textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Tuliskan keluhan pasien, concern, dan objective visit." className="min-h-[96px]" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {Object.entries(activeTemplate).map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-border p-4">
                <p className="text-sm capitalize text-muted">{key}</p>
                <p className="mt-2 text-sm">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Rekomendasi treatment & homecare terstruktur</label>
              <Textarea value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className="min-h-[120px]" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Homecare plan</label>
              <Textarea value={homecare} onChange={(e) => setHomecare(e.target.value)} className="min-h-[120px]" />
            </div>
          </div>

          <div className="mt-6 rounded-[24px] bg-secondary p-5">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-semibold">Consent digital checklist</h4>
                <p className="text-sm text-muted">Checklist ini ikut tersimpan ke rekam medis untuk audit medis dan legal.</p>
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

          <Button className="mt-6" onClick={handleSave}>Save medical record</Button>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold">Patient history auto-link</h3>
            <div className="mt-4 rounded-2xl bg-secondary p-4">
              <p className="font-medium">{selectedPatient?.name}</p>
              <p className="mt-1 text-sm text-muted">MR {selectedPatient?.medicalRecordNumber} • {selectedPatient?.concern}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="pink">{selectedPatient?.memberTier}</Badge>
                <Badge variant="green">{selectedPatient?.loyaltyPoints} pts</Badge>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {patientHistory.map((record) => (
                <div key={record.id} className="rounded-2xl border border-border p-4">
                  <p className="text-sm text-muted">{record.visitDate} • {record.concernTemplate}</p>
                  <p className="mt-2 font-medium">{record.diagnosis}</p>
                  <p className="mt-2 text-sm text-muted">Plan: {record.soap.plan}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">Consent & recommendation summary</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-2xl border border-border p-4">
                <p className="font-medium">Consent completion</p>
                <p className="mt-2 text-muted">{consentChecklist.length}/{consentOptions.length} checklist tercentang.</p>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <p className="font-medium">Suggested treatments</p>
                <p className="mt-2 text-muted">{recommendation}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
    </AccessGuard>
  );
}
