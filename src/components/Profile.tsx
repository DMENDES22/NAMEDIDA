import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Shield, Target, Users, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProfileProps {
  profile: UserProfile;
  users: UserProfile[];
  onUpdate: (p: UserProfile) => void;
  onAddUser: (p: Omit<UserProfile, 'id'>) => void;
  onSwitchUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
}

export const ProfileScreen: React.FC<ProfileProps> = ({ 
  profile, 
  users, 
  onUpdate, 
  onAddUser, 
  onSwitchUser, 
  onDeleteUser 
}) => {
  const [formData, setFormData] = React.useState({ ...profile });
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserData, setNewUserData] = useState<Omit<UserProfile, 'id'>>({
    name: '',
    age: 0,
    gender: 'male',
    height: 0,
    currentWeight: 0,
    weightGoal: undefined
  });

  // Sync formData if profile changes
  React.useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleUpdate = () => {
    onUpdate(formData);
    alert('Perfil atualizado com sucesso.');
  };

  const handleAddUser = () => {
    if (!newUserData.name || !newUserData.age || !newUserData.height) return;
    onAddUser(newUserData);
    setShowAddUser(false);
    setNewUserData({
      name: '',
      age: 0,
      gender: 'male',
      height: 0,
      currentWeight: 0,
      weightGoal: undefined
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Current User Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-12 h-12 bg-military-accent/20 border border-military-accent flex items-center justify-center">
          <User className="text-military-accent" />
        </div>
        <div>
          <h2 className="text-xl font-black">{profile.name.toUpperCase()}</h2>
          <p className="text-[10px] font-mono text-slate-500 uppercase">OPERADOR_ID: {profile.id.slice(0, 8)}</p>
        </div>
      </div>

      {/* User Selector Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-military-accent" />
            <h2 className="text-xl font-black uppercase">USUÁRIOS</h2>
          </div>
          <button 
            onClick={() => setShowAddUser(!showAddUser)}
            className="p-1 border border-slate-800 rounded bg-slate-900 text-slate-400 hover:text-military-accent transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {showAddUser && (
          <div className="tactical-card p-4 space-y-4 border-military-accent animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-[10px] font-black text-military-accent tracking-widest uppercase">REGISTRAR NOVO OPERADOR</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="NOME" 
                className="tactical-input w-full"
                value={newUserData.name}
                onChange={e => setNewUserData(p => ({ ...p, name: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" 
                  placeholder="IDADE" 
                  className="tactical-input"
                  onChange={e => setNewUserData(p => ({ ...p, age: parseInt(e.target.value) || 0 }))}
                />
                <input 
                  type="number" 
                  placeholder="ALTURA cm" 
                  className="tactical-input"
                  onChange={e => setNewUserData(p => ({ ...p, height: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select 
                  className="tactical-input bg-military-900"
                  value={newUserData.gender}
                  onChange={e => setNewUserData(p => ({ ...p, gender: e.target.value as any }))}
                >
                  <option value="male">MASCULINO</option>
                  <option value="female">FEMININO</option>
                </select>
                <input 
                  type="number" 
                  placeholder="PESO kg" 
                  className="tactical-input"
                  onChange={e => setNewUserData(p => ({ ...p, currentWeight: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 text-[10px] font-black py-2 border border-slate-800 text-slate-500"
                >
                  CANCELAR
                </button>
                <button 
                  onClick={handleAddUser}
                  className="flex-1 text-[10px] font-black py-2 bg-military-accent text-military-950"
                >
                  CADASTRAR
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => onSwitchUser(u.id)}
              className={cn(
                "flex-shrink-0 flex items-center gap-3 p-3 border transition-all duration-300",
                u.id === profile.id 
                  ? "bg-military-accent/10 border-military-accent text-military-accent" 
                  : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded flex items-center justify-center",
                u.id === profile.id ? "bg-military-accent text-military-950" : "bg-slate-800 text-slate-600"
              )}>
                {u.id === profile.id ? <CheckCircle2 size={16} /> : <User size={16} />}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black leading-none">{u.name.toUpperCase()}</p>
                <p className="text-[8px] font-mono mt-1 opacity-60">{u.gender === 'male' ? 'MASC' : 'FEM'} • {u.currentWeight}KG</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Edit Current Profile Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Shield size={18} className="text-military-accent" />
          <h2 className="text-xl font-black uppercase">EDITAR PERFIL ATIVO</h2>
        </div>
        
        <div className="tactical-card p-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">NOME</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                className="tactical-input" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">IDADE</label>
              <input 
                type="number" 
                value={isNaN(formData.age) ? '' : formData.age} 
                onChange={e => setFormData(p => ({ ...p, age: e.target.value === '' ? NaN : parseInt(e.target.value) }))}
                className="tactical-input font-mono" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">ALTURA (CM)</label>
              <input 
                type="number" 
                value={isNaN(formData.height) ? '' : formData.height} 
                onChange={e => setFormData(p => ({ ...p, height: e.target.value === '' ? NaN : parseInt(e.target.value) }))}
                className="tactical-input font-mono" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">SEXO</label>
              <select 
                value={formData.gender} 
                onChange={e => setFormData(p => ({ ...p, gender: e.target.value as 'male' | 'female' }))}
                className="tactical-input bg-military-900 appearance-none"
              >
                <option value="male">MASCULINO</option>
                <option value="female">FEMININO</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">PESO ATUAL (KG)</label>
              <input 
                type="number" 
                step="0.1"
                value={formData.currentWeight === undefined || isNaN(formData.currentWeight) ? '' : formData.currentWeight} 
                onChange={e => setFormData(p => ({ ...p, currentWeight: e.target.value === '' ? NaN : parseFloat(e.target.value) }))}
                className="tactical-input font-mono" 
              />
            </div>
          </div>
        </div>

        <div className="tactical-card p-4 space-y-4 border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Target size={16} className="text-military-accent" />
            <h3 className="text-xs font-black tracking-widest">OBJETIVOS</h3>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">META DE PESO (KG)</label>
            <input 
              type="number" 
              value={formData.weightGoal === undefined || isNaN(formData.weightGoal) ? '' : formData.weightGoal} 
              placeholder="OPCIONAL"
              onChange={e => setFormData(p => ({ ...p, weightGoal: e.target.value === '' ? undefined : parseFloat(e.target.value) }))}
              className="tactical-input font-mono text-military-accent" 
            />
          </div>
        </div>

        <button onClick={handleUpdate} className="w-full tactical-btn-primary">
          SALVAR ALTERAÇÕES
        </button>

        {users.length > 1 && (
          <button 
            onClick={() => {
              if (confirm('Tem certeza que deseja excluir este usuário e todos os seus dados?')) {
                onDeleteUser(profile.id);
              }
            }}
            className="w-full py-3 border border-red-900/50 text-red-500 text-[10px] font-black uppercase hover:bg-red-500/10 transition-colors"
          >
            EXCLUIR USUÁRIO ATUAL
          </button>
        )}
      </div>

      <div className="p-4 border border-dashed border-slate-800 text-[10px] text-slate-500 text-center leading-relaxed">
        OS DADOS SÃO ARMAZENADOS LOCALMENTE NO SEU DISPOSITIVO.<br/>
        ESTE É UM SISTEMA DE USO PRIVADO E OFFLINE.
      </div>
    </div>
  );
};

export const WelcomeScreen: React.FC<{ onComplete: (p: UserProfile) => void }> = ({ onComplete }) => {
  const [formData, setFormData] = React.useState<UserProfile>({
    name: '',
    age: 0,
    gender: 'male',
    height: 0,
    currentWeight: 0,
    weightGoal: undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.height || !formData.currentWeight) return;
    onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-military-950 p-6 flex flex-col justify-center max-w-md mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-military-accent/10 border border-military-accent text-military-accent text-[10px] font-black tracking-[0.2em] uppercase">
          Tactical Measurement System
        </div>
        <h1 className="text-5xl font-black italic tracking-tighter leading-none">
          NA <span className="text-military-accent">MEDIDA</span>
        </h1>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Inicie seu protocolo corporal.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="tactical-card p-6 space-y-4 border-slate-800">
           <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">NOME</label>
            <input 
              required
              type="text" 
              placeholder="Digite seu nome"
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              className="tactical-input w-full" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IDADE</label>
                <input 
                  required
                  type="number" 
                  placeholder="EX: 28"
                  value={isNaN(formData.age) || formData.age === 0 ? '' : formData.age}
                  onChange={e => setFormData(p => ({ ...p, age: e.target.value === '' ? NaN : parseInt(e.target.value) }))}
                  className="tactical-input w-full" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PESO ATUAL (KG)</label>
                <input 
                  required
                  type="number" 
                  step="0.1"
                  placeholder="EX: 95.5"
                  value={isNaN(formData.currentWeight) || formData.currentWeight === 0 ? '' : formData.currentWeight}
                  onChange={e => setFormData(p => ({ ...p, currentWeight: e.target.value === '' ? NaN : parseFloat(e.target.value) }))}
                  className="tactical-input w-full" 
                />
              </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ALTURA (CM)</label>
                <input 
                  required
                  type="number" 
                  placeholder="EX: 180"
                  value={isNaN(formData.height) || formData.height === 0 ? '' : formData.height}
                  onChange={e => setFormData(p => ({ ...p, height: e.target.value === '' ? NaN : parseInt(e.target.value) }))}
                  className="tactical-input w-full" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SEXO</label>
                <select 
                  value={formData.gender} 
                  onChange={e => setFormData(p => ({ ...p, gender: e.target.value as 'male' | 'female' }))}
                  className="tactical-input bg-military-900 appearance-none"
                >
                  <option value="male">MASCULINO</option>
                  <option value="female">FEMININO</option>
                </select>
              </div>
          </div>
        </div>

        <button type="submit" className="w-full tactical-btn-primary h-14 text-sm">
          INICIAR AVALIAÇÃO
        </button>
      </form>
    </div>
  );
};
