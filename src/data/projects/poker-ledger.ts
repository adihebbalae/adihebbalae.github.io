import type { Project } from '@/data/types';

/**
 * Facts come from the private experience corpus record and from the demo code
 * (src/app/projects/poker-ledger/demo/page.tsx).
 *
 * The corpus dates this only as "the high-school era" and marks its 2024
 * start/end as unconfirmed placeholders, so `period` says High school.
 *
 * Deliberately not inflated: no user counts, no adoption claims, no framing of
 * it as bankroll analytics. It is a payout calculator and the copy says so.
 */
const pokerLedger: Project = {
  slug: 'poker-ledger',
  title: 'Poker Ledger',

  tagline: {
    recruiter: 'A payout calculator for home games: buy-ins in, chip counts out, net per player.',
    builder: 'Small enough that the only real design decision was the balance check.',
  },

  summary: {
    recruiter:
      'Set the buy-in amount and the chips each buy-in is worth, enter how much every player bought in for and what they finished with, and it returns net chips and net dollars per person. It also checks that the table balances, because the net across all players has to sum to zero. This is a small tool.',
    builder:
      'The arithmetic is one division and one subtraction per player, so the tool is only worth anything because of the balance check. Doing the math by hand at the end of a night is where mistakes happen, and a total that does not come out to zero is a signal to recount before anyone hands over money.',
  },

  role: 'Sole developer',
  period: 'High school',
  status: 'live',
  depth: 'overview',
  category: ['Web App'],

  tech: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'TypeScript'],

  metrics: [],

  links: {
    github: 'https://github.com/adihebbalae/pokerledger2',
    demo: '/projects/poker-ledger/demo',
  },

  sections: [
    {
      heading: 'What it computes',
      body: `Two settings define the table: the dollar value of a buy-in and the number of chips a buy-in is worth. Dividing one by the other gives the value of a single chip.

For each player you enter the total dollars they bought in for and the chips they finished with. The tool converts their dollars back into chips to get what they were owed at the start, subtracts that from their final stack to get net chips, and multiplies by the chip value to get net dollars. Players are entered as collapsible rows so a ten-person table stays readable on a phone.`,
    },
    {
      heading: 'Why the balance check matters',
      body: `A home game is a closed system. Every dollar a winner takes came from a loser, so the net dollars across the whole table have to sum to zero.

The tool adds up total bought in, total chips issued, total chips counted, and total net dollars, then flags the result as balanced or not. When it does not balance, the numbers are wrong and no payout should happen yet. Usually someone miscounted their stack or forgot a rebuy.`,
    },
  ],
};

export default pokerLedger;
