import { create } from 'zustand';
import type { GeneratedImage, Character, Brand, YouTubeThumbnail, GenerationType } from '@/types';

interface AppState {
  // Current generation type
  generationType: GenerationType;
  setGenerationType: (type: GenerationType) => void;

  // Images
  images: GeneratedImage[];
  setImages: (images: GeneratedImage[]) => void;
  addImage: (image: GeneratedImage) => void;
  removeImage: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // Characters
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  addCharacter: (character: Character) => void;
  removeCharacter: (id: string) => void;

  // Brands
  brands: Brand[];
  setBrands: (brands: Brand[]) => void;
  addBrand: (brand: Brand) => void;
  removeBrand: (id: string) => void;

  // YouTube Thumbnails
  thumbnails: YouTubeThumbnail[];
  setThumbnails: (thumbnails: YouTubeThumbnail[]) => void;
  addThumbnail: (thumbnail: YouTubeThumbnail) => void;

  // Selected items for generation
  selectedCharacterId: string | null;
  setSelectedCharacterId: (id: string | null) => void;
  selectedBrandId: string | null;
  setSelectedBrandId: (id: string | null) => void;

  // UI State
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  selectedImage: GeneratedImage | null;
  setSelectedImage: (image: GeneratedImage | null) => void;
  showAdvanced: boolean;
  setShowAdvanced: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Generation type
  generationType: 'text-to-image',
  setGenerationType: (type) => set({ generationType: type }),

  // Images
  images: [],
  setImages: (images) => set({ images }),
  addImage: (image) => set((state) => ({ images: [image, ...state.images] })),
  removeImage: (id) => set((state) => ({ images: state.images.filter((img) => img.id !== id) })),
  toggleFavorite: (id) => set((state) => ({
    images: state.images.map((img) => img.id === id ? { ...img, isFavorite: !img.isFavorite } : img),
  })),

  // Characters
  characters: [],
  setCharacters: (characters) => set({ characters }),
  addCharacter: (character) => set((state) => ({ characters: [character, ...state.characters] })),
  removeCharacter: (id) => set((state) => ({ characters: state.characters.filter((char) => char.id !== id) })),

  // Brands
  brands: [],
  setBrands: (brands) => set({ brands }),
  addBrand: (brand) => set((state) => ({ brands: [brand, ...state.brands] })),
  removeBrand: (id) => set((state) => ({ brands: state.brands.filter((brand) => brand.id !== id) })),

  // Thumbnails
  thumbnails: [],
  setThumbnails: (thumbnails) => set({ thumbnails }),
  addThumbnail: (thumbnail) => set((state) => ({ thumbnails: [thumbnail, ...state.thumbnails] })),

  // Selected items
  selectedCharacterId: null,
  setSelectedCharacterId: (id) => set({ selectedCharacterId: id }),
  selectedBrandId: null,
  setSelectedBrandId: (id) => set({ selectedBrandId: id }),

  // UI State
  isGenerating: false,
  setIsGenerating: (value) => set({ isGenerating: value }),
  selectedImage: null,
  setSelectedImage: (image) => set({ selectedImage: image }),
  showAdvanced: false,
  setShowAdvanced: (value) => set({ showAdvanced: value }),
  activeTab: 'generate',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
