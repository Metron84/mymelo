'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  totalDebates: number;
}

interface FilterState {
  status: string;
  sortBy: string;
  searchQuery: string;
}

const FilterBar = ({ onFilterChange, totalDebates }: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    sortBy: 'recent',
    searchQuery: '',
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Debates', icon: 'ChatBubbleLeftRightIcon' },
    { value: 'active', label: 'Active', icon: 'BoltIcon' },
    { value: 'resolved', label: 'Resolved', icon: 'CheckCircleIcon' },
    { value: 'archived', label: 'Archived', icon: 'ArchiveBoxIcon' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', icon: 'ClockIcon' },
    { value: 'popular', label: 'Most Popular', icon: 'FireIcon' },
    { value: 'commented', label: 'Most Commented', icon: 'ChatBubbleLeftIcon' },
    { value: 'participants', label: 'Most Participants', icon: 'UserGroupIcon' },
  ];

  const handleFilterUpdate = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterUpdate('searchQuery', e.target.value);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      status: 'all',
      sortBy: 'recent',
      searchQuery: '',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = filters.status !== 'all' || filters.sortBy !== 'recent' || filters.searchQuery !== '';

  return (
    <div className="bg-card rounded-lg warm-shadow border border-border p-4 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Icon
          name="MagnifyingGlassIcon"
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search debates by title, topic, or tags..."
          value={filters.searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
        />
      </div>

      {/* Filter Toggle Button (Mobile) */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-2 bg-muted/30 rounded-lg text-sm font-cta text-foreground mb-4"
      >
        <span className="flex items-center gap-2">
          <Icon name="AdjustmentsHorizontalIcon" size={18} />
          <span>Filters & Sort</span>
        </span>
        <Icon
          name={isFilterOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'}
          size={18}
        />
      </button>

      {/* Filters */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-cta font-medium text-muted-foreground mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterUpdate('status', option.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-cta transition-all ${
                    filters.status === option.value
                      ? 'bg-primary text-primary-foreground warm-shadow'
                      : 'bg-background text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  <Icon name={option.icon as any} size={16} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-cta font-medium text-muted-foreground mb-2">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterUpdate('sortBy', option.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-cta transition-all ${
                    filters.sortBy === option.value
                      ? 'bg-accent text-accent-foreground warm-shadow'
                      : 'bg-background text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  <Icon name={option.icon as any} size={16} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results & Clear */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm font-body text-muted-foreground">
            Showing <span className="font-bold text-foreground">{totalDebates}</span> debates
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-cta text-error hover:bg-error/10 rounded-lg transition-colors"
            >
              <Icon name="XMarkIcon" size={16} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;