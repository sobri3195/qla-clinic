import { useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import { ShoppingBag, Trash2, PackagePlus } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useAppStore } from '@/store/app-store';
import { formatCurrency, getLowStockStatus } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product } from '@/types';

const emptyProduct = (): Product => ({
  id: `prd-${nanoid(6)}`,
  name: '',
  category: '',
  regimenStep: '',
  heroIngredient: '',
  price: 0,
  stock: 0,
  minStock: 0,
  supplier: '',
  recommendationFor: '',
  status: 'Ready',
});

export function ProductsPage() {
  const { products, inventoryLogs, purchaseOrders, addProduct, updateProduct, deleteProduct } = useAppStore();
  const [form, setForm] = useState<Product>(emptyProduct());
  const [editingId, setEditingId] = useState<string | null>(null);
  const regimenSteps = Array.from(new Set(products.map((product) => product.regimenStep)));
  const lowStockProducts = useMemo(() => products.filter((item) => item.status === 'Low Stock'), [products]);

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.regimenStep || !form.supplier) {
      toast.error('Lengkapi field wajib produk terlebih dahulu.');
      return;
    }
    const payload = { ...form, status: getLowStockStatus(form.stock, form.minStock) };
    if (editingId) {
      updateProduct(payload);
      toast.success(`Produk ${form.name} diperbarui.`);
    } else {
      addProduct(payload);
      toast.success(`Produk ${form.name} ditambahkan.`);
    }
    setForm(emptyProduct());
    setEditingId(null);
  };

  return (
    <PageShell
      title="Products & Skincare"
      description="Inventory sekarang memiliki CRUD produk, alert stok, dan tampilan mobile card agar lebih mudah dipantau oleh kasir maupun owner."
      actions={<Button onClick={() => toast.success('PO draft dapat diteruskan sebagai form procurement pada fase backend.')}><ShoppingBag className="h-4 w-4" /> Create PO draft</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary">CRUD Product</p>
                <h3 className="mt-2 text-xl font-semibold">Tambah, edit, atau hapus skincare clinic.</h3>
              </div>
              <PackagePlus className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama produk" />
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Kategori" />
              <Input value={form.regimenStep} onChange={(e) => setForm({ ...form, regimenStep: e.target.value })} placeholder="Step routine" />
              <Input value={form.heroIngredient} onChange={(e) => setForm({ ...form, heroIngredient: e.target.value })} placeholder="Hero ingredient" />
              <Input value={form.recommendationFor} onChange={(e) => setForm({ ...form, recommendationFor: e.target.value })} placeholder="Recommended for" />
              <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="Supplier" />
              <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} placeholder="Stock" />
              <Input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} placeholder="Min stock" />
              <div className="md:col-span-2">
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price" />
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleSubmit} className="sm:flex-1">{editingId ? 'Update product' : 'Add product'}</Button>
              <Button variant="secondary" className="sm:flex-1" onClick={() => { setForm(emptyProduct()); setEditingId(null); }}>Reset form</Button>
            </div>
          </Card>

          <Card>
            <div className="hidden overflow-x-auto lg:block">
              <Table>
                <THead>
                  <TR>
                    <TH>Product</TH>
                    <TH>Category</TH>
                    <TH>Routine step</TH>
                    <TH>Stock</TH>
                    <TH>Price</TH>
                    <TH>Status</TH>
                    <TH>Aksi</TH>
                  </TR>
                </THead>
                <TBody>
                  {products.map((product) => (
                    <TR key={product.id}>
                      <TD className="font-medium">{product.name}<p className="mt-1 text-xs text-muted">Supplier: {product.supplier}</p></TD>
                      <TD>{product.category}</TD>
                      <TD>{product.regimenStep}</TD>
                      <TD>{product.stock}/{product.minStock}</TD>
                      <TD>{formatCurrency(product.price)}</TD>
                      <TD><Badge variant={product.status === 'Ready' ? 'green' : 'gold'}>{product.status}</Badge></TD>
                      <TD>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => { setEditingId(product.id); setForm(product); }}>Edit</Button>
                          <Button size="sm" variant="outline" onClick={() => { deleteProduct(product.id); toast.success(`Produk ${product.name} dihapus.`); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>

            <div className="grid gap-3 lg:hidden">
              {products.map((product) => (
                <div key={product.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="mt-1 text-sm text-muted">{product.category} • {product.regimenStep}</p>
                    </div>
                    <Badge variant={product.status === 'Ready' ? 'green' : 'gold'}>{product.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted">{product.recommendationFor} • {formatCurrency(product.price)}</p>
                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1" variant="secondary" onClick={() => { setEditingId(product.id); setForm(product); }}>Edit</Button>
                    <Button className="flex-1" variant="outline" onClick={() => { deleteProduct(product.id); toast.success(`Produk ${product.name} dihapus.`); }}>Hapus</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold">Beauty routine builder</h3>
            <div className="mt-4 space-y-3">
              {regimenSteps.map((step) => (
                <div key={step} className="rounded-2xl border border-border p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{step}</p>
                    <Badge variant="pink">{products.filter((product) => product.regimenStep === step).length} SKU</Badge>
                  </div>
                  <p className="mt-2 text-muted">
                    {products
                      .filter((product) => product.regimenStep === step)
                      .map((product) => product.name)
                      .join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </Card>

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
              {lowStockProducts.map((product) => (
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
