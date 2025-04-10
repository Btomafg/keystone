import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type DenialReason = 'out_of_area' | 'under_budget' | 'out_of_scope';

interface ProjectDeniedProps {
  reason: DenialReason;
}

const denialMessages: Record<DenialReason, { title: string; message: string }> = {
  out_of_area: {
    title: "We're Outside Your Area",
    message:
      "Thank you for your interest in Keystone Woodworx! Unfortunately, your project is located outside our current service area. We're growing, so feel free to check back in the future!",
  },
  under_budget: {
    title: 'Project Below Minimum',
    message:
      'We appreciate you considering Keystone Woodworx. At this time, we are only accepting projects with a minimum value of $10,000. We hope to work with you on a future project that meets this requirement!',
  },
  out_of_scope: {
    title: 'Project Outside Our Services',
    message:
      'Thanks for reaching out! Your project appears to fall outside the scope of services we currently offer. We specialize in custom cabinetry and related work, and unfortunately cannot accommodate your request at this time.',
  },
};

export const ProjectDenied: React.FC<ProjectDeniedProps> = ({ reason }) => {
  const { title, message } = denialMessages[reason];

  return (
    <div className="flex justify-center items-center h-full p-6">
      <Card className="max-w-xl w-full text-center shadow-xl border-red-300">
        <CardContent className="p-8">
          <div className="flex justify-center mb-4 text-red-500">
            <AlertTriangle size={48} />
          </div>
          <h2 className="text-2xl font-semibold text-red-700 mb-2">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white">
            <Link href="/dashboard/projects">Back to your Project</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectDenied;
