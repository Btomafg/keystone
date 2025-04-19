import favicon from '@/app/favicon.ico';
import ProgressCircle from '@/components/ui/scrollCircle';
import { Toaster } from '@/components/ui/toaster';
import { LayoutChildren } from '@/lib/layoutChildren';
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
      <body className={`${plus_jakarta_sans.variable} `}>
        <div id="page-wapper" className="!relative ">
          <ProgressCircle />
          <LayoutChildren>{children}</LayoutChildren>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
