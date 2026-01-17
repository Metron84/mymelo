import { supabase } from '@/lib/supabase';

export interface NotificationPreferences {
  reader_id: string;
  new_content_frequency: 'instant' | 'daily' | 'weekly' | 'never';
  comment_reply_frequency: 'instant' | 'daily' | 'weekly' | 'never';
  content_types: ('all' | 'writings' | 'roundtables' | 'rankings' | 'media')[];
}

export interface ReaderProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_login_at: string | null;
  is_active: boolean;
}

class ReaderNotificationService {
  /**
   * Get reader's notification preferences
   */
  async getNotificationPreferences(readerId: string) {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('reader_id', readerId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch notification preferences: ${error.message}`);
    }

    return data as NotificationPreferences;
  }

  /**
   * Update reader's notification preferences
   */
  async updateNotificationPreferences(
    readerId: string,
    preferences: Partial<NotificationPreferences>
  ) {
    const { data, error } = await supabase
      .from('notification_preferences')
      .update(preferences)
      .eq('reader_id', readerId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update notification preferences: ${error.message}`);
    }

    return data as NotificationPreferences;
  }

  /**
   * Get reader profile
   */
  async getReaderProfile(readerId: string) {
    const { data, error } = await supabase
      .from('reader_profiles')
      .select('*')
      .eq('id', readerId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch reader profile: ${error.message}`);
    }

    return data as ReaderProfile;
  }

  /**
   * Update reader profile
   */
  async updateReaderProfile(readerId: string, updates: Partial<ReaderProfile>) {
    const { data, error } = await supabase
      .from('reader_profiles')
      .update(updates)
      .eq('id', readerId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update reader profile: ${error.message}`);
    }

    return data as ReaderProfile;
  }

  /**
   * Send notification to readers when new content is published
   */
  async notifyReadersOfNewContent(
    contentId: string,
    contentType: 'writing' | 'roundtable' | 'ranking' | 'media',
    contentTitle: string,
    contentUrl: string
  ) {
    try {
      // Call Supabase function to get readers who want notifications
      const { data: readers, error: readersError } = await supabase.rpc(
        'get_readers_for_new_content_notification',
        { content_type_param: contentType }
      );

      if (readersError) {
        throw new Error(`Failed to fetch readers: ${readersError.message}`);
      }

      // Send email to each reader via edge function
      const notifications = await Promise.allSettled(
        readers?.map(async (reader: any) => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-reader-notification`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                  readerEmail: reader.reader_email,
                  readerName: reader.reader_name,
                  contentTitle,
                  contentType,
                  contentUrl
                })
              }
            );

            const result = await response.json();

            // Log notification attempt
            await supabase.rpc('log_email_notification', {
              reader_id_param: reader.reader_id,
              notification_type_param: 'new_content',
              content_id_param: contentId,
              content_type_param: contentType,
              email_sent_param: response.ok,
              error_message_param: response.ok ? null : result.error
            });

            return {
              readerId: reader.reader_id,
              success: response.ok,
              error: response.ok ? null : result.error
            };
          } catch (error: any) {
            return {
              readerId: reader.reader_id,
              success: false,
              error: error.message
            };
          }
        }) || []
      );

      const successCount = notifications.filter(
        (n) => n.status === 'fulfilled' && n.value.success
      ).length;

      return {
        totalReaders: readers?.length || 0,
        successCount,
        failureCount: (readers?.length || 0) - successCount
      };
    } catch (error: any) {
      throw new Error(`Failed to send notifications: ${error.message}`);
    }
  }

  /**
   * Get notification history for a reader
   */
  async getNotificationHistory(readerId: string, limit = 50) {
    const { data, error } = await supabase
      .from('email_notifications')
      .select('*')
      .eq('reader_id', readerId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch notification history: ${error.message}`);
    }

    return data;
  }
}

export const readerNotificationService = new ReaderNotificationService();