'use client';;
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from "react";
import QuickCards from "./dashboard/QuickCards";
import WelcomeBanner from "./dashboard/WelcomeBanner";
import ReportBug from "../ReportBug";
export default function Page() {
  const router = useRouter();
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated])

  const path = usePathname()
  const section = path.split('/')[1]
  const subSection = path.split('/')[3]





  return (
    <div className="flex flex-1 flex-col">
      <WelcomeBanner />
      <QuickCards />

<h3>TESTING PURPOSES ONLY: ONLY TEST PROJECTS PAGE + NEW PROJECT FLOW</h3>


    </div>
  )
}


