import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import HomepageInteractive from './components/HomepageInteractive';

export const metadata: Metadata = {
  title: 'Homepage - MrMelo Sanctuary',
  description: 'Welcome to MrMelo Sanctuary, a digital coffeehouse where philosophical discourse, cultural analysis, and creative writing converge in a beautifully organized space celebrating Lebanese intellectual tradition.',
};

export default function Homepage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16">
        <HomepageInteractive />
      </div>
    </main>
  );
}