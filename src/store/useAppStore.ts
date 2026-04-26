import { create } from 'zustand';
import { BOTS, type Bot } from '../mocks/bots';
import { BATTLES, type Battle, type BattleBet, type BattlePoint } from '../mocks/battles';

export interface MyPosition {
  id: string;
  battleId: string;
  side: 'A' | 'B';
  amountUsd: number;
  entryWinRateA: number;
  at: number;
}

interface AppState {
  bots: Bot[];
  battles: Battle[];
  myPositions: MyPosition[];
  myCashUsd: number;
  newlyPublishedBotId: string | null;

  // bot creation
  addBot: (bot: Bot, joinBattle: boolean) => void;

  // battle mutation (from simulate.ts)
  tickBattle: (id: string, next: { winRateA: number }) => void;

  // bets
  placeBet: (battleId: string, side: 'A' | 'B', amountUsd: number) => MyPosition | null;
  clearHighlight: () => void;
}

function pushPoint(points: BattlePoint[], winRateA: number, maxLen = 60): BattlePoint[] {
  const next = [...points, { t: Date.now(), winRateA }];
  return next.length > maxLen ? next.slice(next.length - maxLen) : next;
}

export const useAppStore = create<AppState>((set, get) => ({
  bots: BOTS,
  battles: BATTLES,
  myPositions: [],
  myCashUsd: 10_000,
  newlyPublishedBotId: null,

  addBot: (bot, joinBattle) => {
    set((s) => {
      const nextBots = [bot, ...s.bots];
      let nextBattles = s.battles;
      if (joinBattle) {
        // Pair the new bot against the weakest currently-active bot for drama.
        const opponent = s.bots[Math.floor(Math.random() * Math.min(s.bots.length, 6))];
        const newBattle: Battle = {
          id: `bat-live-${Math.random().toString(36).slice(2, 8)}`,
          marketTitle: `${bot.name} vs ${opponent.name}`,
          botAId: bot.id,
          botBId: opponent.id,
          winRateA: 0.5,
          points: Array.from({ length: 20 }, (_, i) => ({
            t: Date.now() - (20 - i) * 2000,
            winRateA: 0.5 + (Math.random() - 0.5) * 0.04,
          })),
          poolUsd: 0,
          participantCount: 0,
          bets: [],
          startedAt: Date.now(),
          round: 1,
        };
        nextBattles = [newBattle, ...s.battles];
      }
      return { bots: nextBots, battles: nextBattles, newlyPublishedBotId: bot.id };
    });
  },

  tickBattle: (id, { winRateA }) => {
    set((s) => ({
      battles: s.battles.map((b) =>
        b.id === id ? { ...b, winRateA, points: pushPoint(b.points, winRateA) } : b
      ),
    }));
  },

  placeBet: (battleId, side, amountUsd) => {
    if (amountUsd <= 0 || amountUsd > get().myCashUsd) return null;
    const battle = get().battles.find((b) => b.id === battleId);
    if (!battle) return null;
    const position: MyPosition = {
      id: `pos-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      battleId,
      side,
      amountUsd,
      entryWinRateA: battle.winRateA,
      at: Date.now(),
    };
    set((s) => ({
      myPositions: [position, ...s.myPositions],
      myCashUsd: s.myCashUsd - amountUsd,
      battles: s.battles.map((b) =>
        b.id === battleId
          ? {
              ...b,
              poolUsd: b.poolUsd + amountUsd,
              participantCount: b.participantCount + 1,
              bets: [
                {
                  id: position.id,
                  user: 'YOU',
                  side,
                  amountUsd,
                  at: position.at,
                } as BattleBet,
                ...b.bets,
              ].slice(0, 40),
            }
          : b
      ),
    }));
    return position;
  },

  clearHighlight: () => set({ newlyPublishedBotId: null }),
}));
