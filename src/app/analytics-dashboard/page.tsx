'use client';

import React, { useEffect, useState } from 'react';
import { ChartBarIcon, UserGroupIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, ArrowTrendingUpIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import {
  analyticsService,
  ContentStats,
  ReaderStats,
  NotificationStats,
  ContentViewsData,
  CommentsByContentType,
} from '@/services/analyticsService';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';


const COLORS = ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#DEB887'];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-amber-50 rounded-lg">
          <Icon className="h-6 w-6 text-amber-800" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="flex items-center text-green-600">
          <ArrowTrendingUpIcon className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">{trend}</span>
        </div>
      )}
    </div>
    {description && (
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    )}
  </div>
);

export default function AnalyticsDashboard() {
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [readerStats, setReaderStats] = useState<ReaderStats | null>(null);
  const [notificationStats, setNotificationStats] = useState<NotificationStats | null>(null);
  const [contentViewsData, setContentViewsData] = useState<ContentViewsData[]>([]);
  const [commentsByType, setCommentsByType] = useState<CommentsByContentType[]>([]);
  const [moderationTimeline, setModerationTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        contentData,
        readerData,
        notificationData,
        viewsData,
        commentsData,
        moderationData
      ] = await Promise.all([
        analyticsService.getContentStats(),
        analyticsService.getReaderStats(),
        analyticsService.getNotificationStats(),
        analyticsService.getContentViewsByType(),
        analyticsService.getCommentsByContentType(),
        analyticsService.getModerationActionsTimeline(30)
      ]);

      setContentStats(contentData);
      setReaderStats(readerData);
      setNotificationStats(notificationData);
      setContentViewsData(viewsData);
      setCommentsByType(commentsData);
      setModerationTimeline(moderationData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load analytics data');
      console.error('Analytics loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Analytics</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadAnalytics}
              className="px-6 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const totalContent = (contentStats?.total_writings || 0) + 
                       (contentStats?.total_rankings || 0) + 
                       (contentStats?.total_roundtables || 0) + 
                       (contentStats?.total_media || 0);

  const contentDistribution = [
    { name: 'Writings', value: contentStats?.total_writings || 0 },
    { name: 'Rankings', value: contentStats?.total_rankings || 0 },
    { name: 'Roundtables', value: contentStats?.total_roundtables || 0 },
    { name: 'Media', value: contentStats?.total_media || 0 },
  ];

  const commentStatusData = [
    { name: 'Approved', value: readerStats?.approved_comments || 0 },
    { name: 'Pending', value: readerStats?.pending_comments || 0 },
    { name: 'Rejected', value: readerStats?.rejected_comments || 0 },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive metrics and insights for MrMelo Sanctuary</p>
          </div>

          {/* Content Statistics Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-amber-800 mr-3" />
              Content Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Content"
                value={totalContent}
                icon={ChartBarIcon}
                description="All content items across all types"
              />
              <StatCard
                title="Published Content"
                value={contentStats?.published_content || 0}
                icon={CheckCircleIcon}
                description="Live content visible to readers"
              />
              <StatCard
                title="Draft Content"
                value={contentStats?.draft_content || 0}
                icon={ClockIcon}
                description="Content in draft state"
              />
              <StatCard
                title="Writings"
                value={contentStats?.total_writings || 0}
                icon={DocumentTextIcon}
                description="Total writing pieces"
              />
            </div>

            {/* Content Distribution Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Content Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={contentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Reader Engagement Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <UserGroupIcon className="h-8 w-8 text-amber-800 mr-3" />
              Reader Engagement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Readers"
                value={readerStats?.total_readers || 0}
                icon={UserGroupIcon}
                description="Registered reader accounts"
              />
              <StatCard
                title="Active Readers"
                value={readerStats?.active_readers || 0}
                icon={CheckCircleIcon}
                description="Currently active accounts"
              />
              <StatCard
                title="Total Comments"
                value={readerStats?.total_comments || 0}
                icon={ChatBubbleLeftRightIcon}
                description="All comments across content"
              />
            </div>

            {/* Content Views by Type */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Content Views by Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contentViewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="content_type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_views" fill="#8B4513" name="Total Views" />
                  <Bar dataKey="avg_views" fill="#D2691E" name="Avg Views" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Comments by Content Type */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comments by Content Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={commentsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="content_type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_comments" fill="#A0522D" name="Total Comments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Comment Moderation Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-amber-800 mr-3" />
              Comment Moderation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Approved Comments"
                value={readerStats?.approved_comments || 0}
                icon={CheckCircleIcon}
                description="Published and visible"
              />
              <StatCard
                title="Pending Review"
                value={readerStats?.pending_comments || 0}
                icon={ClockIcon}
                description="Awaiting moderation"
              />
              <StatCard
                title="Rejected Comments"
                value={readerStats?.rejected_comments || 0}
                icon={XCircleIcon}
                description="Not approved"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Comment Status Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Comment Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={commentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {commentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Moderation Actions Timeline */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Moderation Actions (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moderationTimeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="approve" stroke="#10B981" name="Approved" />
                    <Line type="monotone" dataKey="reject" stroke="#EF4444" name="Rejected" />
                    <Line type="monotone" dataKey="edit" stroke="#F59E0B" name="Edited" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Email Notifications Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <EnvelopeIcon className="h-8 w-8 text-amber-800 mr-3" />
              Email Notifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Sent"
                value={notificationStats?.total_sent || 0}
                icon={EnvelopeIcon}
                description="All email notifications"
              />
              <StatCard
                title="Successful"
                value={notificationStats?.successful_sends || 0}
                icon={CheckCircleIcon}
                description="Delivered successfully"
              />
              <StatCard
                title="Failed"
                value={notificationStats?.failed_sends || 0}
                icon={XCircleIcon}
                description="Delivery failures"
              />
              <StatCard
                title="Success Rate"
                value={`${notificationStats?.success_rate || 0}%`}
                icon={ArrowTrendingUpIcon}
                description="Overall delivery rate"
              />
            </div>
          </section>

          {/* Refresh Button */}
          <div className="text-center mt-12">
            <button
              onClick={loadAnalytics}
              className="px-8 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors inline-flex items-center space-x-2"
            >
              <ArrowTrendingUpIcon className="h-5 w-5" />
              <span>Refresh Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}