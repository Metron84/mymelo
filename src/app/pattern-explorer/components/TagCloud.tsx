'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Tag {
  name: string;
  count: number;
  trending: boolean;
  category: string;
}

const TagCloud = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popularity' | 'alphabetical' | 'trending'>('popularity');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockTags: Tag[] = [
    { name: 'Lebanese Culture', count: 45, trending: true, category: 'Culture' },
    { name: 'Philosophy', count: 38, trending: false, category: 'Intellectual' },
    { name: 'Coffee Rituals', count: 32, trending: true, category: 'Culture' },
    { name: 'Emotional Intelligence', count: 28, trending: false, category: 'Psychology' },
    { name: 'Diaspora Stories', count: 25, trending: true, category: 'Culture' },
    { name: 'Social Dynamics', count: 22, trending: false, category: 'Social' },
    { name: 'Hospitality', count: 20, trending: false, category: 'Culture' },
    { name: 'Feelers vs Thinkers', count: 18, trending: true, category: 'Debate' },
    { name: 'Cultural Identity', count: 16, trending: false, category: 'Culture' },
    { name: 'Storytelling', count: 15, trending: false, category: 'Creative' },
    { name: 'Middle Eastern Cuisine', count: 14, trending: false, category: 'Culture' },
    { name: 'Intellectual Discourse', count: 12, trending: true, category: 'Intellectual' },
    { name: 'Community Building', count: 11, trending: false, category: 'Social' },
    { name: 'Traditional Values', count: 10, trending: false, category: 'Culture' },
    { name: 'Modern Perspectives', count: 9, trending: false, category: 'Contemporary' },
  ];

  const getSortedTags = () => {
    const sorted = [...mockTags];
    switch (sortBy) {
      case 'popularity':
        return sorted.sort((a, b) => b.count - a.count);
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'trending':
        return sorted.sort((a, b) => {
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return b.count - a.count;
        });
      default:
        return sorted;
    }
  };

  const getTagSize = (count: number) => {
    const maxCount = Math.max(...mockTags.map(t => t.count));
    const minSize = 0.8;
    const maxSize = 2;
    const size = minSize + ((count / maxCount) * (maxSize - minSize));
    return `${size}rem`;
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 warm-shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="flex flex-wrap gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded-full w-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border warm-shadow">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-lg font-bold text-foreground flex items-center space-x-2">
            <Icon name="TagIcon" size={20} />
            <span>Tag Universe</span>
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-body text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-cta bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="popularity">Popularity</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {/* Tag Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-headline font-bold text-accent">{mockTags.length}</div>
            <div className="text-xs font-body text-muted-foreground">Total Tags</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-headline font-bold text-gold">
              {mockTags.filter(t => t.trending).length}
            </div>
            <div className="text-xs font-body text-muted-foreground">Trending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-headline font-bold text-primary">
              {mockTags.reduce((sum, t) => sum + t.count, 0)}
            </div>
            <div className="text-xs font-body text-muted-foreground">Total Uses</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-3 justify-center items-center min-h-[300px]">
          {getSortedTags().map((tag) => (
            <button
              key={tag.name}
              onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
              className={`relative px-4 py-2 rounded-full font-body font-medium transition-all duration-300 hover:scale-110 ${
                selectedTag === tag.name
                  ? 'bg-accent text-accent-foreground warm-shadow-lg'
                  : 'bg-muted text-foreground hover:bg-accent/20'
              }`}
              style={{ fontSize: getTagSize(tag.count) }}
            >
              {tag.name}
              {tag.trending && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Selected Tag Details */}
        {selectedTag && (
          <div className="mt-6 p-4 bg-background rounded-lg border border-border animate-fade-in">
            {(() => {
              const tag = mockTags.find(t => t.name === selectedTag);
              if (!tag) return null;
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline text-lg font-bold text-foreground">{tag.name}</h3>
                    {tag.trending && (
                      <span className="px-2 py-1 bg-gold text-white text-xs font-cta font-medium rounded-full flex items-center space-x-1">
                        <Icon name="FireIcon" size={12} />
                        <span>Trending</span>
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm font-body">
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <span className="ml-2 font-medium text-foreground">{tag.category}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Usage Count:</span>
                      <span className="ml-2 font-medium text-foreground">{tag.count}</span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-accent text-accent-foreground font-cta font-medium rounded-lg hover:bg-gold transition-colors flex items-center justify-center space-x-2">
                    <Icon name="MagnifyingGlassIcon" size={18} />
                    <span>Explore Content</span>
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagCloud;