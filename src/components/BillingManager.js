'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { DollarSign, Printer, CreditCard } from 'lucide-react';

export default function BillingManager() {
  const { db, processPayment, maskText } = useClinic();
  const [activeReceipt, setActiveReceipt] = useState(null);

  const handlePrintReceipt = (invoice) => {
    setActiveReceipt(invoice);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Stat overview */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold">Billing, Invoices & Receipt Settlements</h2>
          <p className="text-sm text-slate-500 mt-1">Settle outpatient consultation costs, pharmacy prescription charges, and lab analysis fees.</p>
        </div>
      </div>

      {/* Main Billing Table list */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/30 border-b dark:border-slate-700 text-slate-400 font-bold uppercase text-xs">
                <th className="p-4">Invoice No</th>
                <th className="p-4">Patient ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Services Breakdown</th>
                <th className="p-4">Billing Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {db.billing.map(invoice => (
                <tr key={invoice.invoiceNo} className="hover:bg-teal-50/20 dark:hover:bg-teal-950/10">
                  <td className="p-4 font-mono text-xs font-bold">{invoice.invoiceNo}</td>
                  <td className="p-4 font-mono text-xs">{invoice.patientId}</td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-100">{maskText(invoice.patientName, 12)}</td>
                  <td className="p-4 text-xs max-w-[250px] truncate" title={invoice.services}>{invoice.services}</td>
                  <td className="p-4 font-bold text-base text-teal-700 dark:text-teal-400">$ {invoice.amount} <span className="text-xs font-semibold text-slate-400">USD</span></td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                      invoice.status === 'Paid' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {invoice.status !== 'Paid' ? (
                        <button
                          onClick={() => processPayment(invoice.invoiceNo)}
                          className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Process Payment</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePrintReceipt(invoice)}
                          className="px-3 py-1.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Receipt</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash receipt printing modal */}
      {activeReceipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-sm w-full border dark:border-slate-700 overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-5 border-b dark:border-slate-700 font-bold text-lg flex justify-between items-center text-teal-700 dark:text-teal-400">
              <span className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span>Cash Payment Receipt</span>
              </span>
              <button onClick={() => window.print()} className="p-2 border dark:border-slate-700 rounded-lg hover:bg-slate-50">
                <Printer className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 rounded-lg bg-slate-50/40 dark:bg-slate-800/20 font-mono text-xs flex flex-col gap-4 text-slate-800 dark:text-slate-200">
                <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-3 flex flex-col gap-1">
                  <h4 className="font-bold text-sm">AL-SHIFA MEDICAL CLINIC</h4>
                  <p className="text-2xs text-slate-400">Maka Al-Mukarama Street, Mogadishu</p>
                  <p className="text-2xs text-slate-400">Email: billing@alshifa.com | Tel: +252 61 555 1234</p>
                </div>

                <div className="flex flex-col gap-2 border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
                  <div className="flex justify-between"><span>Invoice No:</span><b>{activeReceipt.invoiceNo}</b></div>
                  <div className="flex justify-between"><span>Settlement Date:</span><span>{activeReceipt.date}</span></div>
                  <div className="flex justify-between"><span>Patient ID:</span><span>{activeReceipt.patientId}</span></div>
                  <div className="flex justify-between"><span>Patient Name:</span><b>{activeReceipt.patientName}</b></div>
                </div>

                <div className="flex flex-col gap-2 border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
                  <span className="font-bold text-slate-500">Breakdown of Services:</span>
                  <p className="text-2xs leading-relaxed">{activeReceipt.services}</p>
                </div>

                <div className="flex justify-between items-center text-sm font-bold border-b border-dashed border-slate-300 dark:border-slate-700 pb-3 text-teal-700 dark:text-teal-400">
                  <span>TOTAL PAID CASH:</span>
                  <span>$ {activeReceipt.amount} USD</span>
                </div>

                <div className="text-center font-bold text-green-600 dark:text-green-400 text-sm tracking-widest mt-1">
                  *** PAID & CLEARED ***
                </div>
              </div>

              <div className="flex pt-3 border-t dark:border-slate-700 mt-1">
                <button
                  type="button"
                  onClick={() => setActiveReceipt(null)}
                  className="w-full border py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Close Receipt View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
