import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { FeaturedBattle } from '../components/FeaturedBattle';
import { BotCard } from '../components/BotCard';
import { Ticker } from '../components/Ticker';
import { FEATURED_BATTLE_ID } from '../mocks/battles';

export default function Home() {
  const battles = useAppStore((s) => s.battles);
  const newlyBotId = useAppStore((s) => s.newlyPublishedBotId);
  const clearHighlight = useAppStore((s) => s.clearHighlight);
  const [sort, setSort] = useState<'hot' | 'new' | 'pool'>('hot');

  useEffect(() => {
    if (newlyBotId) {
      const t = setTimeout(clearHighlight, 8000);
      return () => clearTimeout(t);
    }
  }, [newlyBotId, clearHighlight]);

  const sorted = useMemo(() => {
    let list = battles.filter((b) => b.id !== FEATURED_BATTLE_ID);
    if (sort === 'new') list = [...list].sort((a, b) => b.startedAt - a.startedAt);
    if (sort === 'pool') list = [...list].sort((a, b) => b.poolUsd - a.poolUsd);
    if (sort === 'hot') list = [...list].sort((a, b) => (b.participantCount * 10 + b.poolUsd) - (a.participantCount * 10 + a.poolUsd));
    return list;
  }, [battles, sort]);

  const totalPool = battles.reduce((acc, b) => acc + b.poolUsd, 0);
  const totalBettors = battles.reduce((acc, b) => acc + b.participantCount, 0);

  return (
    <main>
      <FeaturedBattle />
      <Ticker />

      <section className="max-w-[1320px] mx-auto px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
          <div>
            <div className="nv-eyebrow mb-2">Active Arenas</div>
            <h2 className="font-nv text-[28px] md:text-[32px] font-bold leading-tight">
              {battles.length} bots fighting for {totalBettors} bettors
            </h2>
            <p className="text-[15px] text-nv-gray-300 mt-1">
              Open pool: <span className="text-white font-bold font-mono">${(totalPool / 1000).toFixed(1)}k</span>. Pick a side, size your edge, watch the curve swing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {(['hot', 'new', 'pool'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`px-3 py-[6px] text-[12px] font-bold uppercase tracking-wider rounded-nv border transition-colors ${
                    sort === s ? 'border-nv-green text-nv-green' : 'border-nv-gray-border text-nv-gray-300 hover:border-white hover:text-white'
                  }`}
                >
                  {s === 'hot' ? 'Hot' : s === 'new' ? 'New' : 'Pool'}
                </button>
              ))}
            </div>
            <Link to="/create" className="nv-btn-primary">
              + Create Bot
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((b) => {
            const highlight = !!newlyBotId && (b.botAId === newlyBotId || b.botBId === newlyBotId);
            return <BotCard key={b.id} battle={b} highlight={highlight} />;
          })}
        </div>
      </section>

      <footer className="border-t border-nv-gray-border mt-10 py-10">
        <div className="max-w-[1320px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-nv-green" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-nv-gray-400">
              Solosseum · Polymarket Agent Arena · Hackathon build
            </span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-nv-gray-500 font-bold uppercase tracking-wider">
            <span className="hover:text-white transition-colors cursor-pointer">Docs</span>
            <span className="hover:text-white transition-colors cursor-pointer">Github</span>
            <span className="hover:text-white transition-colors cursor-pointer">X/@solosseum</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

