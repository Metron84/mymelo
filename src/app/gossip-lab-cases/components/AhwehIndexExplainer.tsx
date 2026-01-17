import Icon from '@/components/ui/AppIcon';

export default function AhwehIndexExplainer() {
  const indexLevels = [
    {
      range: '9-10',
      label: 'Legendary Brew',
      description: 'Stories so rich they deserve multiple cups of ahweh and hours of discussion',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
    },
    {
      range: '7-8',
      label: 'Strong Blend',
      description: 'Compelling narratives with deep cultural insights and engaging complexity',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
    {
      range: '5-6',
      label: 'Balanced Cup',
      description: 'Interesting cases with moderate cultural significance and analysis depth',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
    },
    {
      range: '3-4',
      label: 'Light Roast',
      description: 'Straightforward stories with basic cultural context and limited complexity',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/10',
      borderColor: 'border-muted/20',
    },
    {
      range: '1-2',
      label: 'Mild Sip',
      description: 'Simple observations with minimal cultural depth or analytical layers',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
    },
  ];

  return (
    <div className="bg-card rounded-lg warm-shadow p-6 mb-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="FireIcon" size={28} className="text-accent" />
        <div>
          <h2 className="font-headline text-2xl font-bold text-foreground">
            The Ahweh Index
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Our signature rating system measuring cultural richness, narrative complexity, and discussion potential
          </p>
        </div>
      </div>
      {/* Index Levels */}
      <div className="space-y-3">
        {indexLevels?.map((level, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${level?.bgColor} ${level?.borderColor} transition-all duration-200 hover:warm-shadow`}
          >
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-16 h-16 rounded-lg ${level?.bgColor} border ${level?.borderColor} flex items-center justify-center`}>
                <span className={`font-headline text-2xl font-bold ${level?.color}`}>
                  {level?.range}
                </span>
              </div>
              <div className="flex-1">
                <h3 className={`font-cta text-lg font-bold ${level?.color} mb-1`}>
                  {level?.label}
                </h3>
                <p className="font-body text-sm text-foreground">
                  {level?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Cultural Note */}
      <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-cta text-sm font-medium text-accent mb-1">
              Cultural Sensitivity Note
            </p>
            <p className="font-body text-xs text-foreground">
              The Ahweh Index celebrates the Lebanese coffeehouse tradition where stories are savored, analyzed, and discussed with care. Each rating reflects not just entertainment value, but the depth of cultural insight, ethical complexity, and potential for meaningful discourse. Like a perfectly brewed cup of ahweh, the best stories reveal their layers slowly and reward patient contemplation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}