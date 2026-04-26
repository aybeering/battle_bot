export interface Market {
  id: string;
  title: string;
  category: 'Crypto' | 'Politics' | 'Sports' | 'AI' | 'Macro' | 'Culture';
  yesPrice: number; // 0..1
  volumeUsd: number;
  closes: string;
}

export const MARKETS: Market[] = [
  { id: 'm-btc-120k',  title: 'Will BTC close above $120,000 by Jun 30, 2026?',     category: 'Crypto',   yesPrice: 0.38, volumeUsd: 12_430_000, closes: '2026-06-30' },
  { id: 'm-eth-flip',  title: 'Will ETH market cap flip BTC in 2026?',              category: 'Crypto',   yesPrice: 0.07, volumeUsd:  2_910_000, closes: '2026-12-31' },
  { id: 'm-sol-300',   title: 'Will SOL trade above $300 at any point in Q2 2026?', category: 'Crypto',   yesPrice: 0.54, volumeUsd:  5_210_000, closes: '2026-06-30' },
  { id: 'm-agi-2026',  title: 'Will a frontier lab declare AGI in 2026?',           category: 'AI',       yesPrice: 0.12, volumeUsd:  8_760_000, closes: '2026-12-31' },
  { id: 'm-claude-5',  title: 'Will Anthropic release Claude 5 before July 2026?',  category: 'AI',       yesPrice: 0.61, volumeUsd:  3_480_000, closes: '2026-07-01' },
  { id: 'm-gpt5-free', title: 'Will GPT-5 be free-tier by end of 2026?',            category: 'AI',       yesPrice: 0.29, volumeUsd:  1_620_000, closes: '2026-12-31' },
  { id: 'm-us-rate',   title: 'Will the Fed cut rates ≥50bps by Sep 2026?',         category: 'Macro',    yesPrice: 0.44, volumeUsd:  9_140_000, closes: '2026-09-30' },
  { id: 'm-recession', title: 'US NBER recession called in 2026?',                  category: 'Macro',    yesPrice: 0.22, volumeUsd:  4_060_000, closes: '2026-12-31' },
  { id: 'm-wc-winner', title: 'Will Brazil win the 2026 World Cup?',                category: 'Sports',   yesPrice: 0.18, volumeUsd:  6_700_000, closes: '2026-07-19' },
  { id: 'm-lakers',    title: 'Will the Lakers make the 2026 NBA Finals?',          category: 'Sports',   yesPrice: 0.31, volumeUsd:  2_250_000, closes: '2026-06-20' },
  { id: 'm-oscars',    title: 'Will a24 win Best Picture at the 2026 Oscars?',      category: 'Culture',  yesPrice: 0.47, volumeUsd:  1_120_000, closes: '2026-03-15' },
  { id: 'm-election',  title: 'Will turnout exceed 150M in the 2026 midterms?',     category: 'Politics', yesPrice: 0.33, volumeUsd:  5_540_000, closes: '2026-11-04' },
];
