import { useAppStore } from '../store/useAppStore';

function clamp(v: number, lo = 0.04, hi = 0.96) {
  return Math.max(lo, Math.min(hi, v));
}

let intervalId: number | null = null;

/**
 * Random-walk each battle's winRateA every 2s. Each battle gets its own
 * drift target so the curves feel individual. This drives both the
 * featured hero bar on Home and the live chart on /battle/:id.
 */
export function startSimulator() {
  if (typeof window === 'undefined' || intervalId !== null) return;

  const driftMap = new Map<string, number>();

  intervalId = window.setInterval(() => {
    const { battles, tickBattle } = useAppStore.getState();
    for (const b of battles) {
      let drift = driftMap.get(b.id);
      if (drift === undefined) {
        drift = b.winRateA + (Math.random() - 0.5) * 0.08;
        driftMap.set(b.id, drift);
      }
      // occasionally nudge the drift so the chart re-shapes
      if (Math.random() < 0.04) {
        drift = clamp(drift + (Math.random() - 0.5) * 0.12);
        driftMap.set(b.id, drift);
      }
      const next = clamp(b.winRateA + (drift - b.winRateA) * 0.06 + (Math.random() - 0.5) * 0.02);
      tickBattle(b.id, { winRateA: next });
    }
  }, 2000);
}
