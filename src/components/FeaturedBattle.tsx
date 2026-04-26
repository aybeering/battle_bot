import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BotAvatar } from './BotAvatar';
import { WinRateBar } from './WinRateBar';
import { useAppStore } from '../store/useAppStore';
import { FEATURED_BATTLE_ID } from '../mocks/battles';
import { formatUsd } from '../lib/format';

interface FloatTicker {
  id: string;
  side: 'A' | 'B';
  amount: number;
  isPositive: boolean;
  topPct: number;     // 0..100, vertical position inside the section
  drift: number;      // small horizontal jitter (px from edge)
}

export function FeaturedBattle() {
  const battle = useAppStore((s) => s.battles.find((b) => b.id === FEATURED_BATTLE_ID) ?? s.battles[0]);
  const botA = useAppStore((s) => s.bots.find((b) => b.id === battle.botAId)!);
  const botB = useAppStore((s) => s.bots.find((b) => b.id === battle.botBId)!);

  const [tickers, setTickers] = useState<FloatTicker[]>([]);
  // bumping these counters re-keys the avatars and re-runs the shake animation.
  const [shakeA, setShakeA] = useState(0);
  const [shakeB, setShakeB] = useState(0);
  const [flashA, setFlashA] = useState(0);
  const [flashB, setFlashB] = useState(0);

  // Single ticker emitter — used by both random and price-driven sources.
  // Stable identity so deps arrays stay tight.
  const emit = useCallback((side: 'A' | 'B', isPositive: boolean, amount: number) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setTickers((t) => [
      ...t.slice(-7),
      {
        id,
        side,
        amount,
        isPositive,
        topPct: 18 + Math.random() * 64,
        drift: Math.random() * 28,
      },
    ]);
    if (side === 'A') {
      setShakeA((s) => s + 1);
      setFlashA((s) => s + 1);
    } else {
      setShakeB((s) => s + 1);
      setFlashB((s) => s + 1);
    }
    window.setTimeout(() => {
      setTickers((t) => t.filter((x) => x.id !== id));
    }, 1750);
  }, []);

  // PRICE-DRIVEN: every time winRateA actually moves (simulate.ts ticks every 2s),
  // shake the side whose probability went up and emit a "▲ +$X" on that side.
  // delta is mapped to a $ amount so big swings produce big numbers.
  const prevWinRateA = useRef(battle.winRateA);
  useEffect(() => {
    const prev = prevWinRateA.current;
    const curr = battle.winRateA;
    const delta = curr - prev;
    if (Math.abs(delta) > 0.0008) {
      const side: 'A' | 'B' = delta > 0 ? 'A' : 'B';
      const amount = Math.max(20, Math.round(Math.abs(delta) * 50000));
      emit(side, true, amount);
    }
    prevWinRateA.current = curr;
  }, [battle.winRateA, emit]);

  // BACKGROUND NOISE: random emitter — alternates feel via side bias toward the leader.
  // Slowed down vs. before so it doesn't drown out the price-driven signal.
  useEffect(() => {
    let alive = true;
    let timer: number | null = null;

    const fire = () => {
      if (!alive) return;
      const leadingA = battle.winRateA > 0.5;
      const sideRoll = Math.random();
      const side: 'A' | 'B' = sideRoll < (leadingA ? 0.6 : 0.4) ? 'A' : 'B';
      const isPositive = Math.random() > 0.42;
      const amount = Math.floor(40 + Math.random() * 1180);
      emit(side, isPositive, amount);

      const next = 1800 + Math.random() * 1800;
      timer = window.setTimeout(fire, next);
    };

    timer = window.setTimeout(fire, 1100);
    return () => {
      alive = false;
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [battle.winRateA, emit]);

  return (
    <section className="relative overflow-hidden border-b border-nv-gray-border">
      <div className="absolute inset-0 nv-radial-green opacity-80" />
      <div className="absolute inset-0 nv-grid-bg opacity-60" />
      {/* drifting scanline for the cyber feel */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-nv-green/40 to-transparent animate-scanline pointer-events-none" />

      {/* per-side flash overlays (re-keyed to retrigger animation each ticker) */}
      <div
        key={`flash-A-${flashA}`}
        className="absolute inset-y-0 left-0 w-[35%] pointer-events-none animate-sideFlashGreen"
      />
      <div
        key={`flash-B-${flashB}`}
        className="absolute inset-y-0 right-0 w-[35%] pointer-events-none animate-sideFlashRed"
      />

      {/* floating +/- tickers, absolute to the section — z-[40] so they paint
          over the avatars and side flashes. */}
      {tickers.map((t) => (
        <span
          key={t.id}
          className={`absolute pointer-events-none select-none font-mono font-bold tabular-nums whitespace-nowrap z-[40] ${
            t.side === 'A' ? 'animate-floatUpLeft' : 'animate-floatUpRight'
          } ${t.isPositive ? 'text-nv-green' : 'text-nv-red'}`}
          style={{
            top: `${t.topPct}%`,
            [t.side === 'A' ? 'left' : 'right']: `${8 + t.drift}px`,
            fontSize: 18 + Math.min(14, Math.floor(t.amount / 100)),
            textShadow: t.isPositive
              ? '0 0 14px rgba(118,185,0,0.85), 0 0 2px rgba(118,185,0,1)'
              : '0 0 14px rgba(229,32,32,0.85),  0 0 2px rgba(229,32,32,1)',
            letterSpacing: '0.02em',
          }}
        >
          {t.isPositive ? '▲ +' : '▼ −'}${t.amount.toLocaleString()}
        </span>
      ))}

      <div className="relative max-w-[1320px] mx-auto px-6 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="nv-label">◉ Main Event</span>
            <span className="text-[11px] text-nv-gray-400 font-bold uppercase tracking-wider">
              Round {battle.round} · Pool {formatUsd(battle.poolUsd, { compact: true })} · {battle.participantCount} Bettors
            </span>
          </div>
          <Link to={`/battle/${battle.id}`} className="nv-btn-primary">
            Enter Battle <span className="text-nv-green">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-center">
          <BotSide bot={botA} side="A" align="left" shakeKey={shakeA} />
          <div className="flex flex-col items-center gap-2">
            <div className="text-nv-gray-500 font-nv text-[11px] font-bold uppercase tracking-[0.3em]">Versus</div>
            <div className="font-nv text-[48px] md:text-[72px] font-bold leading-none nv-shimmer">VS</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-nv-gray-400">Round {battle.round} · Live</div>
          </div>
          <BotSide bot={botB} side="B" align="right" shakeKey={shakeB} />
        </div>

        <div className="mt-10">
          <WinRateBar winRateA={battle.winRateA} labelA={botA.name} labelB={botB.name} size="lg" />
          <div className="mt-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-nv-gray-400">
            <span>Win Probability · Agent A</span>
            <span>Updates every 2s</span>
            <span>Win Probability · Agent B</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function BotSide({
  bot,
  side,
  align,
  shakeKey,
}: {
  bot: { avatarSeed: string; name: string; tagline: string; record: string };
  side: 'A' | 'B';
  align: 'left' | 'right';
  shakeKey: number;
}) {
  const right = align === 'right';
  const ringColor1 = side === 'A' ? '#76b900' : '#e52020';
  const ringColor2 = side === 'A' ? '#bff230' : '#ff5050';
  const glowAnim = side === 'A' ? 'animate-avatarGlowGreen' : 'animate-avatarGlowRed';
  return (
    <div className={`flex ${right ? 'flex-row-reverse text-right' : ''} items-start gap-5`}>
      {/* avatar stack: shockwave rings + steady glow halo + shaking avatar */}
      <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
        {shakeKey > 0 && (
          <>
            {/* primary shockwave ring */}
            <span
              key={`sw1-${shakeKey}`}
              className="absolute inset-0 rounded-full pointer-events-none animate-shockwave z-[5]"
              style={{ border: `3px solid ${ringColor1}`, boxSizing: 'border-box' }}
            />
            {/* secondary delayed shockwave ring */}
            <span
              key={`sw2-${shakeKey}`}
              className="absolute inset-0 rounded-full pointer-events-none animate-shockwaveDelayed z-[5]"
              style={{ border: `2px solid ${ringColor2}`, boxSizing: 'border-box' }}
            />
            {/* halo glow that stays put while avatar punches around */}
            <span
              key={`glow-${shakeKey}`}
              className={`absolute inset-0 rounded-full pointer-events-none ${glowAnim} z-[1]`}
            />
          </>
        )}
        {/* shaking avatar — re-keyed each shake so animation restarts */}
        <div key={`shake-${shakeKey}`} className="absolute inset-0 animate-shakeHard will-change-transform z-[10]">
          <BotAvatar seed={bot.avatarSeed} name={bot.name} side={side} size={96} pulsing />
        </div>
      </div>
      <div key={`text-${shakeKey}`} className={`min-w-0 ${shakeKey ? 'animate-textJolt' : ''}`}>
        <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${side === 'A' ? 'text-nv-green' : 'text-nv-red'}`}>
          Agent {side}
        </div>
        <h2 className="font-nv text-[28px] md:text-[36px] font-bold leading-[1.1] text-white">{bot.name}</h2>
        <div className="text-[13px] font-bold uppercase tracking-wider text-nv-gray-400 mb-2">{bot.record}</div>
        <p className="text-[15px] text-white/80 leading-relaxed max-w-[360px]">{bot.tagline}</p>
      </div>
    </div>
  );
}

