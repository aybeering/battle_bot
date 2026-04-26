import { seedHash } from '../lib/format';

interface Props {
  seed: string;
  name: string;
  size?: number;
  side?: 'A' | 'B';
  pulsing?: boolean;
}

const GRADIENTS: [string, string][] = [
  ['#76b900', '#1e5c00'],
  ['#e52020', '#650b0b'],
  ['#1eaedb', '#0a3b52'],
  ['#bff230', '#3f8500'],
  ['#ef9100', '#5a2c00'],
  ['#4d1368', '#1a0425'],
  ['#8c1c55', '#2a0719'],
  ['#007fff', '#00305f'],
];

export function BotAvatar({ seed, name, size = 56, side, pulsing }: Props) {
  const h = seedHash(seed);
  const idx = Math.floor(h * GRADIENTS.length);
  const [c1, c2] = side === 'B'
    ? GRADIENTS[(idx + 1) % GRADIENTS.length]
    : GRADIENTS[idx];
  const angle = Math.floor(h * 360);
  const borderColor = side === 'B' ? '#e52020' : '#76b900';
  const letters = name
    .split(/[-\s]/)
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative rounded-full flex items-center justify-center font-nv font-bold text-white shrink-0 ${pulsing ? 'animate-pulseGreen' : ''}`}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(from ${angle}deg, ${c1}, ${c2}, ${c1})`,
        border: `2px solid ${borderColor}`,
        fontSize: size * 0.34,
        letterSpacing: '0.02em',
      }}
      aria-label={name}
    >
      <span style={{ mixBlendMode: 'screen' }}>{letters}</span>
    </div>
  );
}
