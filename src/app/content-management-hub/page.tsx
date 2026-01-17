'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UsersIcon,
  FilmIcon,
  EyeIcon,
  ClockIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import {
  writingsService,
  rankingsService,
  roundtableService,
  mediaService,
  contentStatsService,
  type Writing,
  type Ranking,
  type RoundtableSession,
  type MediaItem,
  type ContentStats,
  type ContentStatus,
  type ContentCategory,
} from '@/services/contentService';

type ContentType = 'writings' | 'rankings' | 'roundtables' | 'media';

interface FilterState {
  status?: ContentStatus;
  category?: ContentCategory;
  search?: string;
}

export default function ContentManagementHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentType>('writings');
  const [writings, setWritings] = useState<Writing[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [roundtables, setRoundtables] = useState<RoundtableSession[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'writings':
          const writingsData = await writingsService.getAll(filters);
          setWritings(writingsData);
          break;
        case 'rankings':
          const rankingsData = await rankingsService.getAll(filters);
          setRankings(rankingsData);
          break;
        case 'roundtables':
          const roundtablesData = await roundtableService.getAll(filters);
          setRoundtables(roundtablesData);
          break;
        case 'media':
          const mediaData = await mediaService.getAll(filters);
          setMediaItems(mediaData);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await contentStatsService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      switch (activeTab) {
        case 'writings':
          await writingsService.delete(id);
          break;
        case 'rankings':
          await rankingsService.delete(id);
          break;
        case 'roundtables':
          await roundtableService.delete(id);
          break;
        case 'media':
          await mediaService.delete(id);
          break;
      }
      await loadData();
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Delete ${selectedItems.size} selected items?`)) return;

    try {
      const deletePromises = Array.from(selectedItems).map((id) => {
        switch (activeTab) {
          case 'writings':
            return writingsService.delete(id);
          case 'rankings':
            return rankingsService.delete(id);
          case 'roundtables':
            return roundtableService.delete(id);
          case 'media':
            return mediaService.delete(id);
        }
      });
      await Promise.all(deletePromises);
      setSelectedItems(new Set());
      await loadData();
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete items');
    }
  };

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'writings':
        return writings;
      case 'rankings':
        return rankings;
      case 'roundtables':
        return roundtables;
      case 'media':
        return mediaItems;
    }
  };

  const getStatusBadge = (status: ContentStatus) => {
    const statusColors = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status === 'published' ? <CheckCircleIcon className="w-3 h-3 mr-1" /> : <XCircleIcon className="w-3 h-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category: ContentCategory) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        <TagIcon className="w-3 h-3 mr-1" />
        {category}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Content Management Hub</h1>
              <p className="text-amber-100 mt-1">Manage all your content in one place</p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex items-center">
                <DocumentTextIcon className="w-8 h-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Writings</p>
                  <p className="text-2xl font-bold">{stats.total_writings}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <div className="flex items-center">
                <ChartBarIcon className="w-8 h-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Rankings</p>
                  <p className="text-2xl font-bold">{stats.total_rankings}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex items-center">
                <UsersIcon className="w-8 h-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Roundtables</p>
                  <p className="text-2xl font-bold">{stats.total_roundtables}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
              <div className="flex items-center">
                <FilmIcon className="w-8 h-8 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Media</p>
                  <p className="text-2xl font-bold">{stats.total_media}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
              <div className="flex items-center">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold">{stats.published_content}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <ClockIcon className="w-8 h-8 text-yellow-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold">{stats.draft_content}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'writings', label: 'Writings', icon: DocumentTextIcon },
                { id: 'rankings', label: 'Rankings', icon: ChartBarIcon },
                { id: 'roundtables', label: 'Roundtables', icon: UsersIcon },
                { id: 'media', label: 'Media', icon: FilmIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as ContentType);
                    setSelectedItems(new Set());
                  }}
                  className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Toolbar */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/admin/content/create?type=${activeTab}`)}
                  className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create New
                </button>
                {selectedItems.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Delete ({selectedItems.size})
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                    showFilters ? 'bg-amber-100 border-amber-300' : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FunnelIcon className="w-5 h-5 mr-2" />
                  Filters
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) => setFilters({ ...filters, status: (e.target.value as ContentStatus) || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">All</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => setFilters({ ...filters, category: (e.target.value as ContentCategory) || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">All</option>
                      <option value="philosophy">Philosophy</option>
                      <option value="culture">Culture</option>
                      <option value="politics">Politics</option>
                      <option value="society">Society</option>
                      <option value="technology">Technology</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilters({});
                        setShowFilters(false);
                      }}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            ) : getCurrentData().length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No {activeTab} found</p>
                  <button
                    onClick={() => router.push(`/admin/content/create?type=${activeTab}`)}
                    className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Create your first {activeTab.slice(0, -1)}
                  </button>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === getCurrentData().length && getCurrentData().length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(new Set(getCurrentData().map((item: any) => item.id)));
                          } else {
                            setSelectedItems(new Set());
                          }
                        }}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentData().map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        {item.subtitle && <div className="text-sm text-gray-500">{item.subtitle}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getCategoryBadge(item.category)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {item.view_count || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.updated_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/content/edit/${item.id}?type=${activeTab}`)}
                          className="text-amber-600 hover:text-amber-900 mr-4"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}