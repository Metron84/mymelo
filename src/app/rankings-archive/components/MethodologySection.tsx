import Icon from '@/components/ui/AppIcon';

interface Criterion {
  id: string;
  name: string;
  weight: number;
  description: string;
  icon: string;
}

interface MethodologySectionProps {
  criteria: Criterion[];
}

export default function MethodologySection({ criteria }: MethodologySectionProps) {
  return (
    <div className="bg-card rounded-lg warm-shadow border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-coffee-medium px-6 py-4">
        <div className="flex items-center space-x-3">
          <Icon name="AcademicCapIcon" size={28} className="text-accent" variant="solid" />
          <div>
            <h2 className="font-headline text-2xl font-bold text-white">
              Ranking Methodology
            </h2>
            <p className="text-sm text-cream/90 font-cta">
              Transparent criteria for thoughtful evaluation
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <p className="text-muted-foreground font-body leading-relaxed">
            Each ranking is carefully crafted using a weighted scoring system that balances multiple perspectives. Our methodology honors both the emotional intuition of &quot;Feelers&quot; and the analytical rigor of &quot;Thinkers,&quot; ensuring comprehensive and culturally sensitive evaluations.
          </p>
        </div>

        <div className="space-y-4">
          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Icon
                  name={criterion.icon as any}
                  size={24}
                  className="text-accent"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-cta font-bold text-foreground">
                    {criterion.name}
                  </h3>
                  <span className="px-3 py-1 bg-accent/20 rounded-full text-sm font-cta font-bold text-accent">
                    {criterion.weight}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {criterion.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-start space-x-3">
            <Icon name="InformationCircleIcon" size={20} className="text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground font-body leading-relaxed">
              All rankings are subjective evaluations based on personal experience, cultural context, and community feedback. We encourage respectful discourse and diverse perspectives in the comments section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}