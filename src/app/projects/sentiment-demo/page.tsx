'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import Link from 'next/link';

/* ─── keyword lists ─── */
const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic', 'wonderful',
  'love', 'loved', 'loving', 'best', 'perfect', 'beautiful', 'happy', 'glad',
  'enjoy', 'enjoyed', 'enjoyable', 'delicious', 'friendly', 'nice', 'recommend',
  'recommended', 'outstanding', 'superb', 'brilliant', 'incredible', 'pleasant',
  'welcoming', 'helpful', 'impressive', 'tasty', 'fresh', 'clean', 'comfortable',
  'cozy', 'fast', 'quick', 'efficient', 'polite', 'kind', 'generous', 'warm',
  'charming', 'delightful', 'satisfied', 'satisfied', 'exceptional', 'flawless',
  'heavenly', 'magnificent', 'remarkable', 'stellar', 'top-notch', 'stellar',
  'worth', 'favorite', 'favourite', 'fabulous', 'terrific', 'phenomenal',
  'positive', 'exciting', 'yummy', 'savory', 'divine', 'adorable', 'gracious',
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'horrible', 'awful', 'worst', 'hate', 'hated', 'disgusting',
  'rude', 'slow', 'cold', 'dirty', 'nasty', 'poor', 'disappointing', 'disappointed',
  'mediocre', 'bland', 'stale', 'overpriced', 'expensive', 'unfriendly', 'unpleasant',
  'gross', 'never', 'boring', 'sucks', 'waste', 'tasteless', 'uncomfortable',
  'annoying', 'irritating', 'frustrating', 'pathetic', 'lousy', 'dreadful',
  'atrocious', 'incompetent', 'unprofessional', 'disrespectful', 'careless',
  'filthy', 'overcooked', 'undercooked', 'burnt', 'inedible', 'revolting',
  'abysmal', 'miserable', 'hideous', 'appalling', 'unacceptable', 'inferior',
  'flawed', 'broken', 'damaged', 'useless', 'pointless', 'toxic', 'obnoxious',
  'horrendous', 'nightmare', 'problem', 'problems', 'complaint', 'complaints',
]);

const NEGATION_WORDS = new Set([
  'not', "n't", 'no', 'never', 'neither', 'nor', 'hardly', 'barely', 'scarcely',
]);

const INTENSIFIERS = new Set([
  'very', 'really', 'extremely', 'absolutely', 'incredibly', 'super', 'totally',
  'utterly', 'remarkably', 'so',
]);

/* ─── analysis engine ─── */
interface WordResult {
  word: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  weight: number;
  negated: boolean;
}

function analyzeSentiment(text: string) {
  const rawWords = text.toLowerCase().replace(/[^\w\s'-]/g, ' ').split(/\s+/).filter(Boolean);
  const results: WordResult[] = [];
  let score = 0;
  let positiveCount = 0;
  let negativeCount = 0;

  for (let i = 0; i < rawWords.length; i++) {
    const word = rawWords[i];
    const prevWord = i > 0 ? rawWords[i - 1] : '';
    const prevPrevWord = i > 1 ? rawWords[i - 2] : '';

    const isNegated =
      NEGATION_WORDS.has(prevWord) ||
      prevWord.endsWith("n't") ||
      NEGATION_WORDS.has(prevPrevWord);

    const isIntensified = INTENSIFIERS.has(prevWord);
    const multiplier = isIntensified ? 1.5 : 1;

    if (POSITIVE_WORDS.has(word)) {
      const effectiveWeight = isNegated ? -1 * multiplier : 1 * multiplier;
      score += effectiveWeight;
      if (effectiveWeight > 0) positiveCount++;
      else negativeCount++;
      results.push({
        word,
        sentiment: isNegated ? 'negative' : 'positive',
        weight: effectiveWeight,
        negated: isNegated,
      });
    } else if (NEGATIVE_WORDS.has(word)) {
      const effectiveWeight = isNegated ? 1 * multiplier : -1 * multiplier;
      score += effectiveWeight;
      if (effectiveWeight < 0) negativeCount++;
      else positiveCount++;
      results.push({
        word,
        sentiment: isNegated ? 'positive' : 'negative',
        weight: effectiveWeight,
        negated: isNegated,
      });
    } else {
      results.push({ word, sentiment: 'neutral', weight: 0, negated: false });
    }
  }

  const totalSentimentWords = positiveCount + negativeCount;
  const maxScore = totalSentimentWords > 0 ? totalSentimentWords * 1.5 : 1;
  const normalizedScore = Math.max(-1, Math.min(1, score / maxScore));
  const confidence = totalSentimentWords > 0
    ? Math.min(1, (Math.abs(normalizedScore) * 0.6 + (totalSentimentWords / rawWords.length) * 0.4))
    : 0;

  let label: 'Positive' | 'Negative' | 'Neutral';
  if (normalizedScore > 0.1) label = 'Positive';
  else if (normalizedScore < -0.1) label = 'Negative';
  else label = 'Neutral';

  return { score: normalizedScore, confidence, label, words: results, positiveCount, negativeCount };
}

/* ─── example texts ─── */
const EXAMPLES = [
  {
    label: 'Positive Review',
    text: 'The food was absolutely delicious and the staff was incredibly friendly. Best dining experience I\'ve had in years! Everything was perfect and the atmosphere was warm and welcoming.',
  },
  {
    label: 'Negative Review',
    text: 'Terrible service, the waiter was rude and the food was cold and bland. Worst restaurant I have ever been to. The place was dirty and overpriced. Never coming back.',
  },
  {
    label: 'Mixed Review',
    text: 'The appetizers were great but the main course was disappointing. Service was slow at first but our waiter was friendly and helpful in the end.',
  },
  {
    label: 'Negation Test',
    text: 'This place is not good at all. The food was not terrible but it was not great either. I would not recommend this restaurant.',
  },
];

/* ─── component ─── */
export default function SentimentDemoPage() {
  const [text, setText] = useState('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [analysisText, setAnalysisText] = useState('');

  const result = useMemo(() => {
    if (!hasAnalyzed || !analysisText.trim()) return null;
    return analyzeSentiment(analysisText);
  }, [hasAnalyzed, analysisText]);

  const handleAnalyze = () => {
    setAnalysisText(text);
    setHasAnalyzed(true);
  };

  const handleExample = (exampleText: string) => {
    setText(exampleText);
    setAnalysisText(exampleText);
    setHasAnalyzed(true);
  };

  const sentimentColor = result
    ? result.label === 'Positive'
      ? '#22c55e'
      : result.label === 'Negative'
      ? '#ef4444'
      : '#9ca3af'
    : '#9ca3af';

  const SentimentIcon = result
    ? result.label === 'Positive'
      ? ThumbsUp
      : result.label === 'Negative'
      ? ThumbsDown
      : Minus
    : Minus;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-background)]/95 backdrop-blur border-b border-black/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
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

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold uppercase text-[var(--color-tertiary)] mb-3">
            Sentiment Analysis
          </h1>
          <p className="text-sm uppercase tracking-[4px] text-[var(--color-secondary)]">
            Interactive NLP Demo
          </p>
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-sm shadow-sm border border-black/5 p-6 md:p-8 mb-8"
        >
          <label className="block text-xs uppercase tracking-widest font-medium text-[var(--color-tertiary)] mb-3">
            Enter text to analyze
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste a review, tweet, or any text here…"
            rows={5}
            className="w-full p-4 border border-black/10 rounded-sm bg-[var(--color-background)] text-[var(--color-tertiary)]
                       placeholder:text-[var(--color-secondary)] focus:outline-none focus:border-[var(--color-primary)]
                       transition-colors resize-none text-sm leading-relaxed"
          />
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={handleAnalyze}
              disabled={!text.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-bold
                         bg-[var(--color-primary)] text-white rounded-sm
                         hover:bg-[var(--color-primary-darker)] transition-all duration-200
                         disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles size={14} />
              Analyze Sentiment
            </button>
            <span className="text-[11px] text-[var(--color-secondary)] uppercase tracking-wider">
              or try an example →
            </span>
          </div>
        </motion.div>

        {/* Example Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleExample(ex.text)}
              className="px-4 py-2 text-[11px] uppercase tracking-widest font-medium
                         border border-[var(--color-tertiary)]/20 rounded-sm bg-white
                         text-[var(--color-tertiary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]
                         transition-all duration-200 cursor-pointer"
            >
              {ex.label}
            </button>
          ))}
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={analysisText}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Verdict Card */}
              <div className="bg-white rounded-sm shadow-sm border border-black/5 p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Icon */}
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: sentimentColor + '18' }}
                  >
                    <SentimentIcon size={36} style={{ color: sentimentColor }} />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2
                      className="text-3xl font-bold uppercase mb-1"
                      style={{ color: sentimentColor }}
                    >
                      {result.label}
                    </h2>
                    <p className="text-sm text-[var(--color-tertiary)]/60">
                      {result.positiveCount} positive signal{result.positiveCount !== 1 ? 's' : ''} ·{' '}
                      {result.negativeCount} negative signal{result.negativeCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Confidence bar */}
                  <div className="w-full md:w-48 shrink-0">
                    <div className="flex justify-between text-[11px] uppercase tracking-widest text-[var(--color-tertiary)]/60 mb-1">
                      <span>Confidence</span>
                      <span>{Math.round(result.confidence * 100)}%</span>
                    </div>
                    <div className="h-3 bg-black/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: sentimentColor }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sentiment spectrum bar */}
                <div className="mt-6 pt-6 border-t border-black/5">
                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-[var(--color-tertiary)]/60 mb-2">
                    <span>Negative</span>
                    <span>Neutral</span>
                    <span>Positive</span>
                  </div>
                  <div className="relative h-4 bg-gradient-to-r from-red-400 via-gray-300 to-green-400 rounded-full">
                    <motion.div
                      initial={{ left: '50%' }}
                      animate={{ left: `${((result.score + 1) / 2) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 rounded-full shadow-md"
                      style={{ borderColor: sentimentColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Word Breakdown */}
              <div className="bg-white rounded-sm shadow-sm border border-black/5 p-6 md:p-8">
                <h3 className="text-sm uppercase tracking-widest font-bold text-[var(--color-tertiary)] mb-4">
                  Word-Level Breakdown
                </h3>
                <div className="flex flex-wrap gap-1.5 leading-loose">
                  {result.words.map((w, i) => {
                    let bg = 'transparent';
                    let color = 'var(--color-tertiary)';
                    let border = 'transparent';

                    if (w.sentiment === 'positive') {
                      bg = '#22c55e18';
                      color = '#16a34a';
                      border = '#22c55e40';
                    } else if (w.sentiment === 'negative') {
                      bg = '#ef444418';
                      color = '#dc2626';
                      border = '#ef444440';
                    }

                    return (
                      <span
                        key={`${w.word}-${i}`}
                        className="px-2 py-0.5 rounded text-sm font-medium transition-all"
                        style={{ backgroundColor: bg, color, border: `1px solid ${border}` }}
                        title={
                          w.sentiment !== 'neutral'
                            ? `${w.word}: ${w.weight > 0 ? '+' : ''}${w.weight.toFixed(1)}${w.negated ? ' (negated)' : ''}`
                            : w.word
                        }
                      >
                        {w.word}
                        {w.negated && w.sentiment !== 'neutral' && (
                          <span className="text-[10px] ml-0.5 opacity-60"> ↩</span>
                        )}
                      </span>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[var(--color-secondary)] mt-4">
                  <span className="inline-block w-3 h-3 rounded mr-1 align-middle" style={{ backgroundColor: '#22c55e18', border: '1px solid #22c55e40' }} />
                  Positive
                  <span className="inline-block w-3 h-3 rounded mr-1 ml-3 align-middle" style={{ backgroundColor: '#ef444418', border: '1px solid #ef444440' }} />
                  Negative
                  <span className="ml-3">↩ = negation detected</span>
                </p>
              </div>

              {/* Model Info */}
              <div className="bg-white rounded-sm shadow-sm border border-black/5 p-6 md:p-8">
                <h3 className="text-sm uppercase tracking-widest font-bold text-[var(--color-tertiary)] mb-4">
                  About the Model
                </h3>
                <div className="text-sm text-[var(--color-tertiary)]/70 leading-relaxed space-y-3">
                  <p>
                    <strong className="text-[var(--color-tertiary)]">This is a simplified browser demo.</strong>{' '}
                    The full model uses <strong>Logistic Regression</strong> trained on Yelp review data with{' '}
                    <strong>Bag-of-Words (CountVectorizer)</strong> features and <strong>spaCy</strong> for tokenization
                    and lemmatization. Stop words and punctuation are removed, and each review is represented as a
                    sparse word-count vector (800 features).
                  </p>
                  <p>
                    The notebook also explores <strong>Multinomial Naive Bayes</strong> as an alternative classifier,
                    and a <strong>Word2Vec</strong> approach using spaCy&apos;s 300-dimensional word embeddings
                    (&lsquo;en_core_web_md&rsquo;) combined with a second Logistic Regression model. Techniques like
                    word similarity via <strong>cosine similarity</strong> and nearest-neighbor word analogies are
                    demonstrated.
                  </p>
                  <p>
                    Reviews with &gt;3 stars are classified as &quot;good&quot; (positive), and ≤3 stars as
                    &quot;bad&quot; (negative). The Logistic Regression model achieves high accuracy on the Yelp
                    dataset by learning per-word weights from the Bag-of-Words representation.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
