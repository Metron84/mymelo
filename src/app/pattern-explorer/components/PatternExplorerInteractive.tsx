'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import NetworkVisualization from './NetworkVisualization';
import FilterPanel from './FilterPanel';
import TagCloud from './TagCloud';
import RecommendationEngine from './RecommendationEngine';
import ExportPanel from './ExportPanel';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface ContentItem {
  id: string;
  title: string;
  type: 'writing' | 'ranking' | 'roundtable' | 'media';
  tags?: string[];
  category?: string;
  description?: string;
}

const PatternExplorerInteractive = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      // Fetch all content types
      const [writings, rankings, roundtables, media] = await Promise.all([
        supabase.from('writings').select('id, title, tags, category, excerpt').eq('status', 'published'),
        supabase.from('rankings').select('id, title, tags, category, description').eq('status', 'published'),
        supabase.from('roundtable_sessions').select('id, title, tags, category, description').eq('status', 'published'),
        supabase.from('media_items').select('id, title, tags, category, description').eq('status', 'published'),
      ]);

      const allContent: ContentItem[] = [
        ...(writings.data?.map(w => ({ 
          ...w, 
          type: 'writing' as const, 
          description: w.excerpt 
        })) || []),
        ...(rankings.data?.map(r => ({ ...r, type: 'ranking' as const })) || []),
        ...(roundtables.data?.map(rt => ({ ...rt, type: 'roundtable' as const })) || []),
        ...(media.data?.map(m => ({ ...m, type: 'media' as const })) || []),
      ];

      setContentItems(allContent);
      setFilteredContent(allContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = contentItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      item.category?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredContent(filtered);
  };

  const handleContentSelect = (contentId: string) => {
    const content = contentItems.find(item => item.id === contentId);
    if (content) {
      setSelectedContent(content);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Pattern Explorer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover the hidden connections between ideas, themes, and content across the MrMelo Sanctuary. 
              Explore how philosophical discourse, cultural analysis, and creative writing interweave in unexpected ways.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search content by title, tags, or category..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Filters
            </button>
          </div>
          {showFilters && (
            <div className="mt-4">
              <FilterPanel
                contentItems={contentItems}
                onFilterChange={setFilteredContent}
              />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Visualization and Tag Cloud */}
          <div className="lg:col-span-2 space-y-8">
            {/* Network Visualization */}
            <NetworkVisualization
              contentItems={filteredContent}
              onNodeClick={handleContentSelect}
            />

            {/* Tag Cloud */}
            <TagCloud contentItems={filteredContent} />

            {/* Export Options */}
            <ExportPanel
              contentItems={filteredContent}
              selectedContent={selectedContent}
            />
          </div>

          {/* Right Column: Recommendations */}
          <div className="lg:col-span-1">
            {selectedContent ? (
              <RecommendationEngine
                contentType={selectedContent.type}
                currentContent={{
                  title: selectedContent.title,
                  description: selectedContent.description,
                  tags: selectedContent.tags,
                  category: selectedContent.category,
                }}
                onRecommendationClick={handleContentSelect}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a content item from the visualization to see AI-powered recommendations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternExplorerInteractive;