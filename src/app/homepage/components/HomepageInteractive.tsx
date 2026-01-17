'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ContentCard from './ContentCard';

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

const HomepageInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const contentCategories: ContentCardData[] = [
  {
    id: 1,
    title: "Writing Sanctuary",
    description: "A space for articles, essays, screenplays, and creative writings exploring philosophy, culture, and the human experience.",
    image: "https://images.unsplash.com/photo-1447733078723-b6d972b8646b",
    alt: "Open vintage notebook with fountain pen on wooden desk with warm lighting",
    category: "Writing",
    itemCount: 0,
    href: "/writing-collection",
    icon: "DocumentTextIcon",
    color: "primary"
  },
  {
    id: 2,
    title: "Roundtable Sessions",
    description: "Intellectual debates where diverse perspectives engage on topics ranging from relationships to societal norms.",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0",
    alt: "Round wooden table with multiple coffee cups symbolizing collaborative discussion",
    category: "Debates",
    itemCount: 0,
    href: "/roundtable-sessions",
    icon: "UserGroupIcon",
    color: "accent"
  },
  {
    id: 3,
    title: "Gossip Lab Cases",
    description: "Social narratives analyzed through cultural lenses with thoughtful examination and the Ahweh Index rating system.",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16689735e-1766330812967.png",
    alt: "Magnifying glass over documents representing analytical examination",
    category: "Analysis",
    itemCount: 0,
    href: "/gossip-lab-cases",
    icon: "BeakerIcon",
    color: "gold"
  },
  {
    id: 4,
    title: "Monthly Rankings",
    description: "Curated tier-list style content with interactive visualizations and thoughtful categorization of various topics.",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_10919d84a-1768562098508.png",
    alt: "Charts and graphs representing systematic ranking and organization",
    category: "Rankings",
    itemCount: 0,
    href: "/rankings-archive",
    icon: "ChartBarIcon",
    color: "peru"
  },
  {
    id: 5,
    title: "Media Lounge",
    description: "Audio and video content with transcripts, series organization, and seamless playback experiences.",
    image: "https://images.unsplash.com/photo-1701491332798-35f53bc3e9c0",
    alt: "Professional microphone and audio equipment in warm studio setting",
    category: "Media",
    itemCount: 0,
    href: "/media-library",
    icon: "PlayIcon",
    color: "slate"
  },
  {
    id: 6,
    title: "Pattern Explorer",
    description: "Discover cross-references and thematic connections across all content types in the sanctuary.",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eb95cedb-1768562095705.png",
    alt: "Network of connected nodes representing interconnected ideas and themes",
    category: "Connections",
    itemCount: 0,
    href: "/pattern-explorer",
    icon: "PuzzlePieceIcon",
    color: "coffee-medium"
  }];


  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse space-y-8 py-16">
          <div className="h-96 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Project Introduction */}
      <section className="py-16 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-cta font-medium text-accent">
              Welcome to the Sanctuary
            </span>
          </div>
          
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            MrMelo Sanctuary
          </h1>
          
          <p className="font-body text-xl text-muted-foreground mb-8 leading-relaxed">
            A digital coffeehouse where philosophical discourse, cultural analysis, and creative writing converge. 
            Inspired by the Lebanese tradition of the ahweh—where ideas are brewed slowly, conversations flow freely, 
            and every voice finds space to be heard.
          </p>

          {/* Admin Portal Access Button */}
          <div className="mb-8">
            <Link 
              href="/admin/login"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-cta font-semibold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Admin Portal</span>
            </Link>
            <p className="mt-2 text-sm font-body text-muted-foreground">
              Content management access for authorized administrators only
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 text-left space-y-4">
            <h2 className="font-headline text-2xl font-bold text-foreground mb-4">What is MrMelo Sanctuary?</h2>
            
            <p className="font-body text-muted-foreground leading-relaxed">
              This is a carefully curated space for intellectual exploration and cultural reflection. Drawing from the 
              rich tradition of Lebanese coffeehouses—where strangers become friends over endless cups of ahweh, where 
              debates rage but respect remains, where stories are shared and wisdom is passed down—the sanctuary aims 
              to recreate that atmosphere in digital form.
            </p>

            <p className="font-body text-muted-foreground leading-relaxed">
              Here, you&apos;ll find writings that delve into philosophy and culture, roundtable debates examining contemporary 
              issues from multiple perspectives, social narratives analyzed through the unique Ahweh Index system, curated 
              rankings exploring various topics, multimedia content with thoughtful commentary, and an AI-powered pattern 
              explorer that reveals unexpected connections across themes.
            </p>

            <p className="font-body text-muted-foreground leading-relaxed">
              The sanctuary celebrates the art of slow thinking in a fast world. Each piece of content is crafted with 
              the same care one would take in preparing a perfect cup of Lebanese coffee—patiently, mindfully, and with 
              attention to every detail. This is not a place for quick takes or shallow commentary. It&apos;s a space for 
              depth, nuance, and genuine intellectual engagement.
            </p>

            <div className="pt-4 border-t border-border">
              <p className="font-body text-sm text-muted-foreground italic">
                &quot;In every cup of coffee, there lies a universe of stories waiting to be told, debates waiting to unfold, 
                and connections waiting to be made.&quot; — MrMelo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Categories Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-headline text-3xl lg:text-4xl font-bold text-foreground">
              Explore the Sanctuary
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Six distinct spaces, each offering unique perspectives on culture, philosophy, and human experience. 
              Content will be added as the sanctuary grows.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentCategories.map((category) =>
            <ContentCard key={category.id} content={category} />
            )}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 bg-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-headline text-3xl font-bold text-foreground mb-4">
              The Coffeehouse Philosophy
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-headline text-xl font-bold text-foreground mb-3">Slow Thinking</h3>
              <p className="font-body text-muted-foreground">
                Like a properly brewed cup of ahweh, good ideas need time. We resist the pressure for instant takes 
                and hot reactions, instead favoring thoughtful analysis and nuanced perspectives.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-headline text-xl font-bold text-foreground mb-3">Cultural Roots</h3>
              <p className="font-body text-muted-foreground">
                Grounded in Lebanese cultural traditions while embracing global perspectives. The sanctuary honors 
                its heritage while remaining open to diverse voices and experiences.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-headline text-xl font-bold text-foreground mb-3">Respectful Discourse</h3>
              <p className="font-body text-muted-foreground">
                Disagreement is welcomed, but contempt is not. Like the best coffeehouse debates, we maintain respect 
                even when views clash, recognizing that truth often emerges from dialogue.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-headline text-xl font-bold text-foreground mb-3">Interconnected Ideas</h3>
              <p className="font-body text-muted-foreground">
                No topic exists in isolation. The Pattern Explorer reveals unexpected connections, showing how themes 
                and ideas weave together across different content types and perspectives.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>);

};

export default HomepageInteractive;