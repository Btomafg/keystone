'use client';
import { ReportBugProvider } from '@/components/app/bug-provider';
import { AuthStateSyncer } from '@/components/auth/AuthStateSyncer';
import { store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode, useState } from 'react';
import { Provider } from 'react-redux';

interface LayoutChildrenProps {
  children: ReactNode;
}

export function LayoutChildren({ children }: { children: React.ReactNode }) {
  // Use useState to ensure QueryClient is only created once per session
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthStateSyncer />
        <ReportBugProvider>{children}</ReportBugProvider>
      </QueryClientProvider>
    </Provider>
  );
}
