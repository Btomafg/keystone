'use client';
import React from 'react';

import logo from '@/assets/images/logo/KW-LOGO.webp';
import { useGetUser } from '@/hooks/api/users.queries';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';

import { useSyncSupabaseToRedux } from '@/hooks/useSupabaseToRedux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
type AuthLayoutProps = {
  children: React.ReactNode;
};
const AuthLayout: React.FC<AuthLayoutProps> = (props) => {
  const { children } = props;
  //HOOKS
  const { user: userState } = useTypedSelector((state) => state.auth);
  console.log(userState);
  const { data: getUser } = useGetUser();
  console.log(getUser);
  const [logoClickCount, setLogoClickCount] = React.useState(0);

  const router = useRouter();
  const params = useSearchParams();
  const auth = params.get('auth');
  console.log('access_token', auth);
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated);
  console.log('AUTH', isAuthenticated);
  const { data: user } = useGetUser();
  const userAuth = useTypedSelector((state) => state.auth);
  console.log('AUTH', userAuth);
  useEffect(() => {
    if (!isAuthenticated && auth) {
      console.log('inside');
      useSyncSupabaseToRedux();
      router.push('/');
    }
  }, []);

  const path = usePathname();
  const section = path;
  //STATES

  //VARIABLES
  const bulletPoints = [
    'Outline your custom cabinetry and get real-time estimates.',
    'Track every step of your project from quote to installation.',
    'Easily upload and manage design documents and inspiration photos.',
  ];

  //FUNCTIONS

  //EFFECTS

  return (
    <div className=" md:py-12 py-12 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-slate-300">
      <div className="grid grid-cols-2 mx-auto my-auto md:w-[90vw] md:max-w-[1400px] justify-between z-20">
        <div className="col-span-2 md:col-span-1 mb-0 flex w-full flex-col justify-center px-3 md:mb-20 ">
          <div className="mx-auto my-auto text-muted md:w-3/4">
            <Image onClick={() => setLogoClickCount(logoClickCount + 1)} src={logo} alt="Keystone Logo" className="w-36 md:w-44" />
            <h1 className="text-3xl font-bold tracking-tight mt-4  sm:text-4xl">
              Where Quality and Experience Meet
              <br />
            </h1>
            <ul className=" w-fit space-y-2 text-left text-sm mb-5 md:mb-0  text-muted md:text-lg mt-6">
              {bulletPoints.map((point, index) => (
                <li key={index}>
                  <h3>&#10003; {point}</h3>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 w-full justify-center ">
          <div className="min-w-80 min-h-96 mx-auto flex w-full max-w-md flex-col rounded-3xl bg-white p-6 shadow-lg ">
            {children}
            <div className="mx-auto mt-auto flex w-fit flex-row items-center space-x-2">
              <a href="" target="_blank" className="text-anchorBlue text-xs" rel="noopener noreferrer">
                Privacy Policy
              </a>
              <span className="text-gray-400">|</span>
              <a href="" target="_blank" className="text-anchorBlue text-xs" rel="noopener noreferrer">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
