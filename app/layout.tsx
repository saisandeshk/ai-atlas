import type { Metadata } from 'next';
import {
  Fraunces,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Serif,
  JetBrains_Mono,
  Source_Sans_3,
} from 'next/font/google';
import './globals.css';
import './palettes-preview.css';

const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'] });
const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
});
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});
const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
const plexSerif = IBM_Plex_Serif({
  variable: '--font-plex-serif',
  subsets: ['latin'],
  weight: ['500', '600'],
});
const plexSans = IBM_Plex_Sans({
  variable: '--font-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

// The font variables sit on <html> so the design tokens on :root can use them.
const fontVariables = [
  fraunces,
  sourceSans,
  jetbrainsMono,
  geist,
  geistMono,
  plexSerif,
  plexSans,
  plexMono,
]
  .map((font) => font.variable)
  .join(' ');

// Applies the saved theme before first paint, so a dark page never flashes
// light. The theme toggle in the page changes the same attribute.
const themeScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem('ai-atlas-theme');if(t==='light'||t==='dark')d.dataset.theme=t;var p=localStorage.getItem('ai-atlas-palette');if(p)d.dataset.palette=p}catch(e){}})();`;

export const metadata: Metadata = {
  title: 'AI Atlas',
  description:
    'A finite study route through ML and AI: study units, practice and proof you learned it.',
  icons: {
    icon: '/ai-atlas/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
