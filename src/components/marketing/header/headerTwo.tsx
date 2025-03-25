'use client';
import BottomNavbar from './bottomNavbar';
import MobileNavbar from './mobileNavbar';

const HeaderTwo = () => {
  return (
    <header className="w-full bg-background shadow-md">
      <div className=" hidden lg:block">
        <div className="container-fluid">
          <BottomNavbar />
        </div>
      </div>
      <div className="lg:hidden block">
        <MobileNavbar />
      </div>
    </header>
  );
};

export default HeaderTwo;
