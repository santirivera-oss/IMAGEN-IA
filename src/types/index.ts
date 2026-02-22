export interface GeneratedImage {
  id: string;
  prompt: string;
  enhancedPrompt: string | null;
  imageBase64: string;
  size: string;
  style: string | null;
  mood: string | null;
  lighting: string | null;
  type: string;
  isFavorite: boolean;
  createdAt: string;
  character?: Character | null;
  brand?: Brand | null;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  basePrompt: string;
  traits: string | null;
  styleNotes: string | null;
  avatarBase64: string | null;
  imageCount?: number;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  styleGuide: string | null;
  logoBase64: string | null;
  fontPreference: string | null;
  moodKeywords: string | null;
  imageCount?: number;
  createdAt: string;
}

export interface YouTubeThumbnail {
  id: string;
  title: string;
  description: string | null;
  prompt: string;
  imageBase64: string;
  size: string;
  style: string | null;
  textColor: string | null;
  textPosition: string | null;
  createdAt: string;
}

export type GenerationType = 'text-to-image' | 'character' | 'brand' | 'youtube-thumbnail' | 'edit';

export const IMAGE_SIZES = [
  { value: '1024x1024', label: 'Cuadrado (1:1)', description: 'Perfecto para redes sociales' },
  { value: '1344x768', label: 'Paisaje (16:9)', description: 'YouTube, presentaciones' },
  { value: '1440x720', label: 'Ancho (2:1)', description: 'Banners, headers' },
  { value: '1152x864', label: 'Horizontal (4:3)', description: 'Uso general' },
  { value: '768x1344', label: 'Retrato (9:16)', description: 'Stories, reels' },
  { value: '864x1152', label: 'Vertical (3:4)', description: 'Posts, pósters' },
  { value: '720x1440', label: 'Alto (1:2)', description: 'Posters, infografías' },
] as const;

export const STYLE_OPTIONS = [
  'Fotorealista',
  'Ilustración digital',
  'Arte 3D',
  'Pintura al óleo',
  'Acuarela',
  'Anime',
  'Comic book',
  'Minimalista',
  'Abstracto',
  'Vintage',
  'Cyberpunk',
  'Fantasía épica',
  'Art Deco',
  'Impresionismo',
  'Pop Art',
  'Boceto',
];

export const MOOD_OPTIONS = [
  'Dramático',
  'Sereno',
  'Misterioso',
  'Alegre',
  'Melancólico',
  'Épico',
  'Romántico',
  'Profesional',
  'Juguetón',
  'Elegante',
  'Futurista',
  'Nostálgico',
  'Oscuro',
  'Vibrante',
];

export const LIGHTING_OPTIONS = [
  'Luz natural',
  'Golden hour',
  'Blue hour',
  'Estudio',
  'Dramático',
  'Neón',
  'Cinematográfico',
  'Backlight',
  'Soft light',
  'Hard light',
  'Volumétrico',
  'Ambient',
];

export const YOUTUBE_STYLES = [
  { value: 'gaming', label: 'Gaming', description: 'Estética gaming con neones y acción' },
  { value: 'tech', label: 'Tech', description: 'Limpio, moderno, futurista' },
  { value: 'lifestyle', label: 'Lifestyle', description: 'Cálido, amigable, auténtico' },
  { value: 'educational', label: 'Educativo', description: 'Limpio, profesional, infográfico' },
  { value: 'entertainment', label: 'Entretenimiento', description: 'Divertido, emocionante' },
  { value: 'dramatic', label: 'Dramático', description: 'Alto contraste, cinematográfico' },
  { value: 'minimalist', label: 'Minimalista', description: 'Simple, elegante, espaciado' },
];
