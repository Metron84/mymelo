'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

interface HistoricalFigure {
  id: string;
  name: string;
  era: string;
  bio: string;
  icon: string;
  themes: string[];
}

interface RoundtableSession {
  id: string;
  title: string;
  topic: string;
  description: string;
  session_date: string;
  status: string;
  participants: string[];
  moderator?: string;
}

export default function RoundtableInteractive() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sessions, setSessions] = useState<RoundtableSession[]>([]);
  const [feelers, setFeelers] = useState<HistoricalFigure[]>([]);
  const [thinkers, setThinkers] = useState<HistoricalFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<RoundtableSession | null>(null);
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState('');
  const [creatingSession, setCreatingSession] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch historical figures
      const { data: figuresData, error: figuresError } = await supabase
        .from('historical_figures')
        .select('*')
        .order('name');

      if (figuresError) throw figuresError;

      // Separate feelers and thinkers based on names
      const feelerNames = ['T.S. Eliot', 'Cat Stevens (Yusuf Islam)', 'John Kennedy Toole', 
                          'Milan Kundera', 'Henry Miller', 'Italo Calvino'];
      const thinkerNames = ['Socrates', 'Aristotle', 'Carl Jung', 'Ibn Sina (Avicenna)'];

      const feelerFigures = figuresData?.filter(f => feelerNames.includes(f.name)) || [];
      const thinkerFigures = figuresData?.filter(f => thinkerNames.includes(f.name)) || [];

      setFeelers(feelerFigures);
      setThinkers(thinkerFigures);

      // Fetch roundtable sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('roundtable_sessions')
        .select('*')
        .eq('status', 'published')
        .order('session_date', { ascending: false });

      if (sessionsError) throw sessionsError;

      setSessions(sessionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateResponse = async (figureName: string, topic: string) => {
    try {
      setGeneratingFor(figureName);

      const response = await fetch('/api/roundtable/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          figureName,
          topic,
          position: feelers.some(f => f.name === figureName) ? 'feeler' : 'thinker',
        }),
      });

      if (!response.ok) throw new Error('Failed to generate response');

      const data = await response.json();
      setAiResponses(prev => ({ ...prev, [figureName]: data.response }));
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setGeneratingFor(null);
    }
  };

  const createNewSession = async () => {
    if (!newTopic.trim()) return;

    try {
      setCreatingSession(true);

      const { data, error } = await supabase
        .from('roundtable_sessions')
        .insert({
          title: `Roundtable: ${newTopic}`,
          topic: newTopic,
          description: `A philosophical discussion on ${newTopic} featuring Feelers and Thinkers`,
          participants: [...feelers.map(f => f.name), ...thinkers.map(t => t.name)],
          status: 'draft',
          session_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setSelectedSession(data);
      setNewTopic('');
      setAiResponses({});
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setCreatingSession(false);
    }
  };

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted/20 rounded-lg" />
            <div className="h-96 bg-muted/20 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Participants Overview */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Feelers */}
        <div className="bg-gradient-to-br from-error/5 to-transparent p-8 rounded-lg border border-error/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 rounded-full bg-error animate-pulse" />
            <h2 className="font-headline text-2xl font-bold text-error">
              Feelers ({feelers.length})
            </h2>
          </div>
          <div className="space-y-4">
            {feelers.map((figure) => (
              <div key={figure.id} className="p-4 bg-card rounded-lg border border-border hover:border-error/40 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{figure.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-cta font-bold text-foreground mb-1">
                      {figure.name}
                    </h3>
                    <p className="text-xs font-body text-muted-foreground mb-2">
                      {figure.era}
                    </p>
                    <p className="text-sm font-body text-foreground/80 line-clamp-2">
                      {figure.bio}
                    </p>
                    {figure.themes && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {figure.themes.slice(0, 2).map((theme, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-error/10 text-error rounded">
                            {theme}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thinkers */}
        <div className="bg-gradient-to-br from-primary/5 to-transparent p-8 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
            <h2 className="font-headline text-2xl font-bold text-primary">
              Thinkers ({thinkers.length})
            </h2>
          </div>
          <div className="space-y-4">
            {thinkers.map((figure) => (
              <div key={figure.id} className="p-4 bg-card rounded-lg border border-border hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{figure.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-cta font-bold text-foreground mb-1">
                      {figure.name}
                    </h3>
                    <p className="text-xs font-body text-muted-foreground mb-2">
                      {figure.era}
                    </p>
                    <p className="text-sm font-body text-foreground/80 line-clamp-2">
                      {figure.bio}
                    </p>
                    {figure.themes && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {figure.themes.slice(0, 2).map((theme, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                            {theme}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create New Session */}
      <div className="bg-gradient-to-br from-accent/5 to-transparent p-8 rounded-lg border border-accent/20">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="SparklesIcon" size={28} className="text-accent" />
          <h2 className="font-headline text-2xl font-bold text-foreground">
            Start a New Roundtable
          </h2>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Enter a topic for discussion..."
            className="flex-1 px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            disabled={creatingSession}
          />
          <button
            onClick={createNewSession}
            disabled={!newTopic.trim() || creatingSession}
            className="px-6 py-3 bg-accent text-background font-cta font-bold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {creatingSession ? 'Creating...' : 'Create Session'}
          </button>
        </div>
      </div>

      {/* Active Session */}
      {selectedSession && (
        <div className="bg-card rounded-lg border border-border p-8">
          <div className="mb-8">
            <h2 className="font-headline text-3xl font-bold text-foreground mb-2">
              {selectedSession.title}
            </h2>
            <p className="text-lg font-body text-muted-foreground">
              {selectedSession.description}
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-headline text-xl font-bold text-error mb-4">
                Feeler Perspectives
              </h3>
              <div className="space-y-4">
                {feelers.map((figure) => (
                  <div key={figure.id} className="p-6 bg-error/5 rounded-lg border border-error/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{figure.icon}</span>
                        <h4 className="font-cta font-bold text-foreground">
                          {figure.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => generateResponse(figure.name, selectedSession.topic)}
                        disabled={generatingFor === figure.name}
                        className="px-4 py-2 bg-error text-background font-cta text-sm rounded-lg hover:bg-error/90 disabled:opacity-50 transition-colors"
                      >
                        {generatingFor === figure.name ? 'Generating...' : 'Generate Response'}
                      </button>
                    </div>
                    {aiResponses[figure.name] && (
                      <div className="p-4 bg-card rounded-lg border border-border">
                        <p className="font-body text-foreground/90 leading-relaxed whitespace-pre-wrap">
                          {aiResponses[figure.name]}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-headline text-xl font-bold text-primary mb-4">
                Thinker Perspectives
              </h3>
              <div className="space-y-4">
                {thinkers.map((figure) => (
                  <div key={figure.id} className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{figure.icon}</span>
                        <h4 className="font-cta font-bold text-foreground">
                          {figure.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => generateResponse(figure.name, selectedSession.topic)}
                        disabled={generatingFor === figure.name}
                        className="px-4 py-2 bg-primary text-background font-cta text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        {generatingFor === figure.name ? 'Generating...' : 'Generate Response'}
                      </button>
                    </div>
                    {aiResponses[figure.name] && (
                      <div className="p-4 bg-card rounded-lg border border-border">
                        <p className="font-body text-foreground/90 leading-relaxed whitespace-pre-wrap">
                          {aiResponses[figure.name]}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Previous Sessions */}
      {sessions.length > 0 && (
        <div>
          <h2 className="font-headline text-2xl font-bold text-foreground mb-6">
            Previous Sessions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-6 bg-card rounded-lg border border-border hover:border-accent transition-colors cursor-pointer"
                onClick={() => setSelectedSession(session)}
              >
                <h3 className="font-cta font-bold text-foreground mb-2">
                  {session.title}
                </h3>
                <p className="text-sm font-body text-muted-foreground mb-4">
                  {new Date(session.session_date).toLocaleDateString()}
                </p>
                <p className="text-sm font-body text-foreground/80 line-clamp-2">
                  {session.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}