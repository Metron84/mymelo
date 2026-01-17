'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { readerNotificationService } from '@/services/readerNotificationService';

interface ReaderProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_login_at: string | null;
  is_active: boolean;
}

interface NotificationPreferences {
  reader_id: string;
  new_content_frequency: 'instant' | 'daily' | 'weekly' | 'never';
  comment_reply_frequency: 'instant' | 'daily' | 'weekly' | 'never';
  content_types: ('all' | 'writings' | 'roundtables' | 'rankings' | 'media')[];
}

export default function ReaderProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ReaderProfile | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);
      await loadProfileData(user.id);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const loadProfileData = async (userId: string) => {
    try {
      const [profileData, preferencesData] = await Promise.all([
        readerNotificationService.getReaderProfile(userId),
        readerNotificationService.getNotificationPreferences(userId)
      ]);

      setProfile(profileData);
      setPreferences(preferencesData);
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to load profile: ${error.message}` });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !profile) return;

    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        full_name: formData.get('full_name') as string
      };

      await readerNotificationService.updateReaderProfile(user.id, updates);
      setProfile({ ...profile, ...updates });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !preferences) return;

    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const contentTypes = formData.getAll('content_types') as string[];

      const updates = {
        new_content_frequency: formData.get('new_content_frequency') as any,
        comment_reply_frequency: formData.get('comment_reply_frequency') as any,
        content_types: contentTypes.length > 0 ? contentTypes : ['all']
      };

      await readerNotificationService.updateNotificationPreferences(user.id, updates);
      setPreferences({ ...preferences, ...updates });
      setMessage({ type: 'success', text: 'Notification preferences updated!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || !preferences) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reader Profile</h1>
              <p className="text-gray-600 mt-1">{profile.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                defaultValue={profile.full_name}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Notification Preferences Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
          <form onSubmit={handlePreferencesUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Content Notifications
              </label>
              <select
                name="new_content_frequency"
                defaultValue={preferences.new_content_frequency}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="instant">Instant (as published)</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment Reply Notifications
              </label>
              <select
                name="comment_reply_frequency"
                defaultValue={preferences.comment_reply_frequency}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="instant">Instant</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Types (select all that apply)
              </label>
              <div className="space-y-2">
                {['all', 'writings', 'roundtables', 'rankings', 'media'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      name="content_types"
                      value={type}
                      defaultChecked={preferences.content_types.includes(type as any)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Preferences'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="text-sm text-gray-900">
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Account Status</dt>
              <dd className="text-sm text-gray-900">
                {profile.is_active ? 'Active' : 'Inactive'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}