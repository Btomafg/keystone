import favicon from '@/app/favicon.ico';
import ProgressCircle from '@/components/ui/scrollCircle';
import { Toaster } from '@/components/ui/toaster';
import LayoutChildren from '@/lib/layoutChildren';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const plus_jakarta_sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--plus-jakarta-sans',
});

export const metadata = {
  title: 'Keystone Woodworx | Custom Cabinetry & Furniture | Located in Carrolltown, PA',
  description: 'Keystone Woodworx is a custom woodworking company that specializes in custom cabinetry design and manufacturing.',
  icons: {
    icon: `${favicon.src}`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics Script */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-5BSV8TYE06" strategy="afterInteractive" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5BSV8TYE06');
            `,
          }}
        />
      </head>
      <body className={`${plus_jakarta_sans.variable} `} suppressHydrationWarning={true}>
        <div id="page-wapper" className="!relative ">

          {/* ------ body line start */}
          <div className="w-full h-full fixed -z-[1] top-0 left-0 page-lines">
            <div className="container relative h-full">
              <span className="absolute left-3 top-0 h-full w-[1px] bg-secondary_rgba"></span>
              <span className="absolute right-[28%] top-0 h-full w-[1px] bg-secondary_rgba"></span>
              <span className="absolute right-3 top-0 h-full w-[1px] bg-secondary_rgba"></span>
            </div>
          </div>
          {/* ------ body line end */}
          <Toaster />
          <ProgressCircle />
          <LayoutChildren className="">

            {children}


          </LayoutChildren>

        </div>
      </body>
    </html>
  );
}
