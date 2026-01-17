'use client';

import { useState, useEffect } from 'react';
import FilterBar from './FilterBar';

import StatsOverview from './StatsOverview';


interface FilterState {
  contentType: string;
  sortBy: string;
  readingTime: string;
  selectedTags: string[];
  searchQuery: string;
}

interface Writing {
  id: string;
  title: string;
  excerpt: string;
  contentType: string;
  readingTime: number;
  publishDate: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  tags: string[];
  views: number;
  relatedCount: number;
  publishTimestamp: number;
}

const mockWritings: Writing[] = [];


const contentTypes = ['Articles', 'Essays', 'Screenplays', 'Miscellaneous'];
const allTags = Array.from(new Set(mockWritings.flatMap((w) => w.tags))).sort();

export default function WritingCollectionInteractive() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filteredWritings, setFilteredWritings] = useState<Writing[]>([]);
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    contentType: 'all',
    sortBy: 'newest',
    readingTime: 'all',
    selectedTags: [],
    searchQuery: ''
  });

  useEffect(() => {
    setIsHydrated(true);
    setFilteredWritings(mockWritings);
  }, []);

  const handleFilterChange = (filters: FilterState) => {
    setCurrentFilters(filters);

    let filtered = [...mockWritings];

    // Content Type Filter
    if (filters.contentType !== 'all') {
      filtered = filtered.filter((w) => w.contentType === filters.contentType);
    }

    // Reading Time Filter
    if (filters.readingTime !== 'all') {
      if (filters.readingTime === 'quick') {
        filtered = filtered.filter((w) => w.readingTime < 5);
      } else if (filters.readingTime === 'medium') {
        filtered = filtered.filter((w) => w.readingTime >= 5 && w.readingTime <= 15);
      } else if (filters.readingTime === 'long') {
        filtered = filtered.filter((w) => w.readingTime > 15);
      }
    }

    // Tags Filter
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter((w) =>
      filters.selectedTags.some((tag) => w.tags.includes(tag))
      );
    }

    // Search Query Filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (w) =>
        w.title.toLowerCase().includes(query) ||
        w.excerpt.toLowerCase().includes(query) ||
        w.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sorting
    if (filters.sortBy === 'newest') {
      filtered.sort((a, b) => b.publishTimestamp - a.publishTimestamp);
    } else if (filters.sortBy === 'oldest') {
      filtered.sort((a, b) => a.publishTimestamp - b.publishTimestamp);
    } else if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => b.views - a.views);
    } else if (filters.sortBy === 'reading-time-short') {
      filtered.sort((a, b) => a.readingTime - b.readingTime);
    } else if (filters.sortBy === 'reading-time-long') {
      filtered.sort((a, b) => b.readingTime - a.readingTime);
    }

    setFilteredWritings(filtered);
  };

  const handleClearFilters = () => {
    const resetFilters: FilterState = {
      contentType: 'all',
      sortBy: 'newest',
      readingTime: 'all',
      selectedTags: [],
      searchQuery: ''
    };
    setCurrentFilters(resetFilters);
    setFilteredWritings(mockWritings);
  };

  const stats = {
    totalWritings: 0,
    totalReadingTime: 0,
    totalViews: 0,
    recentPublications: 0
  };

  const hasActiveFilters =
  currentFilters.contentType !== 'all' ||
  currentFilters.readingTime !== 'all' ||
  currentFilters.selectedTags.length > 0 ||
  currentFilters.searchQuery !== '';

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-card rounded-lg" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) =>
            <div key={i} className="h-32 bg-card rounded-lg" />
            )}
          </div>
          <div className="h-96 bg-card rounded-lg" />
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Filter Bar */}
      <FilterBar
        onFilterChange={handleFilterChange}
        contentTypes={contentTypes}
        tags={allTags} />


      {/* Empty State */}
      <div className="text-center py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="font-headline text-2xl font-bold text-foreground">
            No Content Yet
          </h3>
          <p className="font-body text-muted-foreground leading-relaxed">
            The Writing Sanctuary is ready to welcome essays, articles, screenplays, and creative narratives. 
            Content will be added as the sanctuary grows, each piece crafted with the care of a perfectly brewed cup of ahweh.
          </p>
          <div className="pt-4">
            <p className="font-body text-sm text-muted-foreground italic">
              &quot;Every great collection begins with an empty shelf and a vision of what it might become.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>);

}