'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { Microscope, CheckSquare, ChevronRight } from 'lucide-react';

export default function LaboratoryDashboard() {
  const { db, enterLabResults, maskText } = useClinic();
  const [activeResultsVisit, setActiveResultsVisit] = useState(null);
  const [labFormValues, setLabFormFormValues] = useState({});

  const pendingVisits = db.visits.filter(v => v.labResults.some(r => r.status === 'pending'));
  const completedToday = db.visits.filter(v => 
    v.labResults.some(r => r.status === 'completed' && r.date === new Date().toISOString().split('T')[0])
  ).length;

  const handleOpenInput = (visit) => {
    setActiveResultsVisit(visit);
    const initialVals = {};
    visit.labResults.forEach((test, idx) => {
      if (test.status === 'pending') {
        initialVals[idx] = { value: '', range: test.range };
      }
    });
    setLabFormFormValues(initialVals);
  };

  const handleInputChange = (idx, field, val) => {
    setLabFormFormValues(prev => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        [field]: val
      }
    }));
  };

  const handleSubmitResults = (e) => {
    e.preventDefault();
    if (!activeResultsVisit) return;
    enterLabResults(activeResultsVisit.visitNo, labFormValues);
    setActiveResultsVisit(null);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Lab Tests</span>
            <p className="text-3xl font-bold text-red-500 dark:text-red-400 mt-1">{pendingVisits.length}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/40 p-3 rounded-lg text-red-500 dark:text-red-400">
            <Microscope className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Today</span>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedToday}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg text-emerald-600 dark:text-emerald-400">
            <CheckSquare className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Main split grid: Pending list vs Enter form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Orders Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold">Pending Laboratory Diagnostic Requests</h3>
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            {pendingVisits.length === 0 ? (
              <p className="p-8 text-center text-slate-500 text-sm">No pending laboratory diagnostic analyses waiting in queue.</p>
            ) : (
              <div className="divide-y dark:divide-slate-700">
                {pendingVisits.map(v => {
                  const p = db.patients.find(x => x.id === v.patientId);
                  const isSelected = activeResultsVisit?.visitNo === v.visitNo;
                  return (
                    <div 
                      key={v.visitNo} 
                      onClick={() => handleOpenInput(v)}
                      className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700/30 ${
                        isSelected ? 'bg-teal-50/40 dark:bg-teal-950/10 border-l-4 border-teal-700' : ''
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xs uppercase tracking-wider bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-mono font-bold text-slate-500 dark:text-slate-400">{v.visitNo}</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{p ? maskText(p.name, 12) : 'Unknown'}</span>
                        </div>
                        <div className="text-xs text-red-500 dark:text-red-400 font-semibold">{v.labOrdered}</div>
                        <div className="text-2xs text-slate-400">Ordered by: {v.doctor}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Enter Results Form Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm p-5">
          {activeResultsVisit ? (
            <form onSubmit={handleSubmitResults} className="flex flex-col gap-4">
              <h3 className="font-bold text-lg border-b dark:border-slate-700 pb-2 flex items-center gap-2 text-teal-700 dark:text-teal-400">
                <Microscope className="w-5 h-5" />
                <span>Enter Test Results</span>
              </h3>
              
              <div className="text-xs bg-slate-50 dark:bg-slate-700/40 p-3 rounded-lg flex flex-col gap-1">
                <div>Visit: <b>{activeResultsVisit.visitNo}</b></div>
                <div>Patient ID: <b>{activeResultsVisit.patientId}</b></div>
                <div>Doctor Seen: <b>{activeResultsVisit.doctor}</b></div>
              </div>

              <div className="overflow-y-auto max-h-[350px] flex flex-col gap-4 pr-1">
                {activeResultsVisit.labResults.map((test, idx) => {
                  if (test.status === 'pending') {
                    return (
                      <div key={idx} className="p-3 border dark:border-slate-700 rounded-lg bg-slate-50/20 dark:bg-slate-800/10 flex flex-col gap-3">
                        <h4 className="font-bold text-xs text-teal-700 dark:text-teal-400 uppercase tracking-wider">{test.testName}</h4>
                        <div className="flex flex-col gap-2">
                          <label className="text-2xs font-bold text-slate-400 uppercase">Numeric/Text Result *</label>
                          <input
                            type="text"
                            required
                            value={labFormValues[idx]?.value || ''}
                            onChange={(e) => handleInputChange(idx, 'value', e.target.value)}
                            placeholder="e.g. 14.2 x10^9/L or Negative"
                            className="bg-white dark:bg-slate-800 text-sm p-2 border dark:border-slate-700 rounded outline-none focus:border-teal-700"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-2xs font-bold text-slate-400 uppercase">Normal Range Tixraac</label>
                          <input
                            type="text"
                            value={labFormValues[idx]?.range || ''}
                            onChange={(e) => handleInputChange(idx, 'range', e.target.value)}
                            className="bg-white dark:bg-slate-800 text-sm p-2 border dark:border-slate-700 rounded outline-none focus:border-teal-700"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-2xs font-bold text-slate-400 uppercase">Upload PDF Document Scan</label>
                          <input
                            type="file"
                            className="text-xs text-slate-400"
                          />
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              <div className="flex gap-2 border-t dark:border-slate-700 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold p-2.5 rounded-lg text-sm shadow-sm transition-all"
                >
                  Commit and Sign-off Report
                </button>
                <button
                  type="button"
                  onClick={() => setActiveResultsVisit(null)}
                  className="border px-4 py-2.5 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 gap-3">
              <Microscope className="w-12 h-12 stroke-1" />
              <p className="text-sm max-w-[200px]">Select a pending diagnostic order from the left column to begin writing results.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
