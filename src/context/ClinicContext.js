'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ClinicContext = createContext();

const DEFAULT_SEED_DATABASE = {
  patients: [
    {
      id: "PAT-2026-0001",
      name: "Mohamed Ali Barre",
      gender: "male",
      dob: "1981-04-12",
      age: 45,
      phone: "+252 61 555 1234",
      address: "Wadada Maka Al-Mukarama, Mogadishu",
      emergency: "Amina Ali (Wife - +252 61 555 5678)"
    },
    {
      id: "PAT-2026-0002",
      name: "Sarah Ahmed Kamau",
      gender: "female",
      dob: "1998-08-22",
      age: 28,
      phone: "+254 712 345 678",
      address: "Hurlingham, Nairobi",
      emergency: "John Kamau (Brother - +254 712 987 654)"
    },
    {
      id: "PAT-2026-0003",
      name: "Fatma Hassan Al-Harbi",
      gender: "female",
      dob: "2020-03-05",
      age: 6,
      phone: "+966 50 123 4567",
      address: "Olaya, Riyadh",
      emergency: "Hassan Al-Harbi (Father - +966 50 765 4321)"
    },
    {
      id: "PAT-2026-0004",
      name: "Ahmed Abdi Gure",
      gender: "male",
      dob: "1991-11-30",
      age: 35,
      phone: "+252 90 777 8888",
      address: "Jigjiga Yar, Hargeisa",
      emergency: "Halima Abdi (Sister - +252 90 777 9999)"
    },
    {
      id: "PAT-2026-0005",
      name: "Maryam Yusuf Garaad",
      gender: "female",
      dob: "1964-01-15",
      age: 62,
      phone: "+252 61 222 3333",
      address: "Bula Hubey, Mogadishu",
      emergency: "Yusuf Farah (Son - +252 61 222 4444)"
    }
  ],
  visits: [
    {
      visitNo: "VST-1001",
      patientId: "PAT-2026-0001",
      dateTime: "2026-06-01T10:30",
      doctor: "Dr. Abdirahman Omar",
      weight: 82,
      height: 175,
      bmi: 26.8,
      bmiClass: "Overweight",
      bp: "140/90",
      temp: 37.2,
      symptoms: "Mild persistent headache, generalized fatigue, intermittent blurred vision.",
      diagnosis: "Essential Hypertension",
      treatment: "Amlodipine 5mg - Take 1 tablet daily in the morning.",
      notes: "Patient is advised to limit salt intake, engage in light aerobic exercise, and return for a follow-up blood pressure check in 2 weeks.",
      prescriptions: [
        { drug: "Amlodipine 5mg", dosage: "5mg", frequency: "Once Daily", duration: "30 days" }
      ],
      labOrdered: "Lipid Profile, Renal Function Test",
      labResults: [
        { testName: "Serum Cholesterol", value: "220 mg/dL", range: "70 - 200 mg/dL", technician: "Khadra Yusuf", status: "completed", date: "2026-06-02" },
        { testName: "Serum Creatinine", value: "0.9 mg/dL", range: "0.6 - 1.2 mg/dL", technician: "Khadra Yusuf", status: "completed", date: "2026-06-02" }
      ]
    },
    {
      visitNo: "VST-1002",
      patientId: "PAT-2026-0003",
      dateTime: "2026-06-10T09:15",
      doctor: "Dr. Sarah Ahmed",
      weight: 20,
      height: 112,
      bmi: 15.9,
      bmiClass: "Normal",
      bp: "95/60",
      temp: 38.9,
      symptoms: "Sudden onset high fever, severe sore throat, painful swallowing, cough.",
      diagnosis: "Acute Tonsillitis",
      treatment: "Amoxicillin Susp 250mg/5ml - Take 5ml every 8 hours for 7 days. Paracetamol Susp 120mg/5ml - Take 7.5ml as needed for fever.",
      notes: "Ensure high hydration. Warm liquids. Return if child experiences respiratory issues or persistent high fever.",
      prescriptions: [
        { drug: "Amoxicillin Susp 250mg/5ml", dosage: "5ml", frequency: "Three times daily", duration: "7 days" },
        { drug: "Paracetamol Susp 120mg/5ml", dosage: "7.5ml", frequency: "As needed (SOS)", duration: "4 days" }
      ],
      labOrdered: "Complete Blood Count",
      labResults: [
        { testName: "WBC count", value: "14.2 x10^9/L", range: "4.0 - 11.0 x10^9/L (HIGH)", technician: "Khadra Yusuf", status: "completed", date: "2026-06-10" }
      ]
    },
    {
      visitNo: "VST-1003",
      patientId: "PAT-2026-0004",
      dateTime: "2026-06-12T08:45",
      doctor: "Dr. Abdirahman Omar",
      weight: 74,
      height: 180,
      bmi: 22.8,
      bmiClass: "Normal",
      bp: "120/80",
      temp: 39.1,
      symptoms: "Chills, intense shivering, high spike fever, joint pain, heavy sweating, severe headache.",
      diagnosis: "Pending Laboratory Confirmation",
      treatment: "Awaiting Rapid Malaria Diagnostic and CBC reports.",
      notes: "Patient isolated temporarily. Hydrating saline administered.",
      prescriptions: [],
      labOrdered: "Malaria Rapid Test, Complete Blood Count",
      labResults: [
        { testName: "Malaria Rapid Test", value: "", range: "Negative", technician: "", status: "pending", date: "" },
        { testName: "Complete Blood Count", value: "", range: "Routine profile", technician: "", status: "pending", date: "" }
      ]
    }
  ],
  appointments: [
    { id: "APT-201", patientId: "PAT-2026-0001", patientName: "Mohamed Ali Barre", date: "2026-06-12", time: "10:00", doctor: "Dr. Abdirahman Omar", status: "Completed" },
    { id: "APT-202", patientId: "PAT-2026-0004", patientName: "Ahmed Abdi Gure", date: "2026-06-12", time: "11:30", doctor: "Dr. Abdirahman Omar", status: "Waiting" },
    { id: "APT-203", patientId: "PAT-2026-0005", patientName: "Maryam Yusuf Garaad", date: "2026-06-12", time: "14:00", doctor: "Dr. Sarah Ahmed", status: "Scheduled" },
    { id: "APT-204", patientId: "PAT-2026-0002", patientName: "Sarah Ahmed Kamau", date: "2026-06-13", time: "09:00", doctor: "Dr. Sarah Ahmed", status: "Scheduled" }
  ],
  inventory: [
    { id: "INV-101", drug: "Paracetamol 500mg tablets", stock: 2400, reorder: 500, unit: "tablets" },
    { id: "INV-102", drug: "Amoxicillin 500mg capsules", stock: 1200, reorder: 300, unit: "capsules" },
    { id: "INV-103", drug: "Amlodipine 5mg tablets", stock: 900, reorder: 200, unit: "tablets" },
    { id: "INV-104", drug: "Metformin 500mg tablets", stock: 1500, reorder: 400, unit: "tablets" },
    { id: "INV-105", drug: "Artemether/Lumefantrine (Coartem)", stock: 80, reorder: 20, unit: "packs" },
    { id: "INV-106", drug: "Paracetamol Suspension 120mg/5ml", stock: 45, reorder: 15, unit: "bottles" },
    { id: "INV-107", drug: "Amoxicillin Suspension 250mg/5ml", stock: 8, reorder: 20, unit: "bottles" }
  ],
  billing: [
    { invoiceNo: "INV-5001", patientId: "PAT-2026-0001", patientName: "Mohamed Ali Barre", date: "2026-06-01", services: "Consultation, Lipid Lab Profile", amount: 45, status: "Paid" },
    { invoiceNo: "INV-5002", patientId: "PAT-2026-0003", patientName: "Fatma Hassan Al-Harbi", date: "2026-06-10", services: "Paediatric Consultation, Amoxicillin Susp", amount: 27, status: "Paid" },
    { invoiceNo: "INV-5003", patientId: "PAT-2026-0004", patientName: "Ahmed Abdi Gure", date: "2026-06-12", services: "Consultation, Malaria RDT Panel", amount: 30, status: "Pending" }
  ],
  auditLogs: [
    { timestamp: "2026-06-12T08:00", user: "system", action: "System initiated & database initialized." },
    { timestamp: "2026-06-12T08:45", user: "reception", action: "Recorded initial triage vitals for PAT-2026-0004" },
    { timestamp: "2026-06-12T09:00", user: "doctor", action: "Diagnosed patient PAT-2026-0004, requested Malaria Rapid Test" }
  ]
};

export function ClinicProvider({ children }) {
  const [currentUserRole, setCurrentUserRole] = useState('none');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [syncPendingCount, setSyncPendingCount] = useState(0);
  const [activePatientId, setActivePatientId] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [db, setDb] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clinic_db_next');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { return DEFAULT_SEED_DATABASE; }
      }
    }
    return DEFAULT_SEED_DATABASE;
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('clinic_theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const saveToDisk = (newDb) => {
    setDb(newDb);
    if (typeof window !== 'undefined') {
      localStorage.setItem('clinic_db_next', JSON.stringify(newDb));
      if (isOffline) {
        setSyncPendingCount(prev => prev + 1);
      }
    }
  };

  const logAction = (actionText, userRole = currentUserRole) => {
    const logEntry = {
      timestamp: new Date().toISOString().substring(0, 16),
      user: userRole || 'system',
      action: actionText
    };
    const updatedLogs = [logEntry, ...db.auditLogs];
    saveToDisk({ ...db, auditLogs: updatedLogs });
  };

  const login = (role) => {
    setCurrentUserRole(role);
    setCurrentTab('dashboard');
    setActivePatientId(null);
    logAction(`User logged in as ${role}`, role);
    showToast(`Welcome! Logged in as ${role}`, 'success');
  };

  const logout = () => {
    logAction(`User logged out from ${currentUserRole}`, currentUserRole);
    setCurrentUserRole('none');
    setActivePatientId(null);
    showToast("Logged out successfully.", "info");
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    if (typeof document !== 'undefined') {
      if (lang === 'ar') {
        document.body.classList.add('rtl');
        document.body.dir = 'rtl';
      } else {
        document.body.classList.remove('rtl');
        document.body.dir = 'ltr';
      }
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('clinic_theme', nextTheme);
      document.documentElement.className = nextTheme;
    }
  };

  const toggleOffline = () => {
    const nextOffline = !isOffline;
    setIsOffline(nextOffline);
    if (!nextOffline && syncPendingCount > 0) {
      showToast(`Re-established cloud link. Syncing ${syncPendingCount} records...`, 'success');
      setSyncPendingCount(0);
    } else {
      showToast(nextOffline ? "Offline Mode Enabled" : "Online Mode Restored", nextOffline ? 'warning' : 'success');
    }
  };

  const toggleEncryption = () => {
    const nextEnc = !isEncrypted;
    setIsEncrypted(nextEnc);
    logAction(`Medical record storage encryption toggled to: ${nextEnc ? 'Active' : 'Bypassed'}`);
    showToast(nextEnc ? "Records encrypted with AES-256 standard" : "Warning: Patient files stored in clear text!", nextEnc ? 'success' : 'danger');
  };

  const registerPatient = (patientData) => {
    const autoId = `PAT-2026-${String(db.patients.length + 1).padStart(4, '0')}`;
    const newPatient = { id: autoId, ...patientData };
    const updatedPatients = [...db.patients, newPatient];
    
    logAction(`Registered brand-new patient chart: ${newPatient.name} (${autoId})`);
    saveToDisk({ ...db, patients: updatedPatients });
    showToast(`Patient registered successfully with ID ${autoId}!`, 'success');
    return autoId;
  };

  const queueVisit = (visitData) => {
    const visitNo = `VST-${db.visits.length + 1001}`;
    const newVisit = { visitNo, ...visitData };
    const updatedVisits = [...db.visits, newVisit];

    const updatedApts = [...db.appointments, {
      id: `APT-${db.appointments.length + 201}`,
      patientId: visitData.patientId,
      patientName: visitData.patientName,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().substring(0, 5),
      doctor: visitData.doctor,
      status: 'Waiting'
    }];

    const bNo = `INV-${db.billing.length + 5001}`;
    const updatedBilling = [...db.billing, {
      invoiceNo: bNo,
      patientId: visitData.patientId,
      patientName: visitData.patientName,
      date: new Date().toISOString().split('T')[0],
      services: "Consultation, Vitals Triage Review",
      amount: 25,
      status: "Pending"
    }];

    logAction(`Recorded triage vitals and queued visit ${visitNo}`);
    saveToDisk({ ...db, visits: updatedVisits, appointments: updatedApts, billing: updatedBilling });
    showToast(`Registered vitals. Patient queued in today's list!`, 'success');
  };

  const saveConsultation = (visitNo, clinicalData) => {
    const updatedVisits = db.visits.map(v => {
      if (v.visitNo === visitNo) {
        // Deduct inventory for prescriptions
        clinicalData.prescriptions.forEach(rx => {
          const invItem = db.inventory.find(inv => inv.drug.toLowerCase().includes(rx.drug.toLowerCase()));
          if (invItem) {
            const days = parseInt(rx.duration) || 5;
            invItem.stock = Math.max(0, invItem.stock - (days * 2));
          }
        });

        // Add billing surcharge
        const bill = db.billing.find(b => b.patientId === v.patientId && b.status === "Pending");
        if (bill) {
          let extra = (clinicalData.prescriptions.length * 10) + (clinicalData.labResults.length * 15);
          bill.amount += extra;
          bill.services += `, Prescribed meds (${clinicalData.prescriptions.length} items)` + (clinicalData.labResults.length > 0 ? `, Labs (${clinicalData.labResults.length} parameters)` : '');
        }

        return { ...v, ...clinicalData };
      }
      return v;
    });

    const vObj = db.visits.find(v => v.visitNo === visitNo);
    const updatedApts = db.appointments.map(a => {
      if (vObj && a.patientId === vObj.patientId && a.status === 'Waiting') {
        return { ...a, status: 'Completed' };
      }
      return a;
    });

    logAction(`Finalized consultation and diagnosed visit ${visitNo}`);
    saveToDisk({ ...db, visits: updatedVisits, appointments: updatedApts });
    showToast(`Medical consultation finalized for visit ${visitNo}`, 'success');
  };

  const updatePatientDemographics = (patientId, updatedData) => {
    const updatedPatients = db.patients.map(p => {
      if (p.id === patientId) {
        return { ...p, ...updatedData };
      }
      return p;
    });
    logAction(`Updated demographics file for ${patientId}`);
    saveToDisk({ ...db, patients: updatedPatients });
    showToast("Patient record updated successfully", "success");
  };

  const enterLabResults = (visitNo, resultsMap) => {
    const updatedVisits = db.visits.map(v => {
      if (v.visitNo === visitNo) {
        const updatedResults = v.labResults.map((test, idx) => {
          if (resultsMap[idx]) {
            return {
              ...test,
              value: resultsMap[idx].value,
              range: resultsMap[idx].range,
              status: 'completed',
              technician: "Khadra Yusuf (Lab Tech)",
              date: new Date().toISOString().split('T')[0]
            };
          }
          return test;
        });
        return { ...v, labResults: updatedResults };
      }
      return v;
    });

    logAction(`Signed-off laboratory diagnostics for ${visitNo}`);
    saveToDisk({ ...db, visits: updatedVisits });
    showToast("Completed lab reports entered and authorized!", "success");
  };

  const addInventoryItem = (itemData) => {
    const autoId = `INV-${db.inventory.length + 101}`;
    const updatedInv = [...db.inventory, { id: autoId, ...itemData }];
    logAction(`Registered new drug batch into pharmacy: ${itemData.drug}`);
    saveToDisk({ ...db, inventory: updatedInv });
    showToast(`Drug added successfully under code ${autoId}!`, 'success');
  };

  const addInventoryStock = (itemId, amount) => {
    const updatedInv = db.inventory.map(item => {
      if (item.id === itemId) {
        return { ...item, stock: item.stock + amount };
      }
      return item;
    });
    logAction(`Replenished stock of drug code ${itemId}`);
    saveToDisk({ ...db, inventory: updatedInv });
    showToast("Inventory stock counts updated successfully!", "success");
  };

  const processPayment = (invoiceNo) => {
    const updatedBilling = db.billing.map(inv => {
      if (inv.invoiceNo === invoiceNo) {
        return { ...inv, status: 'Paid' };
      }
      return inv;
    });
    logAction(`Collected payment cash on Invoice ${invoiceNo}`);
    saveToDisk({ ...db, billing: updatedBilling });
    showToast("Payment receipt cleared. Invoiced status: Paid", "success");
  };

  const createAppointment = (aptData) => {
    const autoId = `APT-${db.appointments.length + 201}`;
    const updatedApts = [...db.appointments, { id: autoId, status: 'Scheduled', ...aptData }];
    logAction(`Scheduled appointment ${autoId} on ${aptData.date} with ${aptData.doctor}`);
    saveToDisk({ ...db, appointments: updatedApts });
    showToast(`Appointment booked under ID ${autoId}`, 'success');
  };

  const maskText = (text, length = 12) => {
    if (isEncrypted) {
      return "U2FsdGVkX1" + btoa(text).substring(0, length) + "...";
    }
    return text;
  };

  return (
    <ClinicContext.Provider value={{
      currentUserRole, currentLanguage, theme, isEncrypted, isOffline, syncPendingCount,
      activePatientId, setActivePatientId, currentTab, setCurrentTab, db, toasts,
      login, logout, changeLanguage, toggleTheme, toggleOffline, toggleEncryption,
      registerPatient, queueVisit, saveConsultation, updatePatientDemographics,
      enterLabResults, addInventoryItem, addInventoryStock, processPayment, createAppointment,
      maskText, showToast
    }}>
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  return useContext(ClinicContext);
}
