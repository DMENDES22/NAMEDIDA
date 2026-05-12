import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { UserProfile, BodyMeasurement } from '../types';
import { calculateNavyBF, calculateBMI, calculateLeanMass, calculateFatMass } from '../utils/math';

interface MeasurementFormProps {
  profile: UserProfile;
  onSubmit: (m: Omit<BodyMeasurement, 'id'>) => void;
  onCancel: () => void;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({ profile, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    neck: '',
    waist: '',
    hip: '',
    arm: '',
    chest: '',
    thigh: '',
    calf: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    const weight = parseFloat(formData.weight);
    const neck = parseFloat(formData.neck);
    const waist = parseFloat(formData.waist);
    const hip = profile.gender === 'female' ? parseFloat(formData.hip) : undefined;

    if (!weight || !neck || !waist || (profile.gender === 'female' && !hip)) {
      setError('Campos obrigatórios (Peso, Pescoço, Cintura e Quadril se feminino) não preenchidos.');
      return;
    }

    const bf = calculateNavyBF(profile.gender, profile.height, neck, waist, hip);
    const bmi = calculateBMI(weight, profile.height);
    const bodyFatPercent = parseFloat(bf.toFixed(2));
    const leanMass = calculateLeanMass(weight, bodyFatPercent);
    const fatMass = calculateFatMass(weight, bodyFatPercent);

    onSubmit({
      date: formData.date,
      weight,
      neck,
      waist,
      hip,
      arm: formData.arm ? parseFloat(formData.arm) : undefined,
      chest: formData.chest ? parseFloat(formData.chest) : undefined,
      thigh: formData.thigh ? parseFloat(formData.thigh) : undefined,
      calf: formData.calf ? parseFloat(formData.calf) : undefined,
      bodyFat: bodyFatPercent,
      bmi: parseFloat(bmi.toFixed(2)),
      leanMass: parseFloat(leanMass.toFixed(2)),
      fatMass: parseFloat(fatMass.toFixed(2)),
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black">NOVA MEDIÇÃO</h2>
        <div className="text-[10px] font-mono bg-military-accent/20 text-military-accent px-2 py-1 border border-military-accent/30">
          ID: {profile.gender === 'male' ? 'OPERADOR' : 'OPERADORA'}
        </div>
      </div>

      <div className="space-y-4">
        {/* Core Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DATA</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              className="tactical-input" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PESO (KG)</label>
            <input 
              type="number" 
              name="weight" 
              placeholder="00.0" 
              step="0.1"
              value={formData.weight} 
              onChange={handleChange}
              className="tactical-input" 
            />
          </div>
        </div>

        {/* Navy Formula Metrics */}
        <div className="tactical-card p-4 space-y-4 border-military-accent/30">
          <h3 className="text-[10px] font-black text-military-accent tracking-widest">FÓRMULA DA MARINHA</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1 col-span-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">PESCOÇO</label>
              <input 
                type="number" 
                name="neck" 
                placeholder="cm" 
                value={formData.neck}
                onChange={handleChange}
                className="tactical-input border-military-accent/20" 
              />
            </div>
            <div className="flex flex-col gap-1 col-span-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">CINTURA</label>
              <input 
                type="number" 
                name="waist" 
                placeholder="cm" 
                value={formData.waist}
                onChange={handleChange}
                className="tactical-input border-military-accent/20" 
              />
            </div>
            {profile.gender === 'female' && (
              <div className="flex flex-col gap-1 col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">QUADRIL</label>
                <input 
                  type="number" 
                  name="hip" 
                  placeholder="cm" 
                  value={formData.hip}
                  onChange={handleChange}
                  className="tactical-input border-military-accent/20" 
                />
              </div>
            )}
          </div>
          
          {/* Live Preview */}
          <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CÁLCULO ESTIMADO</span>
            <div className="text-xl font-mono font-bold text-military-accent">
              {(() => {
                const neck = parseFloat(formData.neck);
                const waist = parseFloat(formData.waist);
                const hip = profile.gender === 'female' ? parseFloat(formData.hip) : undefined;
                if (!neck || !waist || (profile.gender === 'female' && !hip)) return '--';
                try {
                  const bf = calculateNavyBF(profile.gender, profile.height, neck, waist, hip);
                  return bf > 0 ? bf.toFixed(1) + '%' : '--';
                } catch {
                  return '--';
                }
              })()}
            </div>
          </div>
        </div>

        {/* Optional Metrics */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 tracking-widest uppercase">MEDIDAS ADICIONAIS (OPCIONAL)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">PEITORAL</label>
              <input type="number" name="chest" placeholder="cm" value={formData.chest} onChange={handleChange} className="tactical-input" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">BRAÇO</label>
              <input type="number" name="arm" placeholder="cm" value={formData.arm} onChange={handleChange} className="tactical-input" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">COXA</label>
              <input type="number" name="thigh" placeholder="cm" value={formData.thigh} onChange={handleChange} className="tactical-input" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">PANTURRILHA</label>
              <input type="number" name="calf" placeholder="cm" value={formData.calf} onChange={handleChange} className="tactical-input" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-950/30 border border-red-900 flex gap-2 items-start text-red-400 text-[10px] font-bold uppercase leading-relaxed">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button onClick={onCancel} className="flex-1 tactical-btn-outline">CANCELAR</button>
        <button onClick={handleSave} className="flex-1 tactical-btn-primary">
          <Save size={16} />
          REGISTRAR
        </button>
      </div>
    </div>
  );
};
