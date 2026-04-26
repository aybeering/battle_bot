import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Battle } from '../mocks/battles';
import type { Bot } from '../mocks/bots';
import { formatUsd } from '../lib/format';

interface Props {
  battle: Battle;
  botA: Bot;
  botB: Bot;
}

export function BetPanel({ battle, botA, botB }: Props) {
  const [side, setSide] = useState<'A' | 'B'>('A');
  const [amount, setAmount] = useState(50);
  const [flash, setFlash] = useState<string | null>(null);
  const cash = useAppStore((s) => s.myCashUsd);
  const placeBet = useAppStore((s) => s.placeBet);
  const myPositions = useAppStore((s) =>
    s.myPositions.filter((p) => p.battleId === battle.id)
  );

  const winRateA = battle.winRateA;
  const oddsA = 1 / Math.max(0.03, winRateA);
  const oddsB = 1 / Math.max(0.03, 1 - winRateA);
  const odds = side === 'A' ? oddsA : oddsB;
  const payout = amount * odds;

  const presets = [25, 50, 100, 500];

  const totalStake = myPositions.reduce((a, p) => a + p.amountUsd, 0);
  const unrealized = useMemo(() => {
    // Rough PnL: position's marked-to-market value = (currentWinRate / entryWinRate) * stake on winning side.
    return myPositions.reduce((acc, p) => {
      const entry = p.side === 'A' ? p.entryWinRateA : 1 - p.entryWinRateA;
      const now = p.side === 'A' ? winRateA : 1 - winRateA;
      const ratio = now / Math.max(0.03, entry);
      return acc + p.amountUsd * (ratio - 1);
    }, 0);
  }, [myPositions, winRateA]);

  function handlePlace() {
    const pos = placeBet(battle.id, side, amount);
    if (pos) {
      setFlash(`Placed ${formatUsd(amount)} on ${side === 'A' ? botA.name : botB.name}`);
      setTimeout(() => setFlash(null), 2500);
    } else {
      setFlash('Bet rejected — insufficient balance.');
      setTimeout(() => setFlash(null), 2500);
    }
  }

  const sideColor = (s: 'A' | 'B') => (s === 'A' ? 'nv-green' : 'nv-red');

  return (
    <aside id="bet-panel" className="nv-card p-5 flex flex-col gap-5 lg:sticky lg:top-[84px] scroll-mt-[84px]">
      <div>
        <div className="nv-label mb-2">Place a Bet</div>
        <div className="grid grid-cols-2 gap-2">
          <SideButton
            active={side === 'A'}
            onClick={() => setSide('A')}
            color="green"
            label={botA.name}
            sub={`${Math.round(winRateA * 100)}% · ${oddsA.toFixed(2)}x`}
          />
          <SideButton
            active={side === 'B'}
            onClick={() => setSide('B')}
            color="red"
            label={botB.name}
            sub={`${Math.round((1 - winRateA) * 100)}% · ${oddsB.toFixed(2)}x`}
          />
        </div>
      </div>

      <div>
        <div className="nv-label mb-2">Amount (USDC)</div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-nv-gray-500 font-mono text-[18px]">$</span>
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 0))}
            className="nv-input font-mono text-[18px] font-bold"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(p)}
              className={`px-3 py-[6px] text-[12px] font-bold uppercase tracking-wider rounded-nv border transition-colors ${
                amount === p ? 'border-nv-green text-nv-green' : 'border-nv-gray-border text-nv-gray-300 hover:border-white hover:text-white'
              }`}
            >
              ${p}
            </button>
          ))}
          <button
            onClick={() => setAmount(Math.floor(cash))}
            className="px-3 py-[6px] text-[12px] font-bold uppercase tracking-wider rounded-nv border border-nv-gray-border text-nv-gray-300 hover:border-white hover:text-white"
          >
            Max
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 rounded-nv bg-black/50 border border-nv-gray-border">
        <MetaRow label="Odds" value={`${odds.toFixed(2)}x`} />
        <MetaRow label="Potential" value={formatUsd(payout)} accent />
        <MetaRow label="Implied" value={`${Math.round((side === 'A' ? winRateA : 1 - winRateA) * 100)}%`} />
        <MetaRow label="Balance" value={formatUsd(cash)} />
      </div>

      <button
        disabled={amount <= 0 || amount > cash}
        onClick={handlePlace}
        className={`${side === 'A' ? 'nv-btn-primary' : 'nv-btn-danger'} w-full disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        Place ${amount} on {side === 'A' ? botA.name : botB.name}
      </button>

      {flash && (
        <div className="-mt-2 text-[12px] font-bold uppercase tracking-wider text-nv-green">
          {flash}
        </div>
      )}

      <div>
        <div className="nv-label mb-2">My Position</div>
        {myPositions.length === 0 ? (
          <p className="text-[13px] text-nv-gray-500 border border-dashed border-nv-gray-border rounded-nv p-3 text-center">
            No bets on this battle yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-nv-gray-500">Stake / P&L (unrealized)</span>
              <div className="flex items-baseline gap-3 font-mono text-[14px]">
                <span className="text-white">{formatUsd(totalStake)}</span>
                <span className={`font-bold ${unrealized >= 0 ? 'text-nv-green' : 'text-nv-red'}`}>
                  {unrealized >= 0 ? '+' : ''}{formatUsd(unrealized)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 max-h-[140px] overflow-y-auto">
              {myPositions.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-[12px] font-mono bg-black/40 border border-nv-gray-border rounded-nv px-2 py-1"
                >
                  <span className={`font-bold uppercase tracking-wider ${p.side === 'A' ? 'text-nv-green' : 'text-nv-red'}`}>
                    {p.side === 'A' ? botA.name.slice(0, 10) : botB.name.slice(0, 10)}
                  </span>
                  <span>{formatUsd(p.amountUsd)}</span>
                  <span className="text-nv-gray-400">entry {Math.round((p.side === 'A' ? p.entryWinRateA : 1 - p.entryWinRateA) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );

  // keep the unused color-mapper from tripping the linter in strict builds
  void sideColor;
}

function SideButton({
  active,
  color,
  label,
  sub,
  onClick,
}: {
  active: boolean;
  color: 'green' | 'red';
  label: string;
  sub: string;
  onClick: () => void;
}) {
  const border = color === 'green' ? 'border-nv-green' : 'border-nv-red';
  const text = color === 'green' ? 'text-nv-green' : 'text-nv-red';
  return (
    <button
      onClick={onClick}
      className={`p-3 text-left rounded-nv border-2 transition-colors ${
        active ? `${border} bg-white/[0.03]` : 'border-nv-gray-border'
      }`}
    >
      <div className={`text-[10px] font-bold uppercase tracking-wider ${active ? text : 'text-nv-gray-500'}`}>
        {color === 'green' ? 'Long A' : 'Long B'}
      </div>
      <div className="font-nv text-[16px] font-bold text-white leading-tight truncate">{label}</div>
      <div className="text-[11px] text-nv-gray-400 font-mono">{sub}</div>
    </button>
  );
}

function MetaRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-nv-gray-500">{label}</div>
      <div className={`font-mono text-[15px] font-bold ${accent ? 'text-nv-green' : 'text-white'}`}>{value}</div>
    </div>
  );
}
