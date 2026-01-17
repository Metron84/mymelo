'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface FeaturedDebateProps {
  debate: {
    id: string;
    title: string;
    topic: string;
    description: string;
    feelerHighlight: string;
    thinkerHighlight: string;
    synthesis: string;
    featuredImage: string;
    featuredImageAlt: string;
    participantCount: number;
    commentCount: number;
    viewCount: number;
    tags: string[];
  };
  onViewDetails: (id: string) => void;
}

const FeaturedDebate = ({ debate, onViewDetails }: FeaturedDebateProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'feeler' | 'thinker' | 'synthesis'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'InformationCircleIcon' },
    { id: 'feeler', label: 'Feeler View', icon: 'HeartIcon' },
    { id: 'thinker', label: 'Thinker View', icon: 'AcademicCapIcon' },
    { id: 'synthesis', label: 'Synthesis', icon: 'LightBulbIcon' },
  ];

  return (
    <div className="bg-gradient-to-br from-card to-muted/20 rounded-lg warm-shadow-lg border border-border overflow-hidden mb-8">
      {/* Header */}
      <div className="relative h-64 overflow-hidden">
        <AppImage
          src={debate.featuredImage}
          alt={debate.featuredImageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-cta font-bold">
              Featured Debate
            </span>
            <span className="px-3 py-1 bg-success/20 text-success border border-success/30 rounded-full text-xs font-cta font-bold">
              Active
            </span>
          </div>
          <h2 className="font-headline text-3xl font-bold text-white mb-2">
            {debate.title}
          </h2>
          <p className="text-sm font-body text-white/80">
            {debate.topic}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-background/50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-cta font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <Icon name={tab.icon as any} size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <p className="text-base font-body text-foreground/90 leading-relaxed">
              {debate.description}
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                <Icon name="UserGroupIcon" size={24} className="text-accent" />
                <div>
                  <p className="text-2xl font-headline font-bold text-foreground">
                    {debate.participantCount}
                  </p>
                  <p className="text-xs font-body text-muted-foreground">Participants</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                <Icon name="ChatBubbleLeftIcon" size={24} className="text-primary" />
                <div>
                  <p className="text-2xl font-headline font-bold text-foreground">
                    {debate.commentCount}
                  </p>
                  <p className="text-xs font-body text-muted-foreground">Comments</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                <Icon name="EyeIcon" size={24} className="text-gold" />
                <div>
                  <p className="text-2xl font-headline font-bold text-foreground">
                    {debate.viewCount}
                  </p>
                  <p className="text-xs font-body text-muted-foreground">Views</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {debate.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-muted/30 rounded-full text-sm font-cta text-foreground border border-border hover:border-accent hover:text-accent transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feeler' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-error animate-pulse" />
              <h3 className="font-headline text-xl font-bold text-error">
                Feeler Perspective
              </h3>
            </div>
            <div className="p-6 bg-gradient-to-br from-error/5 to-transparent rounded-lg border border-error/20">
              <p className="text-base font-body text-foreground/90 leading-relaxed">
                {debate.feelerHighlight}
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
              <Icon name="InformationCircleIcon" size={20} className="text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm font-body text-muted-foreground">
                Feelers emphasize emotional intelligence, empathy, and the human experience in their arguments. They value connection and understanding.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'thinker' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
              <h3 className="font-headline text-xl font-bold text-primary">
                Thinker Perspective
              </h3>
            </div>
            <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-lg border border-primary/20">
              <p className="text-base font-body text-foreground/90 leading-relaxed">
                {debate.thinkerHighlight}
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
              <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm font-body text-muted-foreground">
                Thinkers prioritize logic, analysis, and objective reasoning in their arguments. They value clarity and systematic thinking.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'synthesis' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="LightBulbIcon" size={24} className="text-accent" />
              <h3 className="font-headline text-xl font-bold text-accent">
                Synthesis & Common Ground
              </h3>
            </div>
            <div className="p-6 bg-gradient-to-br from-accent/5 to-gold/5 rounded-lg border border-accent/20">
              <p className="text-base font-body text-foreground/90 leading-relaxed">
                {debate.synthesis}
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
              <Icon name="SparklesIcon" size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm font-body text-muted-foreground">
                The synthesis represents the wisdom that emerges when emotional intelligence meets analytical rigor - the heart of the coffeehouse tradition.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 pt-6 border-t border-border">
          <button
            onClick={() => onViewDetails(debate.id)}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-coffee-medium text-primary-foreground font-cta font-bold rounded-lg warm-shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>Join the Discussion</span>
            <Icon name="ArrowRightIcon" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDebate;