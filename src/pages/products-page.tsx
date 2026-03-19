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
  const products = useAppStore((state) => state.products);
  return (
    <PageShell title="Products & Skincare" description="Daftar produk skincare, stok dummy, harga, kategori, dan rekomendasi produk untuk pasien." actions={<Button onClick={() => toast.success('UI dummy: produk ditambahkan ke transaksi di halaman Cashier.')}><ShoppingBag className="h-4 w-4" /> Add to sale</Button>}>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH>Product</TH>
                <TH>Category</TH>
                <TH>Recommended for</TH>
                <TH>Stock</TH>
                <TH>Price</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {products.map((product) => (
                <TR key={product.id}>
                  <TD className="font-medium">{product.name}</TD>
                  <TD>{product.category}</TD>
                  <TD>{product.recommendationFor}</TD>
                  <TD>{product.stock}</TD>
                  <TD>{formatCurrency(product.price)}</TD>
                  <TD><Badge variant={product.status === 'Ready' ? 'green' : 'gold'}>{product.status}</Badge></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
