'use client';

import React, { useState, useEffect } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { ShieldCheck, ShieldAlert, Wifi, WifiOff, Sun, Moon, Clock, Globe, Menu } from 'lucide-react';

export default function Header() {
  const { 
    currentLanguage, changeLanguage,
    theme, toggleTheme,
    isEncrypted, toggleEncryption,
    isOffline, toggleOffline,
    syncPendingCount, logout,
    setIsSidebarOpen
  } = useClinic();

  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          logout();
          alert("Session has expired due to inactivity.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [logout]);

  const resetTimer = () => {
    setTimeLeft(900);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b dark:border-slate-700 flex items-center justify-between px-3 md:px-6 sticky top-0 z-30 no-print gap-2">
      
      {/* Left side actions */}
      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Hamburger menu for mobile/tablet */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          title="Open Sidebar"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        {/* Connection Status Badge */}
        <button
          onClick={toggleOffline}
          className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all ${
            isOffline 
              ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40' 
              : 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/40'
          }`}
          title="Click to toggle simulated offline status"
        >
          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse ${isOffline ? 'bg-red-600' : 'bg-green-600'}`}></div>
          {isOffline ? (
            <span className="flex items-center gap-1">
              <WifiOff className="w-3.5 h-3.5"/>
              <span className="hidden md:inline">Offline ({syncPendingCount} pending)</span>
              <span className="md:hidden">Offline</span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5"/>
              <span className="hidden md:inline">Synced to Cloud</span>
              <span className="md:hidden">Synced</span>
            </span>
          )}
        </button>

        {/* Database Encryption Badge */}
        <button
          onClick={toggleEncryption}
          className={`flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold border transition-all ${
            isEncrypted 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' 
              : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40'
          }`}
        >
          {isEncrypted ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Encrypted: Active</span>
              <span className="md:hidden">Encrypted</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Encrypted: Off</span>
              <span className="md:hidden">Off</span>
            </>
          )}
        </button>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1.5 md:gap-4">
        {/* Inactivity Security Timer */}
        <button
          onClick={resetTimer}
          className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40"
          title="Click to reset timer"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>
            <span className="hidden sm:inline">Session: </span>
            {formatTime(timeLeft)}
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 md:p-2 border dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 md:w-4.5 h-4 md:h-4.5 text-amber-400" /> : <Moon className="w-4 md:w-4.5 h-4 md:h-4.5" />}
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-1 md:gap-1.5">
          <Globe className="w-4 md:w-4.5 h-4 md:h-4.5 text-slate-400" />
          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-transparent text-xs md:text-sm font-semibold outline-none border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer text-slate-700 dark:text-slate-300"
          >
            <option className="bg-white dark:bg-slate-800" value="en">EN</option>
            <option className="bg-white dark:bg-slate-800" value="ar">العربية</option>
            <option className="bg-white dark:bg-slate-800" value="so">SO</option>
          </select>
        </div>
      </div>
    </header>
  );
}
