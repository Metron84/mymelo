'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  avatarAlt: string;
  timestamp: string;
  content: string;
  likes: number;
  replies: number;
}

interface CommentSectionProps {
  comments: Comment[];
}

export default function CommentSection({ comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Mock submission
      setNewComment('');
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="bg-card rounded-lg warm-shadow border border-border overflow-hidden">
      <div className="bg-gradient-to-r from-coffee-medium to-coffee-dark px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="ChatBubbleLeftRightIcon" size={28} className="text-accent" variant="solid" />
            <div>
              <h2 className="font-headline text-2xl font-bold text-white">
                Community Discussion
              </h2>
              <p className="text-sm text-cream/90 font-cta">
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortBy('recent')}
              className={`px-4 py-2 rounded-lg font-cta text-sm transition-colors duration-200 ${
                sortBy === 'recent' ?'bg-accent text-accent-foreground' :'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-4 py-2 rounded-lg font-cta text-sm transition-colors duration-200 ${
                sortBy === 'popular' ?'bg-accent text-accent-foreground' :'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Popular
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
              <Icon name="UserIcon" size={20} className="text-accent" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this ranking..."
                className="w-full px-4 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none font-body text-foreground placeholder:text-muted-foreground"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-muted-foreground font-cta">
                  Be respectful and constructive in your feedback
                </p>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-accent to-gold text-accent-foreground font-cta font-bold rounded-lg warm-shadow hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          {sortedComments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start space-x-3 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors duration-200"
            >
              <div className="flex-shrink-0">
                <AppImage
                  src={comment.avatar}
                  alt={comment.avatarAlt}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-cta font-bold text-foreground">
                      {comment.author}
                    </h4>
                    <p className="text-xs text-muted-foreground font-cta">
                      {comment.timestamp}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-accent transition-colors duration-200">
                      <Icon name="HeartIcon" size={18} />
                      <span className="text-sm font-cta">{comment.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-accent transition-colors duration-200">
                      <Icon name="ChatBubbleLeftIcon" size={18} />
                      <span className="text-sm font-cta">{comment.replies}</span>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-foreground font-body leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}