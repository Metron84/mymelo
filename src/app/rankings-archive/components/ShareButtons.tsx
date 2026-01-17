'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: string) => {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-cta font-medium text-muted-foreground">
        Share:
      </span>
      <button
        onClick={() => handleShare('twitter')}
        className="w-10 h-10 bg-muted/30 hover:bg-[#1DA1F2] rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
        aria-label="Share on Twitter"
      >
        <Icon name="ShareIcon" size={18} className="text-foreground group-hover:text-white" />
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="w-10 h-10 bg-muted/30 hover:bg-[#1877F2] rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
        aria-label="Share on Facebook"
      >
        <Icon name="ShareIcon" size={18} className="text-foreground group-hover:text-white" />
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="w-10 h-10 bg-muted/30 hover:bg-[#0A66C2] rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
        aria-label="Share on LinkedIn"
      >
        <Icon name="ShareIcon" size={18} className="text-foreground group-hover:text-white" />
      </button>
      <button
        onClick={() => handleShare('whatsapp')}
        className="w-10 h-10 bg-muted/30 hover:bg-[#25D366] rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
        aria-label="Share on WhatsApp"
      >
        <Icon name="ShareIcon" size={18} className="text-foreground group-hover:text-white" />
      </button>
      <button
        onClick={handleCopyLink}
        className="w-10 h-10 bg-muted/30 hover:bg-accent rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
        aria-label="Copy link"
      >
        <Icon
          name={copied ? 'CheckIcon' : 'LinkIcon'}
          size={18}
          className="text-foreground group-hover:text-accent-foreground"
        />
      </button>
    </div>
  );
}