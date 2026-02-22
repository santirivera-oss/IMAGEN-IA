// Simple in-memory store for development
// In production, this will use Firestore via the REST API

interface ImageData {
  id: string;
  prompt: string;
  enhancedPrompt?: string;
  imageBase64: string;
  size: string;
  style?: string;
  mood?: string;
  lighting?: string;
  type: string;
  characterId?: string;
  brandId?: string;
  isFavorite: boolean;
  createdAt: Date;
}

interface CharacterData {
  id: string;
  name: string;
  description: string;
  basePrompt: string;
  traits?: string;
  styleNotes?: string;
  createdAt: Date;
}

interface BrandData {
  id: string;
  name: string;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  styleGuide?: string;
  moodKeywords?: string;
  createdAt: Date;
}

interface ThumbnailData {
  id: string;
  title: string;
  description?: string;
  prompt: string;
  imageBase64: string;
  size: string;
  style?: string;
  textColor?: string;
  createdAt: Date;
}

// In-memory storage
const images: ImageData[] = [];
const characters: CharacterData[] = [];
const brands: BrandData[] = [];
const thumbnails: ThumbnailData[] = [];

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// IMAGES
export async function createImage(data: Omit<ImageData, 'id' | 'isFavorite' | 'createdAt'>): Promise<ImageData> {
  const image: ImageData = {
    id: generateId(),
    ...data,
    isFavorite: false,
    createdAt: new Date(),
  };
  images.unshift(image);
  return image;
}

export async function getImages(): Promise<ImageData[]> {
  return images;
}

export async function getImageById(id: string): Promise<ImageData | null> {
  return images.find(img => img.id === id) || null;
}

export async function updateImage(id: string, data: Partial<ImageData>): Promise<void> {
  const idx = images.findIndex(img => img.id === id);
  if (idx !== -1) {
    images[idx] = { ...images[idx], ...data };
  }
}

export async function deleteImage(id: string): Promise<void> {
  const idx = images.findIndex(img => img.id === id);
  if (idx !== -1) {
    images.splice(idx, 1);
  }
}

// CHARACTERS
export async function createCharacter(data: Omit<CharacterData, 'id' | 'createdAt'>): Promise<CharacterData> {
  const character: CharacterData = {
    id: generateId(),
    ...data,
    createdAt: new Date(),
  };
  characters.unshift(character);
  return character;
}

export async function getCharacters(): Promise<CharacterData[]> {
  return characters;
}

export async function getCharacterById(id: string): Promise<CharacterData | null> {
  return characters.find(c => c.id === id) || null;
}

export async function updateCharacter(id: string, data: Partial<CharacterData>): Promise<void> {
  const idx = characters.findIndex(c => c.id === id);
  if (idx !== -1) {
    characters[idx] = { ...characters[idx], ...data };
  }
}

export async function deleteCharacter(id: string): Promise<void> {
  const idx = characters.findIndex(c => c.id === id);
  if (idx !== -1) {
    characters.splice(idx, 1);
  }
}

export async function countImagesForCharacter(id: string): Promise<number> {
  return images.filter(img => img.characterId === id).length;
}

// BRANDS
export async function createBrand(data: Omit<BrandData, 'id' | 'createdAt'>): Promise<BrandData> {
  const brand: BrandData = {
    id: generateId(),
    ...data,
    createdAt: new Date(),
  };
  brands.unshift(brand);
  return brand;
}

export async function getBrands(): Promise<BrandData[]> {
  return brands;
}

export async function getBrandById(id: string): Promise<BrandData | null> {
  return brands.find(b => b.id === id) || null;
}

export async function updateBrand(id: string, data: Partial<BrandData>): Promise<void> {
  const idx = brands.findIndex(b => b.id === id);
  if (idx !== -1) {
    brands[idx] = { ...brands[idx], ...data };
  }
}

export async function deleteBrand(id: string): Promise<void> {
  const idx = brands.findIndex(b => b.id === id);
  if (idx !== -1) {
    brands.splice(idx, 1);
  }
}

export async function countImagesForBrand(id: string): Promise<number> {
  return images.filter(img => img.brandId === id).length;
}

// YOUTUBE THUMBNAILS
export async function createThumbnail(data: Omit<ThumbnailData, 'id' | 'createdAt'>): Promise<ThumbnailData> {
  const thumbnail: ThumbnailData = {
    id: generateId(),
    ...data,
    createdAt: new Date(),
  };
  thumbnails.unshift(thumbnail);
  return thumbnail;
}

export async function getThumbnails(): Promise<ThumbnailData[]> {
  return thumbnails;
}
