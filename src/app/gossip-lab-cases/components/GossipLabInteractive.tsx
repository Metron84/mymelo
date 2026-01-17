'use client';

import { useState, useEffect } from 'react';

import FilterBar, { FilterState } from './FilterBar';
import AhwehIndexExplainer from './AhwehIndexExplainer';
import CaseDetailModal from './CaseDetailModal';
import Icon from '@/components/ui/AppIcon';

interface CaseData {
  id: string;
  caseNumber: string;
  title: string;
  excerpt: string;
  fullContent: string;
  ahwehIndex: number;
  culturalContext: string;
  datePublished: string;
  readTime: number;
  tags: string[];
  image: string;
  alt: string;
  anonymizationLevel: 'High' | 'Medium' | 'Low';
  relatedCases: Array<{
    id: string;
    caseNumber: string;
    title: string;
  }>;
  culturalPatterns: string[];
}

export default function GossipLabInteractive() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filteredCases, setFilteredCases] = useState<CaseData[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);

  const mockCases: CaseData[] = [];

  useEffect(() => {
    setIsHydrated(true);
    setFilteredCases([]);
  }, []);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...mockCases];

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
        c.title.toLowerCase().includes(query) ||
        c.excerpt.toLowerCase().includes(query) ||
        c.culturalContext.toLowerCase().includes(query) ||
        c.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Ahweh Index range
    filtered = filtered.filter(
      (c) => c.ahwehIndex >= filters.ahwehIndexRange[0] && c.ahwehIndex <= filters.ahwehIndexRange[1]
    );

    // Cultural context
    if (filters.culturalContext !== 'all') {
      filtered = filtered.filter((c) =>
      c.culturalContext.toLowerCase().includes(filters.culturalContext)
      );
    }

    // Anonymization level
    if (filters.anonymizationLevel !== 'all') {
      filtered = filtered.filter(
        (c) => c.anonymizationLevel.toLowerCase() === filters.anonymizationLevel
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.datePublished).getTime() - new Date(b.datePublished).getTime());
        break;
      case 'ahweh-high':
        filtered.sort((a, b) => b.ahwehIndex - a.ahwehIndex);
        break;
      case 'ahweh-low':
        filtered.sort((a, b) => a.ahwehIndex - b.ahwehIndex);
        break;
      case 'popular':
        // Mock popularity sort
        filtered.sort((a, b) => b.ahwehIndex - a.ahwehIndex);
        break;
    }

    setFilteredCases(filtered);
  };

  const handleCaseClick = (id: string) => {
    const caseData = mockCases.find((c) => c.id === id);
    if (caseData) {
      setSelectedCase(caseData);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCase(null), 300);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-12 bg-muted/20 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-muted/20 rounded-lg w-96 mx-auto animate-pulse" />
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
            <Icon name="BeakerIcon" size={40} className="text-accent" />
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
              The Gossip Lab
            </h1>
          </div>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">
            Where social narratives meet cultural analysis. Anonymized stories from Lebanese life, examined with care, respect, and the signature Ahweh Index rating system.
          </p>
        </div>

        {/* Ahweh Index Explainer Toggle */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="flex items-center space-x-2 px-6 py-3 bg-accent/10 hover:bg-accent/20 text-accent font-cta font-medium rounded-lg border border-accent/20 transition-all duration-200"
          >
            <Icon name="InformationCircleIcon" size={20} />
            <span>{showExplainer ? 'Hide' : 'Learn About'} the Ahweh Index</span>
            <Icon
              name={showExplainer ? 'ChevronUpIcon' : 'ChevronDownIcon'}
              size={16}
            />
          </button>
        </div>

        {/* Ahweh Index Explainer */}
        {showExplainer && <AhwehIndexExplainer />}

        {/* Filter Bar */}
        <FilterBar onFilterChange={handleFilterChange} totalCases={0} />

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
              <Icon name="BeakerIcon" size={40} className="text-accent" />
            </div>
            <h3 className="font-headline text-2xl font-bold text-foreground">
              No Cases Yet
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              The Gossip Lab awaits its first stories. This space will feature anonymized social narratives from Lebanese life, 
              each analyzed through cultural lenses and rated with the Ahweh Index system. Cases will be added with care, 
              respect for privacy, and attention to the cultural patterns they reveal.
            </p>
            <div className="pt-4">
              <p className="font-body text-sm text-muted-foreground italic">
                &quot;Every story carries wisdom if we listen carefully enough to hear it.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Case Detail Modal */}
        <CaseDetailModal
          caseData={selectedCase}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}