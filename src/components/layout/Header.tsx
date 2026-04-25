'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { useCartStore, selectCartItemCount } from '@/stores/cart';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/collections/new', label: 'New Arrivals' },
  { href: '/collections/bestsellers', label: 'Bestsellers' },
  { href: '/collections/sale', label: 'Sale' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const pathname = usePathname();
  const cartItemCount = selectCartItemCount(useCartStore.getState());
  const { cart } = useCartStore();
  
  // Use the Zustand store directly to get live count
  const liveCartCount = useCartStore((state) => state.cart?.totalQuantity || 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      )}
    >
      {/* Top Bar */}
      <div className="hidden border-b border-neutral-200 bg-neutral-50 py-2 lg:block">
        <div className="container mx-auto flex items-center justify-between px-4">
          <p className="text-sm text-neutral-600">
            Free shipping on orders over $100
          </p>
          <div className="flex items-center gap-6">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
              >
                <Globe className="h-4 w-4" />
                USD $
              </button>
              <AnimatePresence>
                {isCurrencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-40 rounded-lg border bg-white shadow-lg"
                  >
                    {CURRENCIES.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => setIsCurrencyOpen(false)}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
                      >
                        {currency.symbol} {currency.code} - {currency.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
              >
                EN
                <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-32 rounded-lg border bg-white shadow-lg"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setIsLangOpen(false)}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-tight text-shopify-dark">
              SHOP
            </span>
            <span className="text-2xl font-bold tracking-tight text-shopify-green">
              FY
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-shopify-green',
                  pathname === link.href ? 'text-shopify-green' : 'text-neutral-700'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full p-2 hover:bg-neutral-100 lg:p-3"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Account */}
            <Link
              href="/account"
              className="rounded-full p-2 hover:bg-neutral-100 lg:p-3"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden rounded-full p-2 hover:bg-neutral-100 lg:p-3"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>
            
            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-full p-2 hover:bg-neutral-100 lg:p-3"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {liveCartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-shopify-green text-xs font-semibold text-white"
                >
                  {liveCartCount > 99 ? '99+' : liveCartCount}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t lg:hidden"
          >
            <nav className="container mx-auto px-4 py-4">
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'block py-2 text-base font-medium',
                        pathname === link.href ? 'text-shopify-green' : 'text-neutral-700'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="container mx-auto max-w-2xl px-4 pt-20"
            >
              <div className="relative rounded-lg bg-white p-4 shadow-xl">
                <Search className="absolute left-7 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-lg border py-4 pl-14 pr-4 text-lg outline-none focus:border-shopify-green"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-7 top-1/2 -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-neutral-400" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
