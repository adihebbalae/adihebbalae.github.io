import type { Project } from '@/data/types';

/**
 * Facts come from the private experience corpus record and from the notebook
 * walkthrough already published in the demo page's explainer panel.
 *
 * Dated Jul 2023 on the strength of the corpus profile record, which pins the
 * Inspirit AI program to July 2023 — the summer before senior year of high
 * school. The copy says so plainly so the page cannot read as recent work.
 *
 * The home-page card claims CNNs. The notebooks documented in the demo
 * explainer cover KNN, SVM, naive Bayes, logistic regression, an MLP and an
 * LSTM, with no CNN named anywhere, so nothing here claims one.
 */
const musicRecommender: Project = {
  slug: 'music-recommender',
  title: 'Music Recommender',

  tagline: {
    recruiter:
      'Song classification and recommendation across four notebooks, ending in an LSTM.',
    builder:
      'Where I learned that the shape of the input decides which model you can use.',
  },

  summary: {
    recruiter:
      'Four Jupyter notebooks that work up from a logistic regression on Spotify audio features to an LSTM over timbre timecourses, with a content-based recommender by cosine similarity in between. Built in July 2023 through the Inspirit AI summer program, two years before I started at UT, so read it as early work rather than current work. The browser demo on this site is a stripped-down stand-in for the notebooks.',
    builder:
      'This was the first project where I picked the model instead of being handed one. The part that stuck was the jump from treating a song as a flat feature vector to treating its timbre as a 120-step sequence, because that reframing is the only reason an LSTM was worth trying at all. Everything before it is standard scikit-learn, and I would not pretend otherwise.',
  },

  role: 'Sole developer',
  period: 'Jul 2023 (Inspirit AI)',
  status: 'complete',
  depth: 'overview',
  category: ['ML/AI'],

  tech: [
    'Python',
    'scikit-learn',
    'TensorFlow',
    'Keras',
    'librosa',
    'Pandas',
    'NumPy',
    'Jupyter',
  ],

  metrics: [
    {
      value: '4',
      label: 'Notebook sections, from logistic regression to an LSTM',
    },
  ],

  links: {
    github: 'https://github.com/adihebbalae/adihebbalae-MusicRecommenders',
    demo: '/projects/music-recommender/demo',
  },

  sections: [
    {
      heading: 'What the notebooks do',
      body: `The first notebook predicts whether a track is a hit from Spotify audio features (danceability, energy, speechiness, acousticness, instrumentalness, liveness, valence, tempo) using logistic regression, then reads the coefficients to see which features carried the decision.

The second builds a song vector out of text fields (artist, genre, lyrics) run through CountVectorizer, concatenated with normalized numeric features, and ranks the K nearest songs by cosine similarity.

The third switches to 12-dimensional timbre timecourses pulled from Spotify's audio analysis, flattens them, and trains KNN, SVM, naive Bayes, logistic regression and an MLP on the same input to compare them.

The fourth stops flattening. It reshapes the timbre data as 120 timesteps by 12 components and trains an LSTM with dense layers on top, plus PCA for spectrogram dimensionality reduction and librosa for audio visualization.`,
    },
    {
      heading: 'How the demo differs from the notebooks',
      body: `The demo here does not run a trained model. It scores about thirty hand-entered songs with a weighted sum over genre match, tempo distance, energy, valence and danceability, and shows the per-feature breakdown behind each score.

I built it that way on purpose. Shipping a real model to the browser would mean either a Python backend or a conversion pipeline, and neither is worth it for a project this old. What the demo is good for is making the idea legible: pick a target, score every candidate against it, sort, take the top K. That loop is the same one the content-based notebook runs, just with cosine similarity over real vectors instead of five weights I chose by hand.`,
    },
  ],
};

export default musicRecommender;
