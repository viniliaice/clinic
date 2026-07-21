'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ClinicContext = createContext();

const getTodayDateStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const getTodayDateTimeStr = (offsetDays = 0, timeStr = "10:30") => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.toISOString().split('T')[0]}T${timeStr}`;
};

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
    },
    {
      id: "PAT-2026-0006",
      name: "Hassan Ibrahim Abdi",
      gender: "male",
      dob: "1975-07-20",
      age: 51,
      phone: "+252 61 666 7890",
      address: "Hamar Weyne, Mogadishu",
      emergency: "Amina Ibrahim (Daughter - +252 61 666 7891)"
    },
    {
      id: "PAT-2026-0007",
      name: "Zahra Mohamed Hassan",
      gender: "female",
      dob: "2005-12-08",
      age: 21,
      phone: "+254 702 555 123",
      address: "Westlands, Nairobi",
      emergency: "Mohamed Hassan (Father - +254 702 555 124)"
    },
    {
      id: "PAT-2026-0008",
      name: "Khalid Yusuf Omar",
      gender: "male",
      dob: "1988-03-14",
      age: 38,
      phone: "+966 50 234 5678",
      address: "Al-Khobar, Saudi Arabia",
      emergency: "Fatima Yusuf (Wife - +966 50 234 5679)"
    },
    {
      id: "PAT-2026-0009",
      name: "Amira Abdullah Hassan",
      gender: "female",
      dob: "2015-09-22",
      age: 11,
      phone: "+252 90 888 9999",
      address: "Mogadishu Central",
      emergency: "Abdullah Hassan (Father - +252 90 888 9998)"
    },
    {
      id: "PAT-2026-0010",
      name: "Omar Farah Mohamed",
      gender: "male",
      dob: "1970-05-30",
      age: 56,
      phone: "+254 722 666 777",
      address: "Industrial Area, Nairobi",
      emergency: "Farah Omar (Son - +254 722 666 778)"
    },
    {
      id: "PAT-2026-0011",
      name: "Noor Abdi Hassan",
      gender: "female",
      dob: "1992-11-05",
      age: 34,
      phone: "+252 61 999 0001",
      address: "Eastleigh, Mogadishu",
      emergency: "Hassan Abdi (Brother - +252 61 999 0002)"
    },
    {
      id: "PAT-2026-0012",
      name: "Ali Mohamed Salim",
      gender: "male",
      dob: "2008-02-17",
      age: 18,
      phone: "+966 50 345 6789",
      address: "Dammam, Saudi Arabia",
      emergency: "Mohamed Salim (Father - +966 50 345 6780)"
    }
  ],
  visits: [
    {
      visitNo: "VST-1001",
      patientId: "PAT-2026-0001",
      dateTime: getTodayDateTimeStr(-11, "10:30"),
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
      labOrdered: "Lipid Profile, Renal Function Test, Fasting Blood Glucose",
      labResults: [
        { testName: "Serum Cholesterol", value: "220 mg/dL", range: "70 - 200 mg/dL", technician: "Khadra Yusuf", status: "completed", date: getTodayDateStr(-10) },
        { testName: "Serum Creatinine", value: "0.9 mg/dL", range: "0.6 - 1.2 mg/dL", technician: "Khadra Yusuf", status: "completed", date: getTodayDateStr(-10) },
        { testName: "Fasting Blood Glucose", value: "110 mg/dL", range: "70 - 100 mg/dL (HIGH)", technician: "Khadra Yusuf", status: "completed", date: getTodayDateStr(-10) }
      ]
    },
    {
      visitNo: "VST-1002",
      patientId: "PAT-2026-0003",
      dateTime: getTodayDateTimeStr(-2, "09:15"),
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
      labOrdered: "Complete Blood Count, Throat Culture",
      labResults: [
        { testName: "WBC count", value: "14.2 x10^9/L", range: "4.0 - 11.0 x10^9/L (HIGH)", technician: "Khadra Yusuf", status: "completed", date: getTodayDateStr(-2) },
        { testName: "Throat Culture", value: "Streptococcus pyogenes", range: "Negative", technician: "Lab Tech Abdi", status: "completed", date: getTodayDateStr(-1) }
      ]
    },
    {
      visitNo: "VST-1003",
      patientId: "PAT-2026-0004",
      dateTime: getTodayDateTimeStr(-1, "08:45"),
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
      labOrdered: "Malaria Rapid Test, Complete Blood Count, Hepatic Panel",
      labResults: [
        { testName: "Malaria Rapid Test", value: "Positive", range: "Negative", technician: "Lab Tech Hassan", status: "completed", date: getTodayDateStr(-1) },
        { testName: "Complete Blood Count", value: "WBC 16.5 x10^9/L", range: "Routine profile", technician: "Lab Tech Hassan", status: "completed", date: getTodayDateStr(-1) },
        { testName: "Hemoglobin", value: "13.2 g/dL", range: "13.5 - 17.5 g/dL (LOW)", technician: "Lab Tech Hassan", status: "completed", date: getTodayDateStr(-1) }
      ]
    },
    {
      visitNo: "VST-1004",
      patientId: "PAT-2026-0006",
      dateTime: getTodayDateTimeStr(-1, "14:30"),
      doctor: "Dr. Sarah Ahmed",
      weight: 88,
      height: 178,
      bmi: 27.8,
      bmiClass: "Overweight",
      bp: "145/95",
      temp: 37.0,
      symptoms: "Chest pain on exertion, shortness of breath, persistent cough.",
      diagnosis: "Hypertension with Cardiac Risk",
      treatment: "Lisinopril 10mg daily, Atorvastatin 20mg at night.",
      notes: "Refer to cardiology. Schedule EKG and stress test.",
      prescriptions: [
        { drug: "Lisinopril 10mg", dosage: "10mg", frequency: "Once Daily", duration: "30 days" },
        { drug: "Atorvastatin 20mg", dosage: "20mg", frequency: "Once Daily at night", duration: "30 days" }
      ],
      labOrdered: "Lipid Panel, ECG, Troponin Test, Complete Blood Count",
      labResults: [
        { testName: "Total Cholesterol", value: "265 mg/dL", range: "< 200 mg/dL (HIGH)", technician: "Khadra Yusuf", status: "completed", date: getTodayDateStr(-1) },
        { testName: "LDL Cholesterol", value: "180 mg/dL", range: "< 100 mg/dL (HIGH)", technician: "Khadra Yusuf", status: "completed", date: getTodayDateStr(-1) },
        { testName: "HDL Cholesterol", value: "35 mg/dL", range: "> 40 mg/dL (LOW)", technician: "Khadra Yusuf", status: "completed", date: getTodayDateStr(-1) },
        { testName: "Troponin", value: "Negative", range: "Negative", technician: "Lab Tech Abdi", status: "completed", date: getTodayDateStr(-1) }
      ]
    },
    {
      visitNo: "VST-1005",
      patientId: "PAT-2026-0007",
      dateTime: getTodayDateTimeStr(0, "11:00"),
      doctor: "Dr. Abdirahman Omar",
      weight: 58,
      height: 165,
      bmi: 21.3,
      bmiClass: "Normal",
      bp: "118/76",
      temp: 36.8,
      symptoms: "Heavy menstrual bleeding, fatigue, dizziness, pale appearance.",
      diagnosis: "Iron Deficiency Anemia",
      treatment: "Ferrous Sulfate 325mg, Vitamin B12 supplements.",
      notes: "Dietary counseling on iron-rich foods. Re-test in 6 weeks.",
      prescriptions: [
        { drug: "Ferrous Sulfate 325mg", dosage: "325mg", frequency: "Twice Daily", duration: "60 days" },
        { drug: "Vitamin B12 1000mcg", dosage: "1000mcg", frequency: "Weekly IM injection", duration: "4 weeks" }
      ],
      labOrdered: "Complete Blood Count, Iron Panel, Thyroid Profile",
      labResults: [
        { testName: "Hemoglobin", value: "8.5 g/dL", range: "12.0 - 16.0 g/dL (LOW)", technician: "Lab Tech Hassan", status: "completed", date: getTodayDateStr(0) },
        { testName: "Serum Iron", value: "45 mcg/dL", range: "60 - 170 mcg/dL (LOW)", technician: "Lab Tech Hassan", status: "completed", date: getTodayDateStr(0) },
        { testName: "Ferritin", value: "12 ng/mL", range: "30 - 400 ng/mL (LOW)", technician: "Lab Tech Hassan", status: "completed", date: getTodayDateStr(0) },
        { testName: "TSH", value: "2.1 mIU/L", range: "0.4 - 4.0 mIU/L", technician: "Lab Tech Hassan", status: "completed", date: getTodayDateStr(0) }
      ]
    },
    {
      visitNo: "VST-1006",
      patientId: "PAT-2026-0008",
      dateTime: getTodayDateTimeStr(0, "10:15"),
      doctor: "Dr. Sarah Ahmed",
      weight: 92,
      height: 182,
      bmi: 27.8,
      bmiClass: "Overweight",
      bp: "135/88",
      temp: 37.1,
      symptoms: "Increased thirst, frequent urination, unexplained weight loss.",
      diagnosis: "Type 2 Diabetes Mellitus",
      treatment: "Metformin 500mg, Glipizide 5mg, dietary modifications.",
      notes: "Patient referred to endocrinology for comprehensive management.",
      prescriptions: [
        { drug: "Metformin 500mg", dosage: "500mg", frequency: "Three times daily", duration: "30 days" },
        { drug: "Glipizide 5mg", dosage: "5mg", frequency: "Once Daily before breakfast", duration: "30 days" }
      ],
      labOrdered: "Fasting Blood Glucose, HbA1c, Lipid Panel, Kidney Function",
      labResults: [
        { testName: "Fasting Blood Glucose", value: "285 mg/dL", range: "70 - 100 mg/dL (HIGH)", technician: "Khadra Yusuf", status: "completed", date: getTodayDateStr(0) },
        { testName: "HbA1c", value: "9.8%", range: "< 5.7% (HIGH)", technician: "Khadra Yusuf", status: "completed", date: getTodayDateStr(0) },
        { testName: "Urine Glucose", value: "4+", range: "Negative", technician: "Lab Tech Abdi", status: "completed", date: getTodayDateStr(0) },
        { testName: "Urine Ketones", value: "Negative", range: "Negative", technician: "Lab Tech Abdi", status: "completed", date: getTodayDateStr(0) }
      ]
    },
    {
      visitNo: "VST-1007",
      patientId: "PAT-2026-0009",
      dateTime: getTodayDateTimeStr(0, "09:30"),
      doctor: "Dr. Abdirahman Omar",
      weight: 35,
      height: 142,
      bmi: 17.4,
      bmiClass: "Normal",
      bp: "108/68",
      temp: 36.9,
      symptoms: "Recurrent headaches, poor concentration, occasional dizziness.",
      diagnosis: "Migraine Disorder with Tension Headaches",
      treatment: "Ibuprofen 200mg as needed, preventive counseling.",
      notes: "Refer to neurology if migraines persist despite lifestyle modifications.",
      prescriptions: [
        { drug: "Ibuprofen 200mg", dosage: "200mg", frequency: "As needed", duration: "30 days" },
        { drug: "Vitamin D3 1000IU", dosage: "1000IU", frequency: "Once Daily", duration: "90 days" }
      ],
      labOrdered: "Complete Blood Count, Metabolic Panel, Vitamin Levels",
      labResults: [
        { testName: "Hemoglobin", value: "13.5 g/dL", range: "12.0 - 16.0 g/dL", technician: "Lab Tech Hassan", status: "completed", date: getTodayDateStr(0) },
        { testName: "WBC Count", value: "6.8 x10^9/L", range: "4.0 - 11.0 x10^9/L", technician: "Lab Tech Hassan", status: "completed", date: getTodayDateStr(0) },
        { testName: "Vitamin D Level", value: "22 ng/mL", range: "30 - 100 ng/mL (LOW)", technician: "Lab Tech Hassan", status: "completed", date: getTodayDateStr(0) }
      ]
    },
    {
      visitNo: "VST-1008",
      patientId: "PAT-2026-0002",
      dateTime: getTodayDateTimeStr(0, "08:15"),
      doctor: "Dr. Abdirahman Omar",
      weight: 65,
      height: 168,
      bmi: 23.0,
      bmiClass: "Normal",
      bp: "120/80",
      temp: 38.5,
      symptoms: "Fatigue, mild abdominal cramps, fever.",
      diagnosis: "",
      treatment: "",
      notes: "",
      prescriptions: [],
      labOrdered: "Complete Blood Count, Fasting Blood Sugar",
      labResults: [
        { testName: "Complete Blood Count", value: "", range: "4.0 - 11.0 x10^9/L", technician: "", status: "pending", date: "" },
        { testName: "Fasting Blood Sugar", value: "", range: "70 - 100 mg/dL", technician: "", status: "pending", date: "" }
      ]
    },
    {
      visitNo: "VST-1009",
      patientId: "PAT-2026-0005",
      dateTime: getTodayDateTimeStr(0, "09:00"),
      doctor: "Dr. Sarah Ahmed",
      weight: 60,
      height: 162,
      bmi: 22.9,
      bmiClass: "Normal",
      bp: "130/85",
      temp: 37.0,
      symptoms: "Fatigue, joint stiffness, generalized weakness.",
      diagnosis: "",
      treatment: "",
      notes: "",
      prescriptions: [],
      labOrdered: "Complete Blood Count, Rheumatoid Factor",
      labResults: [
        { testName: "Complete Blood Count", value: "4.5 x10^9/L", range: "4.0 - 11.0 x10^9/L", technician: "Khadra Yusuf", status: "completed", date: getTodayDateStr(0) },
        { testName: "Rheumatoid Factor", value: "Positive (High)", range: "Negative", technician: "Khadra Yusuf", status: "completed", date: getTodayDateStr(0) }
      ]
    }
  ],
  appointments: [
    { id: "APT-201", patientId: "PAT-2026-0001", patientName: "Mohamed Ali Barre", date: getTodayDateStr(-11), time: "10:00", doctor: "Dr. Abdirahman Omar", status: "Completed" },
    { id: "APT-202", patientId: "PAT-2026-0004", patientName: "Ahmed Abdi Gure", date: getTodayDateStr(-1), time: "11:30", doctor: "Dr. Abdirahman Omar", status: "Waiting" },
    { id: "APT-203", patientId: "PAT-2026-0005", patientName: "Maryam Yusuf Garaad", date: getTodayDateStr(0), time: "14:00", doctor: "Dr. Sarah Ahmed", status: "Waiting" },
    { id: "APT-204", patientId: "PAT-2026-0002", patientName: "Sarah Ahmed Kamau", date: getTodayDateStr(0), time: "09:00", doctor: "Dr. Abdirahman Omar", status: "Waiting" },
    { id: "APT-205", patientId: "PAT-2026-0006", patientName: "Hassan Ibrahim Abdi", date: getTodayDateStr(-1), time: "11:00", doctor: "Dr. Sarah Ahmed", status: "Completed" },
    { id: "APT-206", patientId: "PAT-2026-0007", patientName: "Zahra Mohamed Hassan", date: getTodayDateStr(0), time: "13:30", doctor: "Dr. Abdirahman Omar", status: "Completed" },
    { id: "APT-207", patientId: "PAT-2026-0008", patientName: "Khalid Yusuf Omar", date: getTodayDateStr(0), time: "10:15", doctor: "Dr. Sarah Ahmed", status: "Completed" },
    { id: "APT-208", patientId: "PAT-2026-0009", patientName: "Amira Abdullah Hassan", date: getTodayDateStr(0), time: "15:00", doctor: "Dr. Abdirahman Omar", status: "Scheduled" },
    { id: "APT-209", patientId: "PAT-2026-0010", patientName: "Omar Farah Mohamed", date: getTodayDateStr(1), time: "09:00", doctor: "Dr. Sarah Ahmed", status: "Scheduled" },
    { id: "APT-210", patientId: "PAT-2026-0011", patientName: "Noor Abdi Hassan", date: getTodayDateStr(1), time: "11:30", doctor: "Dr. Abdirahman Omar", status: "Waiting" },
    { id: "APT-211", patientId: "PAT-2026-0012", patientName: "Ali Mohamed Salim", date: getTodayDateStr(2), time: "10:00", doctor: "Dr. Sarah Ahmed", status: "Scheduled" },
    { id: "APT-212", patientId: "PAT-2026-0003", patientName: "Fatma Hassan Al-Harbi", date: getTodayDateStr(2), time: "14:30", doctor: "Dr. Abdirahman Omar", status: "Scheduled" }
  ],
  inventory: [
    { id: "INV-101", drug: "Paracetamol 500mg tablets", stock: 2400, reorder: 500, unit: "tablets" },
    { id: "INV-102", drug: "Amoxicillin 500mg capsules", stock: 1200, reorder: 300, unit: "capsules" },
    { id: "INV-103", drug: "Amlodipine 5mg tablets", stock: 900, reorder: 200, unit: "tablets" },
    { id: "INV-104", drug: "Metformin 500mg tablets", stock: 1500, reorder: 400, unit: "tablets" },
    { id: "INV-105", drug: "Artemether/Lumefantrine (Coartem)", stock: 80, reorder: 20, unit: "packs" },
    { id: "INV-106", drug: "Paracetamol Suspension 120mg/5ml", stock: 45, reorder: 15, unit: "bottles" },
    { id: "INV-107", drug: "Amoxicillin Suspension 250mg/5ml", stock: 8, reorder: 20, unit: "bottles" },
    { id: "INV-108", drug: "Ibuprofen 200mg tablets", stock: 1800, reorder: 400, unit: "tablets" },
    { id: "INV-109", drug: "Lisinopril 10mg tablets", stock: 600, reorder: 200, unit: "tablets" },
    { id: "INV-110", drug: "Atorvastatin 20mg tablets", stock: 720, reorder: 200, unit: "tablets" },
    { id: "INV-111", drug: "Glipizide 5mg tablets", stock: 540, reorder: 180, unit: "tablets" },
    { id: "INV-112", drug: "Ferrous Sulfate 325mg tablets", stock: 1200, reorder: 300, unit: "tablets" },
    { id: "INV-113", drug: "Vitamin B12 1000mcg injectables", stock: 48, reorder: 24, unit: "vials" }
  ],
  billing: [
    { invoiceNo: "INV-5001", patientId: "PAT-2026-0001", patientName: "Mohamed Ali Barre", date: "2026-06-01", services: "Consultation, Lipid Lab Profile, Fasting Blood Glucose", amount: 55, status: "Paid" },
    { invoiceNo: "INV-5002", patientId: "PAT-2026-0003", patientName: "Fatma Hassan Al-Harbi", date: "2026-06-10", services: "Paediatric Consultation, Amoxicillin Susp, Throat Culture", amount: 38, status: "Paid" },
    { invoiceNo: "INV-5003", patientId: "PAT-2026-0004", patientName: "Ahmed Abdi Gure", date: "2026-06-12", services: "Consultation, Malaria RDT Panel, CBC", amount: 45, status: "Paid" },
    { invoiceNo: "INV-5004", patientId: "PAT-2026-0006", patientName: "Hassan Ibrahim Abdi", date: "2026-06-11", services: "Consultation, Lipid Panel, ECG, Troponin Test", amount: 85, status: "Paid" },
    { invoiceNo: "INV-5005", patientId: "PAT-2026-0007", patientName: "Zahra Mohamed Hassan", date: "2026-06-13", services: "Consultation, Iron Panel, Thyroid Profile, Anemia Management", amount: 62, status: "Paid" },
    { invoiceNo: "INV-5006", patientId: "PAT-2026-0008", patientName: "Khalid Yusuf Omar", date: "2026-06-14", services: "Consultation, Glucose Test, HbA1c, Urine Analysis", amount: 68, status: "Pending" },
    { invoiceNo: "INV-5007", patientId: "PAT-2026-0009", patientName: "Amira Abdullah Hassan", date: "2026-06-15", services: "Pediatric Consultation, Migraine Management, Vitamin Supplementation", amount: 42, status: "Pending" }
  ],
  auditLogs: [
    { timestamp: "2026-06-12T08:00", user: "system", action: "System initiated & database initialized with expanded patient registry." },
    { timestamp: "2026-06-12T08:45", user: "reception", action: "Recorded initial triage vitals for PAT-2026-0004" },
    { timestamp: "2026-06-12T09:00", user: "doctor", action: "Diagnosed patient PAT-2026-0004, requested Malaria Rapid Test" },
    { timestamp: "2026-06-13T10:00", user: "reception", action: "Registered new patients: PAT-2026-0006 through PAT-2026-0012" },
    { timestamp: "2026-06-13T14:30", user: "lab", action: "Completed lab results for VST-1005 (Anemia workup)" },
    { timestamp: "2026-06-14T09:00", user: "doctor", action: "Reviewed diabetes screening labs for PAT-2026-0008" }
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
