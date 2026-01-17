'use client';

import Icon from '@/components/ui/AppIcon';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

const StatCard = ({ icon, label, value, trend, color }: StatCardProps) => {
  return (
    <div className="bg-card rounded-lg warm-shadow border border-border p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon name={icon as any} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-cta font-bold ${
            trend.isPositive ? 'text-success' : 'text-error'
          }`}>
            <Icon
              name={trend.isPositive ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'}
              size={14}
            />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-headline font-bold text-foreground mb-1">
        {value}
      </p>
      <p className="text-sm font-body text-muted-foreground">
        {label}
      </p>
    </div>
  );
};

interface StatsOverviewProps {
  stats: {
    totalDebates: number;
    activeDebates: number;
    totalParticipants: number;
    totalComments: number;
  };
}

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const statCards = [
    {
      icon: 'ChatBubbleLeftRightIcon',
      label: 'Total Debates',
      value: stats.totalDebates,
      trend: { value: 12, isPositive: true },
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: 'BoltIcon',
      label: 'Active Debates',
      value: stats.activeDebates,
      trend: { value: 8, isPositive: true },
      color: 'bg-success/10 text-success',
    },
    {
      icon: 'UserGroupIcon',
      label: 'Total Participants',
      value: stats.totalParticipants,
      trend: { value: 15, isPositive: true },
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: 'ChatBubbleLeftIcon',
      label: 'Total Comments',
      value: stats.totalComments,
      trend: { value: 23, isPositive: true },
      color: 'bg-gold/10 text-gold',
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsOverview;