import { clsx } from 'clsx';
import { format, isValid, parse } from 'date-fns';
import { File, FileScan, FileText, ImageIcon, Receipt } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
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

// lib/utils.ts (example additions)

// Basic date formatting (adjust as needed)
export const formatDate = (date: Date | string | null | undefined, fmt: string = 'PP'): string => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), fmt);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format file size
export function formatFileSize(bytes: number | null | undefined, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
interface ProjectFile {
  id: string | number;
  project_id: string | number;
  name: string; // Filename
  url: string; // URL to view/download
  mime_type?: string | null; // e.g., 'application/pdf', 'image/jpeg'
  size?: number | null; // Size in bytes
  uploaded_at?: string | Date | null; // Timestamp string or Date object
  uploaded_by_user_id?: string | null; // Optional uploader ID
  file_category?: 'Drawing' | 'Photo' | 'Agreement' | 'Invoice' | 'Other' | null; // Optional category
  // Optional: Add uploader name if joined/fetched
  uploader_name?: string | null;
}
// Get Icon based on mime type or category
export function getFileIcon(mimeType?: string | null, category?: ProjectFile['file_category']): React.ReactNode {
  if (category === 'Drawing' || mimeType === 'application/pdf') {
    return <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />;
  }
  if (category === 'Photo' || mimeType?.startsWith('image/')) {
    return <ImageIcon className="h-5 w-5 text-purple-500 flex-shrink-0" />;
  }
  if (category === 'Agreement') {
    return <FileScan className="h-5 w-5 text-blue-500 flex-shrink-0" />;
  }
  if (category === 'Invoice') {
    return <Receipt className="h-5 w-5 text-green-500 flex-shrink-0" />;
  }
  // Add more specific icons based on common mime types if needed
  // e.g., Word, Excel, etc.

  // Default icons
  if (mimeType?.startsWith('application/')) {
    return <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />;
  }

  return <File className="h-5 w-5 text-gray-500 flex-shrink-0" />; // Generic file icon
}
