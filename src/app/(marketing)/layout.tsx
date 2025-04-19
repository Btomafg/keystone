import Footer from '@/components/marketing/footer';
import HeaderOne from '@/components/marketing/header/headerOne';

const Layout = ({ children }) => {
  return (
    <main style={{ zIndex: 0 }}>
      <HeaderOne />
      <div className="w-full h-full fixed -z-[1] top-0 left-0 page-lines">
        <div className="container relative h-full">
          <span className="absolute left-3 top-0 h-full w-[1px] bg-secondary_rgba"></span>
          <span className="absolute right-[28%] top-0 h-full w-[1px] bg-secondary_rgba"></span>
          <span className="absolute right-3 top-0 h-full w-[1px] bg-secondary_rgba"></span>
        </div>
      </div>
      {children}
      <Footer />
    </main>
  );
};

export default Layout;
