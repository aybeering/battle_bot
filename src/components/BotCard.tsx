import { Link } from 'react-router-dom';
import type { Battle } from '../mocks/battles';
import { BotAvatar } from './BotAvatar';
import { WinRateBar } from './WinRateBar';
import { useAppStore } from '../store/useAppStore';
import { formatUsd, formatRelative } from '../lib/format';

interface Props {
  battle: Battle;
  highlight?: boolean;
}

export function BotCard({ battle, highlight }: Props) {
  const botA = useAppStore((s) => s.bots.find((b) => b.id === battle.botAId))!;
  const botB = useAppStore((s) => s.bots.find((b) => b.id === battle.botBId))!;

  return (
    <Link
      to={`/battle/${battle.id}`}
      className={`nv-card group block p-5 relative overflow-hidden ${
        highlight ? 'ring-2 ring-nv-green' : ''
      }`}
    >
      {highlight && (
        <div className="absolute top-2 right-2 nv-label bg-nv-near-black border border-nv-green px-2 py-[2px]">
          New
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-nv-gray-500">
          Round {battle.round} · {formatRelative(battle.startedAt)}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-nv-green flex items-center gap-1">
          <span className="w-[6px] h-[6px] bg-nv-green rounded-full animate-pulseGreen" />
          Live
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <BotAvatar seed={botA.avatarSeed} name={botA.name} side="A" size={44} />
          <div className="font-nv text-[16px] font-bold text-white truncate">{botA.name}</div>
        </div>

        <div className="font-nv text-[20px] font-bold text-white/40 px-2">VS</div>

        <div className="flex items-center gap-3 min-w-0 flex-row-reverse text-right">
          <BotAvatar seed={botB.avatarSeed} name={botB.name} side="B" size={44} />
          <div className="font-nv text-[16px] font-bold text-white truncate">{botB.name}</div>
        </div>
      </div>

      <WinRateBar winRateA={battle.winRateA} labelA={botA.name} labelB={botB.name} size="sm" />

      <div className="mt-4 pt-3 border-t border-nv-gray-border/50 flex items-center justify-between text-[12px]">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-nv-gray-500">Pool</div>
          <div className="font-mono font-bold text-white">{formatUsd(battle.poolUsd, { compact: true })}</div>
        </div>
        <span className="nv-link group-hover:border-nv-link-hover">Enter →</span>
      </div>
    </Link>
  );
}
