import type { Project } from '../types';

/**
 * ECE 312H course project, ported to the browser. Facts sourced from the
 * private experience corpus record for ECE 312H. No C source and no
 * assignment code appears on this page or in this repo; the demo under
 * public/demos/20questions is built output only.
 */
const twentyQuestions: Project = {
  slug: 'twenty-questions',
  title: '20 Questions in the browser',

  tagline: {
    recruiter: 'A C game in the browser, with a decision tree you can watch grow.',
    builder: 'Same C data structures, new I/O: a terminal game compiled for the browser.',
  },

  summary: {
    recruiter:
      'My 20 Questions game runs in the browser, with a live decision tree beside the terminal. I built the original in C for ECE 312H at UT Austin, then independently ported it to WebAssembly after finishing the assignment. The port kept the data-structure code unchanged and replaced the I/O layer across one header and three files.',
    builder:
      'I started with a C course project: a learning binary decision tree, a hash table with separate chaining, undo/redo stacks, and an ncurses interface. After the assignment, I compiled the same C source with Emscripten and replaced the ncurses calls with a JavaScript bridge to an xterm.js terminal in React. The result runs in the browser, with the tree drawn live beside it.',
  },

  role: 'Individual course project, self-directed port',
  period: 'Apr 2026',
  status: 'complete',
  depth: 'full',
  category: ['Web App', 'Interactive'],

  tech: [
    'C',
    'WebAssembly',
    'Emscripten',
    'Asyncify',
    'JavaScript',
    'React',
    'Vite',
    'xterm.js',
    'd3-hierarchy',
  ],

  metrics: [],

  links: {
    demo: '/demos/20questions/index.html',
  },

  sections: [
    {
      heading: 'Waiting for a keystroke',
      body: 'The C game loop stops and waits for keyboard input, but a browser cannot block that way. I used Emscripten Asyncify and async JavaScript shims to make the C input functions wait on promises resolved by keystrokes in xterm.js. That let the C keep its straight-line, blocking structure while the browser stayed responsive. The port made the useful boundary clear: the algorithm code was portable because it had no I/O in it.',
    },
    {
      heading: 'Watching the tree grow',
      body: 'Every wrong guess gives the game a chance to learn a new animal, and now that change is visible beside the terminal. C sends the tree to JavaScript as JSON, and React passes it to d3-hierarchy to draw. The status bar reads node count, undo depth, and redo depth directly from C.',
    },
    {
      heading: 'Try it',
      body: 'Answer yes or no in the terminal pane; after a wrong guess, teach it a new animal and watch the tree beside it grow.',
    },
  ],
};

export default twentyQuestions;
