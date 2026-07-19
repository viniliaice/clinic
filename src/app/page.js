'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

// Dashboard / Views
import ReceptionDashboard from '@/components/ReceptionDashboard';
import DoctorDashboard from '@/components/DoctorDashboard';
import LaboratoryDashboard from '@/components/LaboratoryDashboard';
import AppointmentsManager from '@/components/AppointmentsManager';
import InventoryManager from '@/components/InventoryManager';
import BillingManager from '@/components/BillingManager';
import ReportsManager from '@/components/ReportsManager';
import AuditLogsViewer from '@/components/AuditLogsViewer';

// Other screens
import PatientRecordView from '@/components/PatientRecordView';

// Lucide Icons
import { Heart, Search, UserPlus, Users, KeySquare } from 'lucide-react';

export default function HomePage() {
  const { 
    currentUserRole, login, currentLanguage, changeLanguage, currentTab, setCurrentTab,
    db, registerPatient, queueVisit, activePatientId, setActivePatientId, toasts, maskText 
  } = useClinic();

  // Registration Form state
  const [regName, setRegName] = useState('');
  const [regGender, setRegGender] = useState('male');
  const [regDob, setRegDob] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regEmergency, setRegEmergency] = useState('');

  // Triage queue state for search page
  const [triagingPatient, setTriagingPatient] = useState(null);
  const [triDoctor, setTriDoctor] = useState('Dr. Abdirahman Omar');
  const [triWeight, setTriWeight] = useState('');
  const [triHeight, setTriHeight] = useState('');
  const [triBp, setTriBp] = useState('120/80');
  const [triTemp, setTriTemp] = useState('36.5');

  // Search input state
  const [query, setQuery] = useState('');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const dobDate = new Date(regDob);
    const age = Math.abs(new Date(Date.now() - dobDate.getTime()).getUTCFullYear() - 1970) || 0;

    const newId = registerPatient({
      name: regName,
      gender: regGender,
      dob: regDob,
      age,
      phone: regPhone,
      address: regAddress,
      emergency: regEmergency
    });

    // Reset Form
    setRegName('');
    setRegDob('');
    setRegPhone('');
    setRegAddress('');
    setRegEmergency('');
    
    // Open newly registered patient records right away
    setActivePatientId(newId);
    setCurrentTab('search');
  };

  const handleTriageSubmit = (e) => {
    e.preventDefault();
    if (!triagingPatient) return;

    const w = parseFloat(triWeight);
    const h = parseFloat(triHeight);
    const bmiVal = (w / ((h / 100) * (h / 100))).toFixed(1);
    
    let bmiClass = "Normal";
    if (bmiVal < 18.5) bmiClass = "Underweight";
    else if (bmiVal >= 25 && bmiVal < 30) bmiClass = "Overweight";
    else if (bmiVal >= 30) bmiClass = "Obese";

    queueVisit({
      patientId: triagingPatient.id,
      patientName: triagingPatient.name,
      dateTime: new Date().toISOString().substring(0, 16),
      doctor: triDoctor,
      weight: w,
      height: h,
      bmi: parseFloat(bmiVal),
      bmiClass,
      bp: triBp,
      temp: parseFloat(triTemp),
      symptoms: '',
      diagnosis: '',
      treatment: '',
      notes: '',
      prescriptions: [],
      labOrdered: '',
      labResults: []
    });

    setTriagingPatient(null);
    setTriWeight('');
    setTriHeight('');
  };

  // Global Search filters
  const filteredPatients = db.patients.filter(p => {
    const q = query.toLowerCase().trim();
    if (q === '') return true;

    const matchDemo = p.id.toLowerCase().includes(q) ||
                      p.name.toLowerCase().includes(q) ||
                      p.phone.includes(q);
    if (matchDemo) return true;

    const visits = db.visits.filter(v => v.patientId === p.id);
    return visits.some(v => 
      v.diagnosis.toLowerCase().includes(q) ||
      v.symptoms.toLowerCase().includes(q) ||
      v.labOrdered.toLowerCase().includes(q) ||
      v.prescriptions.some(rx => rx.drug.toLowerCase().includes(q))
    );
  });

  // Render correct body content based on selected sidebar Tab
  const renderTabContent = () => {
    if (activePatientId) {
      return <PatientRecordView patientId={activePatientId} onBack={() => setActivePatientId(null)} />;
    }

    switch (currentTab) {
      case 'dashboard':
        if (currentUserRole === 'reception') return <ReceptionDashboard />;
        if (currentUserRole === 'doctor') return <DoctorDashboard />;
        if (currentUserRole === 'laboratory') return <LaboratoryDashboard />;
        return null;

      case 'register':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm p-6 max-w-3xl">
            <h2 className="text-xl font-bold border-b dark:border-slate-700 pb-3 flex items-center gap-2 text-teal-700 dark:text-teal-400 mb-6">
              <UserPlus className="w-5.5 h-5.5" />
              <span>Register Patient File</span>
            </h2>
            <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Halima Farah"
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Gender *</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={regDob}
                    onChange={(e) => setRegDob(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+252 61 555 1234"
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Residence Address *</label>
                <input
                  type="text"
                  required
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Mogadishu, Somalia"
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Emergency Contact Name, Relation & Tel *</label>
                <input
                  type="text"
                  required
                  value={regEmergency}
                  onChange={(e) => setRegEmergency(e.target.value)}
                  placeholder="Hussein Farah (Father - +252 61 555 6789)"
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="md:col-span-2 pt-4 border-t dark:border-slate-700 mt-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-lg text-sm shadow-sm transition-all flex-1"
                >
                  Save and Register Patient File
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('dashboard')}
                  className="border px-6 py-3 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        );

      case 'search':
        return (
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm p-5">
              <h2 className="text-xl font-bold border-b dark:border-slate-700 pb-3 flex items-center gap-2 text-teal-700 dark:text-teal-400 mb-5">
                <Search className="w-5.5 h-5.5" />
                <span>Search Patient Records Directory</span>
              </h2>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Instant search by Patient ID, Name, phone, diagnosis, drug, or lab test..."
                className="bg-slate-50 dark:bg-slate-700/40 text-base p-4 border dark:border-slate-700 rounded-xl outline-none focus:border-teal-700 w-full"
              />
            </div>

            <div className="flex flex-col gap-3">
              {filteredPatients.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-8 text-center text-slate-500 border dark:border-slate-700 rounded-xl">
                  No matching clinical patient logs found. Try another query or register a new chart file.
                </div>
              ) : (
                filteredPatients.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setActivePatientId(p.id)}
                    className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 shadow-sm hover:border-teal-700/70 hover:shadow transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-2xs uppercase tracking-wider font-mono font-bold text-slate-500">{p.id}</span>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">{maskText(p.name, 15)}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Gender: <b className="uppercase">{p.gender}</b> | Age: <b>{p.age} Yrs</b> | Tel: <b>{maskText(p.phone, 8)}</b></p>
                    </div>
                    {currentUserRole === 'reception' && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setTriagingPatient(p); }}
                          className="px-3.5 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-all"
                        >
                          Book consultation triage
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'appointments':
        return <AppointmentsManager />;

      case 'billing':
        return <BillingManager />;

      case 'inventory':
        return <InventoryManager />;

      case 'reports':
        return <ReportsManager />;

      case 'audit':
        return <AuditLogsViewer />;

      default:
        return null;
    }
  };

  // Secure Role Gateway landing if no role is logged
  if (currentUserRole === 'none') {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
          <div className="bg-teal-700 p-8 text-center text-white flex flex-col items-center gap-3">
            <div className="bg-white/10 p-3.5 rounded-full backdrop-blur-sm">
              <Heart className="w-10 h-10 fill-current" />
            </div>
            <h1 className="text-2xl font-bold">Al-Shifa Clinic</h1>
            <p className="text-xs opacity-80 uppercase tracking-widest font-semibold">Modern Clinic Management System</p>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border dark:border-slate-700/50">
              <span className="text-xs font-bold text-slate-400 uppercase">System Language</span>
              <select
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-sm font-semibold outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <option value="en" className="bg-white dark:bg-slate-800">English (EN)</option>
                <option value="ar" className="bg-white dark:bg-slate-800">العربية (Arabic)</option>
                <option value="so" className="bg-white dark:bg-slate-800">Somali (SO)</option>
              </select>
            </div>
            
            <p className="text-xs font-bold text-slate-400 uppercase text-center mt-1">Select credential account login</p>
            
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => login('reception')}
                className="flex items-center gap-4 p-4 rounded-xl border dark:border-slate-700 text-left hover:border-teal-700 dark:hover:border-teal-400 hover:bg-teal-50/10 transition-all group"
              >
                <div className="bg-slate-50 dark:bg-slate-700 p-2.5 rounded-lg text-slate-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/40 group-hover:text-teal-700 dark:group-hover:text-teal-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Reception Staff</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Register patients, record vitals triage & manage billing</p>
                </div>
              </button>

              <button
                onClick={() => login('doctor')}
                className="flex items-center gap-4 p-4 rounded-xl border dark:border-slate-700 text-left hover:border-teal-700 dark:hover:border-teal-400 hover:bg-teal-50/10 transition-all group"
              >
                <div className="bg-slate-50 dark:bg-slate-700 p-2.5 rounded-lg text-slate-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/40 group-hover:text-teal-700 dark:group-hover:text-teal-400">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Medical Doctor</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Examine waiting lists, write clinical files & prescriptions</p>
                </div>
              </button>

              <button
                onClick={() => login('laboratory')}
                className="flex items-center gap-4 p-4 rounded-xl border dark:border-slate-700 text-left hover:border-teal-700 dark:hover:border-teal-400 hover:bg-teal-50/10 transition-all group"
              >
                <div className="bg-slate-50 dark:bg-slate-700 p-2.5 rounded-lg text-slate-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/40 group-hover:text-teal-700 dark:group-hover:text-teal-400">
                  <KeySquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Lab Technician</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Analyze clinical requests & sign-off completed diagnostics</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full relative">
      
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content right pane */}
      <div className="flex-1 flex flex-col h-full min-h-screen overflow-y-auto">
        
        {/* Header navigation bar */}
        <Header />

        {/* Workspace body */}
        <main className="p-6 max-w-7xl w-full mx-auto flex-1 pb-16">
          {renderTabContent()}
        </main>
      </div>

      {/* Triage queue visit recording modal */}
      {triagingPatient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full border dark:border-slate-700 overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-5 border-b dark:border-slate-700 font-bold text-lg text-teal-700 dark:text-teal-400 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              <span>Queue Consultation: {maskText(triagingPatient.name, 12)}</span>
            </div>
            <form onSubmit={handleTriageSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Select Physician Doctor *</label>
                <select
                  required
                  value={triDoctor}
                  onChange={(e) => setTriDoctor(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                >
                  <option value="Dr. Abdirahman Omar">Dr. Abdirahman Omar (General Medicine)</option>
                  <option value="Dr. Sarah Ahmed">Dr. Sarah Ahmed (Paediatrics)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={triWeight}
                    onChange={(e) => setTriWeight(e.target.value)}
                    placeholder="kg"
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Height (cm) *</label>
                  <input
                    type="number"
                    required
                    value={triHeight}
                    onChange={(e) => setTriHeight(e.target.value)}
                    placeholder="cm"
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Blood Pressure *</label>
                  <input
                    type="text"
                    required
                    value={triBp}
                    onChange={(e) => setTriBp(e.target.value)}
                    placeholder="120/80"
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Temperature (°C) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={triTemp}
                    onChange={(e) => setTriTemp(e.target.value)}
                    placeholder="°C"
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t dark:border-slate-700 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-lg text-sm"
                >
                  Send to Doctor's Queue
                </button>
                <button
                  type="button"
                  onClick={() => setTriagingPatient(null)}
                  className="border px-5 py-3 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast notification stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none no-print">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`p-4 rounded-xl border shadow-lg flex items-center gap-3 bg-white dark:bg-slate-800 pointer-events-auto border-l-4 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
              t.type === 'success' 
                ? 'border-l-emerald-500 border-slate-200 dark:border-slate-700' 
                : (t.type === 'danger' 
                  ? 'border-l-red-500 border-slate-200 dark:border-slate-700' 
                  : 'border-l-amber-500 border-slate-200 dark:border-slate-700')
            }`}
          >
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{t.message}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
