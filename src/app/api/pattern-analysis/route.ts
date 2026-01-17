import { NextRequest, NextResponse } from 'next/server';
import { analyzeContentPatterns } from '@/services/aiRecommendationService';
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
    const { contentIds, contentType } = body;

    if (!contentIds || !Array.isArray(contentIds) || contentIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid content IDs provided' },
        { status: 400 }
      );
    }

    let contents: ContentItem[] = [];

    if (contentType === 'all' || !contentType) {
      // Fetch from all tables
      const [writingsResult, rankingsResult, roundtableResult, mediaResult] = await Promise.all([
        supabase.from('writings').select('*').in('id', contentIds),
        supabase.from('rankings').select('*').in('id', contentIds),
        supabase.from('roundtable_sessions').select('*').in('id', contentIds),
        supabase.from('media_items').select('*').in('id', contentIds),
      ]);

      if (writingsResult.data) {
        contents.push(...writingsResult.data.map(writingToContentItem));
      }

      if (rankingsResult.data) {
        contents.push(...rankingsResult.data.map(rankingToContentItem));
      }

      if (roundtableResult.data) {
        contents.push(...roundtableResult.data.map(roundtableToContentItem));
      }

      if (mediaResult.data) {
        contents.push(...mediaResult.data.map(mediaToContentItem));
      }
    } else {
      // Fetch from specific table
      const tableMap: Record<string, { name: string; type: string; converter: (item: Writing | Ranking | RoundtableSession | MediaItem) => ContentItem }> = {
        'writing': {
          name: 'writings',
          type: 'writing',
          converter: writingToContentItem as (item: Writing | Ranking | RoundtableSession | MediaItem) => ContentItem,
        },
        'ranking': {
          name: 'rankings',
          type: 'ranking',
          converter: rankingToContentItem as (item: Writing | Ranking | RoundtableSession | MediaItem) => ContentItem,
        },
        'roundtable': {
          name: 'roundtable_sessions',
          type: 'roundtable',
          converter: roundtableToContentItem as (item: Writing | Ranking | RoundtableSession | MediaItem) => ContentItem,
        },
        'media': {
          name: 'media_items',
          type: 'media',
          converter: mediaToContentItem as (item: Writing | Ranking | RoundtableSession | MediaItem) => ContentItem,
        },
      };

      const table = tableMap[contentType];
      if (!table) {
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
      }

      const { data } = await supabase.from(table.name).select('*').in('id', contentIds);

      if (data) {
        contents = data.map(table.converter);
      }
    }

    if (contents.length === 0) {
      return NextResponse.json(
        { error: 'No content found' },
        { status: 404 }
      );
    }

    // Analyze patterns
    const analysis = await analyzeContentPatterns(contents);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in pattern analysis API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze patterns' },
      { status: 500 }
    );
  }
}
