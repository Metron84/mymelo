'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface RecentItem {
  id: number;
  title: string;
  category: string;
  timestamp: string;
  href: string;
}

interface RecentAdditionsTickerProps {
  items: RecentItem[];
}

const RecentAdditionsTicker = ({ items }: RecentAdditionsTickerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, isHydrated]);

  if (!isHydrated) {
    return (
      <section className="bg-gradient-to-r from-accent/10 to-gold/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="BellIcon" size={20} className="text-accent" />
              <span className="font-cta text-sm font-bold text-foreground">RECENT ADDITIONS</span>
            </div>
            <div className="flex-1 mx-8">
              <div className="h-6 bg-muted/30 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <section className="bg-gradient-to-r from-accent/10 to-gold/10 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="BellIcon" size={20} className="text-accent animate-pulse-soft" />
            <span className="font-cta text-sm font-bold text-foreground">RECENT ADDITIONS</span>
          </div>
          
          <div className="flex-1 mx-8 overflow-hidden">
            <Link
              href={currentItem.href}
              className="flex items-center space-x-4 group"
            >
              <span className="font-body text-sm text-foreground group-hover:text-accent transition-colors duration-200 truncate">
                {currentItem.title}
              </span>
              <span className="flex items-center space-x-2 px-3 py-1 bg-card rounded-full shrink-0">
                <span className="font-cta text-xs font-medium text-muted-foreground">
                  {currentItem.category}
                </span>
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
              className="p-2 rounded-lg hover:bg-card transition-colors duration-200"
              aria-label="Previous item"
            >
              <Icon name="ChevronLeftIcon" size={20} className="text-foreground" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
              className="p-2 rounded-lg hover:bg-card transition-colors duration-200"
              aria-label="Next item"
            >
              <Icon name="ChevronRightIcon" size={20} className="text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentAdditionsTicker;