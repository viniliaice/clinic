'use client';

import { useClinic } from '@/context/ClinicContext';
import { 
  LayoutDashboard, 
  UserPlus, 
  Search, 
  Calendar, 
  DollarSign, 
  Package, 
  BarChart3, 
  ShieldAlert, 
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar() {
  const { currentUserRole, currentTab, setCurrentTab, logout, setActivePatientId, maskText, t, isSidebarOpen, setIsSidebarOpen } = useClinic();

  const getMenuItems = () => {
    if (currentUserRole === 'reception') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'register', label: 'Register Patient', icon: UserPlus },
        { id: 'search', label: 'Search Directory', icon: Search },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'billing', label: 'Billing & Invoices', icon: DollarSign },
        { id: 'inventory', label: 'Drug Inventory', icon: Package },
        { id: 'reports', label: 'Reports & Stats', icon: BarChart3 },
        { id: 'audit', label: 'Security Audit Logs', icon: ShieldAlert },
      ];
    } else if (currentUserRole === 'doctor') {
      return [
        { id: 'dashboard', label: "Today's Queue", icon: LayoutDashboard },
        { id: 'search', label: 'Search Directory', icon: Search },
        { id: 'inventory', label: 'Drug Inventory', icon: Package },
        { id: 'reports', label: 'Reports & Stats', icon: BarChart3 },
      ];
    } else if (currentUserRole === 'laboratory') {
      return [
        { id: 'dashboard', label: 'Laboratory Dashboard', icon: LayoutDashboard },
        { id: 'search', label: 'Search Directory', icon: Search },
        { id: 'reports', label: 'Reports & Stats', icon: BarChart3 },
      ];
    }
    return [];
  };

  const handleMenuClick = (tabId) => {
    setCurrentTab(tabId);
    setActivePatientId(null);
    setIsSidebarOpen(false);
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-68 bg-white dark:bg-slate-800 border-r dark:border-slate-700 flex flex-col no-print h-full min-h-screen transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between text-teal-700 dark:text-teal-400 font-bold text-lg">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            <span>Al-Shifa Clinic</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      <div className="p-4 border-b dark:border-slate-700 bg-teal-50 dark:bg-slate-700/50">
        <div className="text-sm font-semibold truncate">
          {currentUserRole === 'doctor' ? "Dr. Abdirahman Omar" : (currentUserRole === 'laboratory' ? "Khadra Yusuf (Lab Tech)" : "Fadumo Ali (Reception)")}
        </div>
        <div className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">
          {currentUserRole}
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-all ${
                isActive 
                  ? 'bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-teal-700 dark:hover:text-teal-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t dark:border-slate-700">
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 p-3 w-full rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
      </aside>
    </>
  );
}
