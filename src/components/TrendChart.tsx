'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface FunctionDef {
  code: string;
  title: string;
  color: string;
}

interface Props {
  data: Record<string, string | number | null>[];
  functions: FunctionDef[];
}

export default function TrendChart({ data, functions }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
            formatter={(value, name) => [typeof value === 'number' ? value.toFixed(1) : '—', name]}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
            formatter={(value) => {
              const fn = functions.find((f) => f.code === value);
              return fn ? `${fn.code} — ${fn.title}` : value;
            }}
          />
          {functions.map((fn) => (
            <Line
              key={fn.code}
              type="monotone"
              dataKey={fn.code}
              stroke={fn.color}
              strokeWidth={2}
              dot={{ r: 4, fill: fn.color }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
