import type { Metadata } from 'next';
import { Fraunces, JetBrains_Mono, Source_Sans_3 } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';

const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'] });
const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
});
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

// The font variables sit on <html> so the design tokens on :root can use them.
const fontVariables = [fraunces, sourceSans, jetbrainsMono]
  .map((font) => font.variable)
  .join(' ');

// Applies the saved theme before first paint, so a dark page never flashes
// light. The theme toggle in the page changes the same attribute.
const themeScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem('ai-atlas-theme');if(t==='light'||t==='dark')d.dataset.theme=t}catch(e){}})();`;

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
