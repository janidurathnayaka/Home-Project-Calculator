'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Menu,
  X,
  Hammer,
  Bookmark,
} from 'lucide-react';

import {
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import ThemeToggle from './ThemeToggle';

// ==========================================
// NAVIGATION LINKS
// ==========================================

const links = [
  { href: '/', label: 'Home' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/guides', label: 'Cost Guides' },
  { href: '/assistant', label: 'Assistant' },
  { href: '/convert', label: 'Converter' },
  { href: '/saved', label: 'Saved' },
  { href: '/about', label: 'About' },
];

const MOBILE_NAV_ID = 'mobile-site-navigation';

// ==========================================
// HEADER COMPONENT
// ==========================================

export default function Header() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // ========================================
  // ACTIVE NAVIGATION
  // ========================================

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  // Current exact page for screen readers
  const isCurrentPage = (href: string): boolean => {
    return pathname === href;
  };

  // ========================================
  // MOBILE MENU ACTIONS
  // ========================================

  const toggleMenu = () => {
    setOpen((previous) => !previous);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  // ========================================
  // KEYBOARD ACCESSIBILITY
  // ========================================

  const handleKeyDown = (
    event: KeyboardEvent<HTMLElement>
  ) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();

      setOpen(false);

      // Restore focus to the menu button
      menuButtonRef.current?.focus();
    }
  };

  // ========================================
  // HEADER UI
  // ========================================

  return (
    <header
      className="site-header"
      onKeyDown={handleKeyDown}
    >
      <div className="container nav-wrap">

        {/* ==================================
            WEBSITE BRAND / LOGO
        ================================== */}

        <Link
          href="/"
          className="brand"
          aria-label="Home Project Calculator home"
          onClick={closeMenu}
        >
          <span
            className="brand-mark"
            aria-hidden="true"
          >
            <Hammer
              size={19}
              strokeWidth={2.4}
            />
          </span>

          <span>
            Home <span>Project Calculator</span>
          </span>
        </Link>

        {/* ==================================
            DESKTOP NAVIGATION
        ================================== */}

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
        >
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? 'nav-link active'
                    : 'nav-link'
                }
                aria-current={
                  isCurrentPage(link.href)
                    ? 'page'
                    : undefined
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ==================================
            HEADER ACTIONS
        ================================== */}

        <div className="nav-actions">

          {/* DARK / LIGHT MODE */}

          <ThemeToggle />

          {/* ==================================
              SAVED ESTIMATES LINK
              LIGHTHOUSE ACCESSIBILITY FIX
          ================================== */}

          <Link
            className="save-pill"
            href="/saved"
            aria-label="My estimates — view saved projects"
            aria-current={
              isCurrentPage('/saved')
                ? 'page'
                : undefined
            }
            onClick={closeMenu}
          >
            <Bookmark
              size={16}
              aria-hidden="true"
            />

            <span>
              My estimates
            </span>
          </Link>

          {/* ==================================
              MOBILE MENU BUTTON
          ================================== */}

          <button
            ref={menuButtonRef}
            type="button"
            className="menu-btn"
            onClick={toggleMenu}
            aria-label={
              open
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={open}
            aria-controls={
              open ? MOBILE_NAV_ID : undefined
            }
          >
            {open ? (
              <X
                size={24}
                aria-hidden="true"
              />
            ) : (
              <Menu
                size={24}
                aria-hidden="true"
              />
            )}
          </button>

        </div>
      </div>

      {/* ==================================
          MOBILE NAVIGATION
      ================================== */}

      {open && (
        <nav
          id={MOBILE_NAV_ID}
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={
                  active ? 'active' : ''
                }
                aria-current={
                  isCurrentPage(link.href)
                    ? 'page'
                    : undefined
                }
              >
                {link.label}
              </Link>
            );
          })}

          {/* CONTACT PAGE */}

          <Link
            href="/contact"
            onClick={closeMenu}
            className={
              isActive('/contact') ? 'active' : ''
            }
            aria-current={
              isCurrentPage('/contact')
                ? 'page'
                : undefined
            }
          >
            Contact
          </Link>
        </nav>
      )}

    </header>
  );
}