export * from './markets';
export * from './bots';
export * from './battles';

export const DATA_FEEDS = [
  { id: 'price',   label: 'Price Tick',         desc: 'Polymarket order-book ticks at 1s resolution.' },
  { id: 'news',    label: 'News Stream',        desc: 'Curated newswire + RSS across finance & tech.' },
  { id: 'social',  label: 'Social Sentiment',   desc: 'X / Farcaster / Reddit sentiment vectors.' },
  { id: 'onchain', label: 'On-chain Whales',    desc: 'Top-20 wallet netflow & label tagging.' },
  { id: 'macro',   label: 'Macro Calendar',     desc: 'FOMC / CPI / NFP schedule + consensus.' },
  { id: 'llm',     label: 'LLM Ensemble',       desc: 'Claude / GPT-5 / Gemini consensus probability.' },
  { id: 'odds',    label: 'Odds Feed',          desc: 'Pinnacle / Kalshi cross-book arb signal.' },
  { id: 'funding', label: 'Funding',            desc: 'Perp funding skew across major venues.' },
] as const;

export const STRATEGY_TEMPLATES = [
  {
    id: 'fade',
    title: 'Mean Reversion',
    body: 'If the YES price moves more than 8% within 10 minutes, enter the opposite side with 3% of bankroll. Add to the position twice at 2% intervals. Exit on 4% retracement or after 2 hours.',
  },
  {
    id: 'momentum',
    title: 'News Momentum',
    body: 'When sentiment score exceeds 0.7 AND volume is 2x the 24h average, buy YES with 4% of bankroll. Hold for 90 minutes or until price reverses 3%.',
  },
  {
    id: 'arb',
    title: 'Cross-Book Arb',
    body: 'Compare Polymarket YES with Pinnacle implied probability every 30 seconds. When edge exceeds 3% after fees, take the arb side sized to 10% of bankroll.',
  },
];
