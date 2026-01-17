import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface ContentCardData {
  id: number;
  title: string;
  description: string;
  image: string;
  alt: string;
  category: string;
  itemCount: number;
  href: string;
  icon: string;
  color: string;
}

interface ContentCardProps {
  content: ContentCardData;
}

const ContentCard = ({ content }: ContentCardProps) => {
  return (
    <Link
      href={content.href}
      className="group block bg-card rounded-xl overflow-hidden warm-shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <AppImage
          src={content.image}
          alt={content.alt}
          className="w-full h-full object-cover sepia-filter group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/80 to-transparent" />
        
        <div className={`absolute top-4 left-4 flex items-center space-x-2 px-3 py-1.5 bg-${content.color}/90 backdrop-blur-sm rounded-full`}>
          <Icon name={content.icon as any} size={16} className="text-white" />
          <span className="font-cta text-xs font-bold text-white">{content.category}</span>
        </div>
        
        <div className="absolute bottom-4 right-4 flex items-center space-x-1 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-full">
          <Icon name="DocumentTextIcon" size={14} className="text-muted-foreground" />
          <span className="font-cta text-xs font-medium text-foreground">{content.itemCount}</span>
        </div>
      </div>
      
      <div className="p-6 space-y-3">
        <h3 className="font-headline text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-200">
          {content.title}
        </h3>
        
        <p className="font-body text-sm text-muted-foreground line-clamp-2">
          {content.description}
        </p>
        
        <div className="flex items-center space-x-2 text-accent font-cta font-medium text-sm">
          <span>Explore Collection</span>
          <Icon
            name="ArrowRightIcon"
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;