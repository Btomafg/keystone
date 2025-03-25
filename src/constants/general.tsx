import { Accessibility, AlertCircle, Database, Layout, Link, Monitor, MoreHorizontal, Settings, ShieldAlert, Zap } from 'lucide-react';

export const bugTypes = [
  {
    key: 'ui_ux_issue',
    title: 'UI/UX Issue',
    description: 'Problems with the design, layout, or user interaction.',
    icon: <Layout className="h-5 w-5 text-primary" />, // Icon representing UI/UX
  },
  {
    key: 'functionality_issue',
    title: 'Functionality Issue',
    description: 'Features not working as expected.',
    icon: <Settings className="h-5 w-5 text-primary" />, // Icon representing functionality
  },
  {
    key: 'performance_issue',
    title: 'Performance Issue',
    description: 'Slow loading or other performance-related concerns.',
    icon: <Zap className="h-5 w-5 text-primary" />, // Icon representing speed/performance
  },
  {
    key: 'compatibility_issue',
    title: 'Compatibility Issue',
    description: 'Issues on specific devices, browsers, or operating systems.',
    icon: <Monitor className="h-5 w-5 text-primary" />, // Icon representing compatibility across platforms
  },
  {
    key: 'data_error',
    title: 'Data Error',
    description: 'Incorrect or missing data displayed.',
    icon: <Database className="h-5 w-5 text-primary" />, // Icon representing data
  },
  {
    key: 'security_issue',
    title: 'Security Issue',
    description: 'Problems related to security or privacy.',
    icon: <ShieldAlert className="h-5 w-5 text-primary" />, // Icon representing security
  },
  {
    key: 'integration_issue',
    title: 'Integration Issue',
    description: 'Problems with third-party integrations or APIs.',
    icon: <Link className="h-5 w-5 text-primary" />, // Icon representing integration
  },
  {
    key: 'crash_error',
    title: 'Crash/Error',
    description: 'Application crashes or error messages.',
    icon: <AlertCircle className="h-5 w-5 text-primary" />, // Icon representing an error or crash
  },
  {
    key: 'accessibility_issue',
    title: 'Accessibility Issue',
    description: 'Issues related to usability for users with disabilities.',
    icon: <Accessibility className="h-5 w-5 text-primary" />, // Icon representing accessibility
  },
  {
    key: 'other',
    title: 'Other',
    description: "For any issues that don't fit the above categories.",
    icon: <MoreHorizontal className="h-5 w-5 text-primary" />, // Icon representing miscellaneous
  },
];
