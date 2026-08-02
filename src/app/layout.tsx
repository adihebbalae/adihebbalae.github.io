import type { Metadata, Viewport } from "next";
import { Oswald, Montserrat } from "next/font/google";
import "./globals.css";

// Self-hosted at build time, so there is no render-blocking request to
// fonts.googleapis.com. globals.css maps these onto --font-primary and
// --font-display, which is what every component already reads.
const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://adihebbalae.github.io'),
  title: "Adithya Hebbalae",
  description: "BS in Electrical and Computer Engineering at the University of Texas at Austin",
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
    description: "BS in Electrical and Computer Engineering at the University of Texas at Austin",
    images: ["/header.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adithya Hebbalae",
    description: "BS in Electrical and Computer Engineering at the University of Texas at Austin",
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
    <html lang="en" className={`${oswald.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
