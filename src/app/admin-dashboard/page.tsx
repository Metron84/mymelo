'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { contentStatsService, writingsService, rankingsService, roundtableService, mediaService } from '@/services/contentService';

interface ContentStats {
  writings: { total: number; published: number; draft: number };
  rankings: { total: number; published: number; draft: number };
  sessions: { total: number; published: number; draft: number };
  media: { total: number; published: number; draft: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Fetch stats for each content type
      const [writingsData, rankingsData, roundtablesData, mediaData] = await Promise.all([
        writingsService.getAll(),
        rankingsService.getAll(),
        roundtableService.getAll(),
        mediaService.getAll(),
      ]);

      // Calculate breakdown for each type
      const writings = {
        total: writingsData.length,
        published: writingsData.filter((w) => w.status === 'published').length,
        draft: writingsData.filter((w) => w.status === 'draft').length,
      };

      const rankings = {
        total: rankingsData.length,
        published: rankingsData.filter((r) => r.status === 'published').length,
        draft: rankingsData.filter((r) => r.status === 'draft').length,
      };

      const sessions = {
        total: roundtablesData.length,
        published: roundtablesData.filter((rt) => rt.status === 'published').length,
        draft: roundtablesData.filter((rt) => rt.status === 'draft').length,
      };

      const media = {
        total: mediaData.length,
        published: mediaData.filter((m) => m.status === 'published').length,
        draft: mediaData.filter((m) => m.status === 'draft').length,
      };

      setStats({
        writings,
        rankings,
        sessions,
        media,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-lg text-amber-800">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-4 border-amber-200">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Admin Dashboard</h1>
          <p className="text-amber-700">Manage your content and monitor site activity</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Writings</h3>
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{stats?.writings?.total ?? 0}</p>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Published: {stats?.writings?.published ?? 0}</span>
                <span className="text-amber-600">Draft: {stats?.writings?.draft ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Rankings</h3>
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{stats?.rankings?.total ?? 0}</p>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Published: {stats?.rankings?.published ?? 0}</span>
                <span className="text-amber-600">Draft: {stats?.rankings?.draft ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200 hover:border-orange-400 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Sessions</h3>
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{stats?.sessions?.total ?? 0}</p>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Published: {stats?.sessions?.published ?? 0}</span>
                <span className="text-amber-600">Draft: {stats?.sessions?.draft ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-pink-200 hover:border-pink-400 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Media</h3>
              <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{stats?.media?.total ?? 0}</p>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Published: {stats?.media?.published ?? 0}</span>
                <span className="text-amber-600">Draft: {stats?.media?.draft ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-amber-200">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/content-editor?type=writing"
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all border-2 border-blue-200"
            >
              <svg className="w-10 h-10 text-blue-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Create Writing</h3>
                <p className="text-sm text-gray-600">New essay, analysis, or opinion piece</p>
              </div>
            </Link>

            <Link
              href="/content-editor?type=ranking"
              className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all border-2 border-purple-200"
            >
              <svg className="w-10 h-10 text-purple-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Create Ranking</h3>
                <p className="text-sm text-gray-600">New tier list or ranking system</p>
              </div>
            </Link>

            <Link
              href="/content-editor?type=session"
              className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all border-2 border-orange-200"
            >
              <svg className="w-10 h-10 text-orange-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Create Session</h3>
                <p className="text-sm text-gray-600">New roundtable or discussion</p>
              </div>
            </Link>

            <Link
              href="/content-editor?type=media"
              className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg hover:from-pink-100 hover:to-pink-200 transition-all border-2 border-pink-200"
            >
              <svg className="w-10 h-10 text-pink-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Add Media</h3>
                <p className="text-sm text-gray-600">New video, audio, or podcast</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
