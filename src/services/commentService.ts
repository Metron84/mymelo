import { supabase } from '../lib/supabase';

export type CommentStatus = 'pending' | 'approved' | 'rejected';
export type ContentType = 'writing' | 'roundtable' | 'ranking' | 'media';
export type ModerationAction = 'approve' | 'reject' | 'edit';

export interface Comment {
  id: string;
  content_type: ContentType;
  content_id: string;
  commenter_name: string;
  commenter_email: string;
  comment_text: string;
  status: CommentStatus;
  parent_comment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CommentWithContent extends Comment {
  content_title?: string;
  content_category?: string;
}

export interface ModerationActionRecord {
  id: string;
  comment_id: string;
  moderator_id: string;
  action: ModerationAction;
  reason?: string;
  previous_status: CommentStatus;
  new_status: CommentStatus;
  created_at: string;
}

/**
 * Fetch all comments with optional status filter
 */
export async function fetchComments(status?: CommentStatus): Promise<CommentWithContent[]> {
  try {
    let query = supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Enrich comments with content titles
    const enrichedComments = await Promise.all(
      (data || []).map(async (comment) => {
        let content_title = 'Unknown Content';
        let content_category = '';

        try {
          if (comment.content_type === 'writing') {
            const { data: writing } = await supabase
              .from('writings')
              .select('title, category')
              .eq('id', comment.content_id)
              .single();
            if (writing) {
              content_title = writing.title;
              content_category = writing.category;
            }
          } else if (comment.content_type === 'roundtable') {
            const { data: session } = await supabase
              .from('roundtable_sessions')
              .select('title, category')
              .eq('id', comment.content_id)
              .single();
            if (session) {
              content_title = session.title;
              content_category = session.category;
            }
          } else if (comment.content_type === 'ranking') {
            const { data: ranking } = await supabase
              .from('rankings')
              .select('title, category')
              .eq('id', comment.content_id)
              .single();
            if (ranking) {
              content_title = ranking.title;
              content_category = ranking.category;
            }
          } else if (comment.content_type === 'media') {
            const { data: media } = await supabase
              .from('media_items')
              .select('title, category')
              .eq('id', comment.content_id)
              .single();
            if (media) {
              content_title = media.title;
              content_category = media.category;
            }
          }
        } catch (error) {
          console.error('Error fetching content details:', error);
        }

        return {
          ...comment,
          content_title,
          content_category,
        };
      })
    );

    return enrichedComments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

/**
 * Update comment status (approve/reject)
 */
export async function updateCommentStatus(
  commentId: string,
  newStatus: CommentStatus,
  moderatorId: string,
  reason?: string
): Promise<void> {
  try {
    // Get current comment to track previous status
    const { data: currentComment, error: fetchError } = await supabase
      .from('comments')
      .select('status')
      .eq('id', commentId)
      .single();

    if (fetchError) throw fetchError;

    // Update comment status
    const { error: updateError } = await supabase
      .from('comments')
      .update({ status: newStatus })
      .eq('id', commentId);

    if (updateError) throw updateError;

    // Record moderation action
    const action: ModerationAction = newStatus === 'approved' ? 'approve' : 'reject';
    const { error: actionError } = await supabase
      .from('comment_moderation_actions')
      .insert({
        comment_id: commentId,
        moderator_id: moderatorId,
        action,
        reason,
        previous_status: currentComment?.status || 'pending',
        new_status: newStatus,
      });

    if (actionError) throw actionError;
  } catch (error) {
    console.error('Error updating comment status:', error);
    throw error;
  }
}

/**
 * Edit comment text
 */
export async function editComment(
  commentId: string,
  newText: string,
  moderatorId: string
): Promise<void> {
  try {
    const { data: currentComment, error: fetchError } = await supabase
      .from('comments')
      .select('status')
      .eq('id', commentId)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('comments')
      .update({ comment_text: newText })
      .eq('id', commentId);

    if (updateError) throw updateError;

    // Record edit action
    const { error: actionError } = await supabase
      .from('comment_moderation_actions')
      .insert({
        comment_id: commentId,
        moderator_id: moderatorId,
        action: 'edit',
        previous_status: currentComment?.status || 'pending',
        new_status: currentComment?.status || 'pending',
      });

    if (actionError) throw actionError;
  } catch (error) {
    console.error('Error editing comment:', error);
    throw error;
  }
}

/**
 * Delete comment
 */
export async function deleteComment(commentId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

/**
 * Fetch moderation history for a comment
 */
export async function fetchModerationHistory(commentId: string): Promise<ModerationActionRecord[]> {
  try {
    const { data, error } = await supabase
      .from('comment_moderation_actions')
      .select('*')
      .eq('comment_id', commentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching moderation history:', error);
    throw error;
  }
}

/**
 * Bulk approve comments
 */
export async function bulkApproveComments(
  commentIds: string[],
  moderatorId: string
): Promise<void> {
  try {
    await Promise.all(
      commentIds.map((id) => updateCommentStatus(id, 'approved', moderatorId))
    );
  } catch (error) {
    console.error('Error bulk approving comments:', error);
    throw error;
  }
}

/**
 * Bulk reject comments
 */
export async function bulkRejectComments(
  commentIds: string[],
  moderatorId: string,
  reason?: string
): Promise<void> {
  try {
    await Promise.all(
      commentIds.map((id) => updateCommentStatus(id, 'rejected', moderatorId, reason))
    );
  } catch (error) {
    console.error('Error bulk rejecting comments:', error);
    throw error;
  }
}