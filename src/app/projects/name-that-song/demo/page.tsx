'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Music, RotateCcw, Trophy } from 'lucide-react';

interface Song {
  audio: string;
  title: string;
}

interface GenreData {
  name: string;
  songs: Song[];
}

const genres: GenreData[] = [
  {
    name: 'Classical',
    songs: [
      { audio: '/songs/classical/Brahms1Mvt1.mp3', title: 'Brahms Violin Concerto' },
      { audio: '/songs/classical/Mendh1Mvt1.mp3', title: 'Mendelssohn Violin Concerto' },
      { audio: '/songs/classical/Sib1Mvt1.mp3', title: 'Sibelius Violin Concerto' },
      { audio: '/songs/classical/Tchaik1Mvt1.mp3', title: 'Tchaikovsky Violin Concerto' },
      { audio: '/songs/classical/Lalo_Symphonie_Espagnol.mp3', title: 'Lalo Symphonie Espagnole' },
      { audio: '/songs/classical/Shostakovich_Symphony_No_10.mp3', title: 'Shostakovich Symphony No. 10' },
      { audio: '/songs/classical/Samuel_Barber_-_Adagio_for_Strings.mp3', title: 'Adagio for Strings' },
    ],
  },
  {
    name: 'Hip-Hop',
    songs: [
      { audio: '/songs/hiphop/21_Savage_x_Metro_Boomin_-_Runnin.mp3', title: 'Runnin' },
      { audio: '/songs/hiphop/Lil_Yachty_-_Poland.mp3', title: 'Poland' },
      { audio: '/songs/hiphop/Migos_-_Bad_and_Boujee.mp3', title: 'Bad and Boujee' },
      { audio: '/songs/hiphop/Not_In_The_Mood.mp3', title: 'Not In The Mood' },
      { audio: '/songs/hiphop/One_Mic_One_Gun.mp3', title: 'One Mic, One Gun' },
      { audio: '/songs/hiphop/Ms._Jackson.mp3', title: 'Ms. Jackson' },
      { audio: '/songs/hiphop/20_Min.mp3', title: '20 Min' },
    ],
  },
  {
    name: 'Pop',
    songs: [
      { audio: '/songs/pop/22.mp3', title: '22' },
      { audio: '/songs/pop/Anti_Hero.mp3', title: 'Anti Hero' },
      { audio: '/songs/pop/cardigan.mp3', title: 'cardigan' },
      { audio: '/songs/pop/Cruel_Summer.mp3', title: 'Cruel Summer' },
      { audio: '/songs/pop/Style.mp3', title: 'Style' },
    ],
  },
];

type GamePhase = 'genre-select' | 'loading' | 'playing' | 'answered' | 'finished';

export default function NameThatSongPage() {
  const [phase, setPhase] = useState<GamePhase>('genre-select');
  const [selectedGenre, setSelectedGenre] = useState<GenreData | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [options, setOptions] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [usedSongIndices, setUsedSongIndices] = useState<number[]>([]);
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewUrlsRef = useRef<Record<string, string>>({});

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Deezer is the only working audio source: public/songs/ does not exist, so the
  // song.audio fallback path 404s. That makes the timeout load-bearing — without
  // it a single request that never settles pins the loading screen forever, with
  // no cancel path back to genre select.
  const PREVIEW_TIMEOUT_MS = 6000;

  const fetchDeezerPreviews = async (songs: Song[]): Promise<Record<string, string>> => {
    const urls: Record<string, string> = {};
    await Promise.all(
      songs.map(async (song) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), PREVIEW_TIMEOUT_MS);
        try {
          const res = await fetch(
            `https://api.deezer.com/search?q=${encodeURIComponent(song.title)}&limit=1`,
            { signal: controller.signal }
          );
          if (!res.ok) return;
          const data = await res.json();
          if (data.data?.[0]?.preview) {
            urls[song.audio] = data.data[0].preview;
          }
        } catch {
          // Timed out, aborted, or Deezer refused. This song loses its preview;
          // the round still runs with the rest.
        } finally {
          clearTimeout(timer);
        }
      })
    );
    return urls;
  };

  const startGame = useCallback(async (genre: GenreData) => {
    setSelectedGenre(genre);
    setScore(0);
    setRound(1);
    setTotalRounds(Math.min(genre.songs.length, 5));
    setUsedSongIndices([]);
    setIsLoadingPreviews(true);
    setPhase('loading');

    const urls = await fetchDeezerPreviews(genre.songs);
    previewUrlsRef.current = urls;
    setIsLoadingPreviews(false);

    // Every preview failed, so there is no audio to play. Go back rather than
    // start a round with a silent player and no explanation.
    if (Object.keys(urls).length === 0) {
      setLoadError('Could not reach the preview service. Try again in a moment.');
      setPhase('genre-select');
      return;
    }
    setLoadError(null);

    loadNewRound(genre, []);
  }, []);

  const loadNewRound = (genre: GenreData, usedIndices: number[]) => {
    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setResult(null);

    // Pick a random song not yet used
    let availableIndices = genre.songs.map((_, i) => i).filter((i) => !usedIndices.includes(i));
    if (availableIndices.length === 0) {
      availableIndices = genre.songs.map((_, i) => i);
    }
    const songIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setCurrentSongIndex(songIdx);

    const newUsed = [...usedIndices, songIdx];
    setUsedSongIndices(newUsed);

    // Generate 4 random options
    const optionIndices: number[] = [];
    const allIndices = genre.songs.map((_, i) => i);

    // Ensure correct answer is in options
    optionIndices.push(songIdx);

    // Fill remaining slots
    while (optionIndices.length < Math.min(4, genre.songs.length)) {
      const randIdx = allIndices[Math.floor(Math.random() * allIndices.length)];
      if (!optionIndices.includes(randIdx)) {
        optionIndices.push(randIdx);
      }
    }

    // Shuffle
    for (let i = optionIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionIndices[i], optionIndices[j]] = [optionIndices[j], optionIndices[i]];
    }

    setOptions(optionIndices.map((i) => genre.songs[i]));

    // Create new audio — prefer Deezer preview URL, fall back to local path
    const audioUrl = previewUrlsRef.current[genre.songs[songIdx].audio] || genre.songs[songIdx].audio;
    audioRef.current = new Audio(audioUrl);

    setPhase('playing');
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleGuess = (song: Song) => {
    if (phase !== 'playing' || !selectedGenre) return;

    const correct = song.title === selectedGenre.songs[currentSongIndex].title;
    if (correct) {
      setResult('Correct!');
      setScore((s) => s + 1);
    } else {
      setResult(`Wrong. The correct answer is: ${selectedGenre.songs[currentSongIndex].title}`);
    }

    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setPhase('answered');
  };

  const nextRound = () => {
    if (!selectedGenre) return;
    const nextRoundNum = round + 1;
    if (nextRoundNum > totalRounds) {
      setPhase('finished');
      return;
    }
    setRound(nextRoundNum);
    loadNewRound(selectedGenre, usedSongIndices);
  };

  const resetGame = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    previewUrlsRef.current = {};
    setPhase('genre-select');
    setSelectedGenre(null);
    setScore(0);
    setRound(0);
    setResult(null);
    setIsPlaying(false);
    setOptions([]);
    setUsedSongIndices([]);
  };

  return (
    <div
      className="min-h-screen py-5 px-3 md:px-5"
      style={{ background: 'linear-gradient(135deg, var(--color-background) 0%, #f5e6d3 100%)' }}
    >
      {/* Back Button */}
      <div className="max-w-[700px] mx-auto mb-4">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-darker)] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>
      </div>

      <div className="max-w-[700px] mx-auto bg-white rounded-lg shadow-[0_4px_20px_rgba(136,8,8,0.1)] overflow-hidden">
        {/* Header */}
        <div
          className="relative text-white py-8 px-8 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-darker) 100%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none animate-[shimmer_6s_ease-in-out_infinite]"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              top: '-50%', left: '-50%', width: '200%', height: '200%',
            }}
          />
          <Music className="mx-auto mb-2 relative z-10" size={40} />
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider relative z-10 drop-shadow-md">
            Name That Song
          </h1>
          <p className="text-lg font-light mt-2 opacity-90 relative z-10">
            Test your music knowledge
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          {/* Loading Phase */}
          {phase === 'loading' && (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin mb-6" />
              <p className="text-sm uppercase tracking-widest font-medium text-[var(--color-tertiary)]/60">
                {isLoadingPreviews ? 'Loading previews…' : 'Starting game…'}
              </p>
            </div>
          )}

          {/* Genre Selection */}
          {phase === 'genre-select' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold uppercase text-[var(--color-tertiary)] mb-2">
                Choose a Genre
              </h2>
              <p className="text-sm text-[var(--color-tertiary)]/60 mb-8">
                Select a genre to start the game
              </p>
              {loadError && (
                <p role="alert" className="text-sm text-[var(--color-primary)] mb-8 -mt-4">
                  {loadError}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-4">
                {genres.map((genre) => (
                  <button
                    key={genre.name}
                    onClick={() => startGame(genre)}
                    className="px-8 py-4 text-lg font-semibold text-white uppercase tracking-wider rounded-lg cursor-pointer
                               shadow-[0_4px_15px_rgba(136,8,8,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(136,8,8,0.15)]
                               active:translate-y-0 transition-all duration-300 min-w-[160px]"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-darker) 100%)' }}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Playing / Answered Phase */}
          {(phase === 'playing' || phase === 'answered') && selectedGenre && (
            <div className="text-center">
              {/* Score & Round */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm uppercase tracking-widest font-medium text-[var(--color-tertiary)]/60">
                  Round {round} / {totalRounds}
                </span>
                <span className="text-sm uppercase tracking-widest font-medium text-[var(--color-primary)]">
                  Score: {score}
                </span>
              </div>

              <p className="text-sm uppercase tracking-widest text-[var(--color-secondary)] mb-6">
                {selectedGenre.name}
              </p>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="mx-auto mb-8 w-20 h-20 rounded-full flex items-center justify-center
                           shadow-[0_4px_20px_rgba(136,8,8,0.2)] hover:shadow-[0_8px_30px_rgba(136,8,8,0.3)]
                           hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-darker) 100%)' }}
              >
                {isPlaying ? (
                  <Pause className="text-white" size={32} />
                ) : (
                  <Play className="text-white ml-1" size={32} />
                )}
              </button>

              {/* Options */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {options.map((song, i) => (
                  <button
                    key={i}
                    onClick={() => handleGuess(song)}
                    disabled={phase === 'answered'}
                    className={`px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg cursor-pointer
                               transition-all duration-300 min-w-[140px] border-2 ${
                                 phase === 'answered'
                                   ? song.title === selectedGenre.songs[currentSongIndex].title
                                     ? 'border-green-500 bg-green-50 text-green-700'
                                     : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                   : 'border-[var(--color-primary)]/30 text-[var(--color-tertiary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:-translate-y-0.5'
                               }`}
                  >
                    {song.title}
                  </button>
                ))}
              </div>

              {/* Result */}
              {result && (
                <div
                  className={`p-4 rounded-lg font-semibold mb-6 ${
                    result === 'Correct!'
                      ? 'text-green-600 bg-green-50 border border-green-200'
                      : 'text-red-500 bg-red-50 border border-red-200'
                  }`}
                >
                  {result}
                </div>
              )}

              {/* Next / Finish Button */}
              {phase === 'answered' && (
                <button
                  onClick={nextRound}
                  className="px-8 py-3 text-sm font-semibold text-white uppercase tracking-wider rounded-lg cursor-pointer
                             shadow-[0_4px_15px_rgba(136,8,8,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(136,8,8,0.15)]
                             active:translate-y-0 transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-darker) 100%)' }}
                >
                  {round >= totalRounds ? 'See Results' : 'Next Song'}
                </button>
              )}
            </div>
          )}

          {/* Finished Phase */}
          {phase === 'finished' && (
            <div className="text-center">
              <Trophy className="mx-auto mb-4 text-[var(--color-primary)]" size={48} />
              <h2 className="text-3xl font-bold uppercase text-[var(--color-tertiary)] mb-2">
                Game Over!
              </h2>
              <p className="text-lg text-[var(--color-tertiary)]/70 mb-2">
                {selectedGenre?.name}
              </p>
              <div className="text-5xl font-bold text-[var(--color-primary)] mb-2">
                {score} / {totalRounds}
              </div>
              <p className="text-sm text-[var(--color-tertiary)]/60 mb-8">
                {score === totalRounds
                  ? 'Perfect score! 🎉'
                  : score >= totalRounds / 2
                  ? 'Nice work! 👏'
                  : 'Better luck next time! 🎵'}
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={() => selectedGenre && startGame(selectedGenre)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white uppercase tracking-wider rounded-lg cursor-pointer
                             shadow-[0_4px_15px_rgba(136,8,8,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(136,8,8,0.15)]
                             active:translate-y-0 transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-darker) 100%)' }}
                >
                  <RotateCcw size={14} />
                  Play Again
                </button>
                <button
                  onClick={resetGame}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg cursor-pointer
                             border-2 border-[var(--color-primary)] text-[var(--color-primary)]
                             hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
                >
                  Change Genre
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
