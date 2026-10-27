import Link from 'next/link';
import { Hammer } from 'lucide-react';

// ==========================================
// FOOTER NAVIGATION DATA
// ==========================================

const footerLinks = {
  tools: [
    {
      href: '/calculators',
      label: 'All calculators',
    },
    {
      href: '/saved',
      label: 'Saved estimates',
    },
    {
      href: '/guides',
      label: 'Cost guides',
    },
  ],

  company: [
    {
      href: '/about',
      label: 'About',
    },
    {
      href: '/contact',
      label: 'Contact',
    },
    {
      href: '/affiliate-disclosure',
      label: 'Affiliate disclosure',
    },
  ],

  legal: [
    {
      href: '/privacy',
      label: 'Privacy Policy',
    },
    {
      href: '/terms',
      label: 'Terms of Service',
    },
  ],
};

// ==========================================
// FOOTER COMPONENT
// ==========================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="footer"
      aria-label="Website footer"
    >
      <div className="container footer-grid">

        {/* ===================================
            WEBSITE BRAND
        =================================== */}

        <div className="footer-about">

          <div className="brand footer-brand">

            <span
              className="brand-mark"
              aria-hidden="true"
            >
              <Hammer size={18} />
            </span>

            <span>
              Home <span>Project Calculator</span>
            </span>

          </div>

          <p>
            Free planning calculators for smarter
            home projects. Measure twice,
            budget once.
          </p>

        </div>

        {/* ===================================
            TOOLS NAVIGATION
        =================================== */}

        <div
          role="navigation"
          aria-label="Footer tools"
        >

          <h2>Tools</h2>

          {footerLinks.tools.map((link) => (
            <Link
              key={link.href}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}

        </div>

        {/* ===================================
            COMPANY NAVIGATION
        =================================== */}

        <div
          role="navigation"
          aria-label="Footer company"
        >

          <h2>Company</h2>

          {footerLinks.company.map((link) => (
            <Link
              key={link.href}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}

        </div>

        {/* ===================================
            LEGAL NAVIGATION
        =================================== */}

        <div
          role="navigation"
          aria-label="Footer legal"
        >

          <h2>Legal</h2>

          {footerLinks.legal.map((link) => (
            <Link
              key={link.href}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}

          <p className="footer-note">
            Estimates are for planning purposes
            only and should not be considered
            professional contractor quotations.
          </p>

        </div>

      </div>

      {/* =====================================
          COPYRIGHT INFORMATION
      ===================================== */}

      <div className="container footer-bottom">

        <small>
          © {currentYear} Home Project Calculator.
          All rights reserved.
          {' '}
          Built for homeowners, DIY enthusiasts,
          and project planners.
        </small>

      </div>

    </footer>
  );
}