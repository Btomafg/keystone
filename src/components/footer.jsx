import Logo from '@/assets/images/logo/KW-LOGO.webp';
import Image from 'next/image';
import Link from 'next/link';
import SocialMediaList from './ui/socialMediaList';

const Footer = () => {
  return (
    <footer className="   mx-auto ">
      <div className=" bg-secondary ">
        <div className="container">
          <div className="grid lg:grid-cols-3 grid-cols-1 items-center pt-[100px] pb-20">
            <div>
              <Link href={''} className="text-primary-foreground">
                <Image className="p-3" src={Logo} height={'31'} width={'219'} />
              </Link>
              <h5 className="xl:text-2xl text-xl font-semibold text-primary-foreground leading-160 pt-2.5 pb-3">
                Shaping Interior Excellence
              </h5>
              <SocialMediaList />
            </div>

            <div className="mt-12 lg:mt-0 flex gap-x-10">
              <span className="h-[198px] w-[1px] bg-primary block my-2.5"></span>
              <div>
                <h5 className="text-2xl font-extrabold inline-block text-primary-foreground leading-160 ">Mailing Address:</h5>
                <span className="w-[99px] h-[1px] bg-primary block my-2.5"></span>
                <div className="mt-[18px]">
                  <p className="text-xl font-bold text-primary-foreground">Keystone Woodworx LLC </p>
                  <p className="text-lg text-primary-foreground">1155 Plank Road </p>
                  <p className="text-lg  text-primary-foreground">Carrolltown, PA 15722 USA </p>
                </div>
                <div className="mt-[17px]">
                  <Link href={'tel:+18143127972'} className="text-lg block text-primary-foreground hover-underline">
                    Phone: <span>814 312 7972</span>
                  </Link>
                  <Link href={'mailto:contact@keystonewoodworx.com'} className="text-lg block text-primary-foreground hover-underline">
                    Email: <span>contact@keystonewoodworx.com</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <hr className="bg-pritext-primary-foreground" />
          <div className="py-8 lg:flex justify-between items-center">
            <span className="text-sm text-primary-foreground block">
              Made with Love by{' '}
              <Link className="text-blue-400" href={'https://www.btllabs.com'}>
                BTL Labs
              </Link>{' '}
            </span>
            <span className="text-sm text-primary-foreground block mt-3 lg:mt-0">©2024, Keystone Woodworx, All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
