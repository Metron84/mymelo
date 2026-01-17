'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function RankingsArchiveInteractive() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted/20 rounded-lg" />
            <div className="h-96 bg-muted/20 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Icon name="ChartBarIcon" size={40} className="text-accent" />
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
              Rankings Archive
            </h1>
          </div>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">
            Curated tier-list style content with interactive visualizations and thoughtful commentary. 
            From books to restaurants, ideas to experiences—everything ranked, analyzed, and explained.
          </p>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
              <Icon name="ChartBarIcon" size={40} className="text-accent" />
            </div>
            <h3 className="font-headline text-2xl font-bold text-foreground">
              No Rankings Yet
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              The Rankings Archive awaits its first tier list. This space will feature curated rankings exploring various 
              topics—books that changed perspectives, films that moved souls, restaurants that defined taste, ideas that 
              shaped thinking. Each ranking will include interactive visualizations, detailed methodology, and space for 
              thoughtful discussion.
            </p>
            <div className="pt-4">
              <p className="font-body text-sm text-muted-foreground italic">
                &quot;The act of ranking is not about declaring absolutes, but about articulating preferences and inviting dialogue.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}