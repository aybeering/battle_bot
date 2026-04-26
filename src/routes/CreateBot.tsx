import { useMemo, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MARKETS, DATA_FEEDS, STRATEGY_TEMPLATES, type Market } from '../mocks';
import { useAppStore } from '../store/useAppStore';
import { BotAvatar } from '../components/BotAvatar';
import { formatUsd } from '../lib/format';

type WizardState = {
  step: 0 | 1 | 2 | 3 | 4;
  name: string;
  tagline: string;
  marketId: string | null;
  feeds: string[];
  strategy: string;
  joinBattle: boolean;
  bankroll: number;
};

const initialState: WizardState = {
  step: 0,
  name: '',
  tagline: '',
  marketId: null,
  feeds: [],
  strategy: '',
  joinBattle: true,
  bankroll: 10_000,
};

type Action =
  | { type: 'set'; patch: Partial<WizardState> }
  | { type: 'toggleFeed'; id: string }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'jump'; step: WizardState['step'] };

function reducer(s: WizardState, a: Action): WizardState {
  switch (a.type) {
    case 'set': return { ...s, ...a.patch };
    case 'toggleFeed':
      return { ...s, feeds: s.feeds.includes(a.id) ? s.feeds.filter((x) => x !== a.id) : [...s.feeds, a.id] };
    case 'next': return { ...s, step: Math.min(4, s.step + 1) as WizardState['step'] };
    case 'prev': return { ...s, step: Math.max(0, s.step - 1) as WizardState['step'] };
    case 'jump': return { ...s, step: a.step };
  }
}

const STEPS = [
  { id: 0, label: 'Market' },
  { id: 1, label: 'Data Feeds' },
  { id: 2, label: 'Strategy' },
  { id: 3, label: 'Battle' },
  { id: 4, label: 'Publish' },
] as const;

export default function CreateBot() {
  const nav = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const addBot = useAppStore((s) => s.addBot);
  const [published, setPublished] = useState(false);

  const market = useMemo<Market | undefined>(
    () => MARKETS.find((m) => m.id === state.marketId),
    [state.marketId]
  );

  const canProceed = (() => {
    switch (state.step) {
      case 0: return !!state.marketId;
      case 1: return state.feeds.length > 0;
      case 2: return state.strategy.trim().length >= 10;
      case 3: return !state.joinBattle || state.bankroll >= 100;
      case 4: return state.name.trim().length > 0;
    }
  })();

  function handlePublish() {
    if (!market) return;
    const id = `bot-${Date.now().toString(36)}`;
    const seed = state.name.toLowerCase().replace(/\s+/g, '-') || id;
    addBot(
      {
        id,
        name: state.name.toUpperCase(),
        handle: `@${seed.slice(0, 10)}`,
        avatarSeed: seed,
        tagline: state.tagline || 'Freshly deployed. No track record yet.',
        strategy: state.strategy,
        winRate: 0.5,
        record: '0-0',
        creator: '0xYou…1111',
        bankrollUsd: state.bankroll,
        dataFeeds: state.feeds
          .map((f) => DATA_FEEDS.find((d) => d.id === f)?.label)
          .filter(Boolean) as string[],
        marketId: market.id,
        createdAt: Date.now(),
        lifetimePnlUsd: 0,
        pnl24hPct: 0,
        pnl7dPct: 0,
      },
      state.joinBattle
    );
    setPublished(true);
    setTimeout(() => nav('/'), 1200);
  }

  return (
    <main className="relative min-h-[calc(100vh-64px)]">
      <div className="absolute inset-0 nv-grid-bg opacity-40 pointer-events-none" />

      <div className="relative max-w-[820px] mx-auto px-6 py-10 md:py-14">
        <div className="mb-8">
          <div className="nv-eyebrow mb-2">Create Agent</div>
          <h1 className="font-nv text-[32px] md:text-[40px] font-bold leading-tight">
            Deploy a new <span className="text-nv-green">Polymarket</span> bot
          </h1>
          <p className="text-[15px] text-nv-gray-300 mt-2">
            Describe your edge in plain English — pick a market, wire in data, write a strategy. We'll compile and queue it for battle.
          </p>
        </div>

        <Stepper step={state.step} onJump={(s) => dispatch({ type: 'jump', step: s })} />

        <div className="nv-card p-6 md:p-8 mt-6">
          {state.step === 0 && (
            <StepMarket
              marketId={state.marketId}
              onSelect={(id) => dispatch({ type: 'set', patch: { marketId: id } })}
            />
          )}
          {state.step === 1 && (
            <StepDataFeed
              feeds={state.feeds}
              onToggle={(id) => dispatch({ type: 'toggleFeed', id })}
            />
          )}
          {state.step === 2 && (
            <StepStrategy
              strategy={state.strategy}
              onChange={(v) => dispatch({ type: 'set', patch: { strategy: v } })}
            />
          )}
          {state.step === 3 && (
            <StepBattle
              joinBattle={state.joinBattle}
              bankroll={state.bankroll}
              onJoinChange={(v) => dispatch({ type: 'set', patch: { joinBattle: v } })}
              onBankrollChange={(v) => dispatch({ type: 'set', patch: { bankroll: v } })}
            />
          )}
          {state.step === 4 && (
            <StepConfirm
              state={state}
              market={market}
              name={state.name}
              tagline={state.tagline}
              onNameChange={(v) => dispatch({ type: 'set', patch: { name: v } })}
              onTaglineChange={(v) => dispatch({ type: 'set', patch: { tagline: v } })}
            />
          )}

          <div className="mt-8 pt-6 border-t border-nv-gray-border/60 flex items-center justify-between">
            <button
              onClick={() => dispatch({ type: 'prev' })}
              disabled={state.step === 0}
              className="nv-btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            {state.step < 4 ? (
              <button
                disabled={!canProceed}
                onClick={() => dispatch({ type: 'next' })}
                className="nv-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            ) : (
              <button
                disabled={!canProceed || published}
                onClick={handlePublish}
                className="nv-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {published ? '✓ Published — redirecting…' : 'Publish Bot'}
              </button>
            )}
          </div>
        </div>
      </div>

      {published && (
        <div className="fixed bottom-6 right-6 nv-card p-4 flex items-center gap-3 shadow-nv-green-glow">
          <div className="w-2 h-2 bg-nv-green animate-pulseGreen" />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-nv-green">Deployed</div>
            <div className="text-[14px] font-bold text-white">{state.name.toUpperCase()} is now live in the arena.</div>
          </div>
        </div>
      )}
    </main>
  );
}

function Stepper({ step, onJump }: { step: number; onJump: (s: WizardState['step']) => void }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={s.id} className="flex-1 flex items-center">
            <button
              onClick={() => onJump(i as WizardState['step'])}
              className="flex flex-col items-center gap-2 group"
              type="button"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] border-2 transition-all ${
                  done
                    ? 'bg-nv-green border-nv-green text-black'
                    : active
                    ? 'bg-black border-nv-green text-nv-green'
                    : 'bg-black border-nv-gray-border text-nv-gray-500 group-hover:border-white'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
                  active ? 'text-white' : done ? 'text-nv-gray-300' : 'text-nv-gray-500'
                }`}
              >
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-6 ${done ? 'bg-nv-green' : 'bg-nv-gray-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepMarket({ marketId, onSelect }: { marketId: string | null; onSelect: (id: string) => void }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'All' | Market['category']>('All');

  const results = MARKETS.filter((m) => {
    const matchQ = q.trim() === '' || m.title.toLowerCase().includes(q.toLowerCase());
    const matchC = cat === 'All' || m.category === cat;
    return matchQ && matchC;
  });

  const cats: ('All' | Market['category'])[] = ['All', 'Crypto', 'AI', 'Macro', 'Sports', 'Politics', 'Culture'];

  return (
    <div>
      <StepHeader num="01" title="Pick a Polymarket" subtitle="Your agent will only trade this single outcome market." />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search markets…"
        className="nv-input mb-3"
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`nv-chip ${cat === c ? 'is-selected' : ''}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
        {results.length === 0 && (
          <div className="text-nv-gray-500 text-[14px] py-6 text-center">No markets match.</div>
        )}
        {results.map((m) => {
          const selected = marketId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`text-left p-4 rounded-nv border transition-colors ${
                selected ? 'border-nv-green bg-nv-green/5' : 'border-nv-gray-border hover:border-white'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-nv-green">{m.category}</span>
                <span className="text-[11px] text-nv-gray-400 font-mono">Closes {m.closes}</span>
              </div>
              <div className="font-nv text-[16px] font-bold text-white leading-snug mb-2">{m.title}</div>
              <div className="flex items-center gap-4 text-[12px]">
                <span className="font-mono text-nv-green">YES {Math.round(m.yesPrice * 100)}¢</span>
                <span className="font-mono text-nv-red">NO {100 - Math.round(m.yesPrice * 100)}¢</span>
                <span className="text-nv-gray-500">Vol {formatUsd(m.volumeUsd, { compact: true })}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDataFeed({ feeds, onToggle }: { feeds: string[]; onToggle: (id: string) => void }) {
  return (
    <div>
      <StepHeader num="02" title="Wire in data feeds" subtitle="Choose one or more signals for your bot's decision loop." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DATA_FEEDS.map((f) => {
          const on = feeds.includes(f.id);
          return (
            <button
              key={f.id}
              onClick={() => onToggle(f.id)}
              className={`text-left p-4 rounded-nv border transition-colors ${
                on ? 'border-nv-green bg-nv-green/5' : 'border-nv-gray-border hover:border-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-nv text-[16px] font-bold ${on ? 'text-nv-green' : 'text-white'}`}>{f.label}</span>
                <span className={`w-4 h-4 border-2 rounded-[2px] ${on ? 'bg-nv-green border-nv-green' : 'border-nv-gray-border'}`}>
                  {on && <span className="block text-black text-[11px] leading-none text-center">✓</span>}
                </span>
              </div>
              <p className="text-[13px] text-nv-gray-300 leading-snug">{f.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepStrategy({ strategy, onChange }: { strategy: string; onChange: (s: string) => void }) {
  return (
    <div>
      <StepHeader num="03" title="Write the strategy" subtitle="Natural language — we'll compile it into an execution plan on deploy." />
      <textarea
        value={strategy}
        onChange={(e) => onChange(e.target.value)}
        rows={7}
        placeholder="Describe your edge. Example: If YES probability drops below 0.30 AND news sentiment flips positive within 15 minutes, buy YES with 10% of bankroll. Exit on 5% move or 2h timeout."
        className="nv-input font-mono text-[14px] leading-relaxed"
      />
      <div className="mt-2 flex items-center justify-between text-[11px] text-nv-gray-500 font-bold uppercase tracking-wider">
        <span>Min. 10 characters</span>
        <span>{strategy.length} / 2000</span>
      </div>

      <div className="mt-6">
        <div className="nv-label mb-2">Prefill from a template</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {STRATEGY_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange(t.body)}
              className="text-left p-3 rounded-nv border border-nv-gray-border hover:border-nv-green transition-colors"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-nv-green mb-1">{t.title}</div>
              <div className="text-[12px] text-nv-gray-300 line-clamp-3 leading-snug">{t.body}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBattle({
  joinBattle,
  bankroll,
  onJoinChange,
  onBankrollChange,
}: {
  joinBattle: boolean;
  bankroll: number;
  onJoinChange: (v: boolean) => void;
  onBankrollChange: (v: number) => void;
}) {
  return (
    <div>
      <StepHeader num="04" title="Enter the arena" subtitle="Opt in to battle another bot head-to-head. Winners keep bragging rights. Bettors keep the pool." />

      <button
        onClick={() => onJoinChange(!joinBattle)}
        className={`w-full flex items-center justify-between p-5 rounded-nv border transition-colors ${
          joinBattle ? 'border-nv-green bg-nv-green/5' : 'border-nv-gray-border'
        }`}
      >
        <div className="text-left">
          <div className="font-nv text-[18px] font-bold">Join Battle Matchmaking</div>
          <div className="text-[13px] text-nv-gray-300 mt-1">We'll pair you against a bot of similar track record.</div>
        </div>
        <div
          className={`w-12 h-6 rounded-full border-2 relative transition-colors ${
            joinBattle ? 'border-nv-green bg-nv-green/20' : 'border-nv-gray-border bg-black'
          }`}
        >
          <div
            className={`absolute top-[2px] w-4 h-4 rounded-full transition-all ${
              joinBattle ? 'left-[22px] bg-nv-green' : 'left-[2px] bg-nv-gray-border'
            }`}
          />
        </div>
      </button>

      {joinBattle && (
        <div className="mt-6">
          <div className="nv-label mb-2">Opening Bankroll (mock USDC)</div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={100}
              step={100}
              value={bankroll}
              onChange={(e) => onBankrollChange(Number(e.target.value) || 0)}
              className="nv-input max-w-[220px] font-mono"
            />
            <div className="flex items-center gap-2">
              {[1_000, 5_000, 10_000, 50_000].map((v) => (
                <button
                  key={v}
                  onClick={() => onBankrollChange(v)}
                  className={`px-3 py-[6px] text-[12px] font-bold uppercase tracking-wider rounded-nv border transition-colors ${
                    bankroll === v ? 'border-nv-green text-nv-green' : 'border-nv-gray-border text-nv-gray-300 hover:border-white hover:text-white'
                  }`}
                >
                  ${v.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[12px] text-nv-gray-500 mt-2">
            No real funds are moved in this demo build.
          </p>
        </div>
      )}
    </div>
  );
}

function StepConfirm({
  state,
  market,
  name,
  tagline,
  onNameChange,
  onTaglineChange,
}: {
  state: WizardState;
  market: Market | undefined;
  name: string;
  tagline: string;
  onNameChange: (v: string) => void;
  onTaglineChange: (v: string) => void;
}) {
  return (
    <div>
      <StepHeader num="05" title="Name it. Ship it." subtitle="Final sanity check before deploy." />

      <div className="flex items-center gap-4 mb-6">
        <BotAvatar seed={name || 'preview'} name={name || 'AGENT'} size={72} pulsing />
        <div className="flex-1">
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Agent name (e.g. MOTHRA-7)"
            className="nv-input text-[20px] font-bold font-nv uppercase tracking-wider mb-2"
          />
          <input
            value={tagline}
            onChange={(e) => onTaglineChange(e.target.value)}
            placeholder="One-line tagline — how it trades."
            className="nv-input text-[14px]"
          />
        </div>
      </div>

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Summary label="Market" value={market?.title ?? '—'} />
        <Summary
          label="Data Feeds"
          value={state.feeds.length === 0 ? '—' : state.feeds.map((id) => DATA_FEEDS.find((f) => f.id === id)?.label).join(' · ')}
        />
        <Summary
          label="Battle"
          value={state.joinBattle ? `Enabled · ${formatUsd(state.bankroll)}` : 'Off — shadow mode'}
        />
        <Summary label="Strategy" value={state.strategy || '—'} mono truncate={120} />
      </dl>
    </div>
  );
}

function Summary({ label, value, mono, truncate }: { label: string; value: string; mono?: boolean; truncate?: number }) {
  const [expanded, setExpanded] = useState(false);
  const overflows = typeof truncate === 'number' && value.length > truncate;
  const display = overflows && !expanded ? `${value.slice(0, truncate)}…` : value;
  return (
    <div className="p-4 rounded-nv border border-nv-gray-border bg-black/40">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-nv-green mb-1">{label}</dt>
      <dd className={`${mono ? 'font-mono text-[13px] leading-relaxed' : 'text-[14px]'} text-white whitespace-pre-wrap`}>{display}</dd>
      {overflows && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[11px] font-bold uppercase tracking-wider text-nv-green hover:text-white transition-colors"
        >
          {expanded ? '↑ Collapse' : '↓ Show full'}
        </button>
      )}
    </div>
  );
}

function StepHeader({ num, title, subtitle }: { num: string; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[12px] text-nv-green font-bold">{num}</span>
        <h2 className="font-nv text-[24px] font-bold leading-tight">{title}</h2>
      </div>
      <p className="text-[14px] text-nv-gray-300 mt-1">{subtitle}</p>
    </div>
  );
}
