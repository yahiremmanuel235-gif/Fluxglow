import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Método no permitido. Utilice POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Falta GEMINI_API_KEY" });
  }

  try {
    const text = (req.body.text || req.body.entryText || "").trim();
    const mood = req.body.mood;
    const tags = req.body.tags;

    if (!text) {
      return res.status(400).json({ error: "BAD_REQUEST", message: "El texto de la entrada es requerido para el análisis." });
    }

    const aiClient = new GoogleGenAI({ apiKey });

    const prompt = `Analiza la siguiente entrada de diario emocional de un usuario en FluxGlow:
Texto del usuario: "${text}"
Emoción seleccionada: "${mood || 'No especificada'}"
Etiquetas: "${tags ? tags.join(', ') : 'Ninguna'}"

Genera un breve análisis psicológico positivo y constructivo con formato JSON:
{
  "dominantEmotion": "emoción principal identificada",
  "sentimentScore": número entre 1 y 100 indicando nivel de balance y optimismo,
  "keywords": ["3", "palabras", "clave"],
  "aiInsight": "breve observación comprensiva de 2 oraciones",
  "suggestedAction": "una acción práctica recomendada inmediata"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text);
      if (parsed && (parsed.dominantEmotion || parsed.aiInsight)) {
        return res.status(200).json({ analysis: parsed });
      }
    }

    throw new Error("No se pudo generar un análisis JSON válido.");

  } catch (error: any) {
    console.error("[Flux AI] Error crítico en /api/gemini/analyze:", error);
    
    return res.status(500).json({ 
      error: "GEMINI_ERROR", 
      message: error.message || String(error)
    });
  }
}
