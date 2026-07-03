'use client';

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface RadarRow {
  function: string;
  title: string;
  Current: number | null;
  Target: number | null;
}

interface Props {
  data: RadarRow[];
}

export default function RoadmapRadar({ data }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="function" tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 10, fill: '#cbd5e1' }}
          />
          <Radar name="Current" dataKey="Current" stroke="#64748b" fill="#64748b" fillOpacity={0.25} strokeWidth={2} connectNulls />
          <Radar name="Target" dataKey="Target" stroke="#6366f1" fill="#6366f1" fillOpacity={0.08} strokeWidth={2} strokeDasharray="5 5" connectNulls />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}
            formatter={(value) => (typeof value === 'number' ? value.toFixed(1) : '—')}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
