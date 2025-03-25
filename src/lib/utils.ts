import { clsx } from 'clsx';
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
