'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  contentTypes: string[];
  tags: string[];
}

interface FilterState {
  contentType: string;
  sortBy: string;
  readingTime: string;
  selectedTags: string[];
  searchQuery: string;
}

export default function FilterBar({ onFilterChange, contentTypes, tags }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    contentType: 'all',
    sortBy: 'newest',
    readingTime: 'all',
    selectedTags: [],
    searchQuery: '',
  });

  const handleFilterUpdate = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];
    handleFilterUpdate('selectedTags', newTags);
  };

  const clearFilters = () => {
    const resetFilters: FilterState = {
      contentType: 'all',
      sortBy: 'newest',
      readingTime: 'all',
      selectedTags: [],
      searchQuery: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFilterCount =
    (filters.contentType !== 'all' ? 1 : 0) +
    (filters.readingTime !== 'all' ? 1 : 0) +
    filters.selectedTags.length +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="bg-card rounded-lg warm-shadow p-4 sm:p-6 mb-6 sm:mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Icon
          name="MagnifyingGlassIcon"
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search writings by title, content, or theme..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterUpdate('searchQuery', e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-cta font-medium hover:bg-opacity-90 transition-all duration-200"
        >
          <Icon name="AdjustmentsHorizontalIcon" size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
          <Icon
            name="ChevronDownIcon"
            size={16}
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Sort By */}
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterUpdate('sortBy', e.target.value)}
          className="px-4 py-2 bg-background border border-border rounded-lg text-foreground font-cta text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
          <option value="reading-time-short">Shortest Read</option>
          <option value="reading-time-long">Longest Read</option>
        </select>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition-all duration-200"
          >
            <Icon name="XMarkIcon" size={16} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="pt-4 border-t border-border space-y-4 animate-fade-in">
          {/* Content Type Filter */}
          <div>
            <label className="block text-sm font-cta font-medium text-foreground mb-2">
              Content Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterUpdate('contentType', 'all')}
                className={`px-4 py-2 rounded-lg text-sm font-cta transition-all duration-200 ${
                  filters.contentType === 'all' ?'bg-primary text-primary-foreground' :'bg-background text-foreground border border-border hover:border-primary'
                }`}
              >
                All Types
              </button>
              {contentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterUpdate('contentType', type)}
                  className={`px-4 py-2 rounded-lg text-sm font-cta transition-all duration-200 ${
                    filters.contentType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground border border-border hover:border-primary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Time Filter */}
          <div>
            <label className="block text-sm font-cta font-medium text-foreground mb-2">
              Reading Time
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Any Length' },
                { value: 'quick', label: 'Quick Read (< 5 min)' },
                { value: 'medium', label: 'Medium (5-15 min)' },
                { value: 'long', label: 'Deep Dive (> 15 min)' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterUpdate('readingTime', option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-cta transition-all duration-200 ${
                    filters.readingTime === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground border border-border hover:border-primary'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-cta font-medium text-foreground mb-2">
              Tags ({filters.selectedTags.length} selected)
            </label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-cta transition-all duration-200 ${
                    filters.selectedTags.includes(tag)
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-background text-foreground border border-border hover:border-accent'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}