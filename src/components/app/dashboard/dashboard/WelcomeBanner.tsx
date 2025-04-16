import { useGetUser } from '@/hooks/api/users.queries';
import React from 'react';

interface WelcomeBannerProps {}
const WelcomeBanner: React.FC<WelcomeBannerProps> = (props) => {
  //HOOKS
  const { data } = useGetUser();
  //STATES

  //VARIABLES

  //FUNCTIONS

  //EFFECTS

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col  justify-center w-full h-full p-4">
        <h1 className="text-2xl font-bold">👋 Welcome {data?.first_name}!</h1>
        <p className="mt-1 text-lg">Let's get started on your next project?.</p>
      </div>
    </div>
  );
};

export default WelcomeBanner;
