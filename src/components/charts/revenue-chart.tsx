import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const currencyFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

const revenueData = [
  { day: 'Mon', revenue: 6800000 },
  { day: 'Tue', revenue: 8200000 },
  { day: 'Wed', revenue: 7900000 },
  { day: 'Thu', revenue: 9600000 },
  { day: 'Fri', revenue: 11200000 },
  { day: 'Sat', revenue: 13800000 },
  { day: 'Sun', revenue: 9100000 },
];

const funnelData = [
  { name: 'Check-in', value: 18, color: '#d9a8b6' },
  { name: 'Consultation', value: 14, color: '#c89b93' },
  { name: 'Treatment', value: 11, color: '#b88395' },
  { name: 'Paid', value: 10, color: '#926270' },
];

const performanceData = [
  { name: 'dr. Keisya', value: 92 },
  { name: 'dr. Alicia', value: 88 },
  { name: 'Mey', value: 96 },
  { name: 'Vania', value: 83 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={revenueData} margin={{ left: -8, right: 6, top: 8 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#b77d8c" stopOpacity={0.34} />
            <stop offset="95%" stopColor="#b77d8c" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f3eaee" vertical={false} strokeDasharray="4 4" />
        <XAxis dataKey="day" tick={{ fill: '#8d7e84', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(value) => `${Math.round(value / 1000000)}M`} tick={{ fill: '#8d7e84', fontSize: 12 }} axisLine={false} tickLine={false} width={34} />
        <Tooltip
          contentStyle={{ borderRadius: '14px', border: '1px solid #efe4e8', background: '#fff', boxShadow: '0 10px 24px rgba(53,42,47,0.08)' }}
          formatter={(value: number) => [currencyFormatter.format(value), 'Revenue']}
        />
        <Area type="monotone" dataKey="revenue" stroke="#b77d8c" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function FunnelChartCard() {
  const total = funnelData[0]?.value ?? 0;

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={funnelData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92} paddingAngle={2}>
            {funnelData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '14px', border: '1px solid #efe4e8', background: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid gap-2 sm:grid-cols-2">
        {funnelData.map((item) => {
          const ratio = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.name} className="flex items-center justify-between rounded-2xl border border-[#efe5e9] bg-[#fffafb] px-3 py-2.5 text-xs">
              <span className="inline-flex items-center gap-2 text-muted">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="font-semibold text-foreground">{item.value} ({ratio}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StaffPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={performanceData} margin={{ left: -12, right: 6, top: 8 }}>
        <CartesianGrid stroke="#f1e7ea" vertical={false} strokeDasharray="4 4" />
        <XAxis dataKey="name" tick={{ fill: '#8d7e84', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: '#8d7e84', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: '14px', border: '1px solid #efe4e8', background: '#fff' }} />
        <Bar dataKey="value" fill="#c89b93" radius={[10, 10, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
