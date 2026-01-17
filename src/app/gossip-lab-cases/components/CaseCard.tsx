'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface CaseCardProps {
  caseData: {
    id: string;
    caseNumber: string;
    title: string;
    excerpt: string;
    ahwehIndex: number;
    culturalContext: string;
    datePublished: string;
    readTime: number;
    tags: string[];
    image: string;
    alt: string;
    anonymizationLevel: 'High' | 'Medium' | 'Low';
  };
  onCaseClick: (id: string) => void;
}

export default function CaseCard({ caseData, onCaseClick }: CaseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getAhwehIndexColor = (index: number): string => {
    if (index >= 8) return 'text-success';
    if (index >= 5) return 'text-warning';
    return 'text-error';
  };

  const getAnonymizationBadgeColor = (level: string): string => {
    switch (level) {
      case 'High':
        return 'bg-success/10 text-success border-success/20';
      case 'Medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Low':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <article
      className="bg-card rounded-lg warm-shadow hover:warm-shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onCaseClick(caseData.id)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <AppImage
          src={caseData.image}
          alt={caseData.alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/80 via-coffee-dark/40 to-transparent" />
        
        {/* Case Number Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-accent/90 backdrop-blur-sm rounded-lg">
          <span className="font-cta font-bold text-sm text-accent-foreground">
            {caseData.caseNumber}
          </span>
        </div>

        {/* Anonymization Level Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 backdrop-blur-sm rounded-lg border ${getAnonymizationBadgeColor(caseData.anonymizationLevel)}`}>
          <span className="font-cta font-medium text-xs">
            {caseData.anonymizationLevel} Privacy
          </span>
        </div>

        {/* Ahweh Index */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 px-3 py-2 bg-card/90 backdrop-blur-sm rounded-lg warm-shadow">
          <Icon name="FireIcon" size={20} className={getAhwehIndexColor(caseData.ahwehIndex)} />
          <span className={`font-cta font-bold text-lg ${getAhwehIndexColor(caseData.ahwehIndex)}`}>
            {caseData.ahwehIndex}/10
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="font-headline text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {caseData.title}
        </h3>

        {/* Excerpt */}
        <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-3">
          {caseData.excerpt}
        </p>

        {/* Cultural Context */}
        <div className="flex items-start space-x-2 mb-4 p-3 bg-muted/30 rounded-lg">
          <Icon name="GlobeAltIcon" size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-cta text-xs font-medium text-accent mb-1">Cultural Context</p>
            <p className="font-body text-xs text-foreground line-clamp-2">
              {caseData.culturalContext}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {caseData.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-secondary/20 text-secondary-foreground text-xs font-cta font-medium rounded-full hover:bg-secondary/30 transition-colors duration-200"
            >
              #{tag}
            </span>
          ))}
          {caseData.tags.length > 3 && (
            <span className="px-2.5 py-1 bg-muted/20 text-muted-foreground text-xs font-cta font-medium rounded-full">
              +{caseData.tags.length - 3}
            </span>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1.5">
              <Icon name="CalendarIcon" size={14} />
              <span className="font-body">{caseData.datePublished}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Icon name="ClockIcon" size={14} />
              <span className="font-body">{caseData.readTime} min read</span>
            </div>
          </div>

          {/* Read More Arrow */}
          <div className={`flex items-center space-x-1 text-primary transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
            <span className="font-cta text-sm font-medium">Explore</span>
            <Icon name="ArrowRightIcon" size={16} />
          </div>
        </div>
      </div>
    </article>
  );
}