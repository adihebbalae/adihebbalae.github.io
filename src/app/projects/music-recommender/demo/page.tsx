'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Music, Shuffle, ChevronDown, Info } from 'lucide-react';
import Link from 'next/link';

/* ─── Song database ─── */
interface Song {
  id: number;
  title: string;
  artist: string;
  genre: string;
  tempo: number;        // BPM
  energy: number;       // 0‑1
  danceability: number; // 0‑1
  valence: number;      // 0‑1  (mood: 0=sad, 1=happy)
  acousticness: number; // 0‑1
}

const SONGS: Song[] = [
  // Pop
  { id: 1,  title: 'Blinding Lights',       artist: 'The Weeknd',        genre: 'Pop',        tempo: 171, energy: 0.73, danceability: 0.51, valence: 0.33, acousticness: 0.00 },
  { id: 2,  title: 'Levitating',            artist: 'Dua Lipa',          genre: 'Pop',        tempo: 103, energy: 0.67, danceability: 0.70, valence: 0.91, acousticness: 0.01 },
  { id: 3,  title: 'Shape of You',          artist: 'Ed Sheeran',        genre: 'Pop',        tempo: 96,  energy: 0.65, danceability: 0.83, valence: 0.93, acousticness: 0.58 },
  { id: 4,  title: 'Party In The U.S.A.',   artist: 'Miley Cyrus',       genre: 'Pop',        tempo: 96,  energy: 0.68, danceability: 0.68, valence: 0.88, acousticness: 0.01 },
  { id: 5,  title: 'Watermelon Sugar',      artist: 'Harry Styles',      genre: 'Pop',        tempo: 95,  energy: 0.82, danceability: 0.55, valence: 0.56, acousticness: 0.12 },
  { id: 6,  title: 'Anti-Hero',             artist: 'Taylor Swift',      genre: 'Pop',        tempo: 97,  energy: 0.64, danceability: 0.64, valence: 0.53, acousticness: 0.13 },

  // Hip-Hop
  { id: 7,  title: 'HUMBLE.',               artist: 'Kendrick Lamar',    genre: 'Hip-Hop',    tempo: 150, energy: 0.62, danceability: 0.90, valence: 0.42, acousticness: 0.00 },
  { id: 8,  title: 'Sicko Mode',            artist: 'Travis Scott',      genre: 'Hip-Hop',    tempo: 155, energy: 0.73, danceability: 0.83, valence: 0.45, acousticness: 0.01 },
  { id: 9,  title: 'God\'s Plan',           artist: 'Drake',             genre: 'Hip-Hop',    tempo: 77,  energy: 0.45, danceability: 0.75, valence: 0.36, acousticness: 0.33 },
  { id: 10, title: 'Lose Yourself',         artist: 'Eminem',            genre: 'Hip-Hop',    tempo: 171, energy: 0.82, danceability: 0.57, valence: 0.17, acousticness: 0.07 },
  { id: 11, title: 'Old Town Road',         artist: 'Lil Nas X',        genre: 'Hip-Hop',    tempo: 136, energy: 0.62, danceability: 0.88, valence: 0.65, acousticness: 0.14 },

  // Rock
  { id: 12, title: 'Bohemian Rhapsody',     artist: 'Queen',             genre: 'Rock',       tempo: 72,  energy: 0.40, danceability: 0.39, valence: 0.22, acousticness: 0.31 },
  { id: 13, title: 'Smells Like Teen Spirit', artist: 'Nirvana',          genre: 'Rock',       tempo: 117, energy: 0.91, danceability: 0.50, valence: 0.26, acousticness: 0.00 },
  { id: 14, title: 'Come As You Are',       artist: 'Nirvana',           genre: 'Rock',       tempo: 120, energy: 0.71, danceability: 0.55, valence: 0.26, acousticness: 0.00 },
  { id: 15, title: 'Sweet Child O\' Mine',  artist: 'Guns N\' Roses',    genre: 'Rock',       tempo: 125, energy: 0.82, danceability: 0.42, valence: 0.41, acousticness: 0.01 },
  { id: 16, title: 'Under The Bridge',      artist: 'Red Hot Chili Peppers', genre: 'Rock',   tempo: 85,  energy: 0.54, danceability: 0.59, valence: 0.42, acousticness: 0.30 },

  // R&B / Soul
  { id: 17, title: 'Blinding Lights',       artist: 'The Weeknd',        genre: 'R&B',        tempo: 121, energy: 0.60, danceability: 0.69, valence: 0.43, acousticness: 0.12 },
  { id: 18, title: 'Best Part',             artist: 'Daniel Caesar',     genre: 'R&B',        tempo: 72,  energy: 0.25, danceability: 0.55, valence: 0.62, acousticness: 0.80 },
  { id: 19, title: 'Redbone',               artist: 'Childish Gambino',  genre: 'R&B',        tempo: 81,  energy: 0.37, danceability: 0.74, valence: 0.47, acousticness: 0.44 },
  { id: 20, title: 'Kiss of Life',          artist: 'Sade',              genre: 'R&B',        tempo: 98,  energy: 0.44, danceability: 0.68, valence: 0.73, acousticness: 0.55 },

  // Electronic
  { id: 21, title: 'Strobe',                artist: 'Deadmau5',          genre: 'Electronic', tempo: 128, energy: 0.72, danceability: 0.58, valence: 0.18, acousticness: 0.01 },
  { id: 22, title: 'Midnight City',         artist: 'M83',               genre: 'Electronic', tempo: 105, energy: 0.78, danceability: 0.60, valence: 0.53, acousticness: 0.01 },
  { id: 23, title: 'Titanium',              artist: 'David Guetta',      genre: 'Electronic', tempo: 126, energy: 0.79, danceability: 0.62, valence: 0.32, acousticness: 0.01 },
  { id: 24, title: 'Get Lucky',             artist: 'Daft Punk',         genre: 'Electronic', tempo: 116, energy: 0.78, danceability: 0.79, valence: 0.87, acousticness: 0.06 },

  // Country
  { id: 25, title: 'Jolene',                artist: 'Dolly Parton',      genre: 'Country',    tempo: 112, energy: 0.47, danceability: 0.53, valence: 0.67, acousticness: 0.76 },
  { id: 26, title: 'Take Me Home, Country Roads', artist: 'John Denver',  genre: 'Country',   tempo: 82,  energy: 0.37, danceability: 0.49, valence: 0.82, acousticness: 0.82 },
  { id: 27, title: 'Before He Cheats',      artist: 'Carrie Underwood',  genre: 'Country',    tempo: 143, energy: 0.80, danceability: 0.47, valence: 0.45, acousticness: 0.04 },
  { id: 28, title: 'Cruise',                artist: 'Florida Georgia Line', genre: 'Country', tempo: 79,  energy: 0.62, danceability: 0.72, valence: 0.88, acousticness: 0.10 },

  // Jazz
  { id: 29, title: 'So What',               artist: 'Miles Davis',       genre: 'Jazz',       tempo: 136, energy: 0.28, danceability: 0.48, valence: 0.30, acousticness: 0.95 },
  { id: 30, title: 'Take Five',             artist: 'Dave Brubeck',      genre: 'Jazz',       tempo: 175, energy: 0.36, danceability: 0.52, valence: 0.55, acousticness: 0.90 },
];

const GENRES = ['Any', 'Pop', 'Hip-Hop', 'Rock', 'R&B', 'Electronic', 'Country', 'Jazz'];
const MOODS = [
  { label: 'Any',         min: 0, max: 1 },
  { label: 'Happy',       min: 0.6, max: 1 },
  { label: 'Melancholic', min: 0, max: 0.35 },
  { label: 'Energetic',   min: 0.4, max: 0.8 },
  { label: 'Chill',       min: 0.3, max: 0.65 },
];

/* ─── recommendation engine ─── */
interface Recommendation {
  song: Song;
  similarity: number;
  breakdown: { genre: number; tempo: number; energy: number; mood: number; dance: number };
}

function getRecommendations(
  genre: string,
  targetTempo: number,
  mood: string,
  topK: number = 8,
): Recommendation[] {
  const moodRange = MOODS.find((m) => m.label === mood) ?? MOODS[0];

  const results: Recommendation[] = SONGS.map((song) => {
    // Genre match (0 or 1)
    const genreScore = genre === 'Any' || song.genre === genre ? 1 : 0;

    // Tempo similarity (closer = higher, normalized)
    const tempoMaxDiff = 150;
    const tempoScore = 1 - Math.min(Math.abs(song.tempo - targetTempo) / tempoMaxDiff, 1);

    // Energy score – reward medium‑to‑high energy
    const energyScore = song.energy;

    // Mood (valence) fit
    let moodScore: number;
    if (mood === 'Any') {
      moodScore = 1;
    } else {
      const valMid = (moodRange.min + moodRange.max) / 2;
      const valRange = (moodRange.max - moodRange.min) / 2;
      moodScore = 1 - Math.min(Math.abs(song.valence - valMid) / (valRange || 1), 1);
    }

    // Danceability
    const danceScore = song.danceability;

    // Weighted sum
    const weights = { genre: 0.35, tempo: 0.2, energy: 0.15, mood: 0.2, dance: 0.1 };
    const similarity =
      weights.genre * genreScore +
      weights.tempo * tempoScore +
      weights.energy * energyScore +
      weights.mood * moodScore +
      weights.dance * danceScore;

    return {
      song,
      similarity,
      breakdown: {
        genre: genreScore,
        tempo: tempoScore,
        energy: energyScore,
        mood: moodScore,
        dance: danceScore,
      },
    };
  });

  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, topK);
}

/* ─── component ─── */
export default function MusicRecommenderPage() {
  const [genre, setGenre] = useState('Any');
  const [tempo, setTempo] = useState(120);
  const [mood, setMood] = useState('Any');
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [showExplainer, setShowExplainer] = useState(false);

  const handleRecommend = () => {
    setResults(getRecommendations(genre, tempo, mood));
  };

  const handleShuffle = () => {
    const rGenre = GENRES[Math.floor(Math.random() * GENRES.length)];
    const rTempo = 60 + Math.floor(Math.random() * 140);
    const rMood = MOODS[Math.floor(Math.random() * MOODS.length)].label;
    setGenre(rGenre);
    setTempo(rTempo);
    setMood(rMood);
    setResults(getRecommendations(rGenre, rTempo, rMood));
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-background)]/95 backdrop-blur border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium
                       text-[var(--color-primary)] hover:text-[var(--color-primary-darker)] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Portfolio
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold uppercase text-[var(--color-tertiary)] mb-3">
            Music Recommender
          </h1>
          <p className="text-sm uppercase tracking-[4px] text-[var(--color-secondary)]">
            Content-Based Similarity Demo
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-sm shadow-sm border border-black/5 p-6 md:p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Genre */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-medium text-[var(--color-tertiary)] mb-2">
                Genre
              </label>
              <div className="relative">
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full appearance-none p-3 pr-10 border border-black/10 rounded-sm bg-[var(--color-background)]
                             text-[var(--color-tertiary)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors cursor-pointer"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] pointer-events-none" />
              </div>
            </div>

            {/* Tempo */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-medium text-[var(--color-tertiary)] mb-2">
                Target Tempo — <span className="text-[var(--color-primary)]">{tempo} BPM</span>
              </label>
              <input
                type="range"
                min={60}
                max={200}
                value={tempo}
                onChange={(e) => setTempo(Number(e.target.value))}
                className="w-full h-2 bg-black/5 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-secondary)] mt-1">
                <span>60</span>
                <span>200</span>
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-medium text-[var(--color-tertiary)] mb-2">
                Mood
              </label>
              <div className="relative">
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full appearance-none p-3 pr-10 border border-black/10 rounded-sm bg-[var(--color-background)]
                             text-[var(--color-tertiary)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors cursor-pointer"
                >
                  {MOODS.map((m) => (
                    <option key={m.label} value={m.label}>{m.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleRecommend}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-bold
                         bg-[var(--color-primary)] text-white rounded-sm
                         hover:bg-[var(--color-primary-darker)] transition-all duration-200 cursor-pointer"
            >
              <Music size={14} />
              Get Recommendations
            </button>
            <button
              onClick={handleShuffle}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-medium
                         border border-[var(--color-tertiary)]/20 rounded-sm text-[var(--color-tertiary)]
                         hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]
                         transition-all duration-200 cursor-pointer"
            >
              <Shuffle size={14} />
              Random
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              key={`${genre}-${tempo}-${mood}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {results.map((rec, i) => (
                  <SongCard key={rec.song.id} rec={rec} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explainer section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-sm shadow-sm border border-black/5 overflow-hidden"
        >
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="w-full flex items-center justify-between p-6 md:p-8 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <Info size={18} className="text-[var(--color-primary)]" />
              <h3 className="text-sm uppercase tracking-widest font-bold text-[var(--color-tertiary)]">
                How the Real Model Works
              </h3>
            </div>
            <ChevronDown
              size={18}
              className={`text-[var(--color-secondary)] transition-transform duration-300 ${showExplainer ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showExplainer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 md:px-8 pb-8 text-sm text-[var(--color-tertiary)]/70 leading-relaxed space-y-4">
                  <p>
                    This browser demo uses a simplified weighted-similarity approach. The actual project (built across four
                    Jupyter notebook sections) is significantly more sophisticated:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--color-background)] rounded-sm">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-primary)] mb-2">
                        Section 1 — Classification with Spotify features
                      </h4>
                      <p>
                        Uses <strong>Logistic Regression</strong> on Spotify audio features (danceability, energy,
                        speechiness, acousticness, instrumentalness, liveness, valence, tempo) to predict whether
                        a song is a &quot;hit&quot; or not. Explored feature importance via model coefficients.
                      </p>
                    </div>

                    <div className="p-4 bg-[var(--color-background)] rounded-sm">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-primary)] mb-2">
                        Section 2 — Content-Based Filtering
                      </h4>
                      <p>
                        Builds song vectors by combining text features (artist, genre, lyrics via <strong>CountVectorizer</strong>)
                        with normalized numerical features (popularity, energy, danceability). Uses{' '}
                        <strong>cosine similarity</strong> to find the K most similar songs to a user&apos;s selection.
                      </p>
                    </div>

                    <div className="p-4 bg-[var(--color-background)] rounded-sm">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-primary)] mb-2">
                        Section 3 — Timbre-Based Classification
                      </h4>
                      <p>
                        Extracts <strong>12-dimensional timbre timecourses</strong> (120 timesteps) from Spotify audio
                        analysis. Trains <strong>KNN, SVM, Naive Bayes, Logistic Regression</strong>, and{' '}
                        <strong>MLP Neural Networks</strong> on the flattened timbre features to classify songs. Explores
                        which timbre components are most discriminative.
                      </p>
                    </div>

                    <div className="p-4 bg-[var(--color-background)] rounded-sm">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-primary)] mb-2">
                        Section 4 — Deep Learning with RNNs
                      </h4>
                      <p>
                        Reshapes timbre data as time-series (120 timesteps × 12 components) and trains an{' '}
                        <strong>LSTM Recurrent Neural Network</strong> (128 units) with Dense layers for
                        sequential classification. Also uses <strong>PCA</strong> for spectrogram dimensionality reduction
                        and audio visualization via <strong>librosa</strong>.
                      </p>
                    </div>
                  </div>

                  <p className="text-[var(--color-secondary)] italic">
                    The full pipeline uses real Spotify data with ~4,000 tracks and can be deployed via
                    Streamlit for interactive song selection.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}

/* ─── Song Card ─── */
function SongCard({ rec, index }: { rec: Recommendation; index: number }) {
  const pct = Math.round(rec.similarity * 100);

  const genreColors: Record<string, string> = {
    Pop: '#e879a0',
    'Hip-Hop': '#f59e0b',
    Rock: '#ef4444',
    'R&B': '#8b5cf6',
    Electronic: '#06b6d4',
    Country: '#84cc16',
    Jazz: '#f97316',
  };

  const accent = genreColors[rec.song.genre] || '#9ca3af';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="bg-white rounded-sm border border-black/5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-1" style={{ backgroundColor: accent }} />

      <div className="p-5">
        {/* Rank & similarity */}
        <div className="flex items-start justify-between mb-3">
          <span
            className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm"
            style={{ backgroundColor: accent + '18', color: accent }}
          >
            {rec.song.genre}
          </span>
          <span className="text-lg font-bold text-[var(--color-primary)]">{pct}%</span>
        </div>

        <h4 className="text-sm font-bold uppercase text-[var(--color-tertiary)] leading-tight mb-1 line-clamp-2">
          {rec.song.title}
        </h4>
        <p className="text-xs text-[var(--color-secondary)] mb-4">{rec.song.artist}</p>

        {/* Similarity bar */}
        <div className="h-1.5 bg-black/5 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, delay: index * 0.06 + 0.2 }}
            className="h-full rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider text-[var(--color-secondary)]">
          <div>
            <span className="block text-[var(--color-tertiary)] font-bold">{rec.song.tempo}</span>
            BPM
          </div>
          <div>
            <span className="block text-[var(--color-tertiary)] font-bold">{Math.round(rec.song.energy * 100)}%</span>
            Energy
          </div>
          <div>
            <span className="block text-[var(--color-tertiary)] font-bold">{Math.round(rec.song.danceability * 100)}%</span>
            Dance
          </div>
        </div>
      </div>
    </motion.div>
  );
}
