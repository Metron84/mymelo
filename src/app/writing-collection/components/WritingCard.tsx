import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface WritingCardProps {
  writing: {
    id: string;
    title: string;
    excerpt: string;
    contentType: string;
    readingTime: number;
    publishDate: string;
    featuredImage: string;
    featuredImageAlt: string;
    author: string;
    tags: string[];
    views: number;
    relatedCount: number;
  };
}

export default function WritingCard({ writing }: WritingCardProps) {
  return (
    <article className="group bg-card rounded-lg overflow-hidden warm-shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Featured Image */}
      <Link href={`/writing-collection/${writing.id}`} className="block relative h-48 sm:h-56 overflow-hidden">
        <AppImage
          src={writing.featuredImage}
          alt={writing.featuredImageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content Type Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-cta font-bold">
          {writing.contentType}
        </div>

        {/* Reading Time Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-cta font-medium text-foreground flex items-center space-x-1">
          <Icon name="ClockIcon" size={14} />
          <span>{writing.readingTime} min</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Title */}
        <Link href={`/writing-collection/${writing.id}`}>
          <h3 className="font-headline text-lg sm:text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {writing.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {writing.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {writing.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-cta"
            >
              #{tag}
            </span>
          ))}
          {writing.tags.length > 3 && (
            <span className="px-2 py-1 text-muted-foreground text-xs font-cta">
              +{writing.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="UserIcon" size={14} />
              <span className="font-cta">{writing.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="CalendarIcon" size={14} />
              <span className="font-cta">{writing.publishDate}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="EyeIcon" size={14} />
              <span className="font-cta">{writing.views}</span>
            </div>
            {writing.relatedCount > 0 && (
              <div className="flex items-center space-x-1 text-accent">
                <Icon name="LinkIcon" size={14} />
                <span className="font-cta">{writing.relatedCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}