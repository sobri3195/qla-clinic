import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import { calculateTransactionTotal, formatCurrency } from '@/lib/utils';

export function InvoicePage() {
  const { transactions, patients, settings } = useAppStore();
  const transaction = transactions[0];
  if (!transaction) return null;
  const patient = patients.find((item) => item.id === transaction.patientId);
  const subtotal = transaction.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const total = calculateTransactionTotal(subtotal, transaction.discount, transaction.tax);

  return (
    <PageShell title="Invoice & Visit Summary" description="Ringkasan kunjungan, invoice dummy, receipt, dan kesiapan cetak frontend-only untuk demo operasional klinik.">
      <Card className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">{settings.clinicName}</p>
            <h2 className="mt-2 text-3xl font-semibold">Invoice {settings.invoicePrefix}-20260319-001</h2>
            <p className="mt-2 text-sm text-muted">Patient: {patient?.name} • Date: {transaction.date}</p>
          </div>
          <Badge variant={transaction.paymentStatus === 'paid' ? 'green' : 'gold'}>{transaction.paymentStatus}</Badge>
        </div>
        <div className="mt-6 space-y-4">
          {transaction.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-secondary p-4 text-sm">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-muted">{item.type} • qty {item.qty}</p>
              </div>
              <p>{formatCurrency(item.qty * item.price)}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card className="bg-secondary/70">
            <h3 className="font-semibold">Visit summary</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>1. Pasien check-in & registrasi selesai.</li>
              <li>2. Screening dan konsultasi dokter tercatat.</li>
              <li>3. Treatment dan skincare recommendation selesai.</li>
              <li>4. Pembayaran via {transaction.paymentMethod}.</li>
              <li>5. Follow-up dijadwalkan melalui reminder dummy.</li>
            </ul>
          </Card>
          <Card className="bg-secondary/70">
            <h3 className="font-semibold">Billing recap</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>- {formatCurrency(transaction.discount)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{transaction.tax * 100}%</span></div>
              <div className="flex justify-between border-t border-border pt-3 font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
          </Card>
        </div>
      </Card>
    </PageShell>
  );
}
