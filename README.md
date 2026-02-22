# Imagina AI - Generador de Imágenes con IA

Aplicación moderna para generar imágenes con inteligencia artificial desde texto.

## ✨ Funcionalidades

- **Generación de imágenes desde texto** - Escribe un prompt y genera imágenes de alta calidad
- **Personajes consistentes** - Crea personajes que mantienen su apariencia
- **Sistema de marcas** - Define estilos de marca para imágenes consistentes
- **Miniaturas YouTube** - Genera thumbnails optimizados
- **Galería histórica** - Visualiza, descarga y reutiliza imágenes

## 🚀 Uso Inmediato

La aplicación está lista para usar. Los datos se almacenan en memoria durante la sesión.

### Generar una imagen:
1. Ve a la pestaña **"Generar"**
2. Escribe una descripción (ej: "Un gato astronauta en el espacio")
3. Selecciona el tamaño
4. Presiona **"Generar imagen"**
5. Espera ~30 segundos

## 📱 Publicar la aplicación

### Opción 1: Firebase App Hosting (Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Firestore Database**
4. Ve a **Build > App Hosting**
5. Conecta tu repositorio de GitHub
6. Configura las variables de entorno (opcional para Firestore público)
7. Deploy automático

### Opción 2: Vercel

1. Conecta tu repositorio a Vercel
2. Deploy automático

### Opción 3: Otros servicios

La aplicación funciona en cualquier plataforma que soporte Next.js:
- Railway
- Render
- Netlify
- etc.

## 🔧 Configuración de Firestore (Para producción)

Para persistencia de datos en producción:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firestore Database
3. Configura las reglas de seguridad en `firestore.rules`
4. Los archivos de configuración ya están incluidos:
   - `firebase.json`
   - `firestore.rules`
   - `firestore.indexes.json`

## 🛠️ Tecnologías

- **Framework**: Next.js 16 con App Router
- **Lenguaje**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand
- **IA**: z-ai-web-dev-sdk
- **Base de datos**: Memoria (desarrollo) / Firestore (producción)

## 📝 Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── generate/         # API de generación
│   │   ├── images/           # CRUD de imágenes
│   │   ├── characters/       # CRUD de personajes
│   │   ├── brands/           # CRUD de marcas
│   │   └── youtube/          # Miniaturas YouTube
│   └── page.tsx              # Interfaz principal
├── lib/
│   └── store/
│       └── memory.ts         # Almacenamiento en memoria
└── types/
    └── index.ts              # Tipos TypeScript
```

## 🎨 Tamaños de Imagen

| Tamaño | Uso |
|--------|-----|
| 1024x1024 | Redes sociales |
| 1344x768 | YouTube (16:9) |
| 1440x720 | Banners |
| 768x1344 | Stories/Reels |
| 864x1152 | Posts verticales |
| 1152x864 | Horizontal general |
| 720x1440 | Infografías |

## 📄 Licencia

MIT
