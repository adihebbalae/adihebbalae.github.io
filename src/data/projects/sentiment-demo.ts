import type { Project } from '@/data/types';

/**
 * Covers two private corpus records, one for the NLP notebook and one for the
 * vision notebook. The 10K+ sample figure is the metric recorded in the NLP
 * record. No accuracy number appears in either record, so none is claimed here.
 *
 * Both records date these to 2023 but mark the dates approximate, so `period`
 * says High school rather than asserting a month.
 *
 * These are program coursework. The builder copy says so rather than framing
 * prescribed notebooks as independent research.
 */
const sentimentDemo: Project = {
  slug: 'sentiment-demo',
  title: 'AI/ML experiments',

  tagline: {
    recruiter: 'Two notebooks: Yelp review sentiment, and image classification from KNN to CNN.',
    builder: 'The first models I trained where I could see why one beat another.',
  },

  summary: {
    recruiter:
      'The NLP notebook classifies Yelp reviews as positive or negative with a logistic regression over bag-of-words features, using spaCy for tokenization and lemmatization, and compares that against multinomial naive Bayes and a word2vec model built on spaCy embeddings. The vision notebook classifies images with a K-nearest-neighbours baseline, then a multilayer perceptron, then a convolutional network, scored under cross-validation. Both are from 2023, before I started at UT.',
    builder:
      'These are program coursework, and the structure was given to me rather than chosen. What I got out of them was the comparison. Running KNN, naive Bayes and logistic regression over the same vectors, then watching a convolutional network beat a multilayer perceptron on the same images, made the accuracy-versus-complexity tradeoff concrete instead of a sentence in a lecture. I have kept them on the site because the demo makes a classifier legible to someone who has never opened a notebook.',
  },

  role: 'Sole developer',
  period: 'High school',
  status: 'complete',
  depth: 'overview',
  category: ['ML/AI'],

  tech: [
    'Python',
    'scikit-learn',
    'TensorFlow',
    'Keras',
    'spaCy',
    'NLTK',
    'Pandas',
    'NumPy',
    'Matplotlib',
    'Jupyter',
  ],

  metrics: [
    {
      value: '10K+',
      label: 'Review samples preprocessed and vectorized for the NLP notebook',
    },
  ],

  links: {
    github: 'https://github.com/adihebbalae/AI-stuff',
    demo: '/projects/sentiment-demo/demo',
  },

  sections: [
    {
      heading: 'The sentiment notebook',
      body: `Reviews above three stars are labelled good and everything at three or below is labelled bad, which turns a star rating into a binary target. Text goes through spaCy for tokenization and lemmatization, stop words and punctuation come out, and each review ends up as a sparse 800-feature word-count vector from CountVectorizer. A logistic regression learns a weight per word.

Two alternatives run against the same data. Multinomial naive Bayes swaps the model but keeps the bag-of-words representation. The word2vec version swaps the representation instead, averaging spaCy's 300-dimensional embeddings, and feeds that into a second logistic regression. Having both comparisons in one notebook makes it clear that the features and the classifier are separate choices.

Ten thousand or so samples were preprocessed and vectorized. I do not have a recorded accuracy figure for any of the three models and will not guess at one.`,
    },
    {
      heading: 'The vision notebook',
      body: `The same idea applied to images, run as a ladder. A K-nearest-neighbours classifier goes first, because it needs no training and gives a floor to beat. Then a multilayer perceptron, then a convolutional network with Conv2D, max-pooling and dropout layers. Every model is scored with stratified K-fold cross-validation so the comparison is not one lucky split.

The point of the exercise was watching where the extra complexity paid for itself and where it did not. The demo on this site does none of that. It is a keyword scorer with negation and intensifier handling, written by hand so you can see every term that moved the score. It is not the trained model, and the explainer panel inside it says so.`,
    },
  ],
};

export default sentimentDemo;
