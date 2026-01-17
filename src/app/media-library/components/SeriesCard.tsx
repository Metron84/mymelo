import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface SeriesCardProps {
  series: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    thumbnailAlt: string;
    episodeCount: number;
    totalDuration: string;
    category: string;
  };
  onSelect: (id: string) => void;
}

export default function SeriesCard({ series, onSelect }: SeriesCardProps) {
  return (
    <button
      onClick={() => onSelect(series.id)}
      className="w-full bg-card rounded-lg overflow-hidden warm-shadow hover:warm-shadow-lg transition-all duration-300 group text-left"
    >
      <div className="relative aspect-video overflow-hidden">
        <AppImage
          src={series.thumbnail}
          alt={series.thumbnailAlt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/80 via-coffee-dark/20 to-transparent" />
        
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 bg-accent/90 rounded text-xs font-cta font-bold text-accent-foreground">
              {series.category}
            </span>
            <span className="px-2 py-1 bg-coffee-dark/90 rounded text-xs font-cta font-medium text-cream">
              {series.episodeCount} Episodes
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-headline text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
          {series.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {series.description}
        </p>
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Icon name="ClockIcon" size={14} />
            <span>{series.totalDuration}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="PlayIcon" size={14} />
            <span>{series.episodeCount} episodes</span>
          </span>
        </div>
      </div>
    </button>
  );
}