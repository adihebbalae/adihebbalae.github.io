import type { Metadata, Viewport } from "next";
import { Oswald, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// Self-hosted at build time, so there is no render-blocking request to
// fonts.googleapis.com. globals.css maps these onto --font-display and
// --font-body, which is what every component reads.
const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://adihebbalae.github.io'),
  title: "Adithya Hebbalae",
  description: "Electrical and computer engineering at UT Austin. Undergraduate researcher in the SWARM Lab and co-author of CrossView (ECCV 2026).",
  alternates: {
    canonical: "https://adihebbalae.github.io/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://adihebbalae.github.io/",
    title: "Adithya Hebbalae",
    description: "Electrical and computer engineering at UT Austin. Undergraduate researcher in the SWARM Lab and co-author of CrossView (ECCV 2026).",
    images: ["/header.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adithya Hebbalae",
    description: "Electrical and computer engineering at UT Austin. Undergraduate researcher in the SWARM Lab and co-author of CrossView (ECCV 2026).",
    images: ["/header.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: '#880808',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${serif.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
