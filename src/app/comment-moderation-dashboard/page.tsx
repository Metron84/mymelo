'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchComments,
  updateCommentStatus,
  editComment,
  deleteComment,
  bulkApproveComments,
  bulkRejectComments,
  CommentWithContent,
  CommentStatus,
} from '@/services/commentService';
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

export default function CommentModerationDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState<CommentWithContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<CommentStatus | 'all'>('pending');
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      loadComments();
    }
  }, [authLoading, user, filterStatus]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchComments(filterStatus === 'all' ? undefined : filterStatus);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments. Please try again.');
      console.error('Load comments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (commentId: string) => {
    if (!user) return;
    try {
      await updateCommentStatus(commentId, 'approved', user.id);
      await loadComments();
      setSelectedComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    } catch (err) {
      setError('Failed to approve comment');
      console.error('Approve error:', err);
    }
  };

  const handleReject = async (commentId: string) => {
    if (!user) return;
    try {
      await updateCommentStatus(commentId, 'rejected', user.id, 'Moderation decision');
      await loadComments();
      setSelectedComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    } catch (err) {
      setError('Failed to reject comment');
      console.error('Reject error:', err);
    }
  };

  const handleEdit = (comment: CommentWithContent) => {
    setEditingCommentId(comment.id);
    setEditText(comment.comment_text);
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!user) return;
    try {
      await editComment(commentId, editText, user.id);
      setEditingCommentId(null);
      await loadComments();
    } catch (err) {
      setError('Failed to edit comment');
      console.error('Edit error:', err);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(commentId);
      await loadComments();
      setSelectedComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Delete error:', err);
    }
  };

  const handleToggleSelect = (commentId: string) => {
    setSelectedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleBulkApprove = async () => {
    if (!user || selectedComments.size === 0) return;
    try {
      await bulkApproveComments(Array.from(selectedComments), user.id);
      setSelectedComments(new Set());
      await loadComments();
    } catch (err) {
      setError('Failed to bulk approve comments');
      console.error('Bulk approve error:', err);
    }
  };

  const handleBulkReject = async () => {
    if (!user || selectedComments.size === 0) return;
    try {
      await bulkRejectComments(Array.from(selectedComments), user.id, 'Bulk moderation');
      setSelectedComments(new Set());
      await loadComments();
    } catch (err) {
      setError('Failed to bulk reject comments');
      console.error('Bulk reject error:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-beige">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rich-espresso mx-auto"></div>
          <p className="mt-4 text-rich-espresso">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-beige">
        <div className="text-center max-w-md">
          <ChatBubbleLeftIcon className="h-16 w-16 text-rich-espresso mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-rich-espresso mb-2">Admin Access Required</h1>
          <p className="text-muted-gray mb-6">
            Please sign in with an admin account to access the comment moderation dashboard.
          </p>
          <a
            href="/admin/login"
            className="inline-block px-6 py-3 bg-rich-espresso text-white rounded-lg hover:bg-deep-mahogany transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-soft-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-rich-espresso">Comment Moderation</h1>
              <p className="text-muted-gray mt-1">Review and manage reader comments</p>
            </div>
            <a
              href="/admin-dashboard"
              className="px-4 py-2 bg-rich-espresso text-white rounded-lg hover:bg-deep-mahogany transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filter and Bulk Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-soft-cream p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-3">
              <FunnelIcon className="h-5 w-5 text-muted-gray" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as CommentStatus | 'all')}
                className="px-4 py-2 border border-soft-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-espresso"
              >
                <option value="all">All Comments</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <span className="text-sm text-muted-gray">
                {comments.length} comment{comments.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Bulk Actions */}
            {selectedComments.size > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-gray">
                  {selectedComments.size} selected
                </span>
                <button
                  onClick={handleBulkApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  Bulk Approve
                </button>
                <button
                  onClick={handleBulkReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <XCircleIcon className="h-4 w-4" />
                  Bulk Reject
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rich-espresso mx-auto"></div>
            <p className="mt-4 text-muted-gray">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-soft-cream">
            <ChatBubbleLeftIcon className="h-16 w-16 text-muted-gray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-rich-espresso mb-2">No comments found</h3>
            <p className="text-muted-gray">
              {filterStatus === 'pending' ?'No pending comments requiring moderation' :'No comments match your filter criteria'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-lg shadow-sm border border-soft-cream overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Comment Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedComments.has(comment.id)}
                        onChange={() => handleToggleSelect(comment.id)}
                        className="mt-1 h-5 w-5 text-rich-espresso focus:ring-rich-espresso border-soft-cream rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-rich-espresso">
                            {comment.commenter_name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              comment.status === 'approved' ?'bg-green-100 text-green-800'
                                : comment.status === 'rejected' ?'bg-red-100 text-red-800' :'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {comment.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-gray">{comment.commenter_email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-gray">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Content Reference */}
                  <div className="mb-4 p-3 bg-soft-cream rounded-lg">
                    <p className="text-sm text-muted-gray mb-1">
                      On: <span className="font-medium">{comment.content_type}</span>
                      {comment.content_category && ` • ${comment.content_category}`}
                    </p>
                    <p className="text-sm font-medium text-rich-espresso">
                      {comment.content_title}
                    </p>
                  </div>

                  {/* Comment Text */}
                  {editingCommentId === comment.id ? (
                    <div className="mb-4">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-4 py-3 border border-soft-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-espresso resize-none"
                        rows={4}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="px-4 py-2 bg-rich-espresso text-white rounded-lg hover:bg-deep-mahogany transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-4 py-2 bg-soft-cream text-rich-espresso rounded-lg hover:bg-warm-tan transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-rich-espresso mb-4 leading-relaxed">
                      {comment.comment_text}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {comment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(comment.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(comment.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircleIcon className="h-4 w-4" />
                          Reject
                        </button>
                      </>
                    )}
                    {editingCommentId !== comment.id && (
                      <button
                        onClick={() => handleEdit(comment)}
                        className="flex items-center gap-2 px-4 py-2 bg-rich-espresso text-white rounded-lg hover:bg-deep-mahogany transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}