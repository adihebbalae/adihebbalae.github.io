import type { Project } from '@/data/types';

const utpoll: Project = {
  slug: 'utpoll',
  title: 'UT Instapoll Alert',

  tagline: {
    recruiter:
      'A Chrome Web Store extension that tells UT students the moment a lecture poll opens.',
    builder:
      'An MV3 extension and a headless Pusher-WebSocket worker, both firing on the same event.',
  },

  summary: {
    recruiter: `UT lectures run live participation polls through a web portal, and the popup lands on whichever monitor that tab happens to be sitting on. UT Instapoll Alert fires a chime, a desktop notification, and an optional phone push the moment a poll goes live, so a student taking notes on the other screen does not lose credit for a class they are sitting in. It shipped to the Chrome Web Store in April 2026 and has 41 users and a 5.0 rating from 6 ratings as of July 30, 2026. It collects no personal data, and the published privacy policy matches what the manifest actually asks for.`,
    builder: `The poll data already reaches the browser. The gap is that nothing tells you it arrived, so I built two ways to catch that moment: a Manifest V3 extension that reads responses the portal is already receiving, and a Python worker that connects straight to the Instapoll Pusher WebSocket and needs no browser open at all. Most of the work turned out to be platform constraints and one library that would not hold a connection.`,
  },

  role: 'Sole developer',
  period: 'Mar 2026 – Apr 2026',
  status: 'live',
  depth: 'full',
  category: ['Developer Tools', 'Civic'],

  tech: [
    'JavaScript',
    'Chrome Manifest V3',
    'Service worker',
    'Offscreen document',
    'Web Audio API',
    'Python',
    'WebSocket',
    'Pusher protocol',
    'ntfy.sh',
    'Railway',
    'systemd',
  ],

  metrics: [
    { value: '41', label: 'Chrome Web Store users, as of Jul 30 2026' },
    {
      value: '5.0★',
      label: 'Store rating from 6 ratings, as of Jul 30 2026',
      recruiterOnly: true,
    },
    { value: 'Zero', label: 'Personal data collected, stored, transmitted, or shared' },
    { value: '2', label: 'Delivery paths: MV3 extension and headless cloud notifier' },
    { value: '17', label: 'Commits, Mar 11 – Apr 20 2026, sole author' },
  ],

  links: {
    live: 'https://chromewebstore.google.com/detail/ljcbfiifmkajnlmdpfmcnfjcekpijmdg',
    github: 'https://github.com/adihebbalae/UTPoll',
  },

  featured: true,

  sections: [
    {
      heading: 'The problem is the other monitor',
      body: `UT lectures run live participation polls through a portal at polls.la.utexas.edu. A poll opens, a popup appears in that tab, and it closes a couple of minutes later. If the tab is on your second monitor and your notes are on the first, you lose the credit for a class you are physically sitting in.

The data is already arriving in the browser. Nothing tells you it got there, which is why the fix is a notifier and nothing cleverer.`,
    },
    {
      heading: 'Two ways to deliver one alert',
      body: `The extension is the obvious path. A content script and an injected script wrap the page's own fetch and XMLHttpRequest calls and read the poll responses the portal is already receiving, cloning them so the original request is untouched. No extra traffic goes to UT and no credentials are involved. Once a poll shows up in two consecutive reads within five seconds, the alert fires: a chime generated with the Web Audio API, a desktop notification that stays up until dismissed, and an optional push to your phone through ntfy.sh.

The second path exists because the first one needs an open browser. The cloud notifier is a Python worker that connects straight to the Instapoll Pusher WebSocket, subscribes to the course channel, and posts to ntfy.sh with nothing running on your machine. It takes two environment variables, a course ID and an ntfy topic, and deploys either on Railway or as a systemd unit.

That worker started on pysher and dropped its connection roughly every sixty seconds against UT's custom Pusher host. Reconnect logic would only have hidden it. Reading the Pusher wire protocol and handling connection_established, subscribe, ping and pong frames by hand fixed it for good.`,
    },
    {
      heading: 'What it does and does not do',
      body: `Out of the box the tool tells you a poll is open and stops there. It does not answer polls for you, and it does not attend class for anyone.

There is one exception. The extension ships an optional auto-submit feature, off unless you turn it on, because some courses use Instapoll as an opt-in participation nudge where the instructor does not require physical presence. Shipping it was a choice, so the boundary sits above the install instructions in the README instead of in a footer: the tool exists for use while you are in the room, UT's Institutional Rules Chapter 11 and the Honor Code require honest completion of academic activities including attendance, and turning auto-submit on for a class you are not attending is academic dishonesty. That is stated in those words, with both policies linked.

A feature that can be misused is a different thing from a tool built for misuse.`,
    },
    {
      heading: 'Zero data collection, decided first',
      body: `No personal data is collected, stored, transmitted, or shared. That was settled before the first alert worked, because the decision determines the architecture rather than following from it.

Settings live in chrome.storage.sync, which is the user's own Chrome profile and not a server I control, so there is no backend to secure and no database to leak. Poll responses are read in memory and discarded. Host permissions name specific origins instead of <all_urls>. The content security policy limits connect-src to self and ntfy.sh, so the extension cannot reach anywhere else even if a later change tried to. The optional push carries one fixed sentence saying a poll is open, with no course, no identity, and no session attached.

The privacy policy is a real document with a per-category table, and the manifest backs every line of it. Anyone can read the two side by side and check.`,
    },
    {
      heading: 'What shipping to a real store took',
      body: `Most of the extension's structure came from the platform rather than from a design idea. An MV3 service worker cannot play audio, which is the only reason an offscreen document exists in this codebase. Chrome blocks autoplay without a user gesture, so the popup has an Arm Audio button that plays a near-silent tone once to satisfy the policy. Neither of those was in the plan.

The rest is the unglamorous half of publishing: icons at three sizes, a permissions table that explains each request in plain language, a privacy policy a reviewer will actually read, an MIT license, a welcome page, and an uninstall URL pointing at a feedback page that asks a departing user for thirty seconds of why. That last one costs a single API call and it is the only moment someone who left will tell you anything. There is also a local sandbox with a mock service worker, so the whole flow can be tested without waiting for a live lecture.

Seventeen commits across thirty-one tracked files, March 11 to April 20, 2026. The repo reached v1.0.3; the store listing was last updated to v1.0.2 on April 9, 2026. The listing is published under a solo handle, llamafx, rather than my name — a personal alias, not a company or a team.

Forty-one people I have never met installed it and six of them rated it. That is a small number, and it is not one I could have generated myself.`,
    },
  ],
};

export default utpoll;
