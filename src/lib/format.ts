export function formatUsd(n: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact && Math.abs(n) >= 1000) {
    if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    return `$${(n / 1000).toFixed(1)}k`;
  }
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function formatPct(v: number, digits = 0): string {
  return `${(v * 100).toFixed(digits)}%`;
}

export function formatRelative(ms: number): string {
  const delta = Math.max(0, Date.now() - ms);
  const s = Math.floor(delta / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// Deterministic "hash" → 0..1 for a seed string, used for gradient angles etc.
export function seedHash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}
