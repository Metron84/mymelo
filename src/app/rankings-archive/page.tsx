import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import RankingsArchiveInteractive from './components/RankingsArchiveInteractive';

export const metadata: Metadata = {
  title: 'Rankings Archive - MrMelo Sanctuary',
  description: 'Explore curated monthly tier-list rankings featuring thoughtful analysis, interactive visualizations, and community discussions on Lebanese culture, philosophy, and social patterns.',
};

export default function RankingsArchivePage() {
  return (
    <>
      <Header />
      <RankingsArchiveInteractive />
    </>
  );
}