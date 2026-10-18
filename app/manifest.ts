import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'DINCA METHOD — Personal Performance System',
    short_name: 'DINCA METHOD',
    description: 'Your goals. My job. A personal system to plan, act, and track meaningful progress.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090909',
    theme_color: '#090909',
    icons: [],
  };
}
