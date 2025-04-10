'use client';
import NewProjectPage from '@/components/app/dashboard/projects/new/NewProjectPage';

import { useGetProjects } from '@/hooks/api/projects.queries';
import { Project } from '@/constants/models/object.types';
import { usePathname } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import React, { useState } from 'react';
import { MultiStepLoader as Loader } from '@/components/ui/multi-step-loader';
import { IoCloseCircle } from 'react-icons/io5';

const loadingStates = [
  {
    text: 'Project Name and Description',
  },
  {
    text: 'Project Location',
  },
  {
    text: 'Inspecting Rooms',
  },
  {
    text: 'Analyzing Walls',
  },
  {
    text: 'Building Cabinets',
  },
  {
    text: 'Checking Measurements',
  },
  {
    text: 'Validating Options',
  },
  {
    text: 'Confirming Estimate',
  },
];

export default function ProjectReviewLoader() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center">
      <Loader
        loadingStates={loadingStates}
        loading={loading}
        duration={650}
        title="Thank you for submitting your project!"
        description="Your project is being reviewed. Please wait..."
      />
    </div>
  );
}
