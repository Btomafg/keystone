'use client';
import { ReportBugProvider } from '@/components/app/bug-provider';
import { store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';


interface LayoutChildrenProps {
  children: ReactNode;
}

const LayoutChildren: React.FC<LayoutChildrenProps> = ({ children }) => {
  const queryClient = new QueryClient()
  const { user, isAuthenticated, token, refreshTokenInterval } = store.getState().auth;
  console.log({ user, isAuthenticated, token, refreshTokenInterval })
  return (
    <>

      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ReportBugProvider>
            {children}
          </ReportBugProvider>

        </QueryClientProvider>
      </Provider>
      <Toaster
        position="top-right"
        containerStyle={{
          top: 60,
        }}
      />

    </>
  );
};

export default LayoutChildren;
