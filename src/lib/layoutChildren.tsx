'use client';
import { store } from '@/redux/store';
import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';


interface LayoutChildrenProps {
  children: ReactNode;
}

const LayoutChildren: React.FC<LayoutChildrenProps> = ({ children }) => {
  return (
    <>
      <Provider store={store}>{children}</Provider>
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
