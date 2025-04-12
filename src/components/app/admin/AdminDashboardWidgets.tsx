'use client';

import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React from 'react';
import { TrendingUp, Users, Folder, DollarSign } from 'lucide-react';

interface AdminDashboardWidgetsProps {
  totalUsers: number;
  totalProjects: number;
  totalValue: number;
  growth: string;
}

const AdminDashboardWidgets: React.FC<AdminDashboardWidgetsProps> = ({ totalUsers, totalProjects, totalValue, growth }) => {
  const router = useRouter();

  const cards = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: <Users className="h-6 w-6 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Total Projects Estimated',
      value: totalProjects.toLocaleString(),
      icon: <Folder className="h-6 w-6 text-yellow-600" />,
      bg: 'bg-yellow-50',
    },
    {
      title: 'Total Estimated Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      bg: 'bg-green-50',
    },
    {
      title: 'Growth This Month',
      value: growth,
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="flex flex-row items-center justify-center w-full h-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {cards.map((card, index) => (
          <Card key={index} className={`p-4 ${card.bg} flex flex-col justify-between`}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground font-medium">{card.title}</div>
              {card.icon}
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{card.value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardWidgets;
