import { NextRequest, NextResponse } from 'next/server';
import { generateContentRecommendations } from '@/services/aiRecommendationService';
import { supabase } from '@/lib/supabase';
import type { Writing, Ranking, RoundtableSession, MediaItem, ContentItem } from '@/types/database.types';

// Helper function to convert Writing to ContentItem
function writingToContentItem(item: Writing): ContentItem {
  return {
    ...item,
    content_type: 'writing',
    description: item.excerpt ?? undefined,
  };
}

// Helper function to convert Ranking to ContentItem
function rankingToContentItem(item: Ranking): ContentItem {
  return {
    ...item,
    content_type: 'ranking',
  };
}

// Helper function to convert RoundtableSession to ContentItem
function roundtableToContentItem(item: RoundtableSession): ContentItem {
  return {
    ...item,
    content_type: 'roundtable',
  };
}

// Helper function to convert MediaItem to ContentItem
function mediaToContentItem(item: MediaItem): ContentItem {
  return {
    ...item,
    content_type: 'media',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, currentContent } = body;

    if (!contentType || !currentContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch available content from database
    const [writingsResult, rankingsResult, roundtableResult, mediaResult] = await Promise.all([
      supabase
        .from('writings')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('rankings')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('roundtable_sessions')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('media_items')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    // Transform and combine all content
    const availableContent: ContentItem[] = [
      ...(writingsResult.data || []).map(writingToContentItem),
      ...(rankingsResult.data || []).map(rankingToContentItem),
      ...(roundtableResult.data || []).map(roundtableToContentItem),
      ...(mediaResult.data || []).map(mediaToContentItem),
    ];

    // Generate AI recommendations
    const recommendations = await generateContentRecommendations({
      contentType,
      currentContent,
      availableContent,
    });

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error in AI recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
