'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterPanelProps {
  onFilterChange: (filters: {
    contentTypes: string[];
    themes: string[];
    connectionStrength: string;
  }) => void;
}

const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [connectionStrength, setConnectionStrength] = useState('all');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      onFilterChange({
        contentTypes: selectedContentTypes,
        themes: selectedThemes,
        connectionStrength,
      });
    }
  }, [selectedContentTypes, selectedThemes, connectionStrength, isHydrated, onFilterChange]);

  const contentTypes = [
    { id: 'article', label: 'Articles', icon: 'DocumentTextIcon' },
    { id: 'essay', label: 'Essays', icon: 'PencilSquareIcon' },
    { id: 'roundtable', label: 'Roundtables', icon: 'UserGroupIcon' },
    { id: 'gossip', label: 'Gossip Lab', icon: 'BeakerIcon' },
    { id: 'ranking', label: 'Rankings', icon: 'ChartBarIcon' },
    { id: 'media', label: 'Media', icon: 'PlayIcon' },
  ];

  const themes = [
    'Lebanese Culture',
    'Philosophy',
    'Social Dynamics',
    'Emotional Intelligence',
    'Cultural Identity',
    'Hospitality',
    'Diaspora Experience',
    'Coffee Culture',
  ];

  const toggleContentType = (typeId: string) => {
    setSelectedContentTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme)
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const clearAllFilters = () => {
    setSelectedContentTypes([]);
    setSelectedThemes([]);
    setConnectionStrength('all');
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 warm-shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border warm-shadow">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-headline text-lg font-bold text-foreground flex items-center space-x-2">
          <Icon name="AdjustmentsHorizontalIcon" size={20} />
          <span>Filters</span>
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-muted rounded transition-colors lg:hidden"
        >
          <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={20} />
        </button>
      </div>

      <div className={`p-4 space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Content Types */}
        <div>
          <h3 className="font-cta text-sm font-bold text-foreground mb-3">Content Types</h3>
          <div className="space-y-2">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => toggleContentType(type.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  selectedContentTypes.includes(type.id)
                    ? 'bg-accent text-accent-foreground warm-shadow'
                    : 'bg-muted text-foreground hover:bg-accent/20'
                }`}
              >
                <Icon name={type.icon as any} size={18} />
                <span className="font-body text-sm">{type.label}</span>
                {selectedContentTypes.includes(type.id) && (
                  <Icon name="CheckIcon" size={16} className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Themes */}
        <div>
          <h3 className="font-cta text-sm font-bold text-foreground mb-3">Themes</h3>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => toggleTheme(theme)}
                className={`px-3 py-1.5 rounded-full text-xs font-cta font-medium transition-all duration-200 ${
                  selectedThemes.includes(theme)
                    ? 'bg-accent text-accent-foreground warm-shadow'
                    : 'bg-muted text-foreground hover:bg-accent/20'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Connection Strength */}
        <div>
          <h3 className="font-cta text-sm font-bold text-foreground mb-3">Connection Strength</h3>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Connections' },
              { value: 'strong', label: 'Strong (≥70%)' },
              { value: 'moderate', label: 'Moderate (40-70%)' },
              { value: 'weak', label: 'Weak (<40%)' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setConnectionStrength(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                  connectionStrength === option.value
                    ? 'bg-accent text-accent-foreground warm-shadow'
                    : 'bg-muted text-foreground hover:bg-accent/20'
                }`}
              >
                <span className="font-body text-sm">{option.label}</span>
                {connectionStrength === option.value && (
                  <Icon name="CheckCircleIcon" size={18} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedContentTypes.length > 0 || selectedThemes.length > 0 || connectionStrength !== 'all') && (
          <button
            onClick={clearAllFilters}
            className="w-full px-4 py-2 bg-destructive text-destructive-foreground font-cta font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          >
            <Icon name="XCircleIcon" size={18} />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;