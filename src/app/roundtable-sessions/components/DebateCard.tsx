'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Argument {
  id: string;
  perspective: 'Feeler' | 'Thinker';
  author: string;
  authorImage: string;
  authorAlt: string;
  content: string;
  timestamp: string;
  votes: number;
}

interface DebateCardProps {
  debate: {
    id: string;
    title: string;
    topic: string;
    status: 'Active' | 'Resolved' | 'Archived';
    feelerArguments: Argument[];
    thinkerArguments: Argument[];
    synthesis: string;
    tags: string[];
    startDate: string;
    participantCount: number;
    commentCount: number;
    viewCount: number;
  };
  onViewDetails: (id: string) => void;
}

const DebateCard = ({ debate, onViewDetails }: DebateCardProps) => {
  const [expandedSide, setExpandedSide] = useState<'feeler' | 'thinker' | null>(null);
  const [votedArguments, setVotedArguments] = useState<Set<string>>(new Set());

  const handleVote = (argumentId: string) => {
    setVotedArguments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(argumentId)) {
        newSet.delete(argumentId);
      } else {
        newSet.add(argumentId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-success/10 text-success border-success/20';
      case 'Resolved':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'Archived':
        return 'bg-muted/30 text-muted-foreground border-muted/40';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="bg-card rounded-lg warm-shadow-lg border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-cta font-bold border ${getStatusColor(debate.status)}`}>
                {debate.status}
              </span>
              <span className="text-xs font-body text-muted-foreground">
                {debate.startDate}
              </span>
            </div>
            <h3 className="font-headline text-xl font-bold text-foreground mb-2 line-clamp-2">
              {debate.title}
            </h3>
            <p className="text-sm font-body text-muted-foreground line-clamp-1">
              {debate.topic}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="UserGroupIcon" size={16} />
            <span className="font-body">{debate.participantCount} participants</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="ChatBubbleLeftRightIcon" size={16} />
            <span className="font-body">{debate.commentCount} comments</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="EyeIcon" size={16} />
            <span className="font-body">{debate.viewCount} views</span>
          </div>
        </div>
      </div>

      {/* Debate Sides */}
      <div className="grid md:grid-cols-2 divide-x divide-border">
        {/* Feeler Side */}
        <div className="p-6 bg-gradient-to-br from-error/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error animate-pulse" />
              <h4 className="font-headline text-lg font-bold text-error">
                Feelers
              </h4>
            </div>
            <button
              onClick={() => setExpandedSide(expandedSide === 'feeler' ? null : 'feeler')}
              className="p-1 hover:bg-error/10 rounded transition-colors"
              aria-label="Toggle feeler arguments"
            >
              <Icon
                name={expandedSide === 'feeler' ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                size={20}
                className="text-error"
              />
            </button>
          </div>

          <div className={`space-y-3 ${expandedSide === 'feeler' ? '' : 'max-h-32 overflow-hidden'}`}>
            {debate.feelerArguments.slice(0, expandedSide === 'feeler' ? undefined : 1).map((arg) => (
              <div key={arg.id} className="bg-card rounded-lg p-4 border border-error/20">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <AppImage
                      src={arg.authorImage}
                      alt={arg.authorAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-cta font-medium text-sm text-foreground">
                      {arg.author}
                    </p>
                    <p className="text-xs text-muted-foreground">{arg.timestamp}</p>
                  </div>
                </div>
                <p className="text-sm font-body text-foreground/90 mb-3 line-clamp-3">
                  {arg.content}
                </p>
                <button
                  onClick={() => handleVote(arg.id)}
                  className={`flex items-center gap-1 text-xs font-cta transition-colors ${
                    votedArguments.has(arg.id)
                      ? 'text-error font-bold' :'text-muted-foreground hover:text-error'
                  }`}
                >
                  <Icon
                    name="HeartIcon"
                    size={14}
                    variant={votedArguments.has(arg.id) ? 'solid' : 'outline'}
                  />
                  <span>{arg.votes + (votedArguments.has(arg.id) ? 1 : 0)}</span>
                </button>
              </div>
            ))}
          </div>

          {!expandedSide && debate.feelerArguments.length > 1 && (
            <p className="text-xs text-muted-foreground mt-2 font-body">
              +{debate.feelerArguments.length - 1} more arguments
            </p>
          )}
        </div>

        {/* Thinker Side */}
        <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <h4 className="font-headline text-lg font-bold text-primary">
                Thinkers
              </h4>
            </div>
            <button
              onClick={() => setExpandedSide(expandedSide === 'thinker' ? null : 'thinker')}
              className="p-1 hover:bg-primary/10 rounded transition-colors"
              aria-label="Toggle thinker arguments"
            >
              <Icon
                name={expandedSide === 'thinker' ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                size={20}
                className="text-primary"
              />
            </button>
          </div>

          <div className={`space-y-3 ${expandedSide === 'thinker' ? '' : 'max-h-32 overflow-hidden'}`}>
            {debate.thinkerArguments.slice(0, expandedSide === 'thinker' ? undefined : 1).map((arg) => (
              <div key={arg.id} className="bg-card rounded-lg p-4 border border-primary/20">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <AppImage
                      src={arg.authorImage}
                      alt={arg.authorAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-cta font-medium text-sm text-foreground">
                      {arg.author}
                    </p>
                    <p className="text-xs text-muted-foreground">{arg.timestamp}</p>
                  </div>
                </div>
                <p className="text-sm font-body text-foreground/90 mb-3 line-clamp-3">
                  {arg.content}
                </p>
                <button
                  onClick={() => handleVote(arg.id)}
                  className={`flex items-center gap-1 text-xs font-cta transition-colors ${
                    votedArguments.has(arg.id)
                      ? 'text-primary font-bold' :'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <Icon
                    name="HeartIcon"
                    size={14}
                    variant={votedArguments.has(arg.id) ? 'solid' : 'outline'}
                  />
                  <span>{arg.votes + (votedArguments.has(arg.id) ? 1 : 0)}</span>
                </button>
              </div>
            ))}
          </div>

          {!expandedSide && debate.thinkerArguments.length > 1 && (
            <p className="text-xs text-muted-foreground mt-2 font-body">
              +{debate.thinkerArguments.length - 1} more arguments
            </p>
          )}
        </div>
      </div>

      {/* Synthesis Preview */}
      {debate.synthesis && (
        <div className="p-6 bg-gradient-to-r from-accent/5 to-gold/5 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="LightBulbIcon" size={20} className="text-accent" />
            <h5 className="font-headline text-sm font-bold text-accent">
              Synthesis & Common Ground
            </h5>
          </div>
          <p className="text-sm font-body text-foreground/80 line-clamp-2">
            {debate.synthesis}
          </p>
        </div>
      )}

      {/* Tags & Action */}
      <div className="p-6 border-t border-border bg-muted/10">
        <div className="flex flex-wrap gap-2 mb-4">
          {debate.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-background rounded-full text-xs font-cta text-muted-foreground border border-border hover:border-accent hover:text-accent transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onViewDetails(debate.id)}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-primary to-coffee-medium text-primary-foreground font-cta font-bold rounded-lg warm-shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <span>View Full Debate</span>
          <Icon name="ArrowRightIcon" size={16} />
        </button>
      </div>
    </div>
  );
};

export default DebateCard;