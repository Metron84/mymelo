import { supabase } from '@/lib/supabase';

export interface ContentStats {
  total_writings: number;
  total_rankings: number;
  total_roundtables: number;
  total_media: number;
  published_content: number;
  draft_content: number;
}

export interface ReaderStats {
  total_readers: number;
  active_readers: number;
  total_comments: number;
  approved_comments: number;
  pending_comments: number;
  rejected_comments: number;
}

export interface NotificationStats {
  total_sent: number;
  successful_sends: number;
  failed_sends: number;
  success_rate: number;
}

export interface ContentViewsData {
  content_type: string;
  total_views: number;
  avg_views: number;
}

export interface CommentsByContentType {
  content_type: string;
  total_comments: number;
}

export const analyticsService = {
  // Get content statistics using existing database function
  async getContentStats(): Promise<ContentStats | null> {
    try {
      const { data, error } = await supabase.rpc('get_content_stats');
      
      if (error) throw error;
      
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching content stats:', error);
      throw error;
    }
  },

  // Get reader and comment statistics
  async getReaderStats(): Promise<ReaderStats> {
    try {
      // Get reader counts
      const { count: totalReaders, error: readerError } = await supabase
        .from('reader_profiles')
        .select('*', { count: 'exact', head: true });

      if (readerError) throw readerError;

      const { count: activeReaders, error: activeError } = await supabase
        .from('reader_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (activeError) throw activeError;

      // Get comment counts by status
      const { count: totalComments, error: commentsError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true });

      if (commentsError) throw commentsError;

      const { count: approvedComments, error: approvedError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      if (approvedError) throw approvedError;

      const { count: pendingComments, error: pendingError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      const { count: rejectedComments, error: rejectedError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      if (rejectedError) throw rejectedError;

      return {
        total_readers: totalReaders || 0,
        active_readers: activeReaders || 0,
        total_comments: totalComments || 0,
        approved_comments: approvedComments || 0,
        pending_comments: pendingComments || 0,
        rejected_comments: rejectedComments || 0,
      };
    } catch (error) {
      console.error('Error fetching reader stats:', error);
      throw error;
    }
  },

  // Get email notification statistics
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const { count: totalSent, error: totalError } = await supabase
        .from('email_notifications')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      const { count: successfulSends, error: successError } = await supabase
        .from('email_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('email_sent', true);

      if (successError) throw successError;

      const { count: failedSends, error: failedError } = await supabase
        .from('email_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('email_sent', false);

      if (failedError) throw failedError;

      const successRate = totalSent ? (successfulSends! / totalSent) * 100 : 0;

      return {
        total_sent: totalSent || 0,
        successful_sends: successfulSends || 0,
        failed_sends: failedSends || 0,
        success_rate: Number(successRate.toFixed(2)),
      };
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  },

  // Get view counts by content type
  async getContentViewsByType(): Promise<ContentViewsData[]> {
    try {
      const viewsData: ContentViewsData[] = [];

      // Writings
      const { data: writings, error: writingsError } = await supabase
        .from('writings')
        .select('view_count')
        .eq('status', 'published');

      if (writingsError) throw writingsError;

      const writingsViews = writings?.reduce((sum, w) => sum + (w.view_count || 0), 0) || 0;
      const avgWritingsViews = writings && writings.length > 0 ? writingsViews / writings.length : 0;

      viewsData.push({
        content_type: 'Writings',
        total_views: writingsViews,
        avg_views: Number(avgWritingsViews.toFixed(2)),
      });

      // Roundtables
      const { data: roundtables, error: roundtablesError } = await supabase
        .from('roundtable_sessions')
        .select('view_count')
        .eq('status', 'published');

      if (roundtablesError) throw roundtablesError;

      const roundtablesViews = roundtables?.reduce((sum, r) => sum + (r.view_count || 0), 0) || 0;
      const avgRoundtablesViews = roundtables && roundtables.length > 0 ? roundtablesViews / roundtables.length : 0;

      viewsData.push({
        content_type: 'Roundtables',
        total_views: roundtablesViews,
        avg_views: Number(avgRoundtablesViews.toFixed(2)),
      });

      // Rankings
      const { data: rankings, error: rankingsError } = await supabase
        .from('rankings')
        .select('view_count')
        .eq('status', 'published');

      if (rankingsError) throw rankingsError;

      const rankingsViews = rankings?.reduce((sum, r) => sum + (r.view_count || 0), 0) || 0;
      const avgRankingsViews = rankings && rankings.length > 0 ? rankingsViews / rankings.length : 0;

      viewsData.push({
        content_type: 'Rankings',
        total_views: rankingsViews,
        avg_views: Number(avgRankingsViews.toFixed(2)),
      });

      // Media
      const { data: media, error: mediaError } = await supabase
        .from('media_items')
        .select('view_count, play_count')
        .eq('status', 'published');

      if (mediaError) throw mediaError;

      const mediaViews = media?.reduce((sum, m) => sum + (m.view_count || 0) + (m.play_count || 0), 0) || 0;
      const avgMediaViews = media && media.length > 0 ? mediaViews / media.length : 0;

      viewsData.push({
        content_type: 'Media',
        total_views: mediaViews,
        avg_views: Number(avgMediaViews.toFixed(2)),
      });

      return viewsData;
    } catch (error) {
      console.error('Error fetching content views:', error);
      throw error;
    }
  },

  // Get comments by content type
  async getCommentsByContentType(): Promise<CommentsByContentType[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('content_type');

      if (error) throw error;

      const commentCounts: Record<string, number> = {};
      
      data?.forEach((comment) => {
        const type = comment.content_type || 'unknown';
        commentCounts[type] = (commentCounts[type] || 0) + 1;
      });

      return Object.entries(commentCounts).map(([content_type, total_comments]) => ({
        content_type: content_type.charAt(0).toUpperCase() + content_type.slice(1),
        total_comments,
      }));
    } catch (error) {
      console.error('Error fetching comments by type:', error);
      throw error;
    }
  },

  // Get moderation actions timeline
  async getModerationActionsTimeline(days: number = 30): Promise<any[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('comment_moderation_actions')
        .select('action, created_at, new_status')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const groupedData: Record<string, any> = {};
      
      data?.forEach((action) => {
        const date = new Date(action.created_at).toLocaleDateString();
        if (!groupedData[date]) {
          groupedData[date] = { date, approve: 0, reject: 0, edit: 0 };
        }
        groupedData[date][action.action as string] = (groupedData[date][action.action as string] || 0) + 1;
      });

      return Object.values(groupedData);
    } catch (error) {
      console.error('Error fetching moderation timeline:', error);
      throw error;
    }
  },
};