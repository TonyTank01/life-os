import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return { name: 'LIFE OS', short_name: 'LIFE OS', description: 'Personal Command Center', start_url: '/', display: 'standalone', background_color: '#090909', theme_color: '#090909', icons: [] };
}
