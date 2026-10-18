import type { Metadata, Viewport } from 'next';
import './styles.css';
export const metadata: Metadata = { title: 'DINCA METHOD — Your goals. My job.', description: 'A premium personal system for fitness, discipline and life progress.' };
export const viewport: Viewport = { themeColor: '#090909', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ro"><body>{children}</body></html>; }
