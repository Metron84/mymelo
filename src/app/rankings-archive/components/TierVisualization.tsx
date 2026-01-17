import Icon from '@/components/ui/AppIcon';

interface TierItem {
  id: string;
  name: string;
  description: string;
  position: number;
}

interface TierVisualizationProps {
  tier: {
    level: string;
    color: string;
    label: string;
    items: TierItem[];
  };
}

export default function TierVisualization({ tier }: TierVisualizationProps) {
  const getTierGradient = (color: string) => {
    const gradients: Record<string, string> = {
      gold: 'from-yellow-400 to-yellow-600',
      silver: 'from-gray-300 to-gray-500',
      bronze: 'from-orange-400 to-orange-600',
      blue: 'from-blue-400 to-blue-600',
      green: 'from-green-400 to-green-600',
    };
    return gradients[color] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden warm-shadow border border-border">
      <div
        className={`px-6 py-4 bg-gradient-to-r ${getTierGradient(tier.color)}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="font-headline text-2xl font-bold text-white">
                {tier.level}
              </span>
            </div>
            <div>
              <h3 className="font-headline text-xl font-bold text-white">
                {tier.label}
              </h3>
              <p className="text-sm text-white/80 font-cta">
                {tier.items.length} {tier.items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <Icon name="StarIcon" size={24} className="text-white" variant="solid" />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {tier.items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <span className="font-cta font-bold text-sm text-accent">
                {item.position}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-cta font-semibold text-foreground mb-1">
                {item.name}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}