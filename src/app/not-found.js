// app/not-found.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const metadata = {
  title: 'Page Not Found - Keystone Woodworx',
  description: 'This page does not exist. Redirecting to the homepage.',
};

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div>
      <h1>Redirecting to the homepage...</h1>
    </div>
  );
}
