import { ClinicProvider } from '@/context/ClinicContext';
import './globals.css';

export const metadata = {
  title: 'Al-Shifa Clinic Management System',
  description: 'A modern, simple, secure, mobile-friendly Clinic Management System.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <ClinicProvider>
          {children}
        </ClinicProvider>
      </body>
    </html>
  );
}
