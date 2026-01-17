import Icon from '@/components/ui/AppIcon';

interface Quote {
  text: string;
  author: string;
  context: string;
}

interface PhilosophicalQuoteProps {
  quote: Quote;
}

const PhilosophicalQuote = ({ quote }: PhilosophicalQuoteProps) => {
  return (
    <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-gold/5 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <Icon
            name="ChatBubbleLeftRightIcon"
            size={48}
            className="absolute -top-4 -left-4 text-accent/20"
          />
          
          <blockquote className="relative pl-8 border-l-4 border-accent">
            <p className="font-headline text-2xl lg:text-3xl font-semibold text-foreground italic leading-relaxed mb-4">
              &quot;{quote.text}&quot;
            </p>
            
            <footer className="space-y-1">
              <cite className="font-cta text-lg font-medium text-primary not-italic">
                — {quote.author}
              </cite>
              <p className="font-body text-sm text-muted-foreground">
                {quote.context}
              </p>
            </footer>
          </blockquote>
          
          <Icon
            name="ChatBubbleLeftRightIcon"
            size={48}
            className="absolute -bottom-4 -right-4 text-gold/20 rotate-180"
          />
        </div>
      </div>
    </section>
  );
};

export default PhilosophicalQuote;