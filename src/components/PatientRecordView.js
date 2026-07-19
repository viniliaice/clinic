'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { Heart, Plus, Printer, Save, FileText, ChevronLeft, ShieldCheck, HelpCircle } from 'lucide-react';

export default function PatientRecordView({ patientId, onBack }) {
  const { 
    db, currentUserRole, maskText, saveConsultation, updatePatientDemographics, showToast 
  } = useClinic();

  const [showEditDemo, setShowEditDemo] = useState(false);
  const [printDoc, setPrintDoc] = useState(null); // 'card', 'rx', 'lab'

  // Demographics Form states
  const p = db.patients.find(x => x.id === patientId);
  const [demoName, setDemoName] = useState(p?.name || '');
  const [demoGender, setDemoGender] = useState(p?.gender || 'male');
  const [demoDob, setDemoDob] = useState(p?.dob || '');
  const [demoPhone, setDemoPhone] = useState(p?.phone || '');
  const [demoAddress, setDemoAddress] = useState(p?.address || '');
  const [demoEmergency, setDemoEmergency] = useState(p?.emergency || '');

  // Doctor consultation desk forms state
  const patientVisits = db.visits.filter(v => v.patientId === patientId).sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime));
  const activeConsultation = patientVisits.find(v => v.diagnosis === ""); // If a visit exists with blank diagnosis

  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState([{ drug: '', dosage: '', frequency: '', duration: '' }]);
  const [labsChecked, setLabsChecked] = useState([]);

  const handleAddRxRow = () => {
    setPrescriptions(prev => [...prev, { drug: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleRemoveRxRow = (idx) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRxChange = (idx, field, val) => {
    setPrescriptions(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const handleLabCheckChange = (testVal) => {
    setLabsChecked(prev => 
      prev.includes(testVal) ? prev.filter(x => x !== testVal) : [...prev, testVal]
    );
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    const dobDate = new Date(demoDob);
    const age = Math.abs(new Date(Date.now() - dobDate.getTime()).getUTCFullYear() - 1970) || p.age;
    
    updatePatientDemographics(patientId, {
      name: demoName,
      gender: demoGender,
      dob: demoDob,
      age,
      phone: demoPhone,
      address: demoAddress,
      emergency: demoEmergency
    });
    setShowEditDemo(false);
  };

  const handleConsultationSubmit = (e) => {
    e.preventDefault();
    if (!activeConsultation) return;

    const formattedPrescriptions = prescriptions.filter(rx => rx.drug.trim() !== "");
    let labResults = [];
    if (labsChecked.length > 0) {
      labResults = labsChecked.map(testName => {
        let range = "Negative";
        if (testName.includes("Count")) range = "4.0 - 11.0 x10^9/L";
        else if (testName.includes("Sugar")) range = "70 - 100 mg/dL";
        return { testName, value: '', range, technician: '', status: 'pending', date: '' };
      });
    }

    saveConsultation(activeConsultation.visitNo, {
      symptoms,
      diagnosis,
      treatment,
      notes,
      prescriptions: formattedPrescriptions,
      labOrdered: labsChecked.join(', '),
      labResults
    });
  };

  if (!p) return <p className="p-8 text-center text-red-500">Patient records missing.</p>;

  // CUSTOM VECTOR SVG GRAPHICS FOR INTERACTIVE CLINICAL TRENDS
  const renderWeightTrendSVG = () => {
    const visits = db.visits.filter(v => v.patientId === patientId && v.weight > 0).sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime));
    if (visits.length === 0) return <p className="text-center text-xs text-slate-400 py-16">No weight triage recordings found on disk.</p>;

    const padding = 30;
    const w = 300;
    const h = 180;
    const minW = Math.min(...visits.map(v => v.weight)) - 5;
    const maxW = Math.max(...visits.map(v => v.weight)) + 5;
    const diff = (maxW - minW) || 10;

    let points = "";
    let dots = [];

    visits.forEach((v, idx) => {
      const x = padding + (idx / Math.max(visits.length - 1, 1)) * (w - padding * 2);
      const y = h - padding - ((v.weight - minW) / diff) * (h - padding * 2);
      points += `${x},${y} `;
      dots.push({ x, y, val: v.weight, date: v.dateTime.split('T')[0].substring(5) });
    });

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <line x1={padding} y1={padding} x2={w-padding} y2={padding} stroke="#e2e8f0" strokeDasharray="2,2" />
        <line x1={padding} y1={(h-padding)/2} x2={w-padding} y2={(h-padding)/2} stroke="#e2e8f0" strokeDasharray="2,2" />
        <line x1={padding} y1={h-padding} x2={w-padding} y2={h-padding} stroke="#cbd5e1" />
        {visits.length > 1 && <polyline fill="none" stroke="#0f766e" strokeWidth="2" points={points.trim()} />}
        {dots.map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r="4" fill="#0f766e" />
            <text x={d.x} y={d.y - 7} fontSize="8" fontWeight="bold" textAnchor="middle" fill="#475569">{d.val}kg</text>
            <text x={d.x} y={h - 10} fontSize="7" textAnchor="middle" fill="#94a3b8">{d.date}</text>
          </g>
        ))}
      </svg>
    );
  };

  const renderBPTrendSVG = () => {
    const visits = db.visits.filter(v => v.patientId === patientId && v.bp).sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime));
    if (visits.length === 0) return <p className="text-center text-xs text-slate-400 py-16">No hypertension BP triage recordings found.</p>;

    const parsed = visits.map(v => {
      const parts = v.bp.split('/');
      return { sys: parseInt(parts[0]) || 120, dia: parseInt(parts[1]) || 80, date: v.dateTime.split('T')[0].substring(5) };
    });

    const padding = 30;
    const w = 300;
    const h = 180;
    const minVal = 50;
    const maxVal = 180;
    const diff = maxVal - minVal;

    let sysPoints = "";
    let diaPoints = "";
    let dots = [];

    parsed.forEach((v, idx) => {
      const x = padding + (idx / Math.max(parsed.length - 1, 1)) * (w - padding * 2);
      const sysY = h - padding - ((v.sys - minVal) / diff) * (h - padding * 2);
      const diaY = h - padding - ((v.dia - minVal) / diff) * (h - padding * 2);
      
      sysPoints += `${x},${sysY} `;
      diaPoints += `${x},${diaY} `;
      
      dots.push({ x, sysY, diaY, sys: v.sys, dia: v.dia, date: v.date });
    });

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <line x1={padding} y1={padding} x2={w-padding} y2={padding} stroke="#e2e8f0" strokeDasharray="2,2" />
        <line x1={padding} y1={(h-padding)/2} x2={w-padding} y2={(h-padding)/2} stroke="#e2e8f0" strokeDasharray="2,2" />
        <line x1={padding} y1={h-padding} x2={w-padding} y2={h-padding} stroke="#cbd5e1" />
        {parsed.length > 1 && <polyline fill="none" stroke="#ef4444" strokeWidth="2" points={sysPoints.trim()} />}
        {parsed.length > 1 && <polyline fill="none" stroke="#2563eb" strokeWidth="2" points={diaPoints.trim()} />}
        {dots.map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.sysY} r="3" fill="#ef4444" />
            <text x={d.x} y={d.sysY - 6} fontSize="7" fontWeight="bold" textAnchor="middle" fill="#ef4444">{d.sys}</text>
            <circle cx={d.x} cy={d.diaY} r="3" fill="#2563eb" />
            <text x={d.x} y={d.diaY + 10} fontSize="7" fontWeight="bold" textAnchor="middle" fill="#2563eb">{d.dia}</text>
            <text x={d.x} y={h - 10} fontSize="7" textAnchor="middle" fill="#94a3b8">{d.date}</text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Upper navigation header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 shadow-sm no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setPrintDoc('card')}
            className="px-3.5 py-2 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Patient Card</span>
          </button>
        </div>
      </div>

      {/* Main Splits view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Demographics Profile file */}
        <div className="flex flex-col gap-6 no-print">
          <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm p-5 flex flex-col gap-5">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider pb-2 border-b dark:border-slate-700">Demographics File</h3>
            <div className="flex flex-col gap-4 text-sm">
              <div><span className="text-xs text-slate-400 font-semibold block uppercase">Patient ID</span><b className="font-mono text-xs">{p.id}</b></div>
              <div><span className="text-xs text-slate-400 font-semibold block uppercase">Full Name</span><b className="text-slate-800 dark:text-slate-200">{maskText(p.name, 15)}</b></div>
              <div><span className="text-xs text-slate-400 font-semibold block uppercase">Age / Gender</span><span>{p.age} Yrs old / <b className="uppercase">{p.gender}</b></span></div>
              <div><span className="text-xs text-slate-400 font-semibold block uppercase">Phone Number</span><span>{maskText(p.phone, 8)}</span></div>
              <div><span className="text-xs text-slate-400 font-semibold block uppercase">Residence Address</span><span>{maskText(p.address, 15)}</span></div>
              <div><span className="text-xs text-slate-400 font-semibold block uppercase">Emergency contact</span><span>{maskText(p.emergency, 15)}</span></div>
            </div>
            {currentUserRole === 'reception' && (
              <button
                onClick={() => setShowEditDemo(true)}
                className="w-full text-center py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs font-bold transition-all"
              >
                Update Demographics
              </button>
            )}
          </div>

          {/* SVG Weight Line graph */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm p-5">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Vitals Weight history trend</h3>
            <div className="w-full h-44 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg p-2 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
              {renderWeightTrendSVG()}
            </div>
          </div>

          {/* SVG BP Hypertension line graph */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm p-5">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Blood pressure (BP) history trend</h3>
            <div className="w-full h-44 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg p-2 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
              {renderBPTrendSVG()}
            </div>
          </div>
        </div>

        {/* Right chronological clinical treatment timelines */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Doctors active treatment panel */}
          {currentUserRole === 'doctor' && activeConsultation && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-teal-700/70 shadow-lg overflow-hidden animate-in fade-in-50 slide-in-from-top-4 duration-200">
              <div className="bg-teal-50 dark:bg-teal-950/20 p-4 border-b dark:border-slate-700 flex justify-between items-center text-teal-700 dark:text-teal-400">
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-current" />
                  <span>Active Consultation Room (Visit Ref: {activeConsultation.visitNo})</span>
                </h3>
              </div>
              <form onSubmit={handleConsultationSubmit} className="p-5 flex flex-col gap-4">
                
                {/* Vitals overview */}
                <div className="grid grid-cols-5 gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                  <div><span>Weight</span><p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.weight} kg</p></div>
                  <div><span>Height</span><p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.height} cm</p></div>
                  <div><span>BMI</span><p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.bmi} ({activeConsultation.bmiClass})</p></div>
                  <div><span>BP</span><p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.bp}</p></div>
                  <div><span>Temp</span><p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.temp} °C</p></div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Patient Symptoms *</label>
                  <textarea
                    required
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Mild persistent headache, generalized fatigue..."
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none focus:border-teal-700 min-h-[70px] resize-y"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Clinical Diagnosis *</label>
                  <input
                    type="text"
                    required
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Essential Hypertension"
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none focus:border-teal-700"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Treatment Plan & Advices</label>
                  <textarea
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder="Limit salt intake, engage in light exercise..."
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none focus:border-teal-700 min-h-[60px]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Confidential Internal Clinical Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Confidential notes restricted from reception..."
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none focus:border-teal-700 min-h-[60px]"
                  />
                </div>

                {/* Prescription issuing */}
                <div className="border-t dark:border-slate-700 pt-4 mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">Medication Prescriptions</span>
                    <button
                      type="button"
                      onClick={handleAddRxRow}
                      className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold transition-all"
                    >
                      + Add Drug
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {prescriptions.map((rx, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center bg-slate-50/50 dark:bg-slate-800/30 p-2 rounded-lg border dark:border-slate-700/50">
                        <input
                          type="text"
                          placeholder="Drug Name"
                          value={rx.drug}
                          onChange={(e) => handleRxChange(idx, 'drug', e.target.value)}
                          className="bg-white dark:bg-slate-800 p-2 text-xs border dark:border-slate-700 rounded outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Dosage"
                          value={rx.dosage}
                          onChange={(e) => handleRxChange(idx, 'dosage', e.target.value)}
                          className="bg-white dark:bg-slate-800 p-2 text-xs border dark:border-slate-700 rounded outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Frequency"
                          value={rx.frequency}
                          onChange={(e) => handleRxChange(idx, 'frequency', e.target.value)}
                          className="bg-white dark:bg-slate-800 p-2 text-xs border dark:border-slate-700 rounded outline-none"
                        />
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Duration (e.g. 5 days)"
                            value={rx.duration}
                            onChange={(e) => handleRxChange(idx, 'duration', e.target.value)}
                            className="bg-white dark:bg-slate-800 p-2 text-xs border dark:border-slate-700 rounded outline-none flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveRxRow(idx)}
                            className="text-red-500 hover:text-red-700 font-bold p-1"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Laboratory analysis requests */}
                <div className="border-t dark:border-slate-700 pt-4 mt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-3">Order Laboratory diagnostics</span>
                  <div className="flex gap-2 flex-wrap text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {['Malaria Rapid Test', 'Complete Blood Count', 'Blood Sugar Fasting', 'Lipid Profile', 'Urinalysis Routine'].map(test => (
                      <label key={test} className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100/50">
                        <input
                          type="checkbox"
                          checked={labsChecked.includes(test)}
                          onChange={() => handleLabCheckChange(test)}
                        />
                        <span>{test}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t dark:border-slate-700 pt-4 mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-lg text-sm shadow-sm transition-all"
                  >
                    Save Clinical Record & Discharge Patient
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Historical clinical timeline list */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm p-6 no-print">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <FileText className="w-5.5 h-5.5" />
              <span>Medical History Timelines</span>
            </h3>

            {patientVisits.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8">No historical consultation records exist on file.</p>
            ) : (
              <div className="relative pl-6 border-l-2 dark:border-slate-700 flex flex-col gap-8">
                {patientVisits.map(v => (
                  <div key={v.visitNo} className="relative group">
                    <div className="absolute -left-8.5 top-1.5 w-3 h-3 rounded-full bg-teal-700 dark:bg-teal-400 border-2 border-white dark:border-slate-800 group-hover:scale-125 transition-all"></div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-2xs uppercase tracking-wider bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded font-bold text-slate-500">{v.visitNo}</span>
                        <span className="font-bold text-teal-700 dark:text-teal-400">{new Date(v.dateTime).toLocaleString()}</span>
                      </div>
                      
                      <div className="bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border dark:border-slate-700/50 flex flex-col gap-3">
                        <div className="text-xs text-slate-400 font-semibold">Consulted by: <b className="text-slate-700 dark:text-slate-300 font-bold">{v.doctor}</b></div>
                        
                        <div className="grid grid-cols-5 gap-2 text-center text-2xs bg-white dark:bg-slate-800/40 p-2 rounded-lg border dark:border-slate-700/30">
                          <div><span>WT</span><p className="font-bold mt-0.5">{v.weight}kg</p></div>
                          <div><span>HT</span><p className="font-bold mt-0.5">{v.height}cm</p></div>
                          <div><span>BMI</span><p className="font-bold mt-0.5">{v.bmi}</p></div>
                          <div><span>BP</span><p className="font-bold mt-0.5">{v.bp}</p></div>
                          <div><span>TMP</span><p className="font-bold mt-0.5">{v.temp}°C</p></div>
                        </div>

                        {v.symptoms && (
                          <div className="text-xs">
                            <span className="text-2xs font-bold text-slate-400 uppercase">Symptoms</span>
                            <p className="mt-1 text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">{maskText(v.symptoms, 35)}</p>
                          </div>
                        )}

                        {v.diagnosis ? (
                          <div className="text-xs">
                            <span className="text-2xs font-bold text-slate-400 uppercase">Diagnosis</span>
                            <p className="mt-1 text-teal-700 dark:text-teal-400 font-bold leading-relaxed">{maskText(v.diagnosis, 25)}</p>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 text-2xs font-bold uppercase w-fit">Awaiting Consultation room</span>
                        )}

                        {v.treatment && (
                          <div className="text-xs">
                            <span className="text-2xs font-bold text-slate-400 uppercase">Treatment advice</span>
                            <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">{maskText(v.treatment, 35)}</p>
                          </div>
                        )}

                        {v.notes && currentUserRole !== 'reception' && (
                          <div className="text-xs border-l-2 dark:border-slate-700 pl-3 italic">
                            <span className="text-2xs font-bold text-slate-400 uppercase block">Internal Doctor notes</span>
                            <p className="mt-1 text-slate-500 leading-relaxed">{maskText(v.notes, 25)}</p>
                          </div>
                        )}

                        {/* Prescriptions */}
                        {v.prescriptions && v.prescriptions.length > 0 && (
                          <div className="border-t dark:border-slate-700/50 pt-3 mt-1 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <span className="text-2xs font-bold text-teal-700 dark:text-teal-400 uppercase">Medications Issued</span>
                              <button
                                onClick={() => setPrintDoc({ type: 'rx', visitNo: v.visitNo })}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 rounded text-2xs font-bold transition-all"
                              >
                                Print prescription
                              </button>
                            </div>
                            <ul className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 list-disc pl-4 flex flex-col gap-1">
                              {v.prescriptions.map((rx, idx) => (
                                <li key={idx}><b>{maskText(rx.drug, 12)}</b> - {rx.dosage} ({rx.frequency}) for {rx.duration}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Lab Results */}
                        {v.labResults && v.labResults.length > 0 && (
                          <div className="border-t dark:border-slate-700/50 pt-3 mt-1 flex flex-col gap-2 bg-teal-50/10 dark:bg-teal-950/5 p-3 rounded-lg border dark:border-slate-700/30">
                            <div className="flex justify-between items-center">
                              <span className="text-2xs font-bold text-teal-700 dark:text-teal-400 uppercase">Laboratory Diagnostics</span>
                              {v.labResults.every(r => r.status === 'completed') && (
                                <button
                                  onClick={() => setPrintDoc({ type: 'lab', visitNo: v.visitNo })}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 rounded text-2xs font-bold transition-all"
                                >
                                  Print Lab Report
                                </button>
                              )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                              {v.labResults.map((r, idx) => (
                                <div key={idx} className="flex justify-between text-xs pb-1 border-b border-dashed dark:border-slate-700/50 last:border-b-0">
                                  <span className="font-semibold">{r.testName}</span>
                                  <span>
                                    {r.status === 'completed' ? (
                                      <><span className="text-teal-700 dark:text-teal-400 font-bold">{maskText(r.value, 6)}</span> <span className="text-2xs text-slate-400 font-semibold">({r.range})</span></>
                                    ) : (
                                      <span className="text-amber-600 text-2xs font-bold uppercase tracking-wider">Pending</span>
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Edit Demographics Modal */}
      {showEditDemo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full border dark:border-slate-700 overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-5 border-b dark:border-slate-700 font-bold text-lg text-teal-700 dark:text-teal-400">
              <span>Update Patient Demographics</span>
            </div>
            <form onSubmit={handleDemoSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name *</label>
                <input
                  type="text"
                  required
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Gender *</label>
                  <select
                    value={demoGender}
                    onChange={(e) => setDemoGender(e.target.value)}
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
                    value={demoDob}
                    onChange={(e) => setDemoDob(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={demoPhone}
                  onChange={(e) => setDemoPhone(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Residence Address *</label>
                <input
                  type="text"
                  required
                  value={demoAddress}
                  onChange={(e) => setDemoAddress(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Emergency Contact *</label>
                <input
                  type="text"
                  required
                  value={demoEmergency}
                  onChange={(e) => setDemoEmergency(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700/40 text-sm p-3 border dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t dark:border-slate-700 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold p-3 rounded-lg text-sm"
                >
                  Save Demographics
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditDemo(false)}
                  className="border px-5 py-3 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printing sheets modal */}
      {printDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-lg w-full border dark:border-slate-700 overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-5 border-b dark:border-slate-700 font-bold text-lg flex justify-between items-center text-teal-700 dark:text-teal-400">
              <span className="flex items-center gap-2">
                <Printer className="w-5 h-5" />
                <span>Medical document preview</span>
              </span>
              <button onClick={() => window.print()} className="p-2 border dark:border-slate-700 rounded-lg hover:bg-slate-50">
                <Printer className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[500px]">
              {printDoc === 'card' && (
                <div className="border-2 border-dashed border-slate-400 p-6 max-w-sm mx-auto rounded-lg bg-white text-slate-900 font-mono text-xs flex flex-col gap-4 shadow-sm">
                  <div className="text-center border-b border-dashed border-slate-400 pb-3 flex flex-col gap-1">
                    <h4 className="font-extrabold text-sm">AL-SHIFA MEDICAL CLINIC</h4>
                    <p className="text-2xs text-slate-500">Maka Al-Mukarama Street, Mogadishu</p>
                    <p className="text-2xs text-slate-500 font-bold">PATIENT ID CARD</p>
                  </div>
                  <div className="text-center py-4 bg-slate-50 rounded-lg border">
                    <span className="border-2 border-slate-900 px-3 py-1 text-sm font-extrabold font-mono rounded">{p.id}</span>
                    <h3 className="font-extrabold text-sm text-slate-800 mt-3">{p.name}</h3>
                  </div>
                  <div className="flex flex-col gap-1.5 border-t border-dashed border-slate-400 pt-3 text-2xs">
                    <div className="flex justify-between"><span>Gender:</span><b className="uppercase">{p.gender}</b></div>
                    <div className="flex justify-between"><span>Date of birth:</span><b>{p.dob}</b></div>
                    <div className="flex justify-between"><span>Phone number:</span><b>{p.phone}</b></div>
                    <div className="flex justify-between"><span>Emergency:</span><b>{p.emergency.split('(')[0]}</b></div>
                  </div>
                </div>
              )}

              {printDoc.type === 'rx' && (() => {
                const v = db.visits.find(x => x.visitNo === printDoc.visitNo);
                return (
                  <div className="border-2 border-dashed border-slate-400 p-6 rounded-lg bg-white text-slate-900 font-mono text-xs flex flex-col gap-4 shadow-sm">
                    <div className="text-center border-b border-dashed border-slate-400 pb-3 flex flex-col gap-1">
                      <h4 className="font-extrabold text-sm">AL-SHIFA CLINIC PRESCRIPTION SHEET</h4>
                      <p className="text-2xs text-slate-500">Maka Al-Mukarama Street, Mogadishu</p>
                      <p className="text-2xs text-slate-500">Physician: {v?.doctor}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 border-b border-dashed border-slate-400 pb-3 text-2xs">
                      <div className="flex justify-between"><span>Patient Name:</span><b>{p.name}</b></div>
                      <div className="flex justify-between"><span>Age / Gender:</span><b>{p.age} Yrs / {p.gender.toUpperCase()}</b></div>
                      <div className="flex justify-between"><span>Date Prescribed:</span><b>{v?.dateTime.split('T')[0]}</b></div>
                      <div className="flex justify-between"><span>Visit Ref No:</span><b>{v?.visitNo}</b></div>
                    </div>
                    <div className="py-2">
                      <span className="font-extrabold text-sm block mb-2">Rx:</span>
                      <ol className="list-decimal pl-4 flex flex-col gap-2 leading-relaxed">
                        {v?.prescriptions.map((rx, idx) => (
                          <li key={idx}><b>{rx.drug}</b> - {rx.dosage} ({rx.frequency}) for {rx.duration}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="border-t border-dashed border-slate-400 pt-5 mt-6 flex justify-between text-2xs">
                      <div>
                        <span>Diagnosis:</span>
                        <p className="font-bold">{v?.diagnosis}</p>
                      </div>
                      <div className="text-center border-t border-slate-900 w-36 pt-1 mt-3">
                        Authorized Physician
                      </div>
                    </div>
                  </div>
                );
              })()}

              {printDoc.type === 'lab' && (() => {
                const v = db.visits.find(x => x.visitNo === printDoc.visitNo);
                return (
                  <div className="border-2 border-dashed border-slate-400 p-6 rounded-lg bg-white text-slate-900 font-mono text-xs flex flex-col gap-4 shadow-sm">
                    <div className="text-center border-b border-dashed border-slate-400 pb-3 flex flex-col gap-1">
                      <h4 className="font-extrabold text-sm">AL-SHIFA CLINICAL PATHOLOGY LAB</h4>
                      <p className="text-2xs text-slate-500">Maka Al-Mukarama Street, Mogadishu</p>
                      <p className="text-2xs text-slate-500">Authorized: Khadra Yusuf (Lab Tech)</p>
                    </div>
                    <div className="flex flex-col gap-1.5 border-b border-dashed border-slate-400 pb-3 text-2xs">
                      <div className="flex justify-between"><span>Patient Name:</span><b>{p.name}</b></div>
                      <div className="flex justify-between"><span>Patient ID:</span><b>{p.id}</b></div>
                      <div className="flex justify-between"><span>Requesting Physician:</span><b>{v?.doctor}</b></div>
                      <div className="flex justify-between"><span>Reporting Date:</span><b>{v?.labResults[0]?.date}</b></div>
                    </div>
                    <table className="w-full text-left border-collapse text-2xs mt-2">
                      <thead>
                        <tr className="border-b border-slate-950 font-bold">
                          <th className="py-2">Test Parameter</th>
                          <th className="py-2">Result Value</th>
                          <th className="py-2">Reference Normal Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dashed">
                        {v?.labResults.map((res, idx) => (
                          <tr key={idx}>
                            <td className="py-2 font-bold">{res.testName}</td>
                            <td className="py-2 font-bold">{res.value}</td>
                            <td className="py-2 text-slate-500">{res.range}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="border-t border-dashed border-slate-400 pt-5 mt-6 flex justify-between text-2xs">
                      <div>
                        <span>Verification Ref:</span>
                        <p className="font-bold">LAB-VER-{v?.visitNo}</p>
                      </div>
                      <div className="text-center border-t border-slate-900 w-36 pt-1 mt-3">
                        Pathologist stamp
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex pt-4 border-t dark:border-slate-700 mt-4">
                <button
                  type="button"
                  onClick={() => setPrintDoc(null)}
                  className="w-full border py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Close Document Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
