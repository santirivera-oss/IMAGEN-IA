import { serve } from 'bun';
import ZAI from 'z-ai-web-dev-sdk';
import { Database } from 'bun:sqlite';
import { join } from 'path';

const PORT = 3030;
const DB_PATH = join(import.meta.dir, '../../db/custom.db');

// Open database connection
const db = new Database(DB_PATH);

// Cache ZAI instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Helper to generate unique ID
function generateId(): string {
  return 'img_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', service: 'image-generator' }, { headers: corsHeaders });
    }

    // Generate image endpoint
    if (url.pathname === '/generate' && method === 'POST') {
      try {
        const body = await req.json();
        const {
          prompt,
          size = '1024x1024',
          style,
          mood,
          lighting,
          characterId,
          brandId,
          type = 'text-to-image',
        } = body;

        if (!prompt || typeof prompt !== 'string') {
          return Response.json(
            { error: 'Prompt is required' },
            { status: 400, headers: corsHeaders }
          );
        }

        // Validate size
        const validSizes = ['1024x1024', '768x1344', '864x1152', '1344x768', '1152x864', '1440x720', '720x1440'];
        if (!validSizes.includes(size)) {
          return Response.json(
            { error: `Invalid size. Valid sizes: ${validSizes.join(', ')}` },
            { status: 400, headers: corsHeaders }
          );
        }

        // Build enhanced prompt
        let enhancedPrompt = prompt;

        // Add character context if provided
        if (characterId) {
          const query = db.query('SELECT * FROM Character WHERE id = ?');
          const character = query.get(characterId) as any;
          if (character) {
            enhancedPrompt = `${character.basePrompt}, ${prompt}`;
            if (character.styleNotes) {
              enhancedPrompt += `, ${character.styleNotes}`;
            }
          }
        }

        // Add brand context if provided
        if (brandId) {
          const query = db.query('SELECT * FROM Brand WHERE id = ?');
          const brand = query.get(brandId) as any;
          if (brand) {
            if (brand.styleGuide) {
              enhancedPrompt += `, ${brand.styleGuide}`;
            }
            if (brand.moodKeywords) {
              enhancedPrompt += `, ${brand.moodKeywords}`;
            }
          }
        }

        // Add style modifiers
        if (style && style.trim()) {
          enhancedPrompt += `, ${style} style`;
        }
        if (mood && mood.trim()) {
          enhancedPrompt += `, ${mood} mood`;
        }
        if (lighting && lighting.trim()) {
          enhancedPrompt += `, ${lighting} lighting`;
        }

        // Add quality boosters
        enhancedPrompt += ', high quality, detailed, professional';

        console.log(`[${new Date().toISOString()}] Generating image with prompt: ${enhancedPrompt.substring(0, 100)}...`);

        // Get ZAI instance
        const zai = await getZAI();

        // Generate image
        const response = await zai.images.generations.create({
          prompt: enhancedPrompt,
          size: size as any,
        });

        if (!response.data || !response.data[0] || !response.data[0].base64) {
          throw new Error('Invalid response from image generation API');
        }

        const imageBase64 = response.data[0].base64;
        const imageId = generateId();
        const now = new Date().toISOString();

        // Save to database
        const insertQuery = db.query(`
          INSERT INTO Image (id, prompt, enhancedPrompt, imageBase64, size, style, mood, lighting, type, characterId, brandId, isFavorite, createdAt, updatedAt)
          VALUES ($id, $prompt, $enhancedPrompt, $imageBase64, $size, $style, $mood, $lighting, $type, $characterId, $brandId, 0, $createdAt, $updatedAt)
        `);
        insertQuery.run({
          $id: imageId,
          $prompt: prompt,
          $enhancedPrompt: enhancedPrompt,
          $imageBase64: imageBase64,
          $size: size,
          $style: style || null,
          $mood: mood || null,
          $lighting: lighting || null,
          $type: type,
          $characterId: characterId || null,
          $brandId: brandId || null,
          $createdAt: now,
          $updatedAt: now,
        });

        console.log(`[${new Date().toISOString()}] Image generated successfully: ${imageId}`);

        return Response.json({
          success: true,
          image: {
            id: imageId,
            prompt,
            enhancedPrompt,
            size,
            style: style || null,
            mood: mood || null,
            lighting: lighting || null,
            type,
            createdAt: now,
            imageBase64,
          },
        }, { headers: corsHeaders });

      } catch (error) {
        console.error('Image generation error:', error);
        return Response.json(
          { error: error instanceof Error ? error.message : 'Failed to generate image' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // YouTube thumbnail endpoint
    if (url.pathname === '/youtube' && method === 'POST') {
      try {
        const body = await req.json();
        const { title, description, style, textColor } = body;

        if (!title) {
          return Response.json(
            { error: 'Title is required' },
            { status: 400, headers: corsHeaders }
          );
        }

        // Build optimized prompt
        let prompt = `YouTube thumbnail, eye-catching, vibrant colors, professional design, "${title}" text prominently displayed,`;

        if (style) {
          const styleMap: Record<string, string> = {
            gaming: 'gaming aesthetic, neon colors, dynamic action, bold graphics',
            tech: 'tech review style, clean modern design, gadgets, futuristic',
            lifestyle: 'lifestyle vlog style, warm colors, friendly, authentic',
            educational: 'educational style, clean infographic elements, professional',
            entertainment: 'entertainment style, fun colors, expressive faces',
            dramatic: 'dramatic style, high contrast, cinematic lighting',
            minimalist: 'minimalist design, clean space, simple composition',
          };
          prompt += ` ${styleMap[style] || style},`;
        }

        if (textColor) {
          prompt += ` ${textColor} accent colors,`;
        }

        prompt += ' high quality, attention-grabbing';

        if (description) {
          prompt += `, ${description}`;
        }

        console.log(`[${new Date().toISOString()}] Generating YouTube thumbnail...`);

        const zai = await getZAI();

        const response = await zai.images.generations.create({
          prompt,
          size: '1344x768',
        });

        if (!response.data || !response.data[0] || !response.data[0].base64) {
          throw new Error('Invalid response from image generation API');
        }

        const imageBase64 = response.data[0].base64;
        const thumbId = generateId();
        const now = new Date().toISOString();

        // Save to database
        const insertQuery = db.query(`
          INSERT INTO YoutubeThumbnail (id, title, description, prompt, imageBase64, size, style, textColor, createdAt, updatedAt)
          VALUES ($id, $title, $description, $prompt, $imageBase64, '1344x768', $style, $textColor, $createdAt, $updatedAt)
        `);
        insertQuery.run({
          $id: thumbId,
          $title: title,
          $description: description || null,
          $prompt: prompt,
          $imageBase64: imageBase64,
          $style: style || null,
          $textColor: textColor || null,
          $createdAt: now,
          $updatedAt: now,
        });

        return Response.json({
          success: true,
          thumbnail: {
            id: thumbId,
            title,
            prompt,
            imageBase64,
            createdAt: now,
          },
        }, { headers: corsHeaders });

      } catch (error) {
        console.error('YouTube thumbnail error:', error);
        return Response.json(
          { error: error instanceof Error ? error.message : 'Failed to generate thumbnail' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // 404 for other routes
    return Response.json(
      { error: 'Not found' },
      { status: 404, headers: corsHeaders }
    );
  },
  idleTimeout: 255, // Keep connections alive
});

console.log(`🖼️ Image Generator Service running on port ${PORT}`);
console.log(`📡 Health check: http://localhost:${PORT}/health`);
console.log(`🎨 Generate endpoint: POST http://localhost:${PORT}/generate`);
