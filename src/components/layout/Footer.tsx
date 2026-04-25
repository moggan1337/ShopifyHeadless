import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  shop: [
    { href: '/collections/new', label: 'New Arrivals' },
    { href: '/collections/bestsellers', label: 'Bestsellers' },
    { href: '/collections/sale', label: 'Sale' },
    { href: '/gift-cards', label: 'Gift Cards' },
  ],
  support: [
    { href: '/contact', label: 'Contact Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/shipping', label: 'Shipping & Returns' },
    { href: '/size-guide', label: 'Size Guide' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/press', label: 'Press' },
    { href: '/sustainability', label: 'Sustainability' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/accessibility', label: 'Accessibility' },
  ],
};

const SOCIAL_LINKS = [
  { href: 'https://twitter.com/moggan1337', icon: Twitter, label: 'Twitter' },
  { href: 'https://github.com/moggan1337', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com/in/moggan1337', icon: Linkedin, label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="border-t bg-neutral-50">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold tracking-tight text-shopify-dark">
                SHOP
              </span>
              <span className="text-2xl font-bold tracking-tight text-shopify-green">
                FY
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-neutral-600">
              High-performance headless commerce built with Next.js, GraphQL, and the latest web technologies.
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@shopifyheadless.dev">hello@shopifyheadless.dev</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Phone className="h-4 w-4" />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-shopify-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-shopify-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-shopify-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-shopify-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} ShopifyHeadless. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-shopify-green"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          
          {/* Payment Methods */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">We accept:</span>
            <div className="flex gap-1">
              {['Visa', 'MC', 'Amex', 'PayPal', 'Apple Pay'].map((method) => (
                <div
                  key={method}
                  className="flex h-8 w-12 items-center justify-center rounded bg-neutral-100 text-xs font-medium text-neutral-600"
                >
                  {method.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
