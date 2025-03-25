'use client';
import { useEffect, useState } from 'react';

export const formatPhoneNumber = (value: string) => {
  console.log(value);
  if (!value) {
    return value;
  }

  const regex = () => value.replace(/[^0-9\.]+/g, '');

  let cleanedValue = regex();

  if (cleanedValue[0] === '0' || cleanedValue[0] === '1') {
    cleanedValue = cleanedValue.slice(1);
  }

  const length = cleanedValue.length;

  const areaCode = () => `(${cleanedValue.slice(0, 3)})`;

  const firstSix = () => `${areaCode()} ${cleanedValue.slice(3, 6)}`;
  const trailer = (start: any) => `${cleanedValue.slice(start, cleanedValue.length)}`;

  if (length <= 3) {
    return cleanedValue;
  } else if (length <= 6) {
    return `${areaCode()} ${trailer(3)}`;
  } else if (length > 6 && length <= 10) {
    return `${firstSix()}-${trailer(6)}`;
  } else {
    return `${firstSix()}-${trailer(6).slice(0, 4)}`;
  }
};

export const cognitoPhoneNumber = (value: string) => {
  if (!value) {
    return value;
  }

  return `+1${value.replace(/\D/g, '')}`;
};

export const cleanPhoneNumber = (value: string) => {
  if (!value) {
    return value;
  }

  return `${value.replace(/\D/g, '')}`;
};
const formatDate = (date: Date | null): string | null => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toUSD = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add an event listener for the resize event.
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when the component unmounts.
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
}
