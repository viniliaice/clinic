'use client';

import React from 'react';
import { useClinic } from '@/context/ClinicContext';
import { ShieldCheck } from 'lucide-react';

export default function AuditLogsViewer() {
  const { db } = useClinic();

  return (
    <div className="flex flex-col gap-6">
      
      {/* Overview header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="bg-teal-50 dark:bg-teal-950/40 p-3 rounded-lg text-teal-700 dark:text-teal-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Immutability Operations Audit Log</h2>
            <p className="text-sm text-slate-500 mt-1">Review secure clinical operational activities, tracking datestamps and operator roles.</p>
          </div>
        </div>
      </div>

      {/* Main Audit log list */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full font-mono text-xs text-slate-700 dark:text-slate-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/30 border-b dark:border-slate-700 text-slate-400 font-bold uppercase text-2xs">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Operator Account</th>
                <th className="p-4">Operational / System Activity Log</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {db.auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-4 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-2xs font-bold uppercase bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400">
                      {log.user}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200 leading-relaxed">{log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
