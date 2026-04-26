import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { BattlePoint } from '../mocks/battles';

export function BattleChart({
  points,
  height = 340,
}: {
  points: BattlePoint[];
  height?: number;
}) {
  const data = useMemo(
    () =>
      points.map((p) => ({
        t: new Date(p.t).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
        winRateA: +(p.winRateA * 100).toFixed(2),
      })),
    [points]
  );
  const current = data[data.length - 1]?.winRateA ?? 50;

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#76b900" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#76b900" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="t"
            tick={{ fill: '#757575', fontSize: 11 }}
            axisLine={{ stroke: '#5e5e5e' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#757575', fontSize: 11 }}
            axisLine={{ stroke: '#5e5e5e' }}
            tickLine={false}
            width={36}
            unit="%"
          />
          <Tooltip
            contentStyle={{
              background: '#0a0a0a',
              border: '1px solid #5e5e5e',
              borderRadius: 2,
              fontSize: 12,
            }}
            labelStyle={{ color: '#a7a7a7', fontWeight: 700 }}
            itemStyle={{ color: '#76b900', fontWeight: 700 }}
            formatter={(v: number) => [`${v.toFixed(1)}%`, 'A Win Prob']}
          />
          <ReferenceLine y={50} stroke="#5e5e5e" strokeDasharray="2 4" />
          <Area
            type="monotone"
            dataKey="winRateA"
            stroke="#76b900"
            strokeWidth={2}
            fill="url(#grA)"
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="relative -mt-[330px] pointer-events-none">
        <div className="absolute right-3 top-0 px-2 py-[2px] bg-black/80 border border-nv-green text-nv-green font-mono text-[12px] font-bold rounded-nv">
          A {current.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
