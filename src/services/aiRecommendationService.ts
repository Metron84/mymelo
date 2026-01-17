import genAI from '../lib/geminiClient';
import { ContentItem } from '../types/database.types';

interface RecommendationRequest {
  contentType: 'writing' | 'ranking' | 'roundtable' | 'media';
  currentContent: {
    title: string;
    description?: string;
    tags?: string[];
    category?: string;
  };
  availableContent: ContentItem[];
}

interface ThematicConnection {
  contentId: string;
  contentTitle: string;
  contentType: string;
  connectionStrength: number;
  connectionReason: string;
  sharedThemes: string[];
}

interface AIRecommendation {
  recommendations: ThematicConnection[];
  overarchingThemes: string[];
  suggestedTags: string[];
  contentSummary: string;
}

/**
 * Generates AI-powered content recommendations based on thematic connections
 * @param request - The recommendation request with current content and available items
 * @returns AI-generated recommendations with thematic connections
 */
export async function generateContentRecommendations(
  request: RecommendationRequest
): Promise<AIRecommendation> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            recommendations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  contentId: { type: 'string' },
                  contentTitle: { type: 'string' },
                  contentType: { type: 'string' },
                  connectionStrength: { type: 'number' },
                  connectionReason: { type: 'string' },
                  sharedThemes: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['contentId', 'contentTitle', 'contentType', 'connectionStrength', 'connectionReason', 'sharedThemes']
              }
            },
            overarchingThemes: {
              type: 'array',
              items: { type: 'string' }
            },
            suggestedTags: {
              type: 'array',
              items: { type: 'string' }
            },
            contentSummary: { type: 'string' }
          },
          required: ['recommendations', 'overarchingThemes', 'suggestedTags', 'contentSummary']
        }
      }
    });

    const prompt = `
You are an AI content analyst specializing in identifying thematic connections and patterns across diverse content types.

Current Content:
- Type: ${request.contentType}
- Title: ${request.currentContent.title}
- Description: ${request.currentContent.description || 'N/A'}
- Tags: ${request.currentContent.tags?.join(', ') || 'None'}
- Category: ${request.currentContent.category || 'N/A'}

Available Content for Recommendations (${request.availableContent.length} items):
${request.availableContent.map((item: ContentItem, idx: number) => `
${idx + 1}. ID: ${item.id}
   Type: ${item.content_type}
   Title: ${item.title}
   Description: ${item.description || 'N/A'}
   Tags: ${item.tags?.join(', ') || 'None'}
   Category: ${item.category || 'N/A'}
`).join('\n')}

Analyze the current content and identify the top 5-7 most thematically connected pieces from the available content. For each recommendation:

1. Calculate a connection strength score (0-100) based on:
   - Shared themes and concepts
   - Topical overlap
   - Complementary perspectives
   - Intellectual depth alignment

2. Provide a clear, insightful reason for the connection

3. Identify specific shared themes between the contents

Also provide:
- Overarching themes present across the current content and recommendations
- Suggested tags that capture the essence of these connections
- A brief summary of the thematic landscape

Focus on deep, meaningful connections rather than surface-level similarities.
`;

    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());

    return response as AIRecommendation;
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    throw error;
  }
}

/**
 * Generates embeddings for content to enable semantic search
 * @param text - The text content to generate embeddings for
 * @returns Vector representation of the text
 */
export async function generateContentEmbeddings(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

/**
 * Analyzes content patterns across multiple items
 * @param contents - Array of content items to analyze
 * @returns Pattern analysis with insights
 */
export async function analyzeContentPatterns(
  contents: ContentItem[]
): Promise<{
  commonThemes: string[];
  contentClusters: Array<{ theme: string; contentIds: string[] }>;
  insights: string;
}> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            commonThemes: {
              type: 'array',
              items: { type: 'string' }
            },
            contentClusters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  theme: { type: 'string' },
                  contentIds: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['theme', 'contentIds']
              }
            },
            insights: { type: 'string' }
          },
          required: ['commonThemes', 'contentClusters', 'insights']
        }
      }
    });

    const prompt = `
Analyze the following content collection and identify patterns, themes, and clusters:

${contents.map((item: ContentItem, idx: number) => `
${idx + 1}. ID: ${item.id}
   Type: ${item.content_type}
   Title: ${item.title}
   Description: ${item.description || 'N/A'}
   Tags: ${item.tags?.join(', ') || 'None'}
   Category: ${item.category || 'N/A'}
`).join('\n')}

Provide:
1. Common themes across all content (5-8 themes)
2. Content clusters grouped by thematic similarity (3-5 clusters)
3. Insightful analysis about the content collection's intellectual landscape

Focus on deep thematic connections and intellectual patterns.
`;

    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());

    return response;
  } catch (error) {
    console.error('Error analyzing content patterns:', error);
    throw error;
  }
}

/**
 * Generates suggested connections between content items
 * @param sourceContent - The source content item
 * @param targetContents - Potential target content items
 * @returns Suggested connections with reasoning
 */
export async function suggestThematicConnections(
  sourceContent: ContentItem,
  targetContents: ContentItem[]
): Promise<ThematicConnection[]> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            connections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  contentId: { type: 'string' },
                  contentTitle: { type: 'string' },
                  contentType: { type: 'string' },
                  connectionStrength: { type: 'number' },
                  connectionReason: { type: 'string' },
                  sharedThemes: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['contentId', 'contentTitle', 'contentType', 'connectionStrength', 'connectionReason', 'sharedThemes']
              }
            }
          },
          required: ['connections']
        }
      }
    });

    const prompt = `
Source Content:
- Type: ${sourceContent.content_type}
- Title: ${sourceContent.title}
- Description: ${sourceContent.description || 'N/A'}
- Tags: ${sourceContent.tags?.join(', ') || 'None'}

Target Content Options:
${targetContents.map((item: ContentItem, idx: number) => `
${idx + 1}. ID: ${item.id}
   Type: ${item.content_type}
   Title: ${item.title}
   Description: ${item.description || 'N/A'}
   Tags: ${item.tags?.join(', ') || 'None'}
`).join('\n')}

Analyze and suggest thematic connections between the source content and the most relevant target content items. For each connection:
- Rate connection strength (0-100)
- Explain the connection reasoning
- Identify shared themes

Return only the most meaningful connections (top 5-7).
`;

    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());

    return response.connections as ThematicConnection[];
  } catch (error) {
    console.error('Error suggesting thematic connections:', error);
    throw error;
  }
}