'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  totalCases: number;
}

export interface FilterState {
  searchQuery: string;
  ahwehIndexRange: [number, number];
  culturalContext: string;
  anonymizationLevel: string;
  sortBy: string;
}

export default function FilterBar({ onFilterChange, totalCases }: FilterBarProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    ahwehIndexRange: [0, 10],
    culturalContext: 'all',
    anonymizationLevel: 'all',
    sortBy: 'recent',
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useState(() => {
    setIsHydrated(true);
  });

  const handleFilterUpdate = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      searchQuery: '',
      ahwehIndexRange: [0, 10],
      culturalContext: 'all',
      anonymizationLevel: 'all',
      sortBy: 'recent',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const culturalContexts = [
    { value: 'all', label: 'All Contexts' },
    { value: 'lebanese', label: 'Lebanese Culture' },
    { value: 'middle-eastern', label: 'Middle Eastern' },
    { value: 'diaspora', label: 'Diaspora Experience' },
    { value: 'cross-cultural', label: 'Cross-Cultural' },
  ];

  const anonymizationLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'high', label: 'High Privacy' },
    { value: 'medium', label: 'Medium Privacy' },
    { value: 'low', label: 'Low Privacy' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'ahweh-high', label: 'Highest Ahweh Index' },
    { value: 'ahweh-low', label: 'Lowest Ahweh Index' },
    { value: 'popular', label: 'Most Popular' },
  ];

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg warm-shadow p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="FunnelIcon" size={24} className="text-accent" />
            <h2 className="font-headline text-xl font-bold text-foreground">Filter Cases</h2>
          </div>
          <div className="text-sm text-muted-foreground font-body">
            Loading filters...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg warm-shadow p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="FunnelIcon" size={24} className="text-accent" />
          <h2 className="font-headline text-xl font-bold text-foreground">Filter Cases</h2>
          <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-cta font-medium rounded-full">
            {totalCases} cases
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors duration-200"
        >
          <Icon
            name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
            size={20}
            className="text-foreground"
          />
        </button>
      </div>

      {/* Filters */}
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Search Bar */}
        <div className="relative">
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search cases by title, context, or tags..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterUpdate('searchQuery', e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cultural Context */}
          <div>
            <label className="block text-sm font-cta font-medium text-foreground mb-2">
              Cultural Context
            </label>
            <select
              value={filters.culturalContext}
              onChange={(e) => handleFilterUpdate('culturalContext', e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            >
              {culturalContexts.map((context) => (
                <option key={context.value} value={context.value}>
                  {context.label}
                </option>
              ))}
            </select>
          </div>

          {/* Anonymization Level */}
          <div>
            <label className="block text-sm font-cta font-medium text-foreground mb-2">
              Privacy Level
            </label>
            <select
              value={filters.anonymizationLevel}
              onChange={(e) => handleFilterUpdate('anonymizationLevel', e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            >
              {anonymizationLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ahweh Index Range */}
          <div>
            <label className="block text-sm font-cta font-medium text-foreground mb-2">
              Ahweh Index: {filters.ahwehIndexRange[0]}-{filters.ahwehIndexRange[1]}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="10"
                value={filters.ahwehIndexRange[1]}
                onChange={(e) =>
                  handleFilterUpdate('ahwehIndexRange', [0, parseInt(e.target.value)])
                }
                className="w-full accent-accent"
              />
              <Icon name="FireIcon" size={20} className="text-accent flex-shrink-0" />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-cta font-medium text-foreground mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterUpdate('sortBy', e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-cta font-medium rounded-lg transition-colors duration-200"
          >
            <Icon name="ArrowPathIcon" size={18} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}