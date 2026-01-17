'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { writingsService, rankingsService, roundtableService, mediaService } from '@/services/contentService';
import type { Writing, Ranking, ContentStatus, ContentCategory, MediaType, SessionFormat } from '@/types/database.types';

type ContentType = 'writing' | 'ranking' | 'session' | 'media';

export default function ContentEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contentType = (searchParams.get('type') as ContentType) || 'writing';
  const editId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Writing form state
  const [writingForm, setWritingForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'essay' as ContentCategory,
    status: 'draft' as ContentStatus,
    author_name: 'Admin Editor',
    read_time: 0,
    tags: [] as string[],
    featured_image: '',
  });

  // Ranking form state
  const [rankingForm, setRankingForm] = useState({
    title: '',
    slug: '',
    description: '',
    methodology: '',
    ranking_data: { tiers: { S: [], A: [], B: [], C: [], D: [] } },
    category: '',
    status: 'draft' as ContentStatus,
    tags: [] as string[],
    featured_image: '',
  });

  // Session form state
  const [sessionForm, setSessionForm] = useState({
    title: '',
    slug: '',
    description: '',
    session_format: 'discussion' as SessionFormat,
    participants: [] as Array<{ name: string; role: string }>,
    transcript: '',
    key_takeaways: [] as string[],
    status: 'draft' as ContentStatus,
    duration: 0,
    tags: [] as string[],
    thumbnail: '',
    session_date: '',
  });

  // Media form state
  const [mediaForm, setMediaForm] = useState({
    title: '',
    slug: '',
    description: '',
    media_type: 'video' as MediaType,
    media_url: '',
    series_name: '',
    episode_number: 0,
    duration: 0,
    transcript: '',
    status: 'draft' as ContentStatus,
    tags: [] as string[],
    thumbnail: '',
    release_date: '',
  });

  useEffect(() => {
    if (editId) {
      loadContent();
    }
  }, [editId, contentType]);

  const loadContent = async () => {
    if (!editId) return;
    
    try {
      setLoading(true);
      
      if (contentType === 'writing') {
        const result = await writingsService.getById(editId);
        setWritingForm(result as any);
      } else if (contentType === 'ranking') {
        const result = await rankingsService.getById(editId);
        setRankingForm(result as any);
      } else if (contentType === 'session') {
        const result = await roundtableService.getById(editId);
        setSessionForm(result as any);
      } else if (contentType === 'media') {
        const result = await mediaService.getById(editId);
        setMediaForm(result as any);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      let result;

      if (contentType === 'writing') {
        if (editId) {
          result = await writingsService.update(editId, writingForm);
        } else {
          result = await writingsService.create(writingForm as any);
        }
      } else if (contentType === 'ranking') {
        if (editId) {
          result = await rankingsService.update(editId, rankingForm);
        } else {
          result = await rankingsService.create(rankingForm as any);
        }
      } else if (contentType === 'session') {
        if (editId) {
          result = await roundtableService.update(editId, sessionForm);
        } else {
          result = await roundtableService.create(sessionForm as any);
        }
      } else if (contentType === 'media') {
        if (editId) {
          result = await mediaService.update(editId, mediaForm);
        } else {
          result = await mediaService.create(mediaForm as any);
        }
      }

      if (result?.error) throw new Error(result.error.message);
      
      setSuccess(editId ? 'Content updated successfully!' : 'Content created successfully!');
      setTimeout(() => router.push('/admin-dashboard'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const renderWritingForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={writingForm.title}
          onChange={(e) => setWritingForm({ ...writingForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
        <textarea
          value={writingForm.excerpt}
          onChange={(e) => setWritingForm({ ...writingForm, excerpt: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={writingForm.content}
          onChange={(e) => setWritingForm({ ...writingForm, content: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={15}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={writingForm.category}
            onChange={(e) => setWritingForm({ ...writingForm, category: e.target.value as ContentCategory })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="essay">Essay</option>
            <option value="analysis">Analysis</option>
            <option value="opinion">Opinion</option>
            <option value="interview">Interview</option>
            <option value="review">Review</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={writingForm.status}
            onChange={(e) => setWritingForm({ ...writingForm, status: e.target.value as ContentStatus })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          value={writingForm.tags.join(', ')}
          onChange={(e) => setWritingForm({ ...writingForm, tags: e.target.value.split(',').map(t => t.trim()) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderRankingForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={rankingForm.title}
          onChange={(e) => setRankingForm({ ...rankingForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={rankingForm.description}
          onChange={(e) => setRankingForm({ ...rankingForm, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Methodology</label>
        <textarea
          value={rankingForm.methodology}
          onChange={(e) => setRankingForm({ ...rankingForm, methodology: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <input
            type="text"
            value={rankingForm.category}
            onChange={(e) => setRankingForm({ ...rankingForm, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={rankingForm.status}
            onChange={(e) => setRankingForm({ ...rankingForm, status: e.target.value as ContentStatus })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          value={rankingForm.tags.join(', ')}
          onChange={(e) => setRankingForm({ ...rankingForm, tags: e.target.value.split(',').map(t => t.trim()) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800">
          Note: Tier list data structure will be managed through an interactive builder in a future update.
          For now, ranking_data is stored as a JSONB object.
        </p>
      </div>
    </div>
  );

  const renderSessionForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={sessionForm.title}
          onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={sessionForm.description}
          onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Format</label>
          <select
            value={sessionForm.session_format}
            onChange={(e) => setSessionForm({ ...sessionForm, session_format: e.target.value as SessionFormat })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="discussion">Discussion</option>
            <option value="debate">Debate</option>
            <option value="panel">Panel</option>
            <option value="interview">Interview</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
          <input
            type="number"
            value={sessionForm.duration}
            onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Session Date</label>
        <input
          type="datetime-local"
          value={sessionForm.session_date}
          onChange={(e) => setSessionForm({ ...sessionForm, session_date: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Key Takeaways (one per line)</label>
        <textarea
          value={sessionForm.key_takeaways.join('\n')}
          onChange={(e) => setSessionForm({ ...sessionForm, key_takeaways: e.target.value.split('\n').filter(t => t.trim()) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          rows={5}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={sessionForm.status}
          onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value as ContentStatus })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          value={sessionForm.tags.join(', ')}
          onChange={(e) => setSessionForm({ ...sessionForm, tags: e.target.value.split(',').map(t => t.trim()) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
    </div>
  );

  const renderMediaForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={mediaForm.title}
          onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={mediaForm.description}
          onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
          <select
            value={mediaForm.media_type}
            onChange={(e) => setMediaForm({ ...mediaForm, media_type: e.target.value as MediaType })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="podcast">Podcast</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
          <input
            type="number"
            value={mediaForm.duration}
            onChange={(e) => setMediaForm({ ...mediaForm, duration: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Media URL</label>
        <input
          type="url"
          value={mediaForm.media_url}
          onChange={(e) => setMediaForm({ ...mediaForm, media_url: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Series Name</label>
          <input
            type="text"
            value={mediaForm.series_name}
            onChange={(e) => setMediaForm({ ...mediaForm, series_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Episode Number</label>
          <input
            type="number"
            value={mediaForm.episode_number}
            onChange={(e) => setMediaForm({ ...mediaForm, episode_number: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Release Date</label>
        <input
          type="datetime-local"
          value={mediaForm.release_date}
          onChange={(e) => setMediaForm({ ...mediaForm, release_date: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={mediaForm.status}
          onChange={(e) => setMediaForm({ ...mediaForm, status: e.target.value as ContentStatus })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          value={mediaForm.tags.join(', ')}
          onChange={(e) => setMediaForm({ ...mediaForm, tags: e.target.value.split(',').map(t => t.trim()) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-amber-200">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              {editId ? 'Edit' : 'Create'} {contentType === 'writing' ? 'Writing' : contentType === 'ranking' ? 'Ranking' : contentType === 'session' ? 'Session' : 'Media'}
            </h1>
            <p className="text-amber-700">Fill out the form below to manage your content</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-8 overflow-x-auto">
            <button
              onClick={() => router.push('/content-editor?type=writing')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                contentType === 'writing' ?'bg-blue-500 text-white' :'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Writing
            </button>
            <button
              onClick={() => router.push('/content-editor?type=ranking')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                contentType === 'ranking' ?'bg-purple-500 text-white' :'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Ranking
            </button>
            <button
              onClick={() => router.push('/content-editor?type=session')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                contentType === 'session' ?'bg-orange-500 text-white' :'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Session
            </button>
            <button
              onClick={() => router.push('/content-editor?type=media')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                contentType === 'media' ?'bg-pink-500 text-white' :'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Media
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {contentType === 'writing' && renderWritingForm()}
            {contentType === 'ranking' && renderRankingForm()}
            {contentType === 'session' && renderSessionForm()}
            {contentType === 'media' && renderMediaForm()}

            {/* Submit Button */}
            <div className="mt-8 flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin-dashboard')}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}