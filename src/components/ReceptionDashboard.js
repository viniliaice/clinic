'use client';

import React from 'react';
import { useClinic } from '@/context/ClinicContext';
import { Users, Clock, Calendar, UserCheck, Plus, Search, Eye } from 'lucide-react';

export default function ReceptionDashboard() {
  const { db, setCurrentTab, setActivePatientId, maskText } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];
  const registeredCount = db.patients.length; 
  const waitingCount = db.appointments.filter(a => a.date === todayStr && a.status === 'Waiting').length;
  const todayAppointments = db.appointments.filter(a => a.date === todayStr).length;

  const handleConsult = (patientId) => {
    setActivePatientId(patientId);
    setCurrentTab('search'); // Switch context
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Today</span>
            <p className="text-3xl font-bold text-teal-700 dark:text-teal-400 mt-1">{registeredCount}</p>
          </div>
          <div className="bg-teal-50 dark:bg-teal-950/40 p-3 rounded-lg text-teal-700 dark:text-teal-400">
            <Users className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Waiting in Queue</span>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{waitingCount}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-lg text-amber-600 dark:text-amber-400">
            <Clock className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today&apos;s Appointments</span>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{todayAppointments}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Main Quick Action Cards */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Quick Registration & Triage Queue</h2>
          <p className="text-sm text-slate-500 mt-1">Add a brand-new medical chart file or book an active doctor-seen queue for a registered patient.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => setCurrentTab('register')}
            className="btn btn-primary flex items-center gap-2 bg-teal-700 text-white font-bold p-3 rounded-lg hover:bg-teal-800 transition-all"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Register Patient</span>
          </button>
          <button
            onClick={() => setCurrentTab('search')}
            className="btn btn-secondary flex items-center gap-2 border p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
          >
            <Search className="w-4.5 h-4.5" />
            <span>Search Patient</span>
          </button>
        </div>
      </div>

      {/* Today's Appointments List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="font-bold">Today&apos;s Appointment Schedule ({todayStr})</h3>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/30 border-b dark:border-slate-700 text-slate-400 font-bold uppercase text-xs">
                <th className="p-4">Patient ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Time</th>
                <th className="p-4">Doctor Assigned</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {db.appointments.map(apt => (
                <tr key={apt.id} className="hover:bg-teal-50/20 dark:hover:bg-teal-950/10">
                  <td className="p-4 font-mono text-xs">{apt.patientId}</td>
                  <td className="p-4 font-bold">{maskText(apt.patientName, 12)}</td>
                  <td className="p-4">{apt.time}</td>
                  <td className="p-4">{apt.doctor}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      apt.status === 'Completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' 
                        : (apt.status === 'Waiting' 
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400')
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleConsult(apt.patientId)}
                      className="flex items-center gap-1 text-xs text-teal-700 dark:text-teal-400 hover:underline font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Medical Records</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
