'use client';

import { modeBootstrapScript } from '@/lib/mode';

/**
 * Renders the pre-paint mode bootstrap into <head>.
 *
 * This exists as its own client component on purpose. `modeBootstrapScript`
 * lives in a 'use client' module, so a Server Component importing it gets a
 * client reference rather than the string. Rendering it from the client
 * boundary gets the real value, and it still lands in the prerendered HTML.
 */
export default function ModeScript() {
  return <script dangerouslySetInnerHTML={{ __html: modeBootstrapScript }} />;
}
