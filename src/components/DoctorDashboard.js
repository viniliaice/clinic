'use client';

import React from 'react';
import { useClinic } from '@/context/ClinicContext';
import { HeartPulse, CheckSquare, Microscope, Eye } from 'lucide-react';

export default function DoctorDashboard() {
  const { db, setActivePatientId, setCurrentTab, maskText } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];
  const waitingQueue = db.appointments.filter(a => a.date === todayStr && a.status === 'Waiting');
  const pendingLabs = db.visits.filter(v => v.labResults.some(r => r.status === 'pending'));
  const completedConsults = db.visits.filter(v => v.dateTime.includes(todayStr) && v.diagnosis !== "").length;

  const handleConsult = (patientId) => {
    setActivePatientId(patientId);
    setCurrentTab('search'); 
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Waiting in Queue</span>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{waitingQueue.length}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-lg text-amber-600 dark:text-amber-400">
            <HeartPulse className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Lab Results Pending Review</span>
            <p className="text-3xl font-bold text-red-500 dark:text-red-400 mt-1">{pendingLabs.length}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/40 p-3 rounded-lg text-red-500 dark:text-red-400">
            <Microscope className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">My Completed Consultations</span>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedConsults}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg text-emerald-600 dark:text-emerald-400">
            <CheckSquare className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Patients in queue for consultation */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="font-bold">Active Patient Consultation Queue</h3>
        </div>
        <div className="overflow-x-auto w-full">
          {waitingQueue.length === 0 ? (
            <p className="p-8 text-center text-slate-500 text-sm">No patients waiting in queue today.</p>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/30 border-b dark:border-slate-700 text-slate-400 font-bold uppercase text-xs">
                  <th className="p-4">Patient ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Registered Time</th>
                  <th className="p-4">Triage Vitals Check</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {waitingQueue.map(apt => {
                  const lastVisit = db.visits.filter(v => v.patientId === apt.patientId).slice(-1)[0];
                  return (
                    <tr key={apt.id} className="hover:bg-teal-50/20 dark:hover:bg-teal-950/10">
                      <td className="p-4 font-mono text-xs">{apt.patientId}</td>
                      <td className="p-4 font-bold">{maskText(apt.patientName, 12)}</td>
                      <td className="p-4">{apt.time}</td>
                      <td className="p-4">
                        {lastVisit ? (
                          <div className="text-xs flex flex-col gap-0.5">
                            <span>BP: <b className="text-teal-700 dark:text-teal-400">{lastVisit.bp}</b> | Temp: <b>{lastVisit.temp}°C</b></span>
                            <span>Weight: <b>{lastVisit.weight}kg</b> | BMI: <b>{lastVisit.bmi} ({lastVisit.bmiClass})</b></span>
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleConsult(apt.patientId)}
                          className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          Consult Patient
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Lab results pending review */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="font-bold">Laboratory Diagnostics Pending Review</h3>
        </div>
        <div className="overflow-x-auto w-full">
          {pendingLabs.length === 0 ? (
            <p className="p-8 text-center text-slate-500 text-sm">No diagnostic lab requests currently pending review.</p>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/30 border-b dark:border-slate-700 text-slate-400 font-bold uppercase text-xs">
                  <th className="p-4">Patient ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Test Requested</th>
                  <th className="p-4">Status Map</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {pendingLabs.map(v => {
                  const p = db.patients.find(x => x.id === v.patientId);
                  return (
                    <tr key={v.visitNo} className="hover:bg-teal-50/20 dark:hover:bg-teal-950/10">
                      <td className="p-4 font-mono text-xs">{v.patientId}</td>
                      <td className="p-4 font-bold">{p ? maskText(p.name, 12) : 'Unknown'}</td>
                      <td className="p-4 font-semibold text-teal-700 dark:text-teal-400">{v.labOrdered}</td>
                      <td className="p-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {v.labResults.map((r, idx) => (
                            <span key={idx} className={`px-2 py-0.5 rounded text-2xs font-bold uppercase ${
                              r.status === 'completed' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                            }`}>
                              {r.testName}: {r.status}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleConsult(v.patientId)}
                          className="flex items-center gap-1 text-xs text-teal-700 dark:text-teal-400 hover:underline font-bold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Report</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
