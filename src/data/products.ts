import type { LucideIcon } from 'lucide-react';
import { GraduationCap, Smile, Stethoscope, Users } from 'lucide-react';
import type { Faq } from './services';

export type Product = {
  slug: string;
  name: string;
  icon: LucideIcon;
  label: string;
  summary: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  audience: string;
  modules: { title: string; body: string }[];
  implementation: string[];
  faqs: Faq[];
  /** v3 spec: products stay noindex until ownership, support and deployments are verified. */
  indexable: boolean;
};

const implementation = [
  'Walkthrough of your current process and paperwork',
  'Configuration of roles, terminology and document templates',
  'Data import from spreadsheets or the previous system',
  'Staff training and a supervised go-live period',
  'Ongoing support and updates under a written agreement',
];

export const products: Product[] = [
  {
    slug: 'school-management-software',
    name: 'School Management Software',
    icon: GraduationCap,
    label: 'Education',
    summary:
      'Enrolment, attendance, fee receipts, examination report cards and parent notifications in one system.',
    title: 'School Management Software Nepal | Hiver Technology',
    description:
      'School management software for Nepal: enrolment, attendance, fees, examinations, report cards and parent communication in one workflow.',
    h1: 'School operations in one clearer workflow.',
    intro:
      'Administrative work in schools is repetitive and deadline-driven. This platform brings admissions, attendance, fees and results into one place so staff spend less time reconciling registers.',
    audience: 'Private schools and colleges in Nepal',
    modules: [
      { title: 'Admissions & enrolment', body: 'Student records, guardians, classes and sections with historical data kept intact.' },
      { title: 'Attendance', body: 'Daily attendance by class or period with summaries for teachers and administrators.' },
      { title: 'Fees & receipts', body: 'Fee structures, discounts, dues tracking and printable or digital receipts.' },
      { title: 'Examinations', body: 'Marks entry, grading rules and report-card generation per term.' },
      { title: 'Parent notifications', body: 'Notices, results and fee reminders sent to guardians.' },
      { title: 'Roles & permissions', body: 'Separate access for administrators, accountants and teaching staff.' },
    ],
    implementation,
    faqs: [
      {
        q: 'Can it follow our grading and fee structure?',
        a: 'Grading rules, fee heads and discounts are configured per school during onboarding. Requirements outside the configuration are scoped as custom work.',
      },
      {
        q: 'Where is the data hosted?',
        a: 'Hosting options and data-handling terms are agreed in writing before go-live. Ask for the current hosting and backup specification during your walkthrough.',
      },
    ],
    indexable: false,
  },
  {
    slug: 'clinic-management-software',
    name: 'Clinic Management Software',
    icon: Stethoscope,
    label: 'Healthcare',
    summary:
      'Patient records, appointment scheduling, prescriptions, inventory and digital invoicing for outpatient clinics.',
    title: 'Clinic Management Software | Hiver Technology',
    description:
      'Clinic management software for patient records, appointments, prescriptions, inventory and billing, configured for outpatient clinics.',
    h1: 'A clearer operating system for clinic workflows.',
    intro:
      'Front desks, practitioners and pharmacy staff all touch the same patient journey. Keeping that journey in one system reduces double entry and makes records easier to find.',
    audience: 'Outpatient clinics and polyclinics',
    modules: [
      { title: 'Patient records', body: 'Demographics, visit history and clinical notes with role-based access.' },
      { title: 'Appointments', body: 'Practitioner calendars, walk-ins and reminders.' },
      { title: 'Prescriptions', body: 'Structured prescriptions linked to the visit record.' },
      { title: 'Inventory', body: 'Medicine and consumable stock with low-stock alerts and expiry tracking.' },
      { title: 'Billing', body: 'Invoices, payments and daily cash summaries.' },
      { title: 'Reports', body: 'Visit, revenue and stock reports for clinic management.' },
    ],
    implementation,
    faqs: [
      {
        q: 'How is patient data protected?',
        a: 'Access is role-based and every deployment includes encrypted transport and scheduled backups. Data-handling terms are documented and agreed before go-live.',
      },
    ],
    indexable: false,
  },
  {
    slug: 'dental-management-software',
    name: 'Dental Management Software',
    icon: Smile,
    label: 'Healthcare',
    summary:
      'Dental charts, treatment plans, appointments, lab work tracking and invoicing for dental practices.',
    title: 'Dental Management Software | Hiver Technology',
    description:
      'Dental management software for treatment plans, dental charting, appointments, lab orders and invoicing in one practice workflow.',
    h1: 'Dental practice workflows, made clearer.',
    intro:
      'Dental care runs over multiple visits. Treatment plans, chair time and lab work need to stay connected so nothing falls between appointments.',
    audience: 'Dental clinics and multi-chair practices',
    modules: [
      { title: 'Dental charting', body: 'Tooth-level history and findings recorded per visit.' },
      { title: 'Treatment plans', body: 'Multi-stage plans with cost estimates and progress tracking.' },
      { title: 'Chair scheduling', body: 'Appointments by practitioner and chair with reminders.' },
      { title: 'Lab orders', body: 'Track crowns, dentures and other lab work from order to fitting.' },
      { title: 'Billing', body: 'Invoices and instalment tracking tied to treatment stages.' },
      { title: 'Inventory', body: 'Consumables and materials with reorder alerts.' },
    ],
    implementation,
    faqs: [
      {
        q: 'Is this separate from the clinic product?',
        a: 'It shares the same foundation but adds dental-specific charting, treatment plans and lab tracking.',
      },
    ],
    indexable: false,
  },
  {
    slug: 'hr-software',
    name: 'HR & Payroll Software',
    icon: Users,
    label: 'Operations',
    summary:
      'Attendance sync, leave management and payroll calculation configured for Nepal labour and tax rules.',
    title: 'HR Software Nepal | Hiver Technology',
    description:
      'HR and payroll software for Nepal: employee records, biometric attendance sync, leave management and payroll configured to local rules.',
    h1: 'A clearer workflow for people operations.',
    intro:
      'Payroll errors and leave disputes usually start with attendance data that lives in too many places. This platform connects attendance, leave and payroll so month-end is predictable.',
    audience: 'Small and mid-sized organizations in Nepal',
    modules: [
      { title: 'Employee records', body: 'Personal, contract and position details with document storage.' },
      { title: 'Attendance', body: 'Import or sync from supported biometric devices, with manual corrections logged.' },
      { title: 'Leave', body: 'Leave types, balances, approvals and holiday calendars.' },
      { title: 'Payroll', body: 'Salary structures, allowances, deductions and tax calculation per current Nepal rules.' },
      { title: 'Payslips', body: 'Monthly payslips and summaries for finance.' },
      { title: 'Self-service', body: 'Employees view balances, payslips and submit requests.' },
    ],
    implementation,
    faqs: [
      {
        q: 'Which biometric devices are supported?',
        a: 'Device compatibility depends on the model and its export options. Share your device details during the walkthrough and we will confirm before you commit.',
      },
      {
        q: 'Who keeps tax rules up to date?',
        a: 'Rule updates are part of the support agreement. Payroll output should still be reviewed by your finance team or auditor.',
      },
    ],
    indexable: false,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
