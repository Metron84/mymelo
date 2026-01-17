'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function MediaLibraryInteractive() {
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
            <Icon name="PlayIcon" size={40} className="text-accent" />
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
              Media Lounge
            </h1>
          </div>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">
            Audio and video content with transcripts, series organization, and seamless playback. 
            Podcasts, video essays, interviews, and multimedia explorations of ideas.
          </p>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
              <Icon name="PlayIcon" size={40} className="text-accent" />
            </div>
            <h3 className="font-headline text-2xl font-bold text-foreground">
              No Media Yet
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              The Media Lounge awaits its first recording. This space will feature audio and video content—podcasts exploring 
              ideas in depth, video essays examining culture and philosophy, interviews with fascinating individuals, and 
              multimedia projects that blend sound, image, and thought. Each piece will include transcripts for accessibility 
              and deeper engagement.
            </p>
            <div className="pt-4">
              <p className="font-body text-sm text-muted-foreground italic">
                &quot;Sometimes the voice carries what words alone cannot convey.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}