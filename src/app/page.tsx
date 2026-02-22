'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Image,
  Users,
  Palette,
  Youtube,
  History,
  Settings,
  Download,
  Trash2,
  Heart,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Check,
  Loader2,
  Maximize2,
  Share2,
  Edit3,
  Bookmark,
  Zap,
  Layers,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store';
import type { GeneratedImage, Character, Brand, GenerationType } from '@/types';
import {
  IMAGE_SIZES,
  STYLE_OPTIONS,
  MOOD_OPTIONS,
  LIGHTING_OPTIONS,
  YOUTUBE_STYLES,
} from '@/types';

// Main component
export default function Home() {
  const { toast } = useToast();
  const {
    generationType,
    setGenerationType,
    images,
    setImages,
    addImage,
    removeImage,
    toggleFavorite,
    characters,
    setCharacters,
    addCharacter,
    removeCharacter,
    brands,
    setBrands,
    addBrand,
    removeBrand,
    thumbnails,
    setThumbnails,
    addThumbnail,
    selectedCharacterId,
    setSelectedCharacterId,
    selectedBrandId,
    setSelectedBrandId,
    isGenerating,
    setIsGenerating,
    selectedImage,
    setSelectedImage,
    showAdvanced,
    setShowAdvanced,
    activeTab,
    setActiveTab,
  } = useAppStore();

  // Form state
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [style, setStyle] = useState('');
  const [mood, setMood] = useState('');
  const [lighting, setLighting] = useState('');

  // YouTube form state
  const [ytTitle, setYtTitle] = useState('');
  const [ytDescription, setYtDescription] = useState('');
  const [ytStyle, setYtStyle] = useState('');
  const [ytTextColor, setYtTextColor] = useState('');

  // Character/Brand dialog state
  const [showCharacterDialog, setShowCharacterDialog] = useState(false);
  const [showBrandDialog, setShowBrandDialog] = useState(false);
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);

  // New character form
  const [newCharName, setNewCharName] = useState('');
  const [newCharDesc, setNewCharDesc] = useState('');
  const [newCharPrompt, setNewCharPrompt] = useState('');
  const [newCharNotes, setNewCharNotes] = useState('');

  // New brand form
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDesc, setNewBrandDesc] = useState('');
  const [newBrandColor, setNewBrandColor] = useState('#3b82f6');
  const [newBrandStyle, setNewBrandStyle] = useState('');

  // Load data on mount
  useEffect(() => {
    fetchImages();
    fetchCharacters();
    fetchBrands();
    fetchThumbnails();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      if (data.images) setImages(data.images);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchCharacters = async () => {
    try {
      const res = await fetch('/api/characters');
      const data = await res.json();
      if (data.characters) setCharacters(data.characters);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      if (data.brands) setBrands(data.brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchThumbnails = async () => {
    try {
      const res = await fetch('/api/youtube');
      const data = await res.json();
      if (data.thumbnails) setThumbnails(data.thumbnails);
    } catch (error) {
      console.error('Error fetching thumbnails:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor escribe una descripción para generar la imagen',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          size,
          style: style || undefined,
          mood: mood || undefined,
          lighting: lighting || undefined,
          characterId: selectedCharacterId || undefined,
          brandId: selectedBrandId || undefined,
          type: generationType,
        }),
      });

      const data = await res.json();
      if (data.success && data.image) {
        addImage(data.image);
        toast({
          title: '¡Imagen generada!',
          description: 'Tu imagen ha sido creada exitosamente',
        });
        setPrompt('');
      } else {
        throw new Error(data.error || 'Error al generar la imagen');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al generar la imagen. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateYouTube = async () => {
    if (!ytTitle.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor escribe un título para la miniatura',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ytTitle,
          description: ytDescription,
          style: ytStyle || undefined,
          textColor: ytTextColor || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.thumbnail) {
        addThumbnail(data.thumbnail);
        toast({
          title: '¡Miniatura generada!',
          description: 'Tu miniatura de YouTube ha sido creada exitosamente',
        });
        setYtTitle('');
        setYtDescription('');
      } else {
        throw new Error(data.error || 'Error al generar la miniatura');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al generar la miniatura. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCharacter = async () => {
    if (!newCharName.trim() || !newCharPrompt.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre y el prompt base son obligatorios',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCharName,
          description: newCharDesc,
          basePrompt: newCharPrompt,
          styleNotes: newCharNotes,
        }),
      });

      const data = await res.json();
      if (data.success && data.character) {
        addCharacter(data.character);
        setShowCharacterDialog(false);
        setNewCharName('');
        setNewCharDesc('');
        setNewCharPrompt('');
        setNewCharNotes('');
        toast({
          title: '¡Personaje creado!',
          description: 'El personaje ha sido guardado exitosamente',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al crear el personaje',
        variant: 'destructive',
      });
    }
  };

  const handleCreateBrand = async () => {
    if (!newBrandName.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre de la marca es obligatorio',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBrandName,
          description: newBrandDesc,
          primaryColor: newBrandColor,
          styleGuide: newBrandStyle,
        }),
      });

      const data = await res.json();
      if (data.success && data.brand) {
        addBrand(data.brand);
        setShowBrandDialog(false);
        setNewBrandName('');
        setNewBrandDesc('');
        setNewBrandColor('#3b82f6');
        setNewBrandStyle('');
        toast({
          title: '¡Marca creada!',
          description: 'La marca ha sido guardada exitosamente',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al crear la marca',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await fetch(`/api/images/${id}`, { method: 'DELETE' });
      removeImage(id);
      if (selectedImage?.id === id) setSelectedImage(null);
      toast({ title: 'Imagen eliminada' });
    } catch {
      toast({ title: 'Error al eliminar', variant: 'destructive' });
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await fetch(`/api/images/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: true }),
      });
      toggleFavorite(id);
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const handleDownload = (imageBase64: string, name: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageBase64}`;
    link.download = `${name}.png`;
    link.click();
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Prompt copiado al portapapeles' });
  };

  const handleReusePrompt = (img: GeneratedImage) => {
    setPrompt(img.prompt);
    setSize(img.size);
    setStyle(img.style || '');
    setMood(img.mood || '');
    setLighting(img.lighting || '');
    setActiveTab('generate');
    toast({ title: 'Prompt reutilizado' });
  };

  const handleEditImage = (img: GeneratedImage) => {
    setEditingImage(img);
    setPrompt(`Edita esta imagen: ${img.prompt}`);
    setGenerationType('edit');
    setActiveTab('generate');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Imagina AI</h1>
                <p className="text-xs text-slate-400">Generador de imágenes con IA</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-slate-700 text-slate-300">
                {images.length} imágenes
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 gap-2 bg-slate-800/50 p-1 rounded-xl h-auto">
            <TabsTrigger
              value="generate"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600"
            >
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">Generar</span>
            </TabsTrigger>
            <TabsTrigger
              value="characters"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Personajes</span>
            </TabsTrigger>
            <TabsTrigger
              value="brands"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Marcas</span>
            </TabsTrigger>
            <TabsTrigger
              value="youtube"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600"
            >
              <Youtube className="w-4 h-4" />
              <span className="hidden sm:inline">YouTube</span>
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600"
            >
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Galería</span>
            </TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Generation Panel */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-violet-400" />
                      Crea tu imagen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Prompt Input */}
                    <div className="space-y-2">
                      <Label className="text-slate-300">Descripción</Label>
                      <Textarea
                        placeholder="Describe la imagen que quieres crear... Ej: Un gato astronauta flotando en el espacio con la Tierra de fondo, estilo digital art"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-32 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                      />
                    </div>

                    {/* Quick Selection Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {selectedCharacterId && (
                        <Badge variant="secondary" className="bg-violet-600/20 text-violet-300 border-violet-500/50">
                          <Users className="w-3 h-3 mr-1" />
                          {characters.find(c => c.id === selectedCharacterId)?.name}
                          <button
                            onClick={() => setSelectedCharacterId(null)}
                            className="ml-1 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}
                      {selectedBrandId && (
                        <Badge variant="secondary" className="bg-fuchsia-600/20 text-fuchsia-300 border-fuchsia-500/50">
                          <Palette className="w-3 h-3 mr-1" />
                          {brands.find(b => b.id === selectedBrandId)?.name}
                          <button
                            onClick={() => setSelectedBrandId(null)}
                            className="ml-1 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}
                    </div>

                    {/* Size Selection */}
                    <div className="space-y-2">
                      <Label className="text-slate-300">Tamaño</Label>
                      <Select value={size} onValueChange={setSize}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {IMAGE_SIZES.map((s) => (
                            <SelectItem key={s.value} value={s.value} className="text-white hover:bg-slate-700">
                              <div>
                                <span>{s.label}</span>
                                <span className="text-slate-400 text-xs ml-2">({s.description})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Advanced Options Toggle */}
                    <Button
                      variant="ghost"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full text-slate-400 hover:text-white hover:bg-slate-700/50"
                    >
                      {showAdvanced ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                      Opciones avanzadas
                    </Button>

                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Style */}
                            <div className="space-y-2">
                              <Label className="text-slate-300 flex items-center gap-2">
                                <Layers className="w-4 h-4" />
                                Estilo
                              </Label>
                              <Select value={style} onValueChange={setStyle}>
                                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                  {STYLE_OPTIONS.map((s) => (
                                    <SelectItem key={s} value={s.toLowerCase()} className="text-white hover:bg-slate-700">
                                      {s}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Mood */}
                            <div className="space-y-2">
                              <Label className="text-slate-300 flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                Ambiente
                              </Label>
                              <Select value={mood} onValueChange={setMood}>
                                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                  {MOOD_OPTIONS.map((m) => (
                                    <SelectItem key={m} value={m.toLowerCase()} className="text-white hover:bg-slate-700">
                                      {m}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Lighting */}
                            <div className="space-y-2">
                              <Label className="text-slate-300 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                Iluminación
                              </Label>
                              <Select value={lighting} onValueChange={setLighting}>
                                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                  {LIGHTING_OPTIONS.map((l) => (
                                    <SelectItem key={l} value={l.toLowerCase()} className="text-white hover:bg-slate-700">
                                      {l}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Generate Button */}
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-lg shadow-lg shadow-violet-500/25"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generar imagen
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Access Sidebar */}
              <div className="space-y-4">
                {/* Characters Quick Select */}
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-violet-400" />
                        Personajes
                      </CardTitle>
                      <Dialog open={showCharacterDialog} onOpenChange={setShowCharacterDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-white">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700 text-white">
                          <DialogHeader>
                            <DialogTitle>Nuevo personaje</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Crea un personaje consistente para reutilizar en tus imágenes
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Nombre</Label>
                              <Input
                                value={newCharName}
                                onChange={(e) => setNewCharName(e.target.value)}
                                placeholder="Ej: María, el explorador..."
                                className="bg-slate-900/50 border-slate-700"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Descripción</Label>
                              <Input
                                value={newCharDesc}
                                onChange={(e) => setNewCharDesc(e.target.value)}
                                placeholder="Breve descripción del personaje"
                                className="bg-slate-900/50 border-slate-700"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Prompt base *</Label>
                              <Textarea
                                value={newCharPrompt}
                                onChange={(e) => setNewCharPrompt(e.target.value)}
                                placeholder="Descripción detallada que define al personaje: apariencia, ropa, rasgos..."
                                className="bg-slate-900/50 border-slate-700 min-h-24"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Notas de estilo</Label>
                              <Input
                                value={newCharNotes}
                                onChange={(e) => setNewCharNotes(e.target.value)}
                                placeholder="Ej: Siempre lleva gafas, estilo casual..."
                                className="bg-slate-900/50 border-slate-700"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" className="border-slate-700">Cancelar</Button>
                            </DialogClose>
                            <Button onClick={handleCreateCharacter} className="bg-violet-600 hover:bg-violet-500">
                              Crear personaje
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      {characters.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">
                          No hay personajes. Crea uno para mantener consistencia.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {characters.map((char) => (
                            <button
                              key={char.id}
                              onClick={() => setSelectedCharacterId(selectedCharacterId === char.id ? null : char.id)}
                              className={`w-full text-left p-2 rounded-lg transition-colors ${
                                selectedCharacterId === char.id
                                  ? 'bg-violet-600/30 border border-violet-500/50'
                                  : 'bg-slate-700/30 hover:bg-slate-700/50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
                                  {char.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">{char.name}</p>
                                  <p className="text-xs text-slate-400 truncate">{char.description}</p>
                                </div>
                                {selectedCharacterId === char.id && (
                                  <Check className="w-4 h-4 text-violet-400 ml-auto" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Brands Quick Select */}
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <Palette className="w-4 h-4 text-fuchsia-400" />
                        Marcas
                      </CardTitle>
                      <Dialog open={showBrandDialog} onOpenChange={setShowBrandDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-white">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700 text-white">
                          <DialogHeader>
                            <DialogTitle>Nueva marca</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Define los elementos de marca para imágenes consistentes
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Nombre *</Label>
                              <Input
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                placeholder="Nombre de la marca"
                                className="bg-slate-900/50 border-slate-700"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Descripción</Label>
                              <Input
                                value={newBrandDesc}
                                onChange={(e) => setNewBrandDesc(e.target.value)}
                                placeholder="Qué representa la marca"
                                className="bg-slate-900/50 border-slate-700"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Color principal</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="color"
                                  value={newBrandColor}
                                  onChange={(e) => setNewBrandColor(e.target.value)}
                                  className="w-12 h-10 bg-slate-900/50 border-slate-700 p-1"
                                />
                                <Input
                                  value={newBrandColor}
                                  onChange={(e) => setNewBrandColor(e.target.value)}
                                  className="bg-slate-900/50 border-slate-700 flex-1"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Guía de estilo</Label>
                              <Textarea
                                value={newBrandStyle}
                                onChange={(e) => setNewBrandStyle(e.target.value)}
                                placeholder="Describe el estilo visual: minimalista, corporativo, moderno..."
                                className="bg-slate-900/50 border-slate-700 min-h-20"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" className="border-slate-700">Cancelar</Button>
                            </DialogClose>
                            <Button onClick={handleCreateBrand} className="bg-fuchsia-600 hover:bg-fuchsia-500">
                              Crear marca
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      {brands.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">
                          No hay marcas. Crea una para aplicar estilos consistentes.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {brands.map((brand) => (
                            <button
                              key={brand.id}
                              onClick={() => setSelectedBrandId(selectedBrandId === brand.id ? null : brand.id)}
                              className={`w-full text-left p-2 rounded-lg transition-colors ${
                                selectedBrandId === brand.id
                                  ? 'bg-fuchsia-600/30 border border-fuchsia-500/50'
                                  : 'bg-slate-700/30 hover:bg-slate-700/50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: brand.primaryColor || '#3b82f6' }}
                                >
                                  <Palette className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">{brand.name}</p>
                                  <p className="text-xs text-slate-400 truncate">{brand.description}</p>
                                </div>
                                {selectedBrandId === brand.id && (
                                  <Check className="w-4 h-4 text-fuchsia-400 ml-auto" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Characters Tab */}
          <TabsContent value="characters" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Personajes consistentes</h2>
                <p className="text-slate-400">Crea personajes que mantienen su apariencia en todas las imágenes</p>
              </div>
              <Dialog open={showCharacterDialog} onOpenChange={setShowCharacterDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-violet-600 hover:bg-violet-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo personaje
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Nuevo personaje</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Crea un personaje consistente para reutilizar en tus imágenes
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input
                        value={newCharName}
                        onChange={(e) => setNewCharName(e.target.value)}
                        placeholder="Ej: María, el explorador..."
                        className="bg-slate-900/50 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Input
                        value={newCharDesc}
                        onChange={(e) => setNewCharDesc(e.target.value)}
                        placeholder="Breve descripción del personaje"
                        className="bg-slate-900/50 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prompt base *</Label>
                      <Textarea
                        value={newCharPrompt}
                        onChange={(e) => setNewCharPrompt(e.target.value)}
                        placeholder="Descripción detallada que define al personaje: apariencia, ropa, rasgos..."
                        className="bg-slate-900/50 border-slate-700 min-h-24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notas de estilo</Label>
                      <Input
                        value={newCharNotes}
                        onChange={(e) => setNewCharNotes(e.target.value)}
                        placeholder="Ej: Siempre lleva gafas, estilo casual..."
                        className="bg-slate-900/50 border-slate-700"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-slate-700">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleCreateCharacter} className="bg-violet-600 hover:bg-violet-500">
                      Crear personaje
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {characters.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No hay personajes</h3>
                  <p className="text-slate-400 mb-4">Crea tu primer personaje para mantener consistencia en tus imágenes</p>
                  <Button onClick={() => setShowCharacterDialog(true)} className="bg-violet-600 hover:bg-violet-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear personaje
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.map((char) => (
                  <Card key={char.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur hover:border-violet-500/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-lg font-bold">
                          {char.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-white">{char.name}</CardTitle>
                          <p className="text-sm text-slate-400">{char.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs text-slate-500">Prompt base</Label>
                        <p className="text-sm text-slate-300 line-clamp-2">{char.basePrompt}</p>
                      </div>
                      {char.styleNotes && (
                        <div>
                          <Label className="text-xs text-slate-500">Notas de estilo</Label>
                          <p className="text-sm text-slate-300">{char.styleNotes}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="outline" className="border-slate-700 text-slate-400">
                          {char.imageCount || 0} imágenes
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCharacterId(char.id);
                              setActiveTab('generate');
                            }}
                            className="text-violet-400 hover:text-violet-300"
                          >
                            <Wand2 className="w-4 h-4 mr-1" />
                            Usar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              await fetch(`/api/characters/${char.id}`, { method: 'DELETE' });
                              removeCharacter(char.id);
                              toast({ title: 'Personaje eliminado' });
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Brands Tab */}
          <TabsContent value="brands" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Marcas</h2>
                <p className="text-slate-400">Define estilos de marca para generar imágenes consistentes</p>
              </div>
              <Dialog open={showBrandDialog} onOpenChange={setShowBrandDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-fuchsia-600 hover:bg-fuchsia-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva marca
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Nueva marca</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Define los elementos de marca para imágenes consistentes
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nombre *</Label>
                      <Input
                        value={newBrandName}
                        onChange={(e) => setNewBrandName(e.target.value)}
                        placeholder="Nombre de la marca"
                        className="bg-slate-900/50 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Input
                        value={newBrandDesc}
                        onChange={(e) => setNewBrandDesc(e.target.value)}
                        placeholder="Qué representa la marca"
                        className="bg-slate-900/50 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color principal</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={newBrandColor}
                          onChange={(e) => setNewBrandColor(e.target.value)}
                          className="w-12 h-10 bg-slate-900/50 border-slate-700 p-1"
                        />
                        <Input
                          value={newBrandColor}
                          onChange={(e) => setNewBrandColor(e.target.value)}
                          className="bg-slate-900/50 border-slate-700 flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Guía de estilo</Label>
                      <Textarea
                        value={newBrandStyle}
                        onChange={(e) => setNewBrandStyle(e.target.value)}
                        placeholder="Describe el estilo visual: minimalista, corporativo, moderno..."
                        className="bg-slate-900/50 border-slate-700 min-h-20"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-slate-700">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleCreateBrand} className="bg-fuchsia-600 hover:bg-fuchsia-500">
                      Crear marca
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {brands.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
                <CardContent className="py-12 text-center">
                  <Palette className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No hay marcas</h3>
                  <p className="text-slate-400 mb-4">Crea tu primera marca para aplicar estilos consistentes a tus imágenes</p>
                  <Button onClick={() => setShowBrandDialog(true)} className="bg-fuchsia-600 hover:bg-fuchsia-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear marca
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <Card key={brand.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur hover:border-fuchsia-500/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: brand.primaryColor || '#3b82f6' }}
                        >
                          <Palette className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-white">{brand.name}</CardTitle>
                          <p className="text-sm text-slate-400">{brand.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        {brand.primaryColor && (
                          <div
                            className="w-8 h-8 rounded-lg border border-slate-600"
                            style={{ backgroundColor: brand.primaryColor }}
                            title="Color principal"
                          />
                        )}
                        {brand.secondaryColor && (
                          <div
                            className="w-8 h-8 rounded-lg border border-slate-600"
                            style={{ backgroundColor: brand.secondaryColor }}
                            title="Color secundario"
                          />
                        )}
                        {brand.accentColor && (
                          <div
                            className="w-8 h-8 rounded-lg border border-slate-600"
                            style={{ backgroundColor: brand.accentColor }}
                            title="Color de acento"
                          />
                        )}
                      </div>
                      {brand.styleGuide && (
                        <div>
                          <Label className="text-xs text-slate-500">Guía de estilo</Label>
                          <p className="text-sm text-slate-300 line-clamp-2">{brand.styleGuide}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="outline" className="border-slate-700 text-slate-400">
                          {brand.imageCount || 0} imágenes
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedBrandId(brand.id);
                              setActiveTab('generate');
                            }}
                            className="text-fuchsia-400 hover:text-fuchsia-300"
                          >
                            <Wand2 className="w-4 h-4 mr-1" />
                            Usar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              await fetch(`/api/brands/${brand.id}`, { method: 'DELETE' });
                              removeBrand(brand.id);
                              toast({ title: 'Marca eliminada' });
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* YouTube Tab */}
          <TabsContent value="youtube" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-500" />
                    Generador de miniaturas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Título del video *</Label>
                    <Input
                      value={ytTitle}
                      onChange={(e) => setYtTitle(e.target.value)}
                      placeholder="Ej: 10 trucos de productividad que cambiarán tu vida"
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Descripción adicional</Label>
                    <Textarea
                      value={ytDescription}
                      onChange={(e) => setYtDescription(e.target.value)}
                      placeholder="Añade detalles sobre el contenido del video..."
                      className="bg-slate-900/50 border-slate-700 text-white min-h-20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Estilo</Label>
                      <Select value={ytStyle} onValueChange={setYtStyle}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {YOUTUBE_STYLES.map((s) => (
                            <SelectItem key={s.value} value={s.value} className="text-white hover:bg-slate-700">
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Color de texto</Label>
                      <Select value={ytTextColor} onValueChange={setYtTextColor}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="white">Blanco</SelectItem>
                          <SelectItem value="black">Negro</SelectItem>
                          <SelectItem value="yellow">Amarillo</SelectItem>
                          <SelectItem value="red">Rojo</SelectItem>
                          <SelectItem value="blue">Azul</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateYouTube}
                    disabled={isGenerating || !ytTitle.trim()}
                    className="w-full py-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generando miniatura...
                      </>
                    ) : (
                      <>
                        <Youtube className="w-5 h-5 mr-2" />
                        Generar miniatura
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Thumbnails */}
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Miniaturas recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {thumbnails.length === 0 ? (
                      <div className="text-center py-8">
                        <Youtube className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">Aún no has generado miniaturas</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {thumbnails.map((thumb) => (
                          <div
                            key={thumb.id}
                            className="relative group rounded-lg overflow-hidden cursor-pointer"
                          >
                            <img
                              src={`data:image/png;base64,${thumb.imageBase64}`}
                              alt={thumb.title}
                              className="w-full aspect-video object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDownload(thumb.imageBase64, thumb.title)}
                                className="text-white hover:text-white hover:bg-white/20"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Galería</h2>
                <p className="text-slate-400">Todas tus imágenes generadas</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-slate-700 text-slate-300">
                  {images.filter(i => i.isFavorite).length} favoritas
                </Badge>
              </div>
            </div>

            {images.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
                <CardContent className="py-12 text-center">
                  <Image className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Galería vacía</h3>
                  <p className="text-slate-400 mb-4">Genera tu primera imagen para comenzar</p>
                  <Button onClick={() => setActiveTab('generate')} className="bg-gradient-to-r from-violet-600 to-fuchsia-600">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generar imagen
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur overflow-hidden hover:border-violet-500/50 transition-colors">
                      <div className="relative aspect-square">
                        <img
                          src={`data:image/png;base64,${img.imageBase64}`}
                          alt={img.prompt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-xs text-white line-clamp-2">{img.prompt}</p>
                          </div>
                        </div>
                        {img.isFavorite && (
                          <div className="absolute top-2 right-2">
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-2">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                            {img.size}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setSelectedImage(img)}
                              className="h-7 w-7 text-slate-400 hover:text-white"
                            >
                              <Maximize2 className="w-3 h-3" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-slate-400 hover:text-white"
                                >
                                  <Settings className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                                <DropdownMenuItem
                                  onClick={() => handleDownload(img.imageBase64, `image-${img.id}`)}
                                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Descargar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleCopyPrompt(img.prompt)}
                                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copiar prompt
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleReusePrompt(img)}
                                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                                >
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Reutilizar prompt
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditImage(img)}
                                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Editar imagen
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteImage(img.id)}
                                  className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-violet-400" />
                  Vista previa
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-slate-800">
                  <img
                    src={`data:image/png;base64,${selectedImage.imageBase64}`}
                    alt={selectedImage.prompt}
                    className="w-full max-h-[60vh] object-contain mx-auto"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Prompt</Label>
                  <p className="text-sm text-slate-300">{selectedImage.prompt}</p>
                </div>
                {selectedImage.enhancedPrompt && (
                  <div className="space-y-2">
                    <Label className="text-slate-400">Prompt mejorado</Label>
                    <p className="text-xs text-slate-500">{selectedImage.enhancedPrompt}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(selectedImage.imageBase64, `image-${selectedImage.id}`)}
                    className="bg-violet-600 hover:bg-violet-500"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReusePrompt(selectedImage)}
                    className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reutilizar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEditImage(selectedImage)}
                    className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>Imagina AI — Crea imágenes increíbles con inteligencia artificial</p>
        </div>
      </footer>
    </div>
  );
}
