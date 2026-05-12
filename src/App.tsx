/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMetrics } from './hooks/useMetrics';
import { Page } from './types';
import { Header, Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { MeasurementForm } from './components/MeasurementForm';
import { HistoryList } from './components/HistoryList';
import { StatsCharts } from './components/StatsCharts';
import { ProfileScreen, WelcomeScreen } from './components/Profile';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { 
    profile, 
    users,
    measurements, 
    addMeasurement, 
    deleteMeasurement, 
    updateProfile, 
    addUser,
    deleteUser,
    setActiveUserId,
    isInitialized 
  } = useMetrics();

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (!isInitialized) {
    return <WelcomeScreen onComplete={(p) => {
      addUser(p);
      setCurrentPage('dashboard');
    }} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            profile={profile!} 
            measurements={measurements} 
            onNavigate={setCurrentPage} 
          />
        );
      case 'new-measure':
        return (
          <MeasurementForm 
            profile={profile!} 
            onSubmit={(m) => {
              addMeasurement(m);
              setCurrentPage('dashboard');
            }} 
            onCancel={() => setCurrentPage('dashboard')} 
          />
        );
      case 'history':
        return (
          <HistoryList 
            measurements={measurements} 
            onDelete={deleteMeasurement} 
          />
        );
      case 'charts':
        return <StatsCharts measurements={measurements} />;
      case 'profile':
        return (
          <ProfileScreen 
            profile={profile!} 
            users={users}
            onUpdate={updateProfile} 
            onAddUser={addUser}
            onSwitchUser={setActiveUserId}
            onDeleteUser={deleteUser}
          />
        );
      default:
        return <Dashboard profile={profile!} measurements={measurements} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-military-950 text-slate-200">
      <Header />
      
      <main className="max-w-md mx-auto p-4 mb-20 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navigation 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
      />
    </div>
  );
}
