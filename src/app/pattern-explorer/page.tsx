import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import PatternExplorerInteractive from './components/PatternExplorerInteractive';

export const metadata: Metadata = {
  title: 'Pattern Explorer - MrMelo Sanctuary',
  description: 'Discover hidden connections and thematic relationships across philosophical discourse, cultural analysis, and creative writing in the MrMelo Sanctuary digital coffeehouse.',
};

export default function PatternExplorerPage() {
  return (
    <>
      <Header />
      <PatternExplorerInteractive />
    </>
  );
}