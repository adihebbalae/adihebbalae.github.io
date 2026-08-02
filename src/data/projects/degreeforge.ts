import type { Project } from '../types';

/**
 * Source repo is private. Everything here is architecture and stack only:
 * no code, no screenshots, no file listings, no internal URLs.
 */
const degreeforge: Project = {
  slug: 'degreeforge',
  title: 'DegreeForge',

  tagline: {
    recruiter:
      'Four-year degree planner and next-semester schedule optimizer for UT Austin ECE.',
    builder:
      'Degree planning is a constraint problem, so the solver is code and the LLM only explains.',
  },

  summary: {
    recruiter:
      'DegreeForge plans a four-year UT Austin ECE degree and optimizes the following semester’s schedule. Prerequisite validation runs on a deterministic TypeScript solver over a 382-node, 624-edge course graph, backed by a 3,181-course catalog and grade distributions for 306 courses. 1,794 test cases cover the solver, the data layer, and the interface. Sole developer, April to July 2026.',
    builder:
      'ECE students plan four years in a spreadsheet and keep the prerequisite rules in their heads, so a bad choice in the fall shows up as a blocked course two years later. DegreeForge makes those rules executable: prerequisites compile to conjunctive normal form, plans are checked by topological order over the course graph, and Claude is confined to a chat panel that explains tradeoffs on a plan it cannot edit. The hard part was the data rather than the interface. It runs on localhost only, which was a scope decision and not an unfinished deployment.',
  },

  role: 'Sole developer',
  period: 'Apr 2026 – Present',
  status: 'in-progress',
  depth: 'full',
  featured: true,
  sourcePrivate: true,

  category: ['Web App', 'ML/AI'],

  tech: [
    'TypeScript',
    'React 19',
    'Vite',
    'Tailwind CSS',
    'shadcn/ui',
    'dnd-kit',
    'Express',
    'Node.js',
    'Anthropic API',
    'Vitest',
    'Playwright',
    'npm workspaces',
  ],

  metrics: [
    { value: '1,794', label: 'Test cases across 153 test files' },
    { value: '3,181', label: 'Courses in the catalog, spanning 178 departments' },
    { value: '382 / 624', label: 'Nodes and edges in the prerequisite graph' },
    { value: '306', label: 'Courses with grade distribution data' },
    { value: '3', label: 'Semesters of section-level offering data' },
    { value: '342', label: 'Commits, April to July 2026, sole author', recruiterOnly: true },
  ],

  // Private repo, no deployment. Nothing to link.
  links: {},

  sections: [
    {
      heading: 'The problem',
      body: 'UT Austin ECE students plan four years in a Google Sheet. The grid holds course codes, the prerequisite rules live in the student’s head, and the consequences of a choice stay invisible until registration opens: whether the section even meets that semester, whether swapping one course in the fall blocks another two years out.\n\nUT’s existing tools each cover part of this. The Interactive Degree Audit reports what is done and what is left, but it does not plan or simulate alternatives. The registration extensions surface per-course information while you register, one semester at a time. None of them take degree requirements, the prerequisite graph, and historical grade data together and answer the question that actually decides a schedule: if I make this choice, what happens to the rest of my degree?',
    },
    {
      heading: 'How the prerequisite solver works',
      body: 'Real prerequisites are disjunctive. A course wants ECE 302 or its honors equivalent, and M 427J, and a physics course passed with a C- or better. A stack of conditionals gets that wrong fast, so the rules compile to conjunctive normal form: a course carries a list of groups, each group holds the courses that would satisfy it, and the course is reachable when every group has at least one member met.\n\nCourse IDs are canonicalized before any group is checked. UT writes electrical engineering as “E E” in some feeds and “ECE” in others, honors sections are separate IDs, and several courses are cross-listed under another department. Skipping that step makes the solver quietly wrong in exactly the cases a student is most likely to hit.\n\nValidation is a topological pass over the course graph, 382 nodes and 624 edges. Prerequisites have to land in a strictly earlier semester, corequisites in the same semester or earlier, and a fall-only course cannot sit in a spring column. Pinned courses are fixed constraints the solver fills around. Moving a course recomputes everything downstream of it, so dragging a gateway course back a year immediately marks the later courses that just became invalid.\n\nDegree-audit gaps go through a separate greedy first-fit resolver that copies how UT’s audit actually assigns a course to a requirement: requirements in sequence order, each course claimed by the earliest requirement that can take it, unless that requirement explicitly allows reuse. Matching the official behavior mattered more than a cleaner assignment: a plan that disagrees with the audit is useless to the student holding it.',
    },
    {
      heading: 'Getting the data',
      body: 'Acquisition was most of the work. The finished set is 3,181 courses across 178 departments, a 382-node prerequisite graph, grade distributions for 306 courses, and three semesters of section-level offerings for Fall 2024, 2025, and 2026, plus a building-to-building walking distance matrix the optimizer uses to check that back-to-back classes are physically possible.\n\nEarlier semesters came from authenticated fetches against UT’s course search for ECE, Math, Physics, Chemistry, and Rhetoric. Fall 2026, the semester the optimizer actually needed, had no clean endpoint, so part of it was OCR’d out of course-search PDFs. The mixed provenance is recorded in each data file’s source field rather than smoothed over, so a later reader knows which rows to distrust first.\n\nGrade distributions come from UT’s official public reporting and carry the most weight in ranking. RateMyProfessor ratings are joined on instructor name and treated as a weak secondary signal, since reviews are written by the students with the strongest opinions and the sample skews accordingly.',
    },
    {
      heading: 'Why the LLM stays out of the correctness path',
      body: 'The obvious build for this is to hand a model the catalog and a transcript and ask it for a plan. It demos beautifully. It is also the wrong tool, because prerequisite satisfaction has a provable answer and a model that is right 95% of the time fails invisibly. The student does not learn about the other 5% at generation time. They learn about it when registration rejects the course and the semester is gone.\n\nSo the system splits along the line of what can be proven. Prerequisite checking, plan generation, conflict-free section enumeration, and ranking are all deterministic TypeScript. The schedule optimizer enumerates every valid combination of sections and scores them with an explicit weighted function over average GPA, time preference, schedule fit, and instruction mode, so any ranking can be explained by pointing at the weights that produced it.\n\nClaude runs in a chat panel that reads the plan and cannot modify it, answering the questions the solver has no opinion about: whether the better professor is worth the 8am, whether an easier writing course offsets a heavy semester. Requests route through a small Express proxy so the API key never reaches the browser. A wrong answer there costs one bad sentence rather than a semester.',
    },
    {
      heading: 'What I would do differently',
      body: 'The CNF rules are hand-authored, and only for the courses that appear in real ECE plans. Everything else falls back to a default-OR check, which is correct for the OR-pools that make up most multi-edge courses and would be wrong for an AND-stack nobody has encoded yet. That fallback holds today because the authored set covers the plans the tool is used for, and it is the first thing to break if someone points it at another major. The better design parses prerequisite text into CNF as a build step and keeps the hand-authored table only as an override for cases the parser gets wrong.\n\nThe docs drifted from the code. The README claimed 49 tests long after the suite had grown to 1,794, and listed grade distributions for 249 courses when the file held 306. Nothing in the app read those numbers, which is exactly why the drift went unnoticed for months. Counts that appear in prose should be generated from the artifacts they describe.\n\nAnd it has one user. Localhost-only was a deliberate scope decision that kept auth, hosting, and multi-tenancy out of a project whose value is the solver and the data. It also means every assumption about what a second student needs is untested. Handing an early version to a few classmates would have cost a weekend and would have told me which half of DegreeForge people actually use.',
    },
  ],
};

export default degreeforge;
