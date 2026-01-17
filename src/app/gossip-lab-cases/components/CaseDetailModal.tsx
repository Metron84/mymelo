'use client';

import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface CaseDetailModalProps {
  caseData: {
    id: string;
    caseNumber: string;
    title: string;
    fullContent: string;
    ahwehIndex: number;
    culturalContext: string;
    datePublished: string;
    readTime: number;
    tags: string[];
    image: string;
    alt: string;
    anonymizationLevel: 'High' | 'Medium' | 'Low';
    relatedCases: Array<{
      id: string;
      caseNumber: string;
      title: string;
    }>;
    culturalPatterns: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CaseDetailModal({ caseData, isOpen, onClose }: CaseDetailModalProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isHydrated]);

  if (!isOpen || !caseData || !isHydrated) return null;

  const getAhwehIndexColor = (index: number): string => {
    if (index >= 8) return 'text-success';
    if (index >= 5) return 'text-warning';
    return 'text-error';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: caseData.title,
        text: `Check out this case from the Gossip Lab: ${caseData.title}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-dark/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-lg warm-shadow-lg overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-card/90 backdrop-blur-sm rounded-full warm-shadow hover:bg-muted transition-colors duration-200"
          aria-label="Close modal"
        >
          <Icon name="XMarkIcon" size={24} className="text-foreground" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80">
            <AppImage
              src={caseData.image}
              alt={caseData.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark via-coffee-dark/50 to-transparent" />
            
            {/* Case Number */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-accent/90 backdrop-blur-sm rounded-lg">
              <span className="font-cta font-bold text-lg text-accent-foreground">
                {caseData.caseNumber}
              </span>
            </div>

            {/* Ahweh Index */}
            <div className="absolute bottom-4 right-4 flex items-center space-x-2 px-4 py-3 bg-card/90 backdrop-blur-sm rounded-lg warm-shadow">
              <Icon name="FireIcon" size={24} className={getAhwehIndexColor(caseData.ahwehIndex)} />
              <span className={`font-cta font-bold text-2xl ${getAhwehIndexColor(caseData.ahwehIndex)}`}>
                {caseData.ahwehIndex}/10
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-4">
              {caseData.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="CalendarIcon" size={16} />
                <span className="font-body">{caseData.datePublished}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="ClockIcon" size={16} />
                <span className="font-body">{caseData.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="ShieldCheckIcon" size={16} />
                <span className="font-body">{caseData.anonymizationLevel} Privacy</span>
              </div>
            </div>

            {/* Cultural Context */}
            <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="GlobeAltIcon" size={20} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-cta text-sm font-bold text-accent mb-2">Cultural Context</h3>
                  <p className="font-body text-sm text-foreground leading-relaxed">
                    {caseData.culturalContext}
                  </p>
                </div>
              </div>
            </div>

            {/* Full Content */}
            <div className="prose prose-coffee max-w-none mb-8">
              <div className="font-body text-base text-foreground leading-relaxed whitespace-pre-line">
                {caseData.fullContent}
              </div>
            </div>

            {/* Cultural Patterns */}
            {caseData.culturalPatterns.length > 0 && (
              <div className="mb-8 p-6 bg-muted/20 rounded-lg">
                <h3 className="font-headline text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="PuzzlePieceIcon" size={24} className="text-accent" />
                  <span>Cultural Patterns Identified</span>
                </h3>
                <ul className="space-y-2">
                  {caseData.culturalPatterns.map((pattern, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Icon name="CheckCircleIcon" size={20} className="text-success flex-shrink-0 mt-0.5" />
                      <span className="font-body text-sm text-foreground">{pattern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="mb-8">
              <h3 className="font-cta text-sm font-medium text-muted-foreground mb-3">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {caseData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-secondary/20 text-secondary-foreground text-sm font-cta font-medium rounded-full hover:bg-secondary/30 transition-colors duration-200 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Cases */}
            {caseData.relatedCases.length > 0 && (
              <div className="mb-8 p-6 bg-card border border-border rounded-lg">
                <h3 className="font-headline text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="LinkIcon" size={24} className="text-accent" />
                  <span>Related Cases</span>
                </h3>
                <div className="space-y-3">
                  {caseData.relatedCases.map((relatedCase) => (
                    <div
                      key={relatedCase.id}
                      className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-cta font-bold text-sm text-accent">
                          {relatedCase.caseNumber}
                        </span>
                        <span className="font-body text-sm text-foreground">
                          {relatedCase.title}
                        </span>
                      </div>
                      <Icon name="ArrowRightIcon" size={16} className="text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Disclaimer */}
            <div className="p-4 bg-muted/10 border border-muted/20 rounded-lg mb-6">
              <div className="flex items-start space-x-3">
                <Icon name="ShieldCheckIcon" size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-cta text-sm font-bold text-foreground mb-1">
                    Privacy & Anonymization
                  </h4>
                  <p className="font-body text-xs text-muted-foreground">
                    All cases in the Gossip Lab are carefully anonymized to protect individual privacy while preserving cultural and analytical value. Names, locations, and identifying details have been modified or removed. This case maintains a {caseData.anonymizationLevel} level of privacy protection.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-cta font-medium rounded-lg warm-shadow transition-all duration-200"
              >
                <Icon name="ShareIcon" size={18} />
                <span>Share Case</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 bg-muted hover:bg-muted/80 text-foreground font-cta font-medium rounded-lg transition-colors duration-200">
                <Icon name="BookmarkIcon" size={18} />
                <span>Save for Later</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}