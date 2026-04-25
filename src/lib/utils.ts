import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: string | number, currencyCode: string = 'USD'): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function getImageUrl(image: { url: string } | string | null | undefined): string {
  if (!image) return '/placeholder.jpg';
  if (typeof image === 'string') return image;
  return image.url;
}

export function calculateDiscountPercentage(
  compareAtPrice: string | null | undefined,
  price: string
): number | null {
  if (!compareAtPrice) return null;
  const compareAmount = parseFloat(compareAtPrice);
  const currentAmount = parseFloat(price);
  if (compareAmount <= currentAmount) return null;
  return Math.round(((compareAmount - currentAmount) / compareAmount) * 100);
}

export function parseGid(gid: string): { id: string; type: string } | null {
  const match = gid.match(/^gid:\/\/([^/]+)\/([^/]+)\/(.+)$/);
  if (!match) return null;
  return {
    id: match[3],
    type: match[2],
  };
}

export function getVariantIdFromGid(gid: string): string {
  const parsed = parseGid(gid);
  return parsed?.type === 'ProductVariant' ? parsed.id : gid;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  INR: '₹',
  BRL: 'R$',
};

export function getCurrencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code] || code;
}
