'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { Package, Plus, AlertTriangle, BatteryCharging } from 'lucide-react';

export default function InventoryManager() {
  const { db, addInventoryItem, addInventoryStock, currentUserRole } = useClinic();
  const [showAddModal, setShowAddModal] = useState(false);
  const [replenishItem, setReplenishItem] = useState(null);
  const [replenishAmt, setReplenishAmt] = useState(100);

  // Form states
  const [drug, setDrug] = useState('');
  const [stock, setStock] = useState(1000);
  const [reorder, setReorder] = useState(200);
  const [unit, setUnit] = useState('tablets');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addInventoryItem({ drug, stock, reorder, unit });
    setShowAddModal(false);
    setDrug('');
  };

  const handleReplenishSubmit = (e) => {
    e.preventDefault();
    if (!replenishItem) return;
    addInventoryStock(replenishItem.id, replenishAmt);
    setReplenishItem(null);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header controls */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold">Pharmacy & Drug Inventory</h2>
          <p className="text-sm text-slate-500 mt-1">Track medications, alert threshold levels, and supply restocking limits.</p>
        </div>
        {currentUserRole === 'reception' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Register New Drug Batch</span>
          </button>
        )}
      </div>

      {/* Grid listing */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/30 border-b dark:border-slate-700 text-slate-400 font-bold uppercase text-xs">
                <th className="p-4">Drug Code</th>
                <th className="p-4">Drug Chemical Name</th>
                <th className="p-4">Available Stock</th>
                <th className="p-4">Reorder Threshold</th>
                <th className="p-4">Status</th>
                {currentUserRole === 'reception' && <th className="p-4">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {db.inventory.map(item => {
                const isLow = item.stock <= item.reorder;
                return (
                  <tr key={item.id} className="hover:bg-teal-50/20 dark:hover:bg-teal-950/10">
                    <td className="p-4 font-mono text-xs font-bold">{item.id}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-100">{item.drug}</td>
                    <td className={`p-4 font-bold text-base ${isLow ? 'text-red-500 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.stock} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-500">{item.reorder} {item.unit}</td>
                    <td className="p-4">
                      {isLow ? (
                        <span className="px-2.5 py-1 rounded bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-bold uppercase flex items-center gap-1.5 w-fit">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Low Stock</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase flex items-center gap-1.5 w-fit">
                          <span>In Stock</span>
                        </span>
                      )}
                    </td>
                    {currentUserRole === 'reception' && (
                      <td className="p-4">
                        <button
                          onClick={() => setReplenishItem(item)}
                          className="px-3 py-1.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs font-bold transition-all"
                        >
                          Replenish Stock
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Drug Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full border dark:border-slate-700 overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-5 border-b dark:border-slate-700 font-bold text-lg flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <Package className="w-5 h-5" />
              <span>Register New Pharmacy Drug Batch</span>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Chemical / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={drug}
                  onChange={(e) => setDrug(e.target.value)}
                  placeholder="e.g. Paracetamol 500mg tablets"
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Measuring Unit *</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                  >
                    <option value="tablets">Tablets</option>
                    <option value="capsules">Capsules</option>
                    <option value="bottles">Bottles</option>
                    <option value="packs">Packs</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Initial Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value))}
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Reorder Alert Level *</label>
                <input
                  type="number"
                  required
                  value={reorder}
                  onChange={(e) => setReorder(parseInt(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t dark:border-slate-700 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-lg text-sm"
                >
                  Register Drug
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="border px-5 py-3 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Replenish Stock Modal */}
      {replenishItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-sm w-full border dark:border-slate-700 overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-5 border-b dark:border-slate-700 font-bold text-lg flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <BatteryCharging className="w-5 h-5" />
              <span>Replenish Stock</span>
            </div>
            <form onSubmit={handleReplenishSubmit} className="p-5 flex flex-col gap-4">
              <div className="text-xs bg-slate-50 dark:bg-slate-700/40 p-3 rounded-lg flex flex-col gap-1">
                <div>Drug: <b>{replenishItem.drug}</b></div>
                <div>Current Stock: <b>{replenishItem.stock} {replenishItem.unit}</b></div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Adding Quantity Count ({replenishItem.unit}) *</label>
                <input
                  type="number"
                  required
                  value={replenishAmt}
                  onChange={(e) => setReplenishAmt(parseInt(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t dark:border-slate-700 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-lg text-sm"
                >
                  Replenish Supply
                </button>
                <button
                  type="button"
                  onClick={() => setReplenishItem(null)}
                  className="border px-5 py-3 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
