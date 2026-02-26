import type { Metadata } from "next";
import "./globals.css";

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
  other: {
    'theme-color': '#880808',
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
    images: ["/favicon.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
