'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterBarProps {
  onFilterChange: (filters: {
    type: string;
    category: string;
    sortBy: string;
    searchQuery: string;
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (
    newType?: string,
    newCategory?: string,
    newSortBy?: string,
    newSearchQuery?: string
  ) => {
    const updatedType = newType ?? type;
    const updatedCategory = newCategory ?? category;
    const updatedSortBy = newSortBy ?? sortBy;
    const updatedSearchQuery = newSearchQuery ?? searchQuery;

    setType(updatedType);
    setCategory(updatedCategory);
    setSortBy(updatedSortBy);
    setSearchQuery(updatedSearchQuery);

    onFilterChange({
      type: updatedType,
      category: updatedCategory,
      sortBy: updatedSortBy,
      searchQuery: updatedSearchQuery,
    });
  };

  const typeOptions = [
    { value: 'all', label: 'All Media', icon: 'RectangleStackIcon' },
    { value: 'audio', label: 'Audio', icon: 'MusicalNoteIcon' },
    { value: 'video', label: 'Video', icon: 'VideoCameraIcon' },
  ];

  const categoryOptions = [
    'All Categories',
    'Philosophy',
    'Culture',
    'Debates',
    'Stories',
    'Interviews',
    'Reflections',
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'duration', label: 'Duration' },
    { value: 'title', label: 'Title A-Z' },
  ];

  return (
    <div className="bg-card rounded-lg p-4 warm-shadow mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Icon
          name="MagnifyingGlassIcon"
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search media library..."
          value={searchQuery}
          onChange={(e) => handleFilterChange(undefined, undefined, undefined, e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-xs font-cta font-medium text-muted-foreground mb-2">
            Media Type
          </label>
          <div className="flex space-x-2">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange(option.value)}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-cta font-medium transition-all duration-200 ${
                  type === option.value
                    ? 'bg-accent text-accent-foreground warm-shadow'
                    : 'bg-muted text-muted-foreground hover:bg-accent/20'
                }`}
              >
                <Icon name={option.icon as any} size={16} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-cta font-medium text-muted-foreground mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => handleFilterChange(undefined, e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat.toLowerCase().replace(' ', '-')}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-xs font-cta font-medium text-muted-foreground mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => handleFilterChange(undefined, undefined, e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}