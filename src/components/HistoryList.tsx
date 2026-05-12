import React from 'react';
import { BodyMeasurement } from '../types';
import { Trash2, TrendingUp, TrendingDown, Minus, History } from 'lucide-react';
import { cn } from '../lib/utils';

interface HistoryProps {
  measurements: BodyMeasurement[];
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryProps> = ({ measurements, onDelete }) => {
  if (measurements.length === 0) {
    return (
      <div className="text-center py-20 px-6 space-y-4">
        <div className="w-16 h-16 border border-dashed border-slate-800 rounded-full mx-auto flex items-center justify-center text-slate-700">
          <History size={32} />
        </div>
        <p className="text-slate-500 text-sm uppercase tracking-widest font-black">REGISTRO VAZIO</p>
        <p className="text-xs text-slate-600">Nenhum dado de inteligência corporal encontrado nos arquivos.</p>
      </div>
    );
  }

  const getDiff = (current: number, next?: number) => {
    if (next === undefined) return null;
    const diff = current - next;
    return {
      value: Math.abs(diff).toFixed(1),
      isUp: diff > 0,
      isNeutral: diff === 0
    };
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-black uppercase">LOG DE OPERAÇÃO</h2>
        <span className="text-[10px] font-mono text-slate-500">{measurements.length} REGISTROS</span>
      </div>

      <div className="space-y-4">
        {measurements.map((m, idx) => {
          const prev = measurements[idx + 1];
          const weightDiff = getDiff(m.weight, prev?.weight);
          const bfDiff = getDiff(m.bodyFat || 0, prev?.bodyFat || 0);

          return (
            <div key={m.id} className="tactical-card group">
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {new Date(m.date).toLocaleDateString('pt-BR', { dateStyle: 'medium' }).toUpperCase()}
                </span>
                <button 
                  onClick={() => onDelete(m.id)}
                  className="text-slate-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="p-4 grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Peso</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono font-bold text-lg">{m.weight}</span>
                    <span className="text-[10px] opacity-50 font-bold">KG</span>
                  </div>
                  {weightDiff && !weightDiff.isNeutral && (
                    <div className={cn("text-[10px] flex items-center font-bold", weightDiff.isUp ? "text-red-400" : "text-military-success")}>
                      {weightDiff.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {weightDiff.value}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter text-center">Gordura</p>
                  <div className="flex items-baseline gap-1 justify-center">
                    <span className="font-mono font-bold text-lg text-military-accent">{m.bodyFat}</span>
                    <span className="text-[10px] opacity-50 font-bold text-military-accent">%</span>
                  </div>
                  {bfDiff && !bfDiff.isNeutral && (
                    <div className={cn("text-[10px] flex items-center justify-center font-bold", bfDiff.isUp ? "text-red-400" : "text-military-success")}>
                      {bfDiff.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {bfDiff.value}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter text-right">Cintura</p>
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="font-mono font-bold text-lg">{m.waist}</span>
                    <span className="text-[10px] opacity-50 font-bold">CM</span>
                  </div>
                </div>
              </div>

              {/* Extra details expanded or on secondary row if needed */}
              <div className="px-4 pb-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-800/50 pt-2 opacity-60">
                 {m.bmi && <div className="text-[9px] flex gap-1"><span className="font-bold text-slate-500">IMC:</span><span className="font-mono">{m.bmi}</span></div>}
                 {m.leanMass && <div className="text-[9px] flex gap-1"><span className="font-bold text-slate-500">MAGRA:</span><span className="font-mono">{m.leanMass}kg</span></div>}
                 {m.fatMass && <div className="text-[9px] flex gap-1"><span className="font-bold text-slate-500">GORDA:</span><span className="font-mono">{m.fatMass}kg</span></div>}
                 {m.arm && <div className="text-[9px] flex gap-1"><span className="font-bold text-slate-500">BRAÇO:</span><span className="font-mono">{m.arm}</span></div>}
                 {m.chest && <div className="text-[9px] flex gap-1"><span className="font-bold text-slate-500">PEITORAL:</span><span className="font-mono">{m.chest}</span></div>}
                 {m.thigh && <div className="text-[9px] flex gap-1"><span className="font-bold text-slate-500">COXA:</span><span className="font-mono">{m.thigh}</span></div>}
                 {m.calf && <div className="text-[9px] flex gap-1"><span className="font-bold text-slate-500">PANT:</span><span className="font-mono">{m.calf}</span></div>}
                 {m.neck && <div className="text-[9px] flex gap-1"><span className="font-bold text-slate-500">PESCOÇO:</span><span className="font-mono">{m.neck}</span></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
