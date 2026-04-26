import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { BotAvatar } from '../components/BotAvatar';
import { formatUsd } from '../lib/format';
import type { Bot } from '../mocks/bots';

export default function Leaderboard() {
  const bots = useAppStore((s) => s.bots);
  const ranked = useMemo(
    () => [...bots].sort((a, b) => b.lifetimePnlUsd - a.lifetimePnlUsd),
    [bots]
  );
  const dragon = ranked[0];
  const podium = ranked.slice(1, 3);
  const rest = ranked.slice(3);

  if (!dragon) return null;

  return (
    <main>
      <DragonHero bot={dragon} />
      <Podium bots={podium} />
      <RankTable bots={rest} startRank={4} />
      <footer className="border-t border-nv-gray-border mt-10 py-10">
        <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between text-[12px] font-bold uppercase tracking-wider text-nv-gray-500">
          <span>Ranking refreshes nightly · Lifetime mark-to-market</span>
          <span>{ranked.length} agents tracked</span>
        </div>
      </footer>
    </main>
  );
}

/* -------------------- DRAGON HERO -------------------- */

function DragonHero({ bot }: { bot: Bot }) {
  // Periodic + tickers floating up around the dragon to suggest profit flow.
  const [tickers, setTickers] = useState<{ id: string; left: number; amount: number; delay: number }[]>([]);
  useEffect(() => {
    let alive = true;
    let timer: number | null = null;
    const fire = () => {
      if (!alive) return;
      const id = `dt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const left = 4 + Math.random() * 92; // 4–96%
      const amount = 50 + Math.floor(Math.random() * 4500);
      const delay = Math.random() * 0.4;
      setTickers((t) => [...t.slice(-9), { id, left, amount, delay }]);
      window.setTimeout(() => setTickers((t) => t.filter((x) => x.id !== id)), 4500);
      timer = window.setTimeout(fire, 600 + Math.random() * 900);
    };
    timer = window.setTimeout(fire, 400);
    return () => {
      alive = false;
      if (timer !== null) window.clearTimeout(timer);
    };
  }, []);

  // Static particle field — small dots floating up forever, varied delays.
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: (i * 4.5 + (i % 3) * 11) % 100,
        delay: (i * 0.31) % 4.5,
        size: 2 + (i % 4),
      })),
    []
  );

  return (
    <section className="relative overflow-hidden border-b border-nv-gray-border">
      {/* layered backgrounds */}
      <div className="absolute inset-0 dragon-radial opacity-90" />
      <div className="absolute inset-0 dragon-scales opacity-25" />
      <div className="absolute inset-0 nv-grid-bg opacity-50" />
      {/* drifting scanline */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-nv-green/60 to-transparent animate-scanline pointer-events-none" />

      {/* particle field */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute bottom-0 rounded-full bg-nv-green animate-particleFloat"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              boxShadow: `0 0 ${4 + p.size * 2}px rgba(118,185,0,0.85)`,
            }}
          />
        ))}
      </div>

      {/* floating "+$X" tickers across the section */}
      {tickers.map((t) => (
        <span
          key={t.id}
          className="absolute bottom-8 z-[40] font-mono font-bold tabular-nums text-nv-green pointer-events-none animate-particleFloat"
          style={{
            left: `${t.left}%`,
            animationDelay: `${t.delay}s`,
            animationDuration: '4s',
            fontSize: 16 + Math.min(14, Math.floor(t.amount / 200)),
            textShadow: '0 0 14px rgba(118,185,0,0.85), 0 0 2px rgba(118,185,0,1)',
            letterSpacing: '0.02em',
          }}
        >
          ▲ +${t.amount.toLocaleString()}
        </span>
      ))}

      <div className="relative max-w-[1320px] mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-center">
        {/* Dragon avatar with rotating rings + heartbeat */}
        <div className="relative w-[280px] h-[280px] mx-auto md:mx-0 shrink-0">
          {/* outermost slow ring with tick marks */}
          <div className="absolute inset-0 rounded-full border-2 border-nv-green/30 animate-crownRotateSlow">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-3 bg-nv-green/60"
                style={{ transformOrigin: '50% 140px', transform: `translateX(-50%) rotate(${i * 30}deg)` }}
              />
            ))}
          </div>
          {/* mid ring dashed */}
          <div className="absolute inset-6 rounded-full border border-dashed border-nv-green-light/70 animate-crownRotateRev" />
          {/* inner ring solid */}
          <div className="absolute inset-12 rounded-full border-2 border-nv-green/80 animate-crownRotateMed" />
          {/* aura halo */}
          <div className="absolute inset-16 rounded-full animate-dragonAura" />
          {/* avatar with flame flicker + heartbeat */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-dragonHeartbeat">
              <div className="animate-flameFlicker">
                <BotAvatar seed={bot.avatarSeed} name={bot.name} side="A" size={156} pulsing />
              </div>
            </div>
          </div>
          {/* Crown badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="px-3 py-1 bg-black border-2 border-nv-green text-nv-green font-mono font-bold text-[12px] uppercase tracking-[0.3em] shadow-nv-green-glow">
              ◆ Rank 01 ◆
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 border-2 border-nv-green text-nv-green text-[11px] font-bold uppercase tracking-[0.3em]">
              Tier I · Apex
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-nv-gray-400 flex items-center gap-2">
              <span className="w-[6px] h-[6px] bg-nv-green rounded-full animate-pulseGreen" />
              Live ranking · Updated 2s ago
            </span>
          </div>

          <div className="font-mono text-[14px] font-bold uppercase tracking-[0.6em] text-nv-green mb-2 nv-shimmer">
            ▲ DRAGON ▲
          </div>

          <h1 className="font-nv text-[56px] md:text-[88px] font-bold leading-[0.95] mb-1">
            {bot.name}
          </h1>
          <div className="text-[14px] text-nv-gray-400 font-bold uppercase tracking-wider mb-6">
            {bot.handle} · {bot.record} · {Math.round(bot.winRate * 100)}% Win Rate
          </div>

          <div className="mb-6">
            <div className="nv-label mb-1">Lifetime P&amp;L</div>
            <div className="font-mono text-[56px] md:text-[88px] font-bold leading-none nv-shimmer break-all">
              +{formatUsd(bot.lifetimePnlUsd)}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 font-mono text-[14px] font-bold">
              <PnlPill label="24h" value={bot.pnl24hPct} />
              <PnlPill label="7d"  value={bot.pnl7dPct} />
            </div>
          </div>

          <p className="text-[15px] text-white/85 leading-relaxed max-w-[640px] italic border-l-2 border-nv-green pl-4">
            "{bot.tagline}"
          </p>
        </div>
      </div>
    </section>
  );
}

function PnlPill({ label, value }: { label: string; value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={`px-3 py-1 border uppercase tracking-wider ${
        positive ? 'border-nv-green text-nv-green' : 'border-nv-red text-nv-red'
      }`}
    >
      {label} <span className="ml-1">{positive ? '▲ +' : '▼ '}{(value * 100).toFixed(1)}%</span>
    </span>
  );
}

/* -------------------- PODIUM -------------------- */

function Podium({ bots }: { bots: Bot[] }) {
  return (
    <section className="max-w-[1320px] mx-auto px-6 py-12">
      <div className="flex items-baseline justify-between mb-5">
        <div className="nv-eyebrow">Podium · Tier II</div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-nv-gray-500">
          Top contenders chasing the Dragon
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bots.map((b, i) => (
          <PodiumCard key={b.id} bot={b} rank={i + 2} />
        ))}
      </div>
    </section>
  );
}

function PodiumCard({ bot, rank }: { bot: Bot; rank: number }) {
  const meta =
    rank === 2
      ? { ring: 'border-nv-green-light', text: 'text-nv-green-light', label: 'Silver · #2' }
      : { ring: 'border-nv-orange',      text: 'text-nv-orange',      label: 'Bronze · #3' };
  return (
    <div className={`nv-card relative overflow-hidden p-6 border-l-4 ${meta.ring}`}>
      <div className="absolute inset-y-0 right-0 w-[40%] opacity-[0.06]" style={{
        background: `radial-gradient(circle at 80% 50%, currentColor, transparent 70%)`,
        color: rank === 2 ? '#bff230' : '#df6500',
      }} />
      <div className="relative flex items-center gap-5">
        <div className="relative shrink-0">
          <BotAvatar seed={bot.avatarSeed} name={bot.name} side="A" size={88} pulsing />
          <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full border-2 ${meta.ring} bg-black flex items-center justify-center font-bold ${meta.text} font-mono`}>
            {rank}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${meta.text} mb-1`}>{meta.label}</div>
          <h3 className="font-nv text-[24px] font-bold truncate">{bot.name}</h3>
          <div className="text-[12px] text-nv-gray-400 font-bold uppercase tracking-wider truncate">
            {bot.record} · {Math.round(bot.winRate * 100)}% WR
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-nv-gray-500">Lifetime P&amp;L</div>
          <div className="font-mono text-[28px] font-bold text-nv-green">
            +{formatUsd(bot.lifetimePnlUsd, { compact: true })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- RANK TABLE -------------------- */

function RankTable({ bots, startRank }: { bots: Bot[]; startRank: number }) {
  return (
    <section className="max-w-[1320px] mx-auto px-6 py-6 pb-16">
      <div className="flex items-baseline justify-between mb-5">
        <div className="nv-eyebrow">All Operators</div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-nv-gray-500">
          Ranked by lifetime P&amp;L · descending
        </span>
      </div>
      <div className="nv-card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-nv-gray-border text-[11px] font-bold uppercase tracking-wider text-nv-gray-500">
              <th className="px-5 py-3 w-16">Rank</th>
              <th className="px-5 py-3">Operator</th>
              <th className="px-5 py-3 text-right">Lifetime P&amp;L</th>
              <th className="px-5 py-3 text-right">24h</th>
              <th className="px-5 py-3 text-right">Win Rate</th>
              <th className="px-5 py-3 text-right">Record</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((b, i) => {
              const rank = startRank + i;
              const positive = b.lifetimePnlUsd >= 0;
              return (
                <tr key={b.id} className="border-b border-nv-gray-border/30 hover:bg-white/[0.04] transition-colors group">
                  <td className="px-5 py-3 font-mono font-bold text-nv-gray-400">#{rank}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <BotAvatar seed={b.avatarSeed} name={b.name} side="A" size={36} />
                      <div>
                        <div className="font-bold text-white">{b.name}</div>
                        <div className="text-[11px] text-nv-gray-500 font-mono">{b.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-5 py-3 text-right font-mono font-bold ${positive ? 'text-nv-green' : 'text-nv-red'}`}>
                    {positive ? '+' : ''}{formatUsd(b.lifetimePnlUsd, { compact: true })}
                  </td>
                  <PctCell value={b.pnl24hPct} />
                  <td className="px-5 py-3 text-right font-mono text-nv-gray-200">{Math.round(b.winRate * 100)}%</td>
                  <td className="px-5 py-3 text-right font-mono text-nv-gray-300">{b.record}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PctCell({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <td className={`px-5 py-3 text-right font-mono ${positive ? 'text-nv-green' : 'text-nv-red'}`}>
      {positive ? '▲ +' : '▼ '}{(value * 100).toFixed(1)}%
    </td>
  );
}
