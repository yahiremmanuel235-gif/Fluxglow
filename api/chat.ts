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
    const { message, history = [], userMood, context } = req.body || {};
    
    if (!message) {
      return res.status(400).json({ error: "BAD_REQUEST", message: "El mensaje es requerido." });
    }

    const systemInstruction = `Eres Flux AI, el acompañante conversacional experto en bienestar emocional y psicología práctica de FluxGlow (diseñado para jóvenes y adultos de 15 a 35 años).
Tu propósito es ofrecer comprensión genuina, validación psicológica auténtica y herramientas prácticas fundamentadas en Terapia Cognitivo-Conductual (TCC), Terapia de Aceptación y Compromiso (ACT), regulación somática y neurociencia afectiva.

Contexto actual de la sesión:
Estado anímico o síntoma reportado: "${userMood || 'No especificado'}".
Enfoque / Modo solicitado: "${context || 'Acompañamiento reflexivo y práctico'}".

Directrices estrictas para tus respuestas:

REGLAS DE FORMATO (SIN MARKDOWN - MUY IMPORTANTE):
NUNCA utilices asteriscos dobles, asteriscos simples ni guiones bajos para dar formato al texto. Nada de negritas ni cursivas.
NUNCA utilices guiones triples, asteriscos triples ni líneas horizontales divisorias.
NUNCA utilices viñetas (asteriscos, guiones, signos de suma) para hacer listas. Si necesitas listar puntos, usa números consecutivos (1., 2., 3.) o escribe en párrafos continuos separados por saltos de línea normales.
Devuelve todas las respuestas exclusivamente en TEXTO PLANO LIMPIO. No uses etiquetas HTML.

TONO Y ESTILO:
Mantén un tono de conversación cercano, humano y fluido.
Elimina por completo clichés robóticos como "espacio seguro", "modo calma", o "estoy aquí para ti". Habla como una persona real.
Evita frases trilladas como "Lamento que te sientas así". En su lugar, refleja con precisión la experiencia subjetiva del usuario.

LONGITUD:
Mantén tus respuestas breves y concisas. Usa un máximo de 2 o 3 párrafos cortos. No te extiendas innecesariamente.

LIMITES ETICOS:
Eres un apoyo psicoeducativo, no un sustituto de diagnóstico médico o psiquiátrico. Ante ideación suicida o emergencia grave, responde con máxima calidez y recuerda la línea de ayuda local.
Responde siempre en español.`;

    const aiClient = new GoogleGenAI({ apiKey });

    // Sanitizar y formatear el historial
    const formattedContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

    if (Array.isArray(history)) {
      for (const h of history) {
        const rawText = 
          typeof h === 'string' ? h :
          (h.content || h.text || (Array.isArray(h.parts) && h.parts[0]?.text) || '');
        
        const cleanText = typeof rawText === 'string' ? rawText.trim() : '';
        if (cleanText) {
          const role = (h.role === 'user' || h.sender === 'user') ? 'user' : 'model';
          formattedContents.push({
            role,
            parts: [{ text: cleanText }]
          });
        }
      }
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: message.trim() }]
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    if (response && response.text) {
      return res.status(200).json({
        response: response.text,
        isFallback: false,
      });
    }

    throw new Error("No se pudo generar una respuesta con el modelo gemini-3.6-flash.");

  } catch (error: any) {
    console.error("[Flux AI] Error crítico en /api/chat Gemini call:", error);
    
    return res.status(500).json({ 
      error: "GEMINI_ERROR", 
      message: error.message || String(error)
    });
  }
}
