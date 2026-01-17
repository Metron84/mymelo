import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import WritingCollectionInteractive from './components/WritingCollectionInteractive';

export const metadata: Metadata = {
  title: 'Writing Collection - MrMelo Sanctuary',
  description: 'Explore a curated collection of essays, articles, screenplays, and miscellaneous writings that showcase intellectual depth across multiple formats. Discover Lebanese cultural insights, philosophical discourse, and creative narratives.',
};

export default function WritingCollectionPage() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-12 sm:mb-16 text-center coffee-stain">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-cta font-medium text-accent">
                Writing Sanctuary
              </span>
            </div>
            
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-shadow-warm">
              The Writing Collection
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A curated sanctuary of intellectual exploration where essays, articles, screenplays, and creative narratives converge. Each piece is crafted with the care of a perfectly brewed cup of ahweh, inviting you to slow down and savor the depth of thoughtful discourse.
            </p>
          </div>

          {/* Interactive Content */}
          <WritingCollectionInteractive />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-cta">
              &copy; {new Date().getFullYear()} MrMelo Sanctuary. All writings are original works.
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-handwritten">
              Brewed with care in the digital coffeehouse
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}