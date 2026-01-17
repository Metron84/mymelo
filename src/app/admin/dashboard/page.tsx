'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router?.push('/admin/login');
  };

  const contentManagementCards = [
    {
      title: 'Roundtable Sessions',
      description: 'Upload and manage debate sessions, discussions, and roundtable content',
      icon: 'UserGroupIcon',
      href: '/content-editor?type=roundtables',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Writing Collection',
      description: 'Create and publish articles, essays, and written content',
      icon: 'DocumentTextIcon',
      href: '/content-editor?type=writings',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-900',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Media Library',
      description: 'Upload podcasts, videos, and multimedia content',
      icon: 'PhotoIcon',
      href: '/content-editor?type=media',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-900',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Gossip Lab Cases',
      description: 'Document and analyze cultural phenomena and gossip cases',
      icon: 'BeakerIcon',
      href: '/content-editor?type=gossip',
      bgColor: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-900',
      iconColor: 'text-pink-600',
    },
    {
      title: 'Rankings Archive',
      description: 'Create and manage tier lists and ranking systems',
      icon: 'ChartBarIcon',
      href: '/content-editor?type=rankings',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      iconColor: 'text-green-600',
    },
    {
      title: 'Content Management Hub',
      description: 'View all content in one place with advanced filtering and bulk actions',
      icon: 'FolderOpenIcon',
      href: '/content-management-hub',
      bgColor: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-900',
      iconColor: 'text-gray-600',
    },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <nav className="bg-white/90 backdrop-blur-sm shadow-md border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/homepage" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Icon name="HomeIcon" size={24} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session?.user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-amber-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, Administrator
          </h2>
          <p className="text-gray-600 mb-6">
            Manage all your content from this central admin portal. Click on any section below to upload and edit content.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Session Info
              </h3>
              <p className="text-sm text-blue-700">
                Expires in: 24 hours
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Role: {session?.user?.role || 'Admin'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Security
              </h3>
              <p className="text-sm text-green-700">
                All admin routes protected
              </p>
              <p className="text-sm text-green-700 mt-1">
                JWT session strategy
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Authentication
              </h3>
              <p className="text-sm text-purple-700">
                NextAuth.js powered
              </p>
              <p className="text-sm text-purple-700 mt-1">
                Bcrypt password hashing
              </p>
            </div>
          </div>
        </div>

        {/* Content Management Cards */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-amber-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Content Management
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="ShieldCheckIcon" size={20} />
              <span>Admin Only Access</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentManagementCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={`bg-gradient-to-br ${card.bgColor} p-6 rounded-xl border ${card.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-white/80 ${card.iconColor}`}>
                    <Icon name={card.icon as any} size={28} />
                  </div>
                  <Icon 
                    name="ArrowTopRightOnSquareIcon" 
                    size={20} 
                    className="text-gray-400 group-hover:text-gray-600 transition-colors"
                  />
                </div>
                <h3 className={`text-lg font-semibold ${card.textColor} mb-2`}>
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <Icon name="InformationCircleIcon" size={24} />
              Quick Actions
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" size={16} />
                Click any card above to create or edit content
              </li>
              <li className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" size={16} />
                Use Content Management Hub for bulk operations
              </li>
              <li className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" size={16} />
                All changes are immediately reflected on the public site
              </li>
              <li className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" size={16} />
                Content can be saved as drafts before publishing
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}