'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { Calendar, Plus, Mail, MessageSquare, Send } from 'lucide-react';

export default function AppointmentsManager() {
  const { db, createAppointment, maskText, showToast } = useClinic();
  const [showBookModal, setShowBookModal] = useState(false);
  const [activeAlertApt, setActiveAlertApt] = useState(null);
  const [alertMethod, setActiveAlertMethod] = useState('sms');

  // Form states
  const [patId, setPatId] = useState('');
  const [date, setDate] = useState('2026-06-12');
  const [time, setTime] = useState('10:00');
  const [doctor, setDoctor] = useState('Dr. Abdirahman Omar');

  const handleOpenAlertModal = (apt, method) => {
    setActiveAlertApt(apt);
    setActiveAlertMethod(method);
  };

  const handleDispatchMockAlert = () => {
    if (!activeAlertApt) return;
    showToast(`Simulated ${alertMethod.toUpperCase()} dispatch sent successfully!`, 'success');
    setActiveAlertApt(null);
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const patient = db.patients.find(p => p.id === patId);
    if (!patient) {
      alert("Invalid Patient selection.");
      return;
    }

    createAppointment({
      patientId: patId,
      patientName: patient.name,
      date,
      time,
      doctor
    });
    setShowBookModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header controls */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold">Appointment Schedulers</h2>
          <p className="text-sm text-slate-500 mt-1">Configure clinical patient visits, dispatch SMS reminders, or WhatsApp notifications.</p>
        </div>
        <button
          onClick={() => { setPatId(db.patients[0]?.id || ''); setShowBookModal(true); }}
          className="btn btn-primary bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Appointment</span>
        </button>
      </div>

      {/* Main Table card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/30 border-b dark:border-slate-700 text-slate-400 font-bold uppercase text-xs">
                <th className="p-4">Patient ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Scheduled Date</th>
                <th className="p-4">Scheduled Time</th>
                <th className="p-4">Assigned Physician</th>
                <th className="p-4">Status</th>
                <th className="p-4">Outbox Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {db.appointments.map(apt => (
                <tr key={apt.id} className="hover:bg-teal-50/20 dark:hover:bg-teal-950/10">
                  <td className="p-4 font-mono text-xs">{apt.patientId}</td>
                  <td className="p-4 font-bold">{maskText(apt.patientName, 12)}</td>
                  <td className="p-4 font-semibold">{apt.date}</td>
                  <td className="p-4">{apt.time}</td>
                  <td className="p-4">{apt.doctor}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                      apt.status === 'Completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' 
                        : (apt.status === 'Waiting' 
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400')
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenAlertModal(apt, 'sms')}
                        className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        title="Simulate SMS booking outbox"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>SMS Alert</span>
                      </button>
                      <button
                        onClick={() => handleOpenAlertModal(apt, 'whatsapp')}
                        className="px-2.5 py-1.5 rounded bg-green-100 hover:bg-green-200 dark:bg-green-950/40 dark:hover:bg-green-950/60 text-green-700 dark:text-green-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        title="Simulate WhatsApp booking notification"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full border dark:border-slate-700 overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-5 border-b dark:border-slate-700 font-bold text-lg flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <Calendar className="w-5 h-5" />
              <span>Schedule New Appointment</span>
            </div>
            <form onSubmit={handleBookSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Select Patient *</label>
                <select
                  required
                  value={patId}
                  onChange={(e) => setPatId(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                >
                  {db.patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Time *</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Assigned Doctor *</label>
                <select
                  required
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                >
                  <option value="Dr. Abdirahman Omar">Dr. Abdirahman Omar (General Medicine)</option>
                  <option value="Dr. Sarah Ahmed">Dr. Sarah Ahmed (Paediatrics)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4 border-t dark:border-slate-700 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-lg text-sm"
                >
                  Book Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="border px-5 py-3 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outbound REST API payload simulator modal */}
      {activeAlertApt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-lg w-full border dark:border-slate-700 overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-5 border-b dark:border-slate-700 font-bold text-lg flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <Send className="w-5 h-5" />
              <span>Simulated Outgoing API Gateway Request</span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <p className="text-sm text-slate-500">This JSON payload represents a secure cloud-bound POST integration dispatch mapping details of the appointment:</p>
              
              <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-lg overflow-x-auto select-all">
                <span className="text-slate-500">{"// HTTP Gateway REST Payload Mapping"}</span>
                <p className="mt-1"><b>METHOD:</b> POST</p>
                <p><b>URL:</b> {alertMethod === 'sms' ? 'https://gateway.shifasms.com/v1/send' : 'https://api.whatsapp.com/v1/messages'}</p>
                <p><b>HEADERS:</b> &#123; &quot;Authorization&quot;: &quot;Bearer key_shifa_secure_v2026&quot; &#125;</p>
                <p className="mt-2"><b>BODY JSON:</b></p>
                <pre className="mt-1 leading-relaxed">
                  {JSON.stringify({
                    recipient: db.patients.find(x => x.id === activeAlertApt.patientId)?.phone || "+252 61 XXX XXX",
                    method: alertMethod,
                    payload: {
                      patientName: activeAlertApt.patientName,
                      scheduledDate: activeAlertApt.date,
                      scheduledTime: activeAlertApt.time,
                      assignedDoctor: activeAlertApt.doctor,
                      messageTemplate: `Salaam ${activeAlertApt.patientName}. Al-Shifa Clinic confirms your consultation booking on ${activeAlertApt.date} at ${activeAlertApt.time} with ${activeAlertApt.doctor}. Shokran.`
                    }
                  }, null, 2)}
                </pre>
              </div>

              <div className="flex gap-2 pt-4 border-t dark:border-slate-700 mt-2">
                <button
                  type="button"
                  onClick={handleDispatchMockAlert}
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-lg text-sm"
                >
                  Confirm Dispatch Transmission
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAlertApt(null)}
                  className="border px-5 py-3 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
