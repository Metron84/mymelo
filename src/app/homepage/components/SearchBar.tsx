'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SearchBarProps {
  onSearch: (query: string, filters: string[]) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterOptions = [
    { id: 'articles', label: 'Articles', icon: 'DocumentTextIcon' },
    { id: 'essays', label: 'Essays', icon: 'BookOpenIcon' },
    { id: 'debates', label: 'Debates', icon: 'UserGroupIcon' },
    { id: 'gossip', label: 'Gossip Lab', icon: 'BeakerIcon' },
    { id: 'rankings', label: 'Rankings', icon: 'ChartBarIcon' },
    { id: 'media', label: 'Media', icon: 'PlayIcon' },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const handleSearch = () => {
    onSearch(query, selectedFilters);
  };

  return (
    <section className="bg-card py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for articles, debates, cultural insights..."
              className="w-full px-6 py-4 pl-14 pr-32 bg-background border-2 border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200"
            />
            
            <Icon
              name="MagnifyingGlassIcon"
              size={24}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-muted text-foreground font-cta font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
              >
                <Icon name="FunnelIcon" size={18} />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-accent text-accent-foreground font-cta font-bold rounded-lg hover:bg-gold transition-colors duration-200"
              >
                <Icon name="MagnifyingGlassIcon" size={18} />
              </button>
            </div>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 p-4 bg-background rounded-xl border border-border animate-fade-in">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-cta font-medium transition-all duration-200 ${
                    selectedFilters.includes(filter.id)
                      ? 'bg-accent text-accent-foreground warm-shadow'
                      : 'bg-card text-foreground border border-border hover:border-accent'
                  }`}
                >
                  <Icon name={filter.icon as any} size={18} />
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchBar;