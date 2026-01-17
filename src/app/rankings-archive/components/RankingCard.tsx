import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface RankingCardProps {
  ranking: {
    id: string;
    title: string;
    month: string;
    year: number;
    category: string;
    image: string;
    alt: string;
    totalItems: number;
    views: number;
    comments: number;
    shares: number;
  };
  onClick: () => void;
}

export default function RankingCard({ ranking, onClick }: RankingCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-card rounded-lg overflow-hidden warm-shadow hover:warm-shadow-lg transition-all duration-300 cursor-pointer border border-border hover:border-accent"
    >
      <div className="relative h-48 overflow-hidden">
        <AppImage
          src={ranking.image}
          alt={ranking.alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/80 via-coffee-dark/40 to-transparent" />
        <div className="absolute top-3 right-3 px-3 py-1 bg-accent/90 backdrop-blur-sm rounded-full">
          <span className="text-xs font-cta font-bold text-accent-foreground">
            {ranking.category}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-headline text-lg font-bold text-white mb-1 line-clamp-2">
            {ranking.title}
          </h3>
          <p className="text-sm text-cream/90 font-cta">
            {ranking.month} {ranking.year}
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="ListBulletIcon" size={16} className="text-accent" />
            <span className="font-cta">{ranking.totalItems} items</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="EyeIcon" size={16} />
              <span className="font-cta">{ranking.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="ChatBubbleLeftIcon" size={16} />
              <span className="font-cta">{ranking.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="ShareIcon" size={16} />
              <span className="font-cta">{ranking.shares}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}