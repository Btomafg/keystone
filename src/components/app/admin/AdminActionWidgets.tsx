'use client';

import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MailWarning, Clock, CheckCircle } from 'lucide-react';

interface AdminActionWidgetsProps {
  projectsToReview: number;
  actionsThisWeek: number;
  unreadMessages: number;
}

const AdminActionWidgets: React.FC<AdminActionWidgetsProps> = ({ projectsToReview, actionsThisWeek, unreadMessages }) => {
  const router = useRouter();

  const actions = [
    {
      title: 'Projects Needing Review',
      value: projectsToReview.toString(),
      description: 'Waiting for admin approval',
      icon: <Clock className="text-yellow-600 w-5 h-5" />,
      bg: 'bg-yellow-50',
      route: '/admin/projects?status=pending_review',
    },
    {
      title: 'Project Actions This Week',
      value: actionsThisWeek.toString(),
      description: 'New estimates, approvals, or changes',
      icon: <CheckCircle className="text-blue-600 w-5 h-5" />,
      bg: 'bg-blue-50',
      route: '/admin/activity',
    },
    {
      title: 'Unresponded Messages',
      value: unreadMessages.toString(),
      description: 'Leads or clients awaiting replies',
      icon: <MailWarning className="text-red-600 w-5 h-5" />,
      bg: 'bg-red-50',
      route: '/admin/messages',
    },
  ];

  return (
    <div className="flex flex-row items-center justify-center w-full ">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {actions.map((action, index) => (
          <Card
            key={index}
            className={`p-4 flex flex-col justify-between cursor-pointer hover:shadow-md transition ${action.bg}`}
            onClick={() => router.push(action.route)}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">{action.title}</h4>
              {action.icon}
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{action.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminActionWidgets;
