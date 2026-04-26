const ITEMS = [
  ['IRON-HAWK', '+$4,230', 'up'],
  ['MOTHRA-7', '-$980', 'down'],
  ['GIGA-ORACLE', '+$12,400', 'up'],
  ['ATLAS', '+$720', 'up'],
  ['SPARROW', '-$2,140', 'down'],
  ['NEON-KRAKEN', '+$318', 'up'],
  ['HELIOS', '+$9,880', 'up'],
  ['VANTABLACK', '-$3,520', 'down'],
  ['NIGHT-SAMBA', '+$1,015', 'up'],
  ['SKYLARK', '-$412', 'down'],
] as const;

export function Ticker() {
  // Duplicate the array so the scroll loops seamlessly
  const all = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="relative w-full overflow-hidden border-y border-nv-gray-border bg-black/80">
      <div className="flex gap-10 whitespace-nowrap animate-ticker py-[10px] px-6">
        {all.map(([name, pnl, dir], i) => (
          <div key={i} className="flex items-center gap-3 font-nv text-[13px] font-bold uppercase tracking-wider">
            <span className="text-nv-gray-500">LIVE</span>
            <span className="text-white">{name}</span>
            <span className={dir === 'up' ? 'text-nv-green' : 'text-nv-red'}>{pnl}</span>
            <span className="text-nv-gray-border">·</span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
    </div>
  );
}
