import React from 'react';
import { LayoutDashboard, History, PlusSquare, LineChart, User, Crosshair } from 'lucide-react';
import { Page } from '../types';
import { cn } from '../lib/utils';

interface NavigationProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, setPage }) => {
  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'new-measure', label: 'MEDIR', icon: PlusSquare },
    { id: 'history', label: 'HISTÓRICO', icon: History },
    { id: 'charts', label: 'GRÁFICOS', icon: LineChart },
    { id: 'profile', label: 'PERFIL', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-military-900 border-t border-slate-800 z-50 px-4 pb-safe">
      <div className="max-w-md mx-auto flex justify-between items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id as Page)}
              className={cn(
                "flex flex-col items-center justify-center p-2 transition-all group",
                isActive ? "text-military-accent" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <div className={cn(
                "relative transition-transform duration-300",
                isActive && "scale-110"
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-1.5 h-1.5 bg-military-accent rounded-full animate-pulse shadow-[0_0_8px_var(--color-military-accent)]" />
                  </div>
                )}
              </div>
              <span className="text-[9px] mt-1 font-bold tracking-tighter opacity-80 group-hover:opacity-100 uppercase">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const Header: React.FC = () => {
  return (
    <header className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-military-950/80 backdrop-blur-md z-40">
      <div className="flex items-center gap-2">
        <div className="p-1 border border-military-accent bg-military-accent/10">
          <Crosshair size={18} className="text-military-accent" />
        </div>
        <h1 className="text-lg font-black tracking-tighter">
          NA <span className="text-military-accent">MEDIDA</span>
        </h1>
      </div>
      <div className="text-[10px] font-mono text-slate-500 bg-slate-900/50 px-2 py-0.5 border border-slate-800">
        VER 1.0.0 // TACTICAL
      </div>
    </header>
  );
};
