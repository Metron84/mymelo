import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import MediaLibraryInteractive from './components/MediaLibraryInteractive';

export const metadata: Metadata = {
  title: 'Media Library - MrMelo Sanctuary',
  description: 'Explore audio and video content from the coffeehouse with searchable transcripts, series organization, and seamless playback experiences for philosophical discussions and cultural explorations.',
};

export default function MediaLibraryPage() {
  return (
    <>
      <Header />
      <MediaLibraryInteractive />
    </>
  );
}