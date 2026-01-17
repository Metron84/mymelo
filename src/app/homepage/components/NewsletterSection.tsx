'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary via-coffee-medium to-coffee-dark py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full">
            <Icon name="EnvelopeIcon" size={32} className="text-accent" />
          </div>
          
          <div className="space-y-3">
            <h2 className="font-headline text-3xl lg:text-4xl font-bold text-white">
              Join the Coffeehouse Circle
            </h2>
            <p className="font-body text-lg text-white/80 max-w-2xl mx-auto">
              Receive weekly insights, philosophical musings, and cultural stories delivered to your inbox like a warm cup of ahweh.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg font-body text-white placeholder:text-white/50 focus:outline-none focus:border-accent transition-colors duration-200"
              />
              <button
                type="submit"
                disabled={isSubscribed}
                className="px-6 py-3 bg-accent text-accent-foreground font-cta font-bold rounded-lg warm-shadow hover:bg-gold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
          </form>
          
          <p className="font-body text-sm text-white/60">
            No spam, just thoughtful discourse. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;