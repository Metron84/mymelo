'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Icon from '@/components/ui/AppIcon';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Homepage', href: '/homepage', icon: 'HomeIcon' },
    { label: 'Writing', href: '/writing-collection', icon: 'DocumentTextIcon' },
    { label: 'Roundtable Session', href: '/roundtable-sessions', icon: 'UserGroupIcon' },
    { label: 'Gossip', href: '/gossip-lab-cases', icon: 'BeakerIcon' },
    { label: 'Rankings', href: '/rankings-archive', icon: 'ChartBarIcon' },
    { label: 'Media', href: '/media-library', icon: 'PhotoIcon' },
    { 
      label: 'melodoumani.com', 
      href: 'https://melodoumani.com', 
      icon: 'UserIcon',
      isExternal: true 
    },
    { 
      label: 'metronventures.com', 
      href: 'https://metronventures.com', 
      icon: 'BuildingOfficeIcon',
      isExternal: true 
    },
  ];

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isProfessionalMenuOpen, setIsProfessionalMenuOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-card shadow-md ${className}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/homepage" className="flex items-center space-x-3 group">
            <div className="relative">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <circle cx="20" cy="20" r="18" fill="var(--color-primary)" opacity="0.1" />
                <path
                  d="M20 8C13.373 8 8 13.373 8 20C8 26.627 13.373 32 20 32C26.627 32 32 26.627 32 20C32 13.373 26.627 8 20 8ZM20 10C25.514 10 30 14.486 30 20C30 25.514 25.514 30 20 30C14.486 30 10 25.514 10 20C10 14.486 14.486 10 20 10Z"
                  fill="var(--color-primary)"
                />
                <path
                  d="M20 14C16.686 14 14 16.686 14 20C14 23.314 16.686 26 20 26C23.314 26 26 23.314 26 20C26 16.686 23.314 14 20 14Z"
                  fill="var(--color-accent)"
                  className="animate-pulse-soft"
                />
                <path
                  d="M18 18C18 17.448 18.448 17 19 17H21C21.552 17 22 17.448 22 18V22C22 22.552 21.552 23 21 23H19C18.448 23 18 22.552 18 22V18Z"
                  fill="var(--color-primary)"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-steam-rise" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-xl font-bold text-primary tracking-tight">
                MrMelo
              </span>
              <span className="font-handwritten text-sm text-muted-foreground -mt-1">
                Sanctuary
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative">
                {item.isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-cta font-medium text-foreground hover:bg-muted hover:text-primary transition-all duration-200 group"
                  >
                    <Icon name={item.icon as any} size={18} />
                    <span>{item.label}</span>
                    <Icon 
                      name="ArrowTopRightOnSquareIcon" 
                      size={14} 
                      className="opacity-60"
                    />
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-cta font-medium text-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                  >
                    <Icon name={item.icon as any} size={18} />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
            
            {/* Admin Link - Only visible to authenticated users */}
            {session?.user && (
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-cta font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-all duration-200 border border-primary/30"
              >
                <Icon name="ShieldCheckIcon" size={18} />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="relative px-6 py-2.5 bg-gradient-to-r from-accent to-gold text-accent-foreground font-cta font-bold rounded-lg warm-shadow hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden group">
              <span className="relative z-10">Enter the Coffeehouse</span>
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <div className="absolute top-0 right-2 w-2 h-2 bg-white rounded-full opacity-60 animate-steam-rise" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <Icon
              name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'}
              size={24}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-fade-in">
          <nav className="px-4 py-4 space-y-1">
            {navigationItems.map((item) => (
              item.isExternal ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-cta font-medium text-foreground hover:bg-muted hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={item.icon as any} size={20} />
                    <span>{item.label}</span>
                  </div>
                  <Icon name="ArrowTopRightOnSquareIcon" size={16} />
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-cta font-medium text-foreground hover:bg-muted hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon name={item.icon as any} size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
            
            {/* Admin Link - Mobile */}
            {session?.user && (
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-cta font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors duration-200 border border-primary/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name="ShieldCheckIcon" size={20} />
                <span>Admin</span>
              </Link>
            )}
            
            <div className="pt-4">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-accent to-gold text-accent-foreground font-cta font-bold rounded-lg warm-shadow hover:shadow-lg transition-all duration-300">
                Enter the Coffeehouse
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;