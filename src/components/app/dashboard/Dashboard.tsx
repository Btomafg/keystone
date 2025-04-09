'use client';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import QuickCards from './dashboard/QuickCards';
import WelcomeBanner from './dashboard/WelcomeBanner';
import ReportBug from '../ReportBug';
import { useGetUser } from '@/hooks/api/users.queries';
import { useDispatch } from 'react-redux';
import { setStep } from '@/store/slices/authSlice';
import AuthModal from '@/components/marketing/AuthModal';
export default function Page() {
  const router = useRouter();
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated);
  const authStep = useTypedSelector((state) => state.auth.step);
  const { data: user } = useGetUser();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated]);

  const path = usePathname();
  const section = path.split('/')[1];
  const subSection = path.split('/')[3];

  useEffect(() => {
    if (user && !user?.first_name) {
      dispatch(setStep('profile'));
    }
  }, [user]);

  return (
    <div className="flex flex-1 flex-col">
      {authStep == 'profile' && <AuthModal />}
      <WelcomeBanner />
      <QuickCards />

      <h3>TESTING PURPOSES ONLY: ONLY TEST PROJECTS PAGE + NEW PROJECT FLOW</h3>
    </div>
  );
}
