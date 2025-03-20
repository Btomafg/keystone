import AuthModal from '../AuthModal';
import SocialMediaList from '../ui/socialMediaList';

const TopNavbar = () => {
  return (
    <div className="container-fluid  py-4 flex flex-col lg:flex-row gap-4 justify-between items-center z-[9999]">
      <p className="font-semibold mb-0">Welcome to Keystone Woodworx. Proven Quality You Deserve.</p>
      <div className="flex items-center gap-[20px] divide-x divide-black">
        <div className="pl-5">
          <SocialMediaList />
        </div>
      </div>{' '}
      <AuthModal />
    </div>
  );
};

export default TopNavbar;
