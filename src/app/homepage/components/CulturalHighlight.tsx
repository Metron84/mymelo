import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface CulturalHighlightData {
  title: string;
  description: string;
  image: string;
  alt: string;
  facts: string[];
}

interface CulturalHighlightProps {
  highlight: CulturalHighlightData;
}

const CulturalHighlight = ({ highlight }: CulturalHighlightProps) => {
  return (
    <section className="bg-card py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden warm-shadow-lg">
              <AppImage
                src={highlight.image}
                alt={highlight.alt}
                className="w-full h-full object-cover sepia-filter"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
          </div>
          
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-full">
              <Icon name="GlobeAltIcon" size={20} className="text-accent" />
              <span className="font-cta text-sm font-medium text-accent">Cultural Insight</span>
            </div>
            
            <h2 className="font-headline text-3xl lg:text-4xl font-bold text-foreground">
              {highlight.title}
            </h2>
            
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              {highlight.description}
            </p>
            
            <div className="space-y-3">
              {highlight.facts.map((fact, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Icon name="CheckCircleIcon" size={20} className="text-accent shrink-0 mt-0.5" />
                  <p className="font-body text-foreground">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalHighlight;