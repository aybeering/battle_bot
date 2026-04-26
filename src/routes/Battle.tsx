import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { WinRateBar } from '../components/WinRateBar';
import { BotAvatar } from '../components/BotAvatar';
import { BattleChart } from '../components/BattleChart';
import { BetPanel } from '../components/BetPanel';
import { formatUsd, formatRelative } from '../lib/format';

const FEED_PREVIEW = 6;

export default function Battle() {
  const { id } = useParams<{ id: string }>();
  const battle = useAppStore((s) => s.battles.find((b) => b.id === id));
  const bots = useAppStore((s) => s.bots);

  const [showAllBets, setShowAllBets] = useState(false);

  if (!battle) return <Navigate to="/" replace />;
  const botA = bots.find((b) => b.id === battle.botAId);
  const botB = bots.find((b) => b.id === battle.botBId);
  if (!botA || !botB) return <Navigate to="/" replace />;

  const visibleBets = showAllBets ? battle.bets.slice(0, 20) : battle.bets.slice(0, FEED_PREVIEW);
  const hiddenBetsCount = Math.max(0, Math.min(battle.bets.length, 20) - FEED_PREVIEW);

  return (
    <main className="max-w-[1320px] mx-auto px-6 py-8 lg:pb-8 pb-[80px]">
      <div className="flex items-center justify-between flex-wrap gap-y-2 mb-6">
        <Link to="/" className="text-[13px] font-bold uppercase tracking-wider text-nv-gray-400 hover:text-nv-green transition-colors">
          ← All Arenas
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-nv-green">
            <span className="w-[6px] h-[6px] bg-nv-green rounded-full animate-pulseGreen" />
            Live · Round {battle.round}
          </span>
          <span className="text-[11px] text-nv-gray-400 font-bold uppercase tracking-wider">
            Pool {formatUsd(battle.poolUsd, { compact: true })} · {battle.participantCount} bettors · started {formatRelative(battle.startedAt)}
          </span>
        </div>
      </div>

      {/* Header */}
      <section className="relative overflow-hidden nv-card p-6 md:p-8 mb-6">
        <div className="absolute inset-0 nv-radial-green opacity-50 pointer-events-none" />
        <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6">
          <div className="flex items-center gap-4">
            <BotAvatar seed={botA.avatarSeed} name={botA.name} side="A" size={72} pulsing />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-nv-green">Agent A</div>
              <h2 className="font-nv text-[24px] md:text-[28px] font-bold leading-tight">{botA.name}</h2>
              <div className="text-[13px] text-nv-gray-400 font-bold uppercase tracking-wider">{botA.record} · {Math.round(botA.winRate * 100)}% WR</div>
            </div>
          </div>
          <div className="text-center">
            <div className="font-nv text-[48px] md:text-[56px] font-bold leading-none nv-shimmer">VS</div>
          </div>
          <div className="flex items-center gap-4 md:flex-row-reverse md:text-right">
            <BotAvatar seed={botB.avatarSeed} name={botB.name} side="B" size={72} pulsing />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-nv-red">Agent B</div>
              <h2 className="font-nv text-[24px] md:text-[28px] font-bold leading-tight">{botB.name}</h2>
              <div className="text-[13px] text-nv-gray-400 font-bold uppercase tracking-wider">{botB.record} · {Math.round(botB.winRate * 100)}% WR</div>
            </div>
          </div>
        </div>
        <div className="relative mt-6">
          <WinRateBar winRateA={battle.winRateA} labelA={botA.name} labelB={botB.name} size="md" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-6">
          <section className="nv-card p-5">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <div className="nv-label mb-1">Win Probability · Agent A</div>
                <h3 className="font-nv text-[18px] font-bold">Real-time odds feed</h3>
              </div>
              <div className="text-[11px] text-nv-gray-400 font-bold uppercase tracking-wider">Updates every 2s</div>
            </div>
            <BattleChart points={battle.points} height={340} />
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StrategyCard title={botA.name} strategy={botA.strategy} feeds={botA.dataFeeds} side="A" />
            <StrategyCard title={botB.name} strategy={botB.strategy} feeds={botB.dataFeeds} side="B" />
          </div>

          <section className="nv-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="nv-label">Activity Feed</div>
              <span className="text-[11px] text-nv-gray-400 font-bold uppercase tracking-wider">
                {battle.bets.length === 0 ? 'No bets yet' : `Showing ${visibleBets.length} / ${Math.min(battle.bets.length, 20)}`}
              </span>
            </div>
            {battle.bets.length === 0 ? (
              <p className="text-[13px] text-nv-gray-500 text-center py-6">No bets yet. Be first in.</p>
            ) : (
              <>
                <ul className="flex flex-col divide-y divide-nv-gray-border/60">
                  {visibleBets.map((bet) => (
                    <li key={bet.id} className="flex items-center justify-between py-2 text-[13px]">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-[2px] rounded-nv border ${
                        bet.side === 'A' ? 'border-nv-green text-nv-green' : 'border-nv-red text-nv-red'
                      }`}>
                        {bet.side === 'A' ? botA.name.slice(0, 12) : botB.name.slice(0, 12)}
                      </span>
                      <div className="flex items-center gap-4 font-mono">
                        <span className="text-white">{formatUsd(bet.amountUsd)}</span>
                        <span className="text-nv-gray-500 text-[11px]">{formatRelative(bet.at)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                {hiddenBetsCount > 0 && (
                  <button
                    onClick={() => setShowAllBets((v) => !v)}
                    className="mt-3 w-full text-[11px] font-bold uppercase tracking-wider text-nv-green hover:text-white transition-colors py-2 border border-nv-gray-border rounded-nv hover:border-nv-green"
                  >
                    {showAllBets ? 'Collapse' : `Show all (${Math.min(battle.bets.length, 20)})`}
                  </button>
                )}
              </>
            )}
          </section>
        </div>

        <BetPanel battle={battle} botA={botA} botB={botB} />
      </div>

      <a
        href="#bet-panel"
        className="lg:hidden fixed bottom-4 right-4 z-40 nv-btn-primary shadow-nv-green-glow"
      >
        ⚡ Place Bet
      </a>
    </main>
  );
}

function StrategyCard({
  title,
  strategy,
  feeds,
  side,
}: {
  title: string;
  strategy: string;
  feeds: string[];
  side: 'A' | 'B';
}) {
  const color = side === 'A' ? 'text-nv-green' : 'text-nv-red';
  const border = side === 'A' ? 'border-nv-green/40' : 'border-nv-red/40';
  return (
    <section className={`nv-card p-5 ${border}`}>
      <div className={`nv-label mb-1 ${color}`}>{side === 'A' ? 'Agent A Playbook' : 'Agent B Playbook'}</div>
      <h3 className="font-nv text-[20px] font-bold mb-3">{title}</h3>
      <p className="text-[13px] text-white/90 font-mono leading-relaxed border-l-2 pl-3" style={{ borderColor: side === 'A' ? '#76b900' : '#e52020' }}>
        {strategy}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {feeds.map((f) => (
          <span key={f} className="text-[11px] font-bold uppercase tracking-wider px-2 py-[3px] border border-nv-gray-border text-nv-gray-300 rounded-nv">
            {f}
          </span>
        ))}
      </div>
    </section>
  );
}
