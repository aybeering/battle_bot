import { BOTS } from './bots';

export interface BattleBet {
  id: string;
  user: string;     // handle
  side: 'A' | 'B';
  amountUsd: number;
  at: number;
}

export interface BattlePoint {
  t: number;         // ms timestamp
  winRateA: number;  // 0..1
}

export interface Battle {
  id: string;
  marketTitle: string;
  botAId: string;
  botBId: string;
  winRateA: number;      // current
  points: BattlePoint[]; // recent 40
  poolUsd: number;
  participantCount: number;
  bets: BattleBet[];
  startedAt: number;
  round: number;
}

// Seed a 40-point line walking around a drift.
function seedPoints(drift: number, noise = 0.018): BattlePoint[] {
  const pts: BattlePoint[] = [];
  const now = Date.now();
  let v = 0.5;
  for (let i = 39; i >= 0; i--) {
    v += (drift - v) * 0.05 + (Math.random() - 0.5) * noise;
    v = Math.max(0.04, Math.min(0.96, v));
    pts.push({ t: now - i * 2000, winRateA: v });
  }
  return pts;
}

function seedBets(n: number): BattleBet[] {
  const users = ['0xwhale', '0xdegen', 'alice.eth', 'bob.lens', '0xHODL', 'crypto_queen', 'quantbro', 'mrgoblin', 'satoshi_jr', 'vitalik.jpeg'];
  const out: BattleBet[] = [];
  const now = Date.now();
  for (let i = 0; i < n; i++) {
    out.push({
      id: `bet-seed-${i}`,
      user: users[Math.floor(Math.random() * users.length)],
      side: Math.random() > 0.5 ? 'A' : 'B',
      amountUsd: [25, 50, 100, 250, 500, 1000, 2500][Math.floor(Math.random() * 7)],
      at: now - Math.floor(Math.random() * 1000 * 60 * 20),
    });
  }
  return out.sort((a, b) => b.at - a.at);
}

export const BATTLES: Battle[] = [
  {
    id: 'bat-01',
    marketTitle: BOTS[0].name + ' vs ' + BOTS[7].name,
    botAId: 'bot-mothra',
    botBId: 'bot-vantablack',
    winRateA: 0.62,
    points: seedPoints(0.62),
    poolUsd: 48_300,
    participantCount: 312,
    bets: seedBets(12),
    startedAt: Date.now() - 1000 * 60 * 38,
    round: 3,
  },
  {
    id: 'bat-02',
    marketTitle: BOTS[1].name + ' vs ' + BOTS[11].name,
    botAId: 'bot-gigaoracle',
    botBId: 'bot-monolith',
    winRateA: 0.41,
    points: seedPoints(0.41),
    poolUsd: 29_700,
    participantCount: 188,
    bets: seedBets(10),
    startedAt: Date.now() - 1000 * 60 * 22,
    round: 2,
  },
  {
    id: 'bat-03',
    marketTitle: BOTS[3].name + ' vs ' + BOTS[6].name,
    botAId: 'bot-iron-hawk',
    botBId: 'bot-atlas',
    winRateA: 0.53,
    points: seedPoints(0.53),
    poolUsd: 71_450,
    participantCount: 441,
    bets: seedBets(14),
    startedAt: Date.now() - 1000 * 60 * 74,
    round: 5,
  },
  {
    id: 'bat-04',
    marketTitle: BOTS[4].name + ' vs ' + BOTS[8].name,
    botAId: 'bot-night-samba',
    botBId: 'bot-helios',
    winRateA: 0.28,
    points: seedPoints(0.28),
    poolUsd: 18_900,
    participantCount: 142,
    bets: seedBets(10),
    startedAt: Date.now() - 1000 * 60 * 12,
    round: 1,
  },
  {
    id: 'bat-05',
    marketTitle: BOTS[2].name + ' vs ' + BOTS[8].name,
    botAId: 'bot-neon-kraken',
    botBId: 'bot-helios',
    winRateA: 0.48,
    points: seedPoints(0.48),
    poolUsd: 9_150,
    participantCount: 77,
    bets: seedBets(8),
    startedAt: Date.now() - 1000 * 60 * 6,
    round: 1,
  },
  {
    id: 'bat-06',
    marketTitle: BOTS[5].name + ' vs ' + BOTS[9].name,
    botAId: 'bot-quantum-chef',
    botBId: 'bot-sparrow',
    winRateA: 0.57,
    points: seedPoints(0.57),
    poolUsd: 14_220,
    participantCount: 105,
    bets: seedBets(9),
    startedAt: Date.now() - 1000 * 60 * 18,
    round: 2,
  },
  {
    id: 'bat-07',
    marketTitle: BOTS[10].name + ' vs ' + BOTS[5].name,
    botAId: 'bot-skylark',
    botBId: 'bot-quantum-chef',
    winRateA: 0.36,
    points: seedPoints(0.36),
    poolUsd: 6_780,
    participantCount: 61,
    bets: seedBets(7),
    startedAt: Date.now() - 1000 * 60 * 28,
    round: 2,
  },
];

export const FEATURED_BATTLE_ID = 'bat-03';
