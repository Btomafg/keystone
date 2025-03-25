import {
  BarChart,
  BookOpen,
  Bot,
  ClipboardSignature,
  Command,
  FileText,
  LayoutDashboard,
  PieChart,
  Scale,
  Settings2,
  StoreIcon,
  Users,
  Users2Icon,
} from 'lucide-react';
import { APP_ROUTES } from 'src/routes';





export const sidebarData = {

  teams: [
    {
      name: "Accounting Firm",
      logo: <Scale />,
      type: "Accounting Partner",
      key: 'accounting_firm',
    },
    {
      name: "Loan Originator",
      logo: <Command />,
      type: "Loan Originator",
      key: 'loan_originator',
    },
    {
      name: "Tax Credits",
      logo: <ClipboardSignature />,
      type: "Company Tax Credits",
      key: 'company',
    },
    {
      name: "Partner Center",
      logo: <Users2Icon />,
      type: "Partner Center",
      key: 'partner',
    },
  ],

  navMain: {
    'accounting_firm':
      [
        { title: 'Dashboard', url: APP_ROUTES.ACCOUNTING_FIRM_DASHBOARD, icon: LayoutDashboard },
        { title: 'Clients', url: APP_ROUTES.CLIENTS, icon: Users },
        { title: 'Tax Amendments', url: APP_ROUTES.TAX_AMENDMENTS, icon: FileText },
        { title: 'Reports', url: APP_ROUTES.REPORTS, icon: BarChart },
        { title: 'Document Management', url: APP_ROUTES.DOCUMENT_CENTER, icon: BookOpen },
        { title: 'Support', url: APP_ROUTES.SUPPORT, icon: Bot },
        { title: 'FAQ', url: APP_ROUTES.FAQ, icon: Settings2 },
      ],
    // Loan Originator menu
    'loan_originator':
      [
        { title: 'Dashboard', url: APP_ROUTES.LOAN_ORIGINATOR_DASHBOARD, icon: LayoutDashboard },
        { title: 'Funding Pools', url: APP_ROUTES.FUNDING_POOLS, icon: PieChart },
        { title: 'Borrowers', url: APP_ROUTES.BORROWERS, icon: Users },
        { title: 'Loan Disbursements', url: APP_ROUTES.LOAN_DISBURSEMENTS, icon: StoreIcon },
        { title: 'Reports', url: APP_ROUTES.REPORTS, icon: BarChart },
        { title: 'Support', url: APP_ROUTES.SUPPORT, icon: Bot },
        { title: 'FAQ', url: APP_ROUTES.FAQ, icon: Settings2 },
      ],
    'company':
      // Company menu
      [
        { title: 'Dashboard', url: APP_ROUTES.COMPANY_DASHBOARD, icon: LayoutDashboard },
        { title: 'Tax Applications', url: APP_ROUTES.TAX_APPLICATIONS, icon: FileText },
        { title: 'KYC Verification', url: APP_ROUTES.KYC, icon: Users },
        { title: 'Refunds & Treasury', url: APP_ROUTES.REFUNDS_TREASURY, icon: PieChart },
        { title: 'Documents', url: APP_ROUTES.DOCUMENT_CENTER, icon: BookOpen },
        { title: 'Communication', url: APP_ROUTES.COMMUNICATION, icon: Bot },
        { title: 'FAQ', url: APP_ROUTES.FAQ, icon: Settings2 },
      ],
    'partner':
      // Partner menu
      [
        { title: 'Dashboard', url: APP_ROUTES.PARTNER_DASHBOARD, icon: LayoutDashboard },
        { title: 'Referrals', url: APP_ROUTES.REFERRALS, icon: Users },
        { title: 'Commissions', url: APP_ROUTES.COMMISSIONS, icon: PieChart },
        { title: 'Support', url: APP_ROUTES.SUPPORT, icon: Bot },
        { title: 'FAQ', url: APP_ROUTES.FAQ, icon: Settings2 },
      ],
  },
};

