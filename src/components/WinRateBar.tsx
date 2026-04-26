import { formatPct } from '../lib/format';

interface Props {
  winRateA: number;        // 0..1, A share on left (green)
  labelA?: string;
  labelB?: string;
  size?: 'sm' | 'md' | 'lg';
  showPct?: boolean;
}

export function WinRateBar({ winRateA, labelA = 'A', labelB = 'B', size = 'md', showPct = true }: Props) {
  const aPct = Math.round(winRateA * 100);
  const bPct = 100 - aPct;

  const h = size === 'lg' ? 'h-3' : size === 'sm' ? 'h-[6px]' : 'h-[10px]';
  const text = size === 'sm' ? 'text-[11px]' : 'text-[13px]';

  return (
    <div className="w-full">
      {showPct && (
        <div className={`flex items-baseline justify-between mb-1 font-nv ${text} font-bold uppercase tracking-wide`}>
          <div className="flex items-center gap-2">
            <span className="text-nv-green">{aPct}%</span>
            <span className="text-nv-gray-500">·</span>
            <span className="text-white/80">{labelA}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/80">{labelB}</span>
            <span className="text-nv-gray-500">·</span>
            <span className="text-nv-red">{bPct}%</span>
          </div>
        </div>
      )}
      <div className={`relative w-full ${h} overflow-hidden rounded-nv bg-nv-near-black border border-nv-gray-border`}>
        <div
          className="absolute inset-y-0 left-0 bg-nv-green transition-[width] duration-500 ease-out"
          style={{ width: `${aPct}%` }}
        />
        <div
          className="absolute inset-y-0 right-0 bg-nv-red transition-[width] duration-500 ease-out"
          style={{ width: `${bPct}%` }}
        />
        {/* center seam */}
        <div
          className="absolute top-0 bottom-0 w-px bg-black/80"
          style={{ left: `${aPct}%`, transform: 'translateX(-0.5px)' }}
        />
      </div>
    </div>
  );
}

export function WinRateBarCompact({ winRateA }: { winRateA: number }) {
  return <WinRateBar winRateA={winRateA} size="sm" showPct={false} />;
}

export function _pct(v: number) { return formatPct(v); }
