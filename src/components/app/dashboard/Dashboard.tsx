'use client';
import AuthStepProfile from '@/components/marketing/AuthStepProfile';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGetUser } from '@/hooks/api/users.queries';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import QuickCards from './dashboard/QuickCards';
import WelcomeBanner from './dashboard/WelcomeBanner';

export default function Page() {
  const router = useRouter();
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated);
  const authStep = useTypedSelector((state) => state.auth.step);
  const { data: user } = useGetUser();
  const dispatch = useDispatch();

  const path = usePathname();
  const section = path.split('/')[1];
  const subSection = path.split('/')[3];

  const ProfileModal = () => {
    return (
      <Dialog open={user && !user?.first_name}>
        <DialogContent closable={false}>
          <AuthStepProfile />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      <ProfileModal />
      <WelcomeBanner />
      <QuickCards />

      <h3>TESTING PURPOSES ONLY: ONLY TEST PROJECTS PAGE, NEW PROJECT FLOW, FAQS, PROFILE SETTINGS, BUG REPORTER</h3>
    </div>
  );
}
