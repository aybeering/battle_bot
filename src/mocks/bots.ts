export interface Bot {
  id: string;
  name: string;
  handle: string;
  avatarSeed: string; // used to pick gradient colors
  tagline: string;
  strategy: string;
  winRate: number;    // 0..1  lifetime
  record: string;     // "W-L"
  creator: string;
  bankrollUsd: number;
  dataFeeds: string[];
  marketId: string;   // primary market
  createdAt: number;
  lifetimePnlUsd: number; // signed; negative = lifetime drawdown
  pnl24hPct: number;      // 24h % change (e.g. 0.124 = +12.4%)
  pnl7dPct: number;       // 7d % change
}

export const BOTS: Bot[] = [
  {
    id: 'bot-mothra',
    name: 'MOTHRA-7',
    handle: '@mothra',
    avatarSeed: 'mothra',
    tagline: 'Mean-reversion on crypto odds, 15m window.',
    strategy: 'Fade any YES move >12% within 15 minutes unless funding flips sign. Stack into 3 scaled entries.',
    winRate: 0.64, record: '142-79', creator: '0xA1…4c2e',
    bankrollUsd: 25_000, dataFeeds: ['Price Tick', 'Funding'], marketId: 'm-btc-120k',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    lifetimePnlUsd: 542_180, pnl24hPct: 0.038, pnl7dPct: 0.182,
  },
  {
    id: 'bot-gigaoracle',
    name: 'GIGA-ORACLE',
    handle: '@giga',
    avatarSeed: 'giga',
    tagline: 'News-driven momentum for AI markets.',
    strategy: 'Scrape lab blog RSS + arXiv. If sentiment>0.7 AND market YES<0.4, buy YES 4% of bankroll.',
    winRate: 0.58, record: '88-63', creator: '0xDeAd…F00D',
    bankrollUsd: 50_000, dataFeeds: ['News Stream', 'Social Sentiment'], marketId: 'm-agi-2026',
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
    lifetimePnlUsd: 318_900, pnl24hPct: 0.021, pnl7dPct: 0.094,
  },
  {
    id: 'bot-neon-kraken',
    name: 'NEON-KRAKEN',
    handle: '@kraken',
    avatarSeed: 'kraken',
    tagline: 'On-chain whale shadow. Rides large wallet flows.',
    strategy: 'Track top 20 holder netflow. Mirror directional bias when 3+ wallets align.',
    winRate: 0.51, record: '47-45', creator: '0xFaCe…0001',
    bankrollUsd: 12_000, dataFeeds: ['On-chain Whales', 'Price Tick'], marketId: 'm-sol-300',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    lifetimePnlUsd: -12_800, pnl24hPct: -0.018, pnl7dPct: -0.043,
  },
  {
    id: 'bot-iron-hawk',
    name: 'IRON-HAWK',
    handle: '@hawk',
    avatarSeed: 'hawk',
    tagline: 'Macro-driven rate trader.',
    strategy: 'Buy NO if CPI surprise > 0.15σ hawkish. Flatten on FOMC day.',
    winRate: 0.69, record: '31-14', creator: '0xBeEf…C0DE',
    bankrollUsd: 80_000, dataFeeds: ['Macro Calendar', 'News Stream'], marketId: 'm-us-rate',
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    lifetimePnlUsd: 3_247_890, pnl24hPct: 0.124, pnl7dPct: 0.478,
  },
  {
    id: 'bot-night-samba',
    name: 'NIGHT-SAMBA',
    handle: '@samba',
    avatarSeed: 'samba',
    tagline: 'Sports-book arb + model edge.',
    strategy: 'When Polymarket yes > Pinnacle implied + 3%, sell YES until convergence.',
    winRate: 0.55, record: '203-164', creator: '0xC0De…1337',
    bankrollUsd: 18_500, dataFeeds: ['Odds Feed', 'Price Tick'], marketId: 'm-wc-winner',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    lifetimePnlUsd: 196_440, pnl24hPct: 0.014, pnl7dPct: 0.062,
  },
  {
    id: 'bot-quantum-chef',
    name: 'QUANTUM-CHEF',
    handle: '@qchef',
    avatarSeed: 'qchef',
    tagline: 'LLM ensemble vote on culture markets.',
    strategy: 'Every hour poll 3 LLMs for a probability estimate. Trade if consensus σ < 0.08 and edge > 5%.',
    winRate: 0.47, record: '19-22', creator: '0xC00C…beef',
    bankrollUsd: 7_500, dataFeeds: ['LLM Ensemble', 'News Stream'], marketId: 'm-oscars',
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    lifetimePnlUsd: 47_260, pnl24hPct: 0.006, pnl7dPct: -0.012,
  },
  {
    id: 'bot-atlas',
    name: 'ATLAS',
    handle: '@atlas',
    avatarSeed: 'atlas',
    tagline: 'Long-horizon fundamental trader.',
    strategy: 'Buy-and-hold if model implied prob < market by 15%. Reassess weekly.',
    winRate: 0.72, record: '18-7', creator: '0xdeaf…0042',
    bankrollUsd: 120_000, dataFeeds: ['LLM Ensemble', 'Macro Calendar'], marketId: 'm-recession',
    createdAt: Date.now() - 1000 * 60 * 60 * 160,
    lifetimePnlUsd: 2_184_500, pnl24hPct: 0.082, pnl7dPct: 0.291,
  },
  {
    id: 'bot-vantablack',
    name: 'VANTABLACK',
    handle: '@vanta',
    avatarSeed: 'vanta',
    tagline: 'Contrarian. Bets against crowd psychology.',
    strategy: 'When 24h volume > 2x average AND YES moves same direction, fade 2% of bankroll.',
    winRate: 0.43, record: '66-87', creator: '0x1337…dead',
    bankrollUsd: 9_000, dataFeeds: ['Price Tick', 'Social Sentiment'], marketId: 'm-election',
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    lifetimePnlUsd: -156_720, pnl24hPct: -0.034, pnl7dPct: -0.118,
  },
  {
    id: 'bot-helios',
    name: 'HELIOS',
    handle: '@helios',
    avatarSeed: 'helios',
    tagline: 'Pure statistical arb.',
    strategy: 'Kalman filter on YES/NO spread. Enter on 2σ dislocation.',
    winRate: 0.61, record: '502-321', creator: '0xBeaD…7777',
    bankrollUsd: 220_000, dataFeeds: ['Price Tick', 'Odds Feed'], marketId: 'm-lakers',
    createdAt: Date.now() - 1000 * 60 * 60 * 400,
    lifetimePnlUsd: 1_406_720, pnl24hPct: 0.041, pnl7dPct: 0.166,
  },
  {
    id: 'bot-sparrow',
    name: 'SPARROW',
    handle: '@sparrow',
    avatarSeed: 'sparrow',
    tagline: 'Social-first. Rides X trending narratives.',
    strategy: 'If cashtag mentions velocity >4σ over 30m, follow direction for 90m only.',
    winRate: 0.49, record: '71-73', creator: '0xf00d…0001',
    bankrollUsd: 5_200, dataFeeds: ['Social Sentiment', 'News Stream'], marketId: 'm-eth-flip',
    createdAt: Date.now() - 1000 * 60 * 60 * 60,
    lifetimePnlUsd: -88_540, pnl24hPct: -0.022, pnl7dPct: -0.071,
  },
  {
    id: 'bot-skylark',
    name: 'SKYLARK',
    handle: '@skylark',
    avatarSeed: 'skylark',
    tagline: 'Options-style convex bets on tail events.',
    strategy: 'Only buy YES when prob < 0.08 AND model edge > 10%. Small, many, asymmetric.',
    winRate: 0.37, record: '12-20', creator: '0xC0DE…C0DE',
    bankrollUsd: 16_500, dataFeeds: ['LLM Ensemble', 'Macro Calendar'], marketId: 'm-gpt5-free',
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    lifetimePnlUsd: -224_180, pnl24hPct: -0.052, pnl7dPct: -0.144,
  },
  {
    id: 'bot-monolith',
    name: 'MONOLITH',
    handle: '@monolith',
    avatarSeed: 'monolith',
    tagline: 'Release-date specialist for major AI labs.',
    strategy: 'Rolling 30-day median of lab release cadence; trade YES when market undershoots model by 8%.',
    winRate: 0.66, record: '27-14', creator: '0xFeeD…BabE',
    bankrollUsd: 42_000, dataFeeds: ['News Stream', 'LLM Ensemble'], marketId: 'm-claude-5',
    createdAt: Date.now() - 1000 * 60 * 60 * 14,
    lifetimePnlUsd: 864_300, pnl24hPct: 0.057, pnl7dPct: 0.213,
  },
];
