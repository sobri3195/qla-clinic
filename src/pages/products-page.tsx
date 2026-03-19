import { ShoppingBag } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useAppStore } from '@/store/app-store';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export function ProductsPage() {
  const { products, inventoryLogs, purchaseOrders } = useAppStore();

  return (
    <PageShell title="Products & Skincare" description="Inventory management yang terhubung ke penjualan dan treatment: auto stock deduction, consumables, restock log, min stock alert, dan simple purchase order." actions={<Button onClick={() => toast.success('PO draft dapat diteruskan sebagai form procurement pada fase backend.') }><ShoppingBag className="h-4 w-4" /> Create PO draft</Button>}>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Product</TH>
                  <TH>Category</TH>
                  <TH>Recommended for</TH>
                  <TH>Stock</TH>
                  <TH>Min stock</TH>
                  <TH>Price</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {products.map((product) => (
                  <TR key={product.id}>
                    <TD className="font-medium">{product.name}<p className="mt-1 text-xs text-muted">Supplier: {product.supplier}</p></TD>
                    <TD>{product.category}</TD>
                    <TD>{product.recommendationFor}</TD>
                    <TD>{product.stock}</TD>
                    <TD>{product.minStock}</TD>
                    <TD>{formatCurrency(product.price)}</TD>
                    <TD><Badge variant={product.status === 'Ready' ? 'green' : 'gold'}>{product.status}</Badge></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold">Restock & usage log</h3>
            <div className="mt-4 space-y-3">
              {inventoryLogs.slice(0, 6).map((log) => {
                const product = products.find((item) => item.id === log.productId);
                return (
                  <div key={log.id} className="rounded-2xl border border-border p-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{product?.name}</p>
                      <Badge variant={log.type === 'restock' ? 'green' : log.type === 'purchase-order' ? 'gold' : 'pink'}>{log.type}</Badge>
                    </div>
                    <p className="mt-2 text-muted">Qty {log.qty} • {log.date}</p>
                    <p className="mt-1 text-muted">{log.notes}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">Minimum stock alert & PO</h3>
            <div className="mt-4 space-y-3">
              {products.filter((item) => item.status === 'Low Stock').map((product) => (
                <div key={product.id} className="rounded-2xl bg-secondary p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{product.name}</p>
                    <Badge variant="gold">Low stock</Badge>
                  </div>
                  <p className="mt-2 text-muted">Sisa {product.stock}, minimum {product.minStock}. Supplier {product.supplier}.</p>
                </div>
              ))}
              {purchaseOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-border p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{order.id}</p>
                    <Badge variant={order.status === 'Received' ? 'green' : 'pink'}>{order.status}</Badge>
                  </div>
                  <p className="mt-2 text-muted">Supplier {order.supplier} • ETA {order.expectedDate}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
