import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface FeaturedArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  alt: string;
  href: string;
}

interface HeroSectionProps {
  featuredArticles: FeaturedArticle[];
  currentIndex: number;
}

const HeroSection = ({ featuredArticles, currentIndex }: HeroSectionProps) => {
  const currentArticle = featuredArticles[currentIndex];

  return (
    <section className="relative bg-gradient-to-br from-background via-card to-muted overflow-hidden">
      <div className="absolute inset-0 coffee-stain opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-full">
              <Icon name="SparklesIcon" size={20} className="text-accent" />
              <span className="font-cta text-sm font-medium text-accent">Featured Story</span>
            </div>
            
            <h1 className="font-headline text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight text-shadow-warm">
              {currentArticle.title}
            </h1>
            
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              {currentArticle.excerpt}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="FolderIcon" size={18} />
                <span className="font-cta">{currentArticle.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="ClockIcon" size={18} />
                <span className="font-cta">{currentArticle.readTime}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href={currentArticle.href}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent to-gold text-accent-foreground font-cta font-bold rounded-lg warm-shadow hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span>Read Full Story</span>
                <Icon name="ArrowRightIcon" size={20} />
              </Link>
              
              <button className="inline-flex items-center space-x-2 px-6 py-3 bg-card text-foreground font-cta font-medium rounded-lg border-2 border-border hover:border-accent transition-all duration-300">
                <Icon name="BookmarkIcon" size={20} />
                <span>Save for Later</span>
              </button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden warm-shadow-lg">
              <AppImage
                src={currentArticle.image}
                alt={currentArticle.alt}
                className="w-full h-full object-cover sepia-filter"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/60 to-transparent" />
            </div>
            
            {/* Decorative Coffee Stain */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold/20 rounded-full blur-2xl" />
          </div>
        </div>
        
        {/* Article Indicators */}
        <div className="flex justify-center space-x-2 mt-12">
          {featuredArticles.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-accent' :'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;