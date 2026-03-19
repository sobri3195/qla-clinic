import { useMemo, useState } from 'react';
import { Gift, ReceiptText } from 'lucide-react';
import { nanoid } from 'nanoid';
import { PageShell } from '@/components/shared/page-shell';
import { AccessGuard } from '@/components/shared/access-guard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useAppStore } from '@/store/app-store';
import { calculateTransactionTotal, formatCurrency, getTierFromPoints } from '@/lib/utils';
import type { TransactionItem } from '@/types';
import { toast } from 'sonner';

export function CashierPage() {
  const { patients, treatments, products, transactions, addTransaction, currentUser } = useAppStore();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id ?? '');
  const [cart] = useState<TransactionItem[]>([
    { id: 'cart-1', type: 'treatment', label: treatments[0]?.name ?? '', qty: 1, price: treatments[0]?.price ?? 0 },
    { id: 'cart-2', type: 'product', label: products[0]?.name ?? '', qty: 1, price: products[0]?.price ?? 0 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState<'tunai' | 'debit' | 'transfer' | 'e-wallet'>('transfer');
  const [pointsRedeemed, setPointsRedeemed] = useState(0);

  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.qty * item.price, 0), [cart]);
  const discount = 150000 + pointsRedeemed * 1000;
  const tax = 0.11;
  const total = calculateTransactionTotal(subtotal, discount, tax);
  const earnedPoints = Math.floor(subtotal / 100000);
  const projectedPoints = Math.max((selectedPatient?.loyaltyPoints ?? 0) - pointsRedeemed + earnedPoints, 0);

  const checkout = () => {
    addTransaction(
      {
        id: `txn-${nanoid(6)}`,
        patientId: selectedPatientId,
        cashierId: currentUser?.name ? 'staff-5' : 'cashier-demo',
        date: new Date().toISOString().slice(0, 10),
        items: cart,
        discount,
        tax,
        pointsRedeemed,
        paymentMethod,
        paymentStatus: 'paid',
        memberPricing: true,
      },
      currentUser?.name ?? 'Kasir'
    );
    toast.success('Transaksi berhasil disimpan, stok dan loyalty otomatis diperbarui.');
  };

  return (
    <AccessGuard module="cashier">
      <PageShell title="Cashier & Billing" description="Cashier terhubung ke stock deduction, loyalty earn/redeem, tier projection, referral tracking, dan histori transaksi terbaru.">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Pilih pasien</label>
              <Select value={selectedPatientId} onChange={setSelectedPatientId} options={patients.map((patient) => ({ value: patient.id, label: patient.name }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Metode pembayaran</label>
              <Select value={paymentMethod} onChange={(value) => setPaymentMethod(value as typeof paymentMethod)} options={['tunai', 'debit', 'transfer', 'e-wallet'].map((item) => ({ value: item, label: item }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Redeem loyalty points</label>
              <Input type="number" min={0} max={selectedPatient?.loyaltyPoints ?? 0} value={pointsRedeemed} onChange={(e) => setPointsRedeemed(Number(e.target.value))} />
            </div>
            <div className="rounded-2xl bg-secondary p-4 text-sm">
              <p className="font-medium">Membership & referral</p>
              <p className="mt-2 text-muted">Tier {selectedPatient?.memberTier} • {selectedPatient?.loyaltyPoints} pts</p>
              <p className="mt-1 text-muted">Referral code: {selectedPatient?.referralCode}</p>
              <p className="mt-1 text-muted">Projected tier after checkout: {getTierFromPoints(projectedPoints)}</p>
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Item</TH>
                  <TH>Type</TH>
                  <TH>Qty</TH>
                  <TH>Price</TH>
                </TR>
              </THead>
              <TBody>
                {cart.map((item) => (
                  <TR key={item.id}>
                    <TD>{item.label}</TD>
                    <TD><Badge variant={item.type === 'treatment' ? 'pink' : 'green'}>{item.type}</Badge></TD>
                    <TD>{item.qty}</TD>
                    <TD>{formatCurrency(item.price)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold">Payment summary</h3>
            <div className="mt-5 space-y-4 rounded-[24px] bg-secondary p-5">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span>Member discount</span><span>- {formatCurrency(150000)}</span></div>
              <div className="flex justify-between text-sm"><span>Point redemption</span><span>- {formatCurrency(pointsRedeemed * 1000)}</span></div>
              <div className="flex justify-between text-sm"><span>Earned points</span><span>+ {earnedPoints} pts</span></div>
              <div className="flex justify-between text-sm"><span>PPN</span><span>11%</span></div>
              <div className="flex justify-between border-t border-border pt-4 text-base font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
            <Button className="mt-5 w-full" onClick={checkout}><ReceiptText className="h-4 w-4" /> Simpan transaksi</Button>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Loyalty & promo engine</h3>
                <p className="mt-1 text-sm text-muted">Siap untuk birthday, anniversary, dan referral promo.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-2xl border border-border p-4">
                <p className="font-medium">Automatic earn / redeem rules</p>
                <p className="mt-2 text-muted">1 poin per Rp100.000 transaksi. Redeem = Rp1.000 / poin. Tier upgrade otomatis setelah checkout.</p>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <p className="font-medium">Birthday & anniversary promo</p>
                <p className="mt-2 text-muted">Member dapat campaign otomatis lewat reminder center dan dipakai di cashier.</p>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            {transactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="rounded-2xl border border-border p-4">
                <p className="font-medium">{transaction.id}</p>
                <p className="mt-1 text-sm text-muted">{transaction.paymentMethod} • {transaction.paymentStatus} • redeem {transaction.pointsRedeemed} pts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
    </AccessGuard>
  );
}
