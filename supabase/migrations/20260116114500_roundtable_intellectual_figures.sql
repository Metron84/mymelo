-- Add unique constraint on name column to support ON CONFLICT clause
ALTER TABLE historical_figures ADD CONSTRAINT historical_figures_name_key UNIQUE (name);

-- Add specific intellectual figures for the roundtable
INSERT INTO historical_figures (name, era, bio, themes, notable_works, quotes, writing_style, icon)
VALUES 
  -- FEELERS
  (
    'T.S. Eliot',
    'Modernist (1888-1965)',
    'Anglo-American poet, essayist, and literary critic. A leader of the modernist movement, Eliot explored fragmentation, alienation, and the search for meaning in the modern world through innovative poetic techniques.',
    ARRAY['Spiritual seeking', 'Modernist fragmentation', 'Meaning through art', 'Exploration as purpose'],
    ARRAY['The Waste Land', 'Four Quartets', 'The Love Song of J. Alfred Prufrock'],
    ARRAY['The exploration is the point', 'April is the cruellest month', 'Do I dare disturb the universe?'],
    'Dense, allusive, fragmented verse that interweaves classical and contemporary references to explore spiritual crisis and renewal.',
    '🎨'
  ),
  (
    'Cat Stevens (Yusuf Islam)',
    'Contemporary (1948-present)',
    'British singer-songwriter who underwent a spiritual transformation from commercial pop star to devoted Muslim artist. His work explores the intersection of art, spirituality, and personal authenticity.',
    ARRAY['Art as spiritual practice', 'Transformation', 'Creation as worship', 'Authenticity over performance'],
    ARRAY['Tea for the Tillerman', 'Teaser and the Firecat', 'The Laughing Apple'],
    ARRAY['If you want to sing out, sing out', 'Music is a lady that I still love', 'I listen to the wind, to the wind of my soul'],
    'Simple, melodic songs with profound spiritual and philosophical undertones, prioritizing sincerity over commercial appeal.',
    '🎸'
  ),
  (
    'John Kennedy Toole',
    'Tragic Artist (1937-1969)',
    'American novelist whose posthumously published masterpiece "A Confederacy of Dunces" won the Pulitzer Prize. Toole embodies the tragic artist archetype—creating from psychological necessity despite lack of recognition.',
    ARRAY['Tragic artist archetype', 'Creation from necessity', 'Posthumous validation', 'Psychological necessity of art'],
    ARRAY['A Confederacy of Dunces', 'The Neon Bible'],
    ARRAY['I mingle with my peers or no one, and since I have no peers, I mingle with no one'],
    'Satirical, tragicomic prose that blends intellectual sophistication with absurdist humor and profound social critique.',
    '📖'
  ),
  (
    'Milan Kundera',
    'Contemporary (1929-2023)',
    'Czech-French novelist and essayist exploring themes of identity, memory, and the philosophical weight of existence. His work examines the tension between lightness and weight in life''s meaning.',
    ARRAY['Lightness vs Weight', 'Exile consciousness', 'Self-interrogation', 'Philosophical narrative'],
    ARRAY['The Unbearable Lightness of Being', 'The Book of Laughter and Forgetting', 'Immortality'],
    ARRAY['The heavier the burden, the closer our lives come to the earth', 'Business has only two functions — marketing and innovation'],
    'Philosophical novels that blend narrative with essayistic meditations on existence, identity, and the nature of human experience.',
    '🌙'
  ),
  (
    'Henry Miller',
    'Modernist Rebel (1891-1980)',
    'American writer and painter known for his raw, unfiltered autobiographical novels. Miller rejected bourgeois values and commercial appeal, prioritizing visceral truth and bodily experience.',
    ARRAY['Raw expression', 'Anti-bourgeois', 'Anti-commercial', 'Bodily truth over audience'],
    ARRAY['Tropic of Cancer', 'Tropic of Capricorn', 'Black Spring'],
    ARRAY['One''s destination is never a place, but a new way of seeing things', 'Life moves on, whether we act as cowards or heroes'],
    'Stream-of-consciousness prose that is sensual, controversial, and unapologetically authentic, rejecting conventional narrative structures.',
    '✍️'
  ),
  (
    'Italo Calvino',
    'Postmodernist (1923-1985)',
    'Italian novelist and short story writer celebrated for playful postmodern narratives. Calvino''s work is self-aware, metafictional, and explores writing as an act of imagining the perfect reader.',
    ARRAY['Playful postmodernism', 'Meta-fiction', 'Self-aware creation', 'Imagining the reader'],
    ARRAY['Invisible Cities', 'If on a winter''s night a traveler', 'Cosmicomics'],
    ARRAY['A classic is a book that has never finished saying what it has to say', 'The more enlightened our houses are, the more their walls ooze ghosts'],
    'Experimental, playful narratives that blur the line between story and storytelling, reader and writer, reality and imagination.',
    '🏰'
  ),
  
  -- THINKERS
  (
    'Socrates',
    'Classical Greece (470-399 BCE)',
    'Ancient Greek philosopher considered the founder of Western philosophy. Developed the Socratic method of inquiry through dialogue and questioning, emphasizing the examined life.',
    ARRAY['Dialectic method', 'Examined life', 'Questioning assumptions', 'Meaning and truth'],
    ARRAY['Socratic Dialogues (via Plato)', 'Apology', 'Crito'],
    ARRAY['The unexamined life is not worth living', 'I know that I know nothing', 'To find yourself, think for yourself'],
    'Dialectical questioning that exposes contradictions and leads interlocutors toward truth through systematic inquiry and self-examination.',
    '⚖️'
  ),
  (
    'Aristotle',
    'Classical Greece (384-322 BCE)',
    'Greek philosopher and polymath who studied under Plato. Developed systematic frameworks for logic, ethics, politics, and natural science. Emphasized empirical observation and teleological purpose.',
    ARRAY['Telos (purpose)', 'Eudaimonia (flourishing)', 'Poiesis (creation)', 'Systematic inquiry'],
    ARRAY['Nicomachean Ethics', 'Politics', 'Poetics', 'Metaphysics'],
    ARRAY['We are what we repeatedly do. Excellence, then, is not an act, but a habit', 'The whole is greater than the sum of its parts'],
    'Systematic, analytical prose that builds comprehensive frameworks for understanding ethics, politics, art, and the natural world.',
    '📐'
  ),
  (
    'Carl Jung',
    'Modern Psychology (1875-1961)',
    'Swiss psychiatrist and psychoanalyst who founded analytical psychology. Explored the unconscious mind, archetypes, individuation, and the creative act as psychic necessity.',
    ARRAY['Unconscious integration', 'Individuation process', 'Creative psychic necessity', 'Archetypes'],
    ARRAY['Psychology and Alchemy', 'The Archetypes and the Collective Unconscious', 'Man and His Symbols'],
    ARRAY['Until you make the unconscious conscious, it will direct your life and you will call it fate', 'The creation of something new is not accomplished by the intellect but by the play instinct'],
    'Psychological analysis that bridges clinical observation with philosophical and spiritual inquiry, exploring the deep structures of the human psyche.',
    '🧠'
  ),
  (
    'Ibn Sina (Avicenna)',
    'Islamic Golden Age (980-1037)',
    'Persian polymath who made pioneering contributions to philosophy, medicine, and science. Synthesized Aristotelian philosophy with Islamic theology, exploring metaphysics, being, and knowledge.',
    ARRAY['Metaphysics of Being', 'Knowledge independent of witness', 'Islamic philosophy', 'Reason and revelation'],
    ARRAY['The Book of Healing', 'The Canon of Medicine', 'The Book of Salvation'],
    ARRAY['The knowledge of anything, since all things have causes, is not acquired or complete unless it is known by its causes'],
    'Philosophical and scientific writing that integrates rational inquiry with theological insight, systematic and comprehensive in scope.',
    '🏛️'
  )
ON CONFLICT (name) DO NOTHING;

-- Create a junction table for roundtable session participants (linking to historical figures)
CREATE TABLE IF NOT EXISTS roundtable_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES roundtable_sessions(id) ON DELETE CASCADE,
  figure_id UUID NOT NULL REFERENCES historical_figures(id) ON DELETE CASCADE,
  position TEXT CHECK (position IN ('feeler', 'thinker', 'moderator')),
  ai_response TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, figure_id)
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_roundtable_participants_session ON roundtable_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_roundtable_participants_figure ON roundtable_participants(figure_id);

-- Add RLS policies
ALTER TABLE roundtable_participants ENABLE ROW LEVEL SECURITY;

-- Public can read published session participants
CREATE POLICY "public_read_roundtable_participants" ON roundtable_participants
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM roundtable_sessions rs
      WHERE rs.id = session_id AND rs.status = 'published'::content_status
    )
  );

-- Admins have full access
CREATE POLICY "admin_full_access_roundtable_participants" ON roundtable_participants
  FOR ALL TO authenticated
  USING (is_admin_from_auth())
  WITH CHECK (is_admin_from_auth());