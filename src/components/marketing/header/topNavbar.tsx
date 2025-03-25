'use client';

import { Button } from '@/components/ui/button';
import SocialMediaList from '@/components/ui/socialMediaList';
import { APP_ROUTES } from '@/constants/routes';
import { useLogout } from '@/hooks/api/auth.queries';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthModal from '../AuthModal';


const TopNavbar = () => {
  const { mutateAsync: signOut } = useLogout();
  const { isAuthenticated } = useTypedSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) return null; // Prevent SSR mismatch

  return (
    <div className="container-fluid  py-2 flex flex-col lg:flex-row gap-4 justify-between items-center z-[9999]  ">
      <p className="font-semibold mb-0">Welcome to Keystone Woodworx. Proven Quality You Deserve.</p>
      <div className="flex items-center gap-[20px] divide-x divide-black">
        <div className="pl-5">
          <SocialMediaList />
        </div>
      </div>
      {!isAuthenticated && <AuthModal />}
      {isAuthenticated && (
        <>
          <Button onClick={() => router.push(APP_ROUTES.DASHBOARD.HOME.path)} className="ms-5 p-2 text-white !rounded-xl" size="lg">
            Dashboard
          </Button>
          <Button onClick={signOut} className="ms-5 p-2 text-white !rounded-xl" size="lg">
            Sign Out
          </Button>
        </>

      )}
    </div>
  );
};

export default TopNavbar;
