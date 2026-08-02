import type { Project } from '@/data/types';

/**
 * Facts come from the private experience corpus record and from the demo code
 * itself (src/app/projects/name-that-song/demo/page.tsx).
 *
 * The corpus dates this project only as "the high-school era" and marks its
 * 2024 start/end as unconfirmed placeholders, so `period` says High school and
 * asserts no month or year.
 *
 * The home-page card says four genres including Country. The demo ships three
 * (classical, hip-hop, pop), so the copy names the three rather than a count.
 */
const nameThatSong: Project = {
  slug: 'name-that-song',
  title: 'Name That Song',

  tagline: {
    recruiter: 'A browser guessing game: hear a clip, pick the title out of four.',
    builder: 'A five-state game loop around a single audio element.',
  },

  summary: {
    recruiter:
      'Pick a genre, listen to a clip, and choose the title from four options. Five rounds, one point each, scored at the end. Originally written in plain HTML, CSS and JavaScript in high school; the version on this site is a React port that runs inside the portfolio.',
    builder:
      'The scoring is trivial. The work is in the state machine: choose a genre, load a round, play, answer, then either advance or finish, with an audio element that has to stop cleanly on every one of those transitions. Almost every bug I hit was an old clip still playing under a new question.',
  },

  role: 'Sole developer',
  period: 'High school',
  status: 'live',
  depth: 'overview',
  category: ['Interactive', 'Web App'],

  tech: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'TypeScript', 'HTML5 Audio'],

  metrics: [],

  links: {
    github: 'https://github.com/adihebbalae/NameThatSong',
    demo: '/projects/name-that-song/demo',
  },

  sections: [
    {
      heading: 'How a round works',
      body: `Choosing a genre resets the score, sets the round count to five (or fewer, if that genre has fewer tracks), and clears the list of songs already used.

Each round picks a track at random from the ones not yet played, then builds four answer buttons: the correct title plus three other titles from the same genre, shuffled so the right answer is not always in the same slot. Keeping the picks inside one genre matters more than it sounds. Offering a Brahms concerto against three hip-hop tracks would make the answer obvious from one second of audio.

Guessing locks the buttons, highlights the correct title, stops playback, and shows the answer whether or not you got it right. After the last round the game reports a score out of five and offers a replay or a genre change.

The genres in the demo are classical, hip-hop and pop.`,
    },
    {
      heading: 'Where the audio comes from',
      body: `The original version played MP3 files served from the project itself. That is fine for a standalone repo and worse for a portfolio site, where it means shipping a folder of copyrighted audio with every deploy.

The version here asks a public music API for a short preview clip for each track when a genre is chosen, and falls back to the local file path if the lookup fails. Songs are matched by title alone, so a common title can return the wrong recording, and the round still plays whatever came back. It is a small game and I have left that as a known rough edge rather than building a matching layer around it.`,
    },
  ],
};

export default nameThatSong;
