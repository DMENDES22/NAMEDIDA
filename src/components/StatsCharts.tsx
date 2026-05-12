import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { BodyMeasurement } from '../types';

interface ChartsProps {
  measurements: BodyMeasurement[];
}

export const StatsCharts: React.FC<ChartsProps> = ({ measurements }) => {
  const data = [...measurements].reverse().map(m => ({
    ...m,
    formattedDate: new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }));

  if (data.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-slate-800">
        <p className="text-slate-500 text-sm uppercase font-mono tracking-widest">DADOS INSUFICIENTES</p>
        <p className="text-[10px] text-slate-600 max-w-[200px]">São necessários pelo menos 2 registros para gerar gráficos de evolução.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label, unit = '' }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-military-900 border border-military-accent/50 p-2 text-[10px] font-mono shadow-xl">
          <p className="text-slate-400 mb-1">{label}</p>
          <p className="text-white font-bold">{payload[0].value}{unit}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="space-y-4">
        <h3 className="text-xs font-black tracking-[0.2em] text-slate-400 border-l-2 border-military-accent pl-2">EVOLUÇÃO DO PESO (KG)</h3>
        <div className="tactical-card h-64 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="formattedDate" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip unit="kg" />} />
              <Area type="monotone" dataKey="weight" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black tracking-[0.2em] text-slate-400 border-l-2 border-military-success pl-2">PERCENTUAL DE GORDURA (%)</h3>
        <div className="tactical-card h-64 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="formattedDate" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Line type="monotone" dataKey="bodyFat" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: '#0f172a' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
         <h3 className="text-xs font-black tracking-[0.2em] text-slate-400 border-l-2 border-military-warning pl-2">CIRCUNFERÊNCIA DA CINTURA (CM)</h3>
         <div className="tactical-card h-64 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="formattedDate" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip unit="cm" />} />
              <Line type="step" dataKey="waist" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
