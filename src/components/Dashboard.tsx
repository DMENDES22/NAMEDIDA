import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Scale, Activity, Timer, ChevronRight, PlusSquare, Zap, Target } from 'lucide-react';
import { UserProfile, BodyMeasurement, Page } from '../types';
import { formatValue, getBFClassification } from '../utils/math';
import { cn } from '../lib/utils';

interface DashboardProps {
  profile: UserProfile;
  measurements: BodyMeasurement[];
  onNavigate: (page: Page) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, measurements, onNavigate }) => {
  const latest = measurements[0];
  const previous = measurements[1];

  const getTrend = (key: keyof BodyMeasurement) => {
    if (!latest || !previous) return null;
    const currentVal = latest[key] as number;
    const prevVal = previous[key] as number;
    if (currentVal === prevVal) return null;
    
    const diff = currentVal - prevVal;
    const isUp = diff > 0;
    
    return {
      diff: Math.abs(diff),
      isUp,
      color: isUp ? 'text-red-400' : 'text-military-success'
    };
  };

  const weightTrend = getTrend('weight');
  const bfTrend = getTrend('bodyFat');
  
  const currentBF = latest?.bodyFat;
  const currentWeight = latest?.weight ?? profile.currentWeight;
  const currentBMI = latest?.bmi ?? (profile.currentWeight && profile.height ? profile.currentWeight / Math.pow(profile.height/100, 2) : undefined);
  const currentLeanMass = latest?.leanMass;
  const currentFatMass = latest?.fatMass;

  const classification = currentBF ? getBFClassification(profile.gender, currentBF) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* BF Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="tactical-card p-4 flex flex-col justify-between aspect-square"
        >
          <div className="flex justify-between items-start">
            <Activity size={18} className="text-military-accent opacity-50" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">FAT %</span>
          </div>
          <div>
            <div className="text-4xl font-mono font-bold text-white">
              {formatValue(currentBF, '')}
              <span className="text-sm opacity-50 ml-1">%</span>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              {classification && (
                <span className={cn("text-[9px] font-black tracking-tighter uppercase", classification.color)}>
                  {classification.label}
                </span>
              )}
              {bfTrend && (
                <div className={cn("text-[10px] font-bold flex items-center gap-0.5", bfTrend.color)}>
                  {bfTrend.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {bfTrend.diff.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Weight Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="tactical-card p-4 flex flex-col justify-between aspect-square"
        >
          <div className="flex justify-between items-start">
            <Scale size={18} className="text-military-accent opacity-50" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">WEIGHT</span>
          </div>
          <div>
            <div className="text-4xl font-mono font-bold text-white">
              {formatValue(currentWeight, '')}
              <span className="text-sm opacity-50 ml-1">KG</span>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                IMC: <span className="text-white">{formatValue(currentBMI, '')}</span>
              </span>
              {weightTrend && (
                <div className={cn("text-[10px] font-bold flex items-center gap-0.5", weightTrend.color)}>
                  {weightTrend.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {weightTrend.diff.toFixed(1)}kg
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Composition Info */}
      {(currentLeanMass !== undefined || currentFatMass !== undefined) && (
        <div className="grid grid-cols-2 gap-4">
           <div className="tactical-card p-3 flex gap-3 items-center border-l-military-success border-l-2">
              <Zap size={16} className="text-military-success" />
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Massa Magra</p>
                <p className="font-mono font-bold text-sm tracking-tight">{formatValue(currentLeanMass, ' KG')}</p>
              </div>
           </div>
           <div className="tactical-card p-3 flex gap-3 items-center border-l-red-500 border-l-2">
              <Target size={16} className="text-red-500" />
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Massa Gorda</p>
                <p className="font-mono font-bold text-sm tracking-tight">{formatValue(currentFatMass, ' KG')}</p>
              </div>
           </div>
        </div>
      )}

      {/* Summary info */}
      <div className="tactical-card p-4 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Timer size={16} className="text-yellow-500 opacity-50" />
            <span className="text-xs font-bold uppercase tracking-wider">Status Atual</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {latest ? new Date(latest.date).toLocaleDateString() : 'SEM REGISTRO'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Altura</p>
              <p className="font-mono font-bold">{profile.height} cm</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Objetivo</p>
              <p className="font-mono font-bold text-military-accent">{profile.weightGoal ? `${profile.weightGoal} kg` : 'N/A'}</p>
            </div>
            {latest && (
              <>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Cintura</p>
                  <p className="font-mono font-bold">{latest.waist} cm</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Pescoço</p>
                  <p className="font-mono font-bold">{latest.neck} cm</p>
                </div>
              </>
            )}
        </div>
      </div>

      <button 
        onClick={() => onNavigate('new-measure')}
        className="w-full tactical-btn-primary h-14 group"
      >
        <PlusSquare size={18} />
        REGISTRAR NOVA MEDIDA
        <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
      </button>

      <div className="space-y-3">
        <h3 className="text-xs font-black tracking-widest text-slate-400">RESUMO DA EVOLUÇÃO</h3>
        {!latest && (
          <div className="p-8 text-center border border-dashed border-slate-800 text-slate-600 text-xs italic">
            Inicie seu treinamento registrando a primeira medição.
          </div>
        )}
        {latest && (
          <div className="tactical-card p-4 bg-military-accent/5 border-military-accent/20">
            <p className="text-xs leading-relaxed">
              Sua última atualização foi em <span className="text-military-accent font-bold">{new Date(latest.date).toLocaleDateString()}</span>. 
              {weightTrend ? (
                <span> Você está <span className={cn("font-bold", weightTrend.color)}>{weightTrend.isUp ? 'acima' : 'abaixo'}</span> do seu peso anterior por {weightTrend.diff.toFixed(1)}kg.</span>
              ) : (
                " Mantenha o foco nos seus objetivos."
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
