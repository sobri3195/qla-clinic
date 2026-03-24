import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

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
  { name: 'Check-in', value: 18, color: '#d8a4b3' },
  { name: 'Consultation', value: 14, color: '#c89b93' },
  { name: 'Treatment', value: 11, color: '#b77d8c' },
  { name: 'Paid', value: 10, color: '#8f5a69' },
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
      <AreaChart data={revenueData}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#b77d8c" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#b77d8c" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f1e7ea" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: '#8d7e84', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#8d7e84', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '14px', border: '1px solid #efe4e8', background: '#fff', boxShadow: '0 12px 28px rgba(53,42,47,0.08)' }}
          formatter={(value: number) => [new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value), 'Revenue']}
        />
        <Area type="monotone" dataKey="revenue" stroke="#b77d8c" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function FunnelChartCard() {
  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={funnelData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
            {funnelData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '14px', border: '1px solid #efe4e8', background: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid gap-2 sm:grid-cols-2">
        {funnelData.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-xl border border-[#efe5e9] bg-[#fffafb] px-3 py-2 text-xs">
            <span className="inline-flex items-center gap-2 text-muted"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>
            <span className="font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StaffPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={performanceData}>
        <CartesianGrid stroke="#f1e7ea" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#8d7e84', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#8d7e84', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: '14px', border: '1px solid #efe4e8', background: '#fff' }} />
        <Bar dataKey="value" fill="#c89b93" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
