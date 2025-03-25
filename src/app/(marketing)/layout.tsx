import Footer from '@/components/marketing/footer';
import HeaderOne from '@/components/marketing/header/headerOne';

const Layout = ({ children }) => {
  return (
    <main style={{ zIndex: 0 }}>
      <HeaderOne />

      {children}
      <Footer />
    </main>
  );
};

export default Layout;
