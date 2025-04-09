'use client';
import AuthStepOTP from '@/components/marketing/AuthStepOTP';
import AuthStepProfile from '@/components/marketing/AuthStepProfile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { RootState } from '@/store';
import { setStep } from '@/store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import AuthStepLogin from './AuthStepLogin';

export default function AuthModal() {
  const step = useSelector((state: RootState) => state.auth.step);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (step === 'none') {
      dispatch(setStep('login'));
    } else {
      dispatch(setStep('none'));
    }
  };

  return (
    <Dialog open={step !== 'none'} onOpenChange={handleClick}>
      <DialogTrigger className="" asChild onClick={handleClick}>
        <div>
          {' '}
          <Button className="ms-5 p-2 text-white !rounded-xl" size="lg">
            Get a quote
          </Button>
          <Button className="ms-5 p-2 !text-sm hover:bg-white" variant="outline">
            Login to your account
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md" closable>
        <DialogHeader></DialogHeader>

        {step === 'login' && <AuthStepLogin />}
        {step === 'otp' && <AuthStepOTP />}
        {step === 'profile' && <AuthStepProfile />}
      </DialogContent>
    </Dialog>
  );
}
