'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface MediaCardProps {
  media: {
    id: string;
    title: string;
    type: 'audio' | 'video';
    thumbnail: string;
    thumbnailAlt: string;
    duration: string;
    publishDate: string;
    description: string;
    series?: string;
    episode?: number;
    tags: string[];
    views: number;
    hasTranscript: boolean;
  };
  onPlay: (id: string) => void;
}

export default function MediaCard({ media, onPlay }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-card rounded-lg overflow-hidden warm-shadow hover:warm-shadow-lg transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <AppImage
          src={media.thumbnail}
          alt={media.thumbnailAlt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/80 via-coffee-dark/20 to-transparent" />
        
        {/* Play Button Overlay */}
        <button
          onClick={() => onPlay(media.id)}
          className="absolute inset-0 flex items-center justify-center bg-coffee-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label={`Play ${media.title}`}
        >
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center warm-shadow-lg transform transition-transform duration-300 hover:scale-110">
            <Icon name="PlayIcon" variant="solid" size={32} className="text-accent-foreground ml-1" />
          </div>
        </button>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-coffee-dark/90 rounded text-xs font-cta font-medium text-cream">
          {media.duration}
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-accent/90 rounded text-xs font-cta font-bold text-accent-foreground flex items-center space-x-1">
          <Icon
            name={media.type === 'audio' ? 'MusicalNoteIcon' : 'VideoCameraIcon'}
            size={14}
            variant="solid"
          />
          <span className="uppercase">{media.type}</span>
        </div>

        {/* Transcript Badge */}
        {media.hasTranscript && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-success/90 rounded text-xs font-cta font-medium text-success-foreground flex items-center space-x-1">
            <Icon name="DocumentTextIcon" size={14} variant="solid" />
            <span>Transcript</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Series Info */}
        {media.series && (
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-cta font-medium text-accent">
              {media.series}
            </span>
            {media.episode && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-cta text-muted-foreground">
                  Episode {media.episode}
                </span>
              </>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="font-headline text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {media.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {media.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Icon name="CalendarIcon" size={14} />
              <span>{media.publishDate}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="EyeIcon" size={14} />
              <span>{media.views.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {media.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-muted rounded text-xs font-cta text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 cursor-pointer"
            >
              #{tag}
            </span>
          ))}
          {media.tags.length > 3 && (
            <span className="px-2 py-1 text-xs font-cta text-muted-foreground">
              +{media.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}