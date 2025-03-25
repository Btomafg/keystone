'use client';;
import useStickyHeader from '@/hooks/useStickyHeader';
import BottomNavbar from './bottomNavbar';
import MobileNavbar from './mobileNavbar';

const HeaderOne = () => {
  useStickyHeader()
  return (
    <header style={{ zIndex: 1000 }} className="absolute top-0 left-0 w-full  header-one">

      <div className=" hidden xl:block">
        <div className="container-fluid">
          <BottomNavbar />
        </div>
      </div>
      <div className="xl:hidden block ">
        <MobileNavbar />
      </div>
    </header>
  );
};

export default HeaderOne;
