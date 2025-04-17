import { clsx } from 'clsx';
import { isValid, parse } from 'date-fns';
import { format } from 'date-fns-tz';
import { redirect } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

export function encodedRedirect(type: 'error' | 'success', path: string, message: string) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function cardSlideAnimation() {
  const cardVariants = {
    offscreen: {
      opacity: 0,
      x: -150,
    },
    onscreen: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
      },
    },
  };
  return cardVariants;
}
export function cardSlideAnimationDelay() {
  const cardVariants = {
    offscreen: {
      opacity: 0,
      x: -150,
    },
    onscreen: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        delay: 0.4,
      },
    },
  };
  return cardVariants;
}
export function cardSlideAnimationRight() {
  const cardVariants = {
    offscreen: {
      opacity: 0,
      x: 150,
    },
    onscreen: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
      },
    },
  };
  return cardVariants;
}
export function cardSlideAnimationRightDelay() {
  const cardVariants = {
    offscreen: {
      opacity: 0,
      x: 150,
    },
    onscreen: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        delay: 0.4,
      },
    },
  };
  return cardVariants;
}

export function countCartProductQuantity(products: any) {
  return products.reduce((total: any, product: any) => total + product?.quantity, 0);
}

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  try {
    return format(new Date(date), 'PPP');
  } catch (error) {
    // e.g., Oct 27, 2023
    return 'Invalid Date';
  }
};
export const formatTime = (timeString: string): string => {
  // Handles "HH:mm:ss" or "HH:mm" and formats to "h:mm a"
  try {
    const referenceDate = new Date(); // Need a reference date for parse
    const parsed = timeString.includes(':') ? parse(timeString.substring(0, 5), 'HH:mm', referenceDate) : new Date('invalid');
    return isValid(parsed) ? format(parsed, 'h:mm a') : 'Invalid Time';
  } catch {
    return 'Invalid Time';
  }
};
