import { useState, useEffect } from 'react';
import { UserProfile, BodyMeasurement } from '../types';

export function useMetrics() {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('namidida_users');
    if (saved) return JSON.parse(saved);
    
    const oldProfileStr = localStorage.getItem('namidida_profile');
    if (oldProfileStr) {
      try {
        const p = JSON.parse(oldProfileStr);
        const newUser = { ...p, id: p.id || crypto.randomUUID() };
        return [newUser];
      } catch (e) { console.error(e); }
    }
    return [];
  });

  const [activeUserId, setActiveUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem('namidida_active_user_id');
    if (saved) return saved;
    return users.length > 0 ? users[0].id : null;
  });

  const [allMeasurements, setAllMeasurements] = useState<BodyMeasurement[]>(() => {
    const saved = localStorage.getItem('namidida_measurements');
    let data: BodyMeasurement[] = saved ? JSON.parse(saved) : [];
    
    if (data.length > 0 && !data[0].userId && users.length > 0) {
       const uid = users[0].id;
       data = data.map(m => ({ ...m, userId: m.userId || uid }));
    }
    return data;
  });

  useEffect(() => {
    localStorage.setItem('namidida_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (activeUserId) localStorage.setItem('namidida_active_user_id', activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    localStorage.setItem('namidida_measurements', JSON.stringify(allMeasurements));
  }, [allMeasurements]);

  const profile = users.find(u => u.id === activeUserId) || null;
  const measurements = allMeasurements.filter(m => m.userId === activeUserId);

  const updateProfile = (p: UserProfile) => {
    setUsers(prev => {
      const index = prev.findIndex(u => u.id === p.id);
      if (index > -1) {
        const next = [...prev];
        next[index] = p;
        return next;
      }
      return [...prev, p];
    });
    setActiveUserId(p.id);
  };

  const addUser = (p: Omit<UserProfile, 'id'>) => {
    const newUser = { ...p, id: crypto.randomUUID() };
    setUsers(prev => [...prev, newUser]);
    setActiveUserId(newUser.id);
    return newUser;
  };

  const deleteUser = (id: string) => {
    const nextUsers = users.filter(u => u.id !== id);
    setUsers(nextUsers);
    setAllMeasurements(prev => prev.filter(m => m.userId !== id));
    if (activeUserId === id) {
      setActiveUserId(nextUsers.length > 0 ? nextUsers[0].id : null);
    }
  };

  const addMeasurement = (m: Omit<BodyMeasurement, 'id' | 'userId'>) => {
    if (!activeUserId) return;
    const newMeasure: BodyMeasurement = { 
      ...m, 
      id: crypto.randomUUID(), 
      userId: activeUserId,
      createdAt: Date.now() 
    };
    
    setAllMeasurements((prev) => {
      const updated = [newMeasure, ...prev].sort((a, b) => {
        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateDiff !== 0) return dateDiff;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });

      const userLatest = updated.filter(mu => mu.userId === activeUserId)[0];
      if (userLatest?.id === newMeasure.id) {
         setUsers(currUsers => currUsers.map(u => 
           u.id === activeUserId ? { ...u, currentWeight: newMeasure.weight } : u
         ));
      }
      return updated;
    });
  };

  const deleteMeasurement = (id: string) => {
    setAllMeasurements((prev) => prev.filter((m) => m.id !== id));
  };

  return {
    profile,
    users,
    activeUserId,
    measurements,
    addMeasurement,
    deleteMeasurement,
    updateProfile,
    addUser,
    deleteUser,
    setActiveUserId,
    isInitialized: users.length > 0 && !!activeUserId,
  };
}
