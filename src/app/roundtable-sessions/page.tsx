import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import RoundtableInteractive from './components/RoundtableInteractive';
import Icon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
  title: 'Roundtable Sessions - MrMelo Sanctuary',
  description: 'Interactive debate archive where Feelers vs Thinkers discussions are beautifully presented with synthesis summaries celebrating the art of deep thinking through emotional intuition and analytical rigor.',
};

export default function RoundtableSessionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-accent" />
              <span className="text-sm font-cta font-bold text-accent">
                Roundtable Chamber
              </span>
            </div>
            
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Where Hearts Meet Minds
            </h1>
            
            <p className="text-lg md:text-xl font-body text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              In the tradition of Lebanese coffeehouses, we gather to explore life&apos;s deepest questions through the lens of Feelers and Thinkers. Here, emotional wisdom and analytical rigor dance together, seeking synthesis in thoughtful discourse.
            </p>

            {/* Philosophy Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-br from-error/5 to-transparent p-6 rounded-lg border border-error/20 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-error animate-pulse" />
                  <h3 className="font-headline text-xl font-bold text-error">
                    The Feeler&apos;s Path
                  </h3>
                </div>
                <p className="text-sm font-body text-foreground/80">
                  Guided by empathy, intuition, and emotional intelligence. Feelers champion the wisdom of the heart, believing that true understanding comes from connection and lived experience.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-lg border border-primary/20 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <h3 className="font-headline text-xl font-bold text-primary">
                    The Thinker&apos;s Path
                  </h3>
                </div>
                <p className="text-sm font-body text-foreground/80">
                  Driven by logic, analysis, and systematic reasoning. Thinkers advocate for clarity and objectivity, believing that truth emerges through rigorous examination and evidence.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-accent/5 to-gold/5 rounded-lg border border-accent/20 max-w-2xl mx-auto">
              <Icon name="LightBulbIcon" size={24} className="text-accent flex-shrink-0" />
              <p className="text-sm font-body text-foreground/90 text-left">
                <span className="font-bold text-accent">The Synthesis:</span> The richest insights emerge when we honor both perspectives, allowing heart and mind to inform each other in pursuit of deeper truth.
              </p>
            </div>
          </div>

          {/* Interactive Content */}
          <RoundtableInteractive />

          {/* Community Guidelines */}
          <div className="mt-16 p-8 bg-gradient-to-br from-card to-muted/20 rounded-lg warm-shadow border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="SparklesIcon" size={28} className="text-accent" />
              <h2 className="font-headline text-2xl font-bold text-foreground">
                Coffeehouse Guidelines
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="HeartIcon" size={20} className="text-error flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-cta font-bold text-foreground mb-1">
                      Respect All Perspectives
                    </h4>
                    <p className="text-sm font-body text-muted-foreground">
                      Every viewpoint carries wisdom. Listen with curiosity, not judgment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="ChatBubbleLeftIcon" size={20} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-cta font-bold text-foreground mb-1">
                      Engage Thoughtfully
                    </h4>
                    <p className="text-sm font-body text-muted-foreground">
                      Take time to understand before responding. Quality over speed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="LightBulbIcon" size={20} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-cta font-bold text-foreground mb-1">
                      Seek Synthesis
                    </h4>
                    <p className="text-sm font-body text-muted-foreground">
                      Look for common ground and integrated insights beyond either/or thinking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="UserGroupIcon" size={20} className="text-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-cta font-bold text-foreground mb-1">
                      Build Community
                    </h4>
                    <p className="text-sm font-body text-muted-foreground">
                      We&apos;re here to learn together, not to win arguments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-body text-muted-foreground">
              © {new Date().getFullYear()} MrMelo Sanctuary. Brewing wisdom, one debate at a time.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm font-cta text-muted-foreground hover:text-accent transition-colors">
                Guidelines
              </a>
              <a href="#" className="text-sm font-cta text-muted-foreground hover:text-accent transition-colors">
                About
              </a>
              <a href="#" className="text-sm font-cta text-muted-foreground hover:text-accent transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}