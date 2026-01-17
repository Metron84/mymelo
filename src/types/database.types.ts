export interface Database {
  public: {
    Tables: {
      writings: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          category: 'essay' | 'analysis' | 'opinion' | 'interview' | 'review';
          status: 'draft' | 'published' | 'archived';
          featured_image: string | null;
          author_name: string;
          read_time: number | null;
          views_count: number;
          tags: string[] | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          category?: 'essay' | 'analysis' | 'opinion' | 'interview' | 'review';
          status?: 'draft' | 'published' | 'archived';
          featured_image?: string | null;
          author_name: string;
          read_time?: number | null;
          views_count?: number;
          tags?: string[] | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          category?: 'essay' | 'analysis' | 'opinion' | 'interview' | 'review';
          status?: 'draft' | 'published' | 'archived';
          featured_image?: string | null;
          author_name?: string;
          read_time?: number | null;
          views_count?: number;
          tags?: string[] | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rankings: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          methodology: string | null;
          ranking_data: any;
          category: string;
          status: 'draft' | 'published' | 'archived';
          featured_image: string | null;
          total_items: number;
          views_count: number;
          tags: string[] | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          methodology?: string | null;
          ranking_data: any;
          category: string;
          status?: 'draft' | 'published' | 'archived';
          featured_image?: string | null;
          total_items?: number;
          views_count?: number;
          tags?: string[] | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          methodology?: string | null;
          ranking_data?: any;
          category?: string;
          status?: 'draft' | 'published' | 'archived';
          featured_image?: string | null;
          total_items?: number;
          views_count?: number;
          tags?: string[] | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      roundtable_sessions: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          session_format: 'debate' | 'discussion' | 'panel' | 'interview';
          participants: any;
          transcript: string | null;
          key_takeaways: string[] | null;
          status: 'draft' | 'published' | 'archived';
          thumbnail: string | null;
          duration: number | null;
          views_count: number;
          tags: string[] | null;
          session_date: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          session_format?: 'debate' | 'discussion' | 'panel' | 'interview';
          participants: any;
          transcript?: string | null;
          key_takeaways?: string[] | null;
          status?: 'draft' | 'published' | 'archived';
          thumbnail?: string | null;
          duration?: number | null;
          views_count?: number;
          tags?: string[] | null;
          session_date?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          session_format?: 'debate' | 'discussion' | 'panel' | 'interview';
          participants?: any;
          transcript?: string | null;
          key_takeaways?: string[] | null;
          status?: 'draft' | 'published' | 'archived';
          thumbnail?: string | null;
          duration?: number | null;
          views_count?: number;
          tags?: string[] | null;
          session_date?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      media_items: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          media_type: 'video' | 'audio' | 'podcast' | 'documentary';
          media_url: string;
          thumbnail: string | null;
          series_name: string | null;
          episode_number: number | null;
          duration: number | null;
          transcript: string | null;
          status: 'draft' | 'published' | 'archived';
          views_count: number;
          tags: string[] | null;
          release_date: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          media_type?: 'video' | 'audio' | 'podcast' | 'documentary';
          media_url: string;
          thumbnail?: string | null;
          series_name?: string | null;
          episode_number?: number | null;
          duration?: number | null;
          transcript?: string | null;
          status?: 'draft' | 'published' | 'archived';
          views_count?: number;
          tags?: string[] | null;
          release_date?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          media_type?: 'video' | 'audio' | 'podcast' | 'documentary';
          media_url?: string;
          thumbnail?: string | null;
          series_name?: string | null;
          episode_number?: number | null;
          duration?: number | null;
          transcript?: string | null;
          status?: 'draft' | 'published' | 'archived';
          views_count?: number;
          tags?: string[] | null;
          release_date?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type ContentStatus = 'draft' | 'published' | 'archived';
export type ContentCategory = 'essay' | 'analysis' | 'opinion' | 'interview' | 'review';
export type MediaType = 'video' | 'audio' | 'podcast' | 'documentary';
export type SessionFormat = 'debate' | 'discussion' | 'panel' | 'interview';

export type Writing = Database['public']['Tables']['writings']['Row'];
export type Ranking = Database['public']['Tables']['rankings']['Row'];
export type RoundtableSession = Database['public']['Tables']['roundtable_sessions']['Row'];
export type MediaItem = Database['public']['Tables']['media_items']['Row'];

// Union type for content items with content_type field
export type ContentItem = (Writing | Ranking | RoundtableSession | MediaItem) & {
  content_type?: string;
};