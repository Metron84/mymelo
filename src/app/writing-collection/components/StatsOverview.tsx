import Icon from '@/components/ui/AppIcon';

interface StatsOverviewProps {
  stats: {
    totalWritings: number;
    totalReadingTime: number;
    totalViews: number;
    recentPublications: number;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const statItems = [
    {
      icon: 'DocumentTextIcon',
      label: 'Total Writings',
      value: stats.totalWritings.toLocaleString(),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: 'ClockIcon',
      label: 'Reading Hours',
      value: Math.round(stats.totalReadingTime / 60).toLocaleString(),
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: 'EyeIcon',
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: 'SparklesIcon',
      label: 'Recent (30d)',
      value: stats.recentPublications.toLocaleString(),
      color: 'text-gold',
      bgColor: 'bg-gold/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-card rounded-lg warm-shadow p-4 sm:p-5 hover:shadow-lg transition-all duration-300"
        >
          <div className={`inline-flex p-3 rounded-lg ${item.bgColor} mb-3`}>
            <Icon name={item.icon as any} size={24} className={item.color} />
          </div>
          <div className="text-2xl sm:text-3xl font-headline font-bold text-foreground mb-1">
            {item.value}
          </div>
          <div className="text-sm text-muted-foreground font-cta">{item.label}</div>
        </div>
      ))}
    </div>
  );
}