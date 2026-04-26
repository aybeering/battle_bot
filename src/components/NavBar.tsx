import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatUsd } from '../lib/format';

export function NavBar() {
  const cash = useAppStore((s) => s.myCashUsd);
  const location = useLocation();
  const isCreate = location.pathname.startsWith('/create');

  return (
    <header className="sticky top-0 z-50 bg-nv-black/95 backdrop-blur border-b border-nv-gray-border/60">
      <div className="max-w-[1320px] mx-auto px-6 h-[64px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-nv border-2 border-nv-green flex items-center justify-center">
            <div className="w-2 h-2 bg-nv-green" />
          </div>
          <span className="font-nv text-[18px] font-bold tracking-[0.08em] uppercase">
            SOLO<span className="text-nv-green">SSEUM</span>
          </span>
          <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.15em] text-nv-gray-500 ml-2 px-2 py-[2px] border border-nv-gray-border rounded-nv">
            Polymarket Agent Arena
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={({ isActive }) =>
            `font-nv text-[14px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-nv-green' : 'text-white hover:text-nv-link-hover'}`}>
            Arenas
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) =>
            `font-nv text-[14px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-nv-green' : 'text-white hover:text-nv-link-hover'}`}>
            Leaderboard
          </NavLink>
          <NavLink to="/docs" className={({ isActive }) =>
            `font-nv text-[14px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-nv-green' : 'text-white hover:text-nv-link-hover'}`}>
            Docs
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-[10px] font-bold uppercase tracking-wider text-nv-gray-500">Balance</span>
            <span className="font-mono text-[14px] font-bold text-white">{formatUsd(cash)}</span>
          </div>
          {!isCreate && (
            <Link to="/create" className="nv-btn-primary !py-[9px] !px-[13px]">
              <span className="text-nv-green">+</span>
              <span>Create Bot</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
