'use client';

import React, { useState } from 'react';
import { Sparkles, TrendingUp, Link2, Lightbulb } from '@heroicons/react/24/outline';

interface RecommendationEngineProps {
  contentType: 'writing' | 'ranking' | 'roundtable' | 'media';
  currentContent: {
    title: string;
    description?: string;
    tags?: string[];
    category?: string;
  };
  onRecommendationClick?: (contentId: string) => void;
}

interface AIRecommendationResponse {
  recommendations: Array<{
    contentId: string;
    contentTitle: string;
    contentType: string;
    connectionStrength: number;
    connectionReason: string;
    sharedThemes: string[];
  }>;
  overarchingThemes: string[];
  suggestedTags: string[];
  contentSummary: string;
}

export default function RecommendationEngine({ 
  contentType, 
  currentContent,
  onRecommendationClick 
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          currentContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            AI-Powered Recommendations
          </h3>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Insights
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      )}

      {recommendations && !loading && (
        <div className="space-y-6">
          {/* Content Summary */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Thematic Summary
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {recommendations.contentSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Overarching Themes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Overarching Themes
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.overarchingThemes?.map((theme, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>

          {/* Suggested Tags */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Suggested Tags
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.suggestedTags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Thematic Connections */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Thematic Connections
              </h4>
            </div>
            <div className="space-y-4">
              {recommendations.recommendations?.map((rec, index) => (
                <div
                  key={rec.contentId}
                  onClick={() => onRecommendationClick?.(rec.contentId)}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          {rec.contentType}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${rec.connectionStrength}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {rec.connectionStrength}%
                          </span>
                        </div>
                      </div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {rec.contentTitle}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {rec.connectionReason}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {rec.sharedThemes?.map((theme, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded text-xs"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!recommendations && !loading && (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Click &quot;Generate Insights&quot; to discover thematic connections and AI-powered recommendations
          </p>
        </div>
      )}
    </div>
  );
}