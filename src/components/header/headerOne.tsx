'use client';;
import BottomNavbar from './bottomNavbar';
import MobileNavbar from './mobileNavbar';
import TopNavbar from './topNavbar';

const HeaderOne = () => {
  return (
    <header style={{ zIndex: 1000 }} className="absolute top-0 left-0 w-full  header-one">
      <div className="hidden xl:block">
        <TopNavbar />
      </div>
      <div className="border-border border-t border-b hidden xl:block">
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
