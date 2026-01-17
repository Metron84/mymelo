import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import GossipLabInteractive from './components/GossipLabInteractive';

export const metadata: Metadata = {
  title: 'Gossip Lab Cases - MrMelo Sanctuary',
  description: 'Explore anonymized social narratives from Lebanese life with cultural analysis and the signature Ahweh Index rating system. Each case presents real stories with respect, insight, and deep cultural context.',
};

export default function GossipLabCasesPage() {
  return (
    <>
      <Header />
      <main className="coffee-stain">
        <GossipLabInteractive />
      </main>
    </>
  );
}