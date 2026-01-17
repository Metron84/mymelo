'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterBarProps {
  categories: string[];
  years: number[];
  onFilterChange: (filters: { category: string; year: string; search: string }) => void;
}

export default function FilterBar({ categories, years, onFilterChange }: FilterBarProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFilterChange({ category, year: selectedYear, search: searchQuery });
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    onFilterChange({ category: selectedCategory, year, search: searchQuery });
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    onFilterChange({ category: selectedCategory, year: selectedYear, search });
  };

  return (
    <div className="bg-card rounded-lg warm-shadow border border-border p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-cta font-medium text-foreground mb-2">
            Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-body text-foreground appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Icon
              name="ChevronDownIcon"
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-cta font-medium text-foreground mb-2">
            Year
          </label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-body text-foreground appearance-none cursor-pointer"
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
            <Icon
              name="ChevronDownIcon"
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-cta font-medium text-foreground mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search rankings..."
              className="w-full px-4 py-2.5 pl-10 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-body text-foreground placeholder:text-muted-foreground"
            />
            <Icon
              name="MagnifyingGlassIcon"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}