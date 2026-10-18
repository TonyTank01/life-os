import type { Metadata, Viewport } from 'next';
import './styles.css';
export const metadata: Metadata = { title: 'LIFE OS — Personal Command Center', description: 'Plan, track and improve your life.' };
export const viewport: Viewport = { themeColor: '#090909', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ro"><body>{children}</body></html>; }
