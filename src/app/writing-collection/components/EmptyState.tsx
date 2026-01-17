import Icon from '@/components/ui/AppIcon';

interface EmptyStateProps {
  searchQuery?: string;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function EmptyState({ searchQuery, hasActiveFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon name="DocumentTextIcon" size={48} className="text-muted-foreground" />
      </div>
      
      <h3 className="font-headline text-2xl font-bold text-foreground mb-2 text-center">
        No Writings Found
      </h3>
      
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {searchQuery
          ? `No writings match your search for "${searchQuery}".`
          : hasActiveFilters
          ? 'No writings match your current filters.' :'The writing collection is currently empty.'}
      </p>

      {(searchQuery || hasActiveFilters) && (
        <button
          onClick={onClearFilters}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-cta font-medium hover:bg-opacity-90 transition-all duration-200"
        >
          <Icon name="ArrowPathIcon" size={18} />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
}