# Al-Shifa Clinic Management System (Next.js Version)

A modern, fast, simple, and mobile-friendly Clinic Management System designed for small to medium-sized medical clinics. Built with **Next.js 14 (App Router)**, React Context, Tailwind CSS, Lucide icons, and fully responsive layouts.

---

## 🏗️ Project Architecture & Components

The application is modularly structured inside the standard Next.js App router environment:

*   **`package.json`**: Package configuration listing modern dependencies (`next`, `react`, `react-dom`, `lucide-react`).
*   **`jsconfig.json`**: Configured custom webpack module aliases (`@/*` maps to `./src/*`) for clean path definitions.
*   **`tailwind.config.js` / `postcss.config.js`**: PostCSS plugins compiling custom utility classes and class-based dark mode toggles.
*   **`src/app/layout.js`**: Main HTML shell and context provider binding.
*   **`src/app/globals.css`**: Global Tailwind imports, variable lists, RTL overrides, and custom print rules.
*   **`src/context/ClinicContext.js`**: Core state machine handling database transactions, local backups, cloud toggles, logging, and security encryption.
*   **`src/components/`**: Modular sub-elements mapping specific role dashboards:
    *   `Header.js`: The top toolbar housing language dropdowns, theme triggers, and inactivity countdowns.
    *   `Sidebar.js`: Adaptive navigation side-drawer rendering role-relevant options.
    *   `ReceptionDashboard.js`: Metric summaries and appointment rosters.
    *   `DoctorDashboard.js`: Medical queues and lab results reviews.
    *   `LaboratoryDashboard.js`: Action forms to input diagnostic numerical fields.
    *   `AppointmentsManager.js`: Outbox schedulers displaying mock API notification payloads.
    *   `InventoryManager.js`: Low-threshold warnings and stock replenish inputs.
    *   `BillingManager.js`: Clearing cash invoices and generating print receipts.
    *   `ReportsManager.js`: Interactive column attendance density and disease horizontal graphs drawn with native SVGs.
    *   `AuditLogsViewer.js`: Non-repudiation security operations logs.
    *   `PatientRecordView.js`: Demographic files, SVG vital charts, and medical timelines.

---

## 👥 Roles & Pre-loaded Seeds

The system includes preloaded mock patient records to ensure directories and metrics display immediately:

1.  **Reception Staff (`reception`)**: Register patients, queue triage visits, book appointments, and clear bill invoices.
2.  **Medical Doctor (`doctor`)**: Review patient files, analyze vital history graphs, write consultation notes, and prescribe medicines.
3.  **Lab Technician (`laboratory`)**: Record results and mark requested tests as completed.

To login, simply choose your role from the gateway card.

---

## 🛠️ Installation & Running Locally

Follow these quick commands to spin up the local development environment:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser to view the live dashboard!

### 3. Build Production Compile
```bash
npm run build
npm start
```
The codebase compiles 100% cleanly with zero errors.
