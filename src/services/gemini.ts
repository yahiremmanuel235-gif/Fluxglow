/**
 * FluxGlow Gemini AI Service
 * Utiliza @google/genai y VITE_GEMINI_API_KEY para proporcionar
 * asistencia empática de salud mental y bienestar emocional.
 */

import { GoogleGenAI } from '@google/genai';

// System Prompt especializado en acompañamiento empático de salud mental
export const FLUX_AI_SYSTEM_PROMPT = `Eres Flux AI, un asistente y compañero empático de salud mental, bienestar psicológico y regulación emocional integrado en la plataforma FluxGlow.

Tu misión es brindar un espacio seguro, comprensivo, cálido y libre de juicios para personas que buscan claridad, apoyo ante la ansiedad, sobrepensamiento, estrés, agotamiento o tristeza, así como herramientas prácticas de autocuidado.

Principios fundamentales de acompañamiento:
1. **Validación Emocional Primero**: Reconoce y normaliza las emociones del usuario con calidez humana antes de ofrecer soluciones. Evita el positivismo tóxico o minimizar lo que siente.
2. **Fundamentación Científica y Accesible**: Utiliza principios basados en Terapia Cognitivo-Conductual (TCC), Terapia de Aceptación y Compromiso (ACT), regulación del sistema nervioso y mindfulness. Explica conceptos de forma sencilla y desestigmatizante.
3. **Herramientas Prácticas y Micro-Pasos**: Ofrece ejercicios de bajo esfuerzo cognitivo (respiración diafragmática, suspiro fisiológico, técnica 5-4-3-2-1, preguntas de reencuadre o desgloses en tareas de 2 minutos).
4. **Formato Claro y Legible**: Estructura tus respuestas con espaciado agradable, subtítulos o viñetas cuando sea útil para reducir la fatiga mental del usuario.
5. **Preguntas Reflexivas**: Cierra habitualmente con una pregunta abierta, suave y no invasiva que invite a la autoobservación compasiva.
6. **Límites de Seguridad y Ética**: Recuerda que eres una herramienta de apoyo y psicoeducación. En situaciones de crisis aguda, daño autoinfligido o emergencia médica, guía con delicadeza al usuario para contactar a un profesional de salud o una línea de ayuda especializada local.`;

export interface ChatMessageHistoryItem {
  role: 'user' | 'model';
  text: string;
}

export interface SendChatMessageParams {
  message: string;
  history?: ChatMessageHistoryItem[];
  mode?: string;
  userMood?: string;
  userContext?: {
    name?: string;
    ageGroup?: string;
    emotionalState?: string;
  };
}

/**
 * Obtiene o inicializa el cliente de Gemini utilizando VITE_GEMINI_API_KEY
 */
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.warn('Error al inicializar GoogleGenAI con VITE_GEMINI_API_KEY:', error);
    return null;
  }
}

/**
 * Genera la respuesta del asistente empático Flux AI
 * Primero intenta llamar directamente al SDK de Gemini con VITE_GEMINI_API_KEY.
 * Si la clave no está presente o el modelo experimenta alta demanda, recurre a la API interna del servidor /api/chat.
 */
export async function sendChatMessageToGemini(params: SendChatMessageParams): Promise<string> {
  const { message, history = [], mode = 'calm', userMood = '', userContext } = params;
  const client = getGeminiClient();

  const enrichedSystemInstruction = `${FLUX_AI_SYSTEM_PROMPT}

Contexto actual de la sesión:
- Modo de interacción seleccionado: ${mode}
- Estado de ánimo reportado: ${userMood || 'No especificado'}
${userContext?.name ? `- Nombre del usuario: ${userContext.name}` : ''}
${userContext?.ageGroup ? `- Grupo de edad: ${userContext.ageGroup}` : ''}
Adapta tu tono al modo (${mode}) manteniendo siempre la empatía, claridad y calidez.`;

  // Intento 1: Llamada directa con el cliente @google/genai si existe VITE_GEMINI_API_KEY
  if (client) {
    const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Agregar historial previo
    if (history && history.length > 0) {
      history.slice(-8).forEach(item => {
        formattedContents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        });
      });
    }

    // Agregar el mensaje actual del usuario
    formattedContents.push({
      role: 'user',
      parts: [{ text: message.trim() }]
    });

    const modelsToTry = ['gemini-3.7-flash', 'gemini-3.1-flash-lite'];

    for (const model of modelsToTry) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: formattedContents,
          config: {
            systemInstruction: enrichedSystemInstruction,
            temperature: 0.7,
          }
        });

        if (response && response.text && response.text.trim().length > 0) {
          return response.text.trim();
        }
      } catch (err: any) {
        console.warn(`Intento directo con ${model} falló:`, err?.status || err?.message || err);
      }
    }
  }

  // Intento 2: Proxy a /api/chat del servidor (utiliza GEMINI_API_KEY del backend con resiliencia y fallback)
  try {
    const serverRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        userMood,
        context: `Modo: ${mode}. Estado: ${userMood}. Usuario: ${userContext?.name || 'Amigo de FluxGlow'}.`,
        userContext,
        history: history.map(h => ({
          role: h.role,
          parts: [{ text: h.text }]
        }))
      })
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data.response && data.response.trim().length > 0) {
        return data.response.trim();
      }
    }
  } catch (proxyErr) {
    console.warn('Fallo en la comunicación con /api/chat:', proxyErr);
  }

  // Intento 3: Fallback local contextual de alta calidad
  return generateClientLocalFallback(message, mode, userMood);
}

/**
 * Analiza una entrada de diario para identificar emociones, distorsiones cognitivas y sugerencias
 */
export async function analyzeJournalWithGemini(entryText: string): Promise<any> {
  const client = getGeminiClient();

  const prompt = `Analiza la siguiente entrada de diario emocional y devuelve un JSON estricto con:
{
  "dominantEmotion": "emoción principal detectada",
  "intensityScore": 7,
  "cognitiveDistortions": ["catastrofismo", "pensamiento todo o nada"],
  "aiInsight": "una reflexión breve y empática de 2 oraciones",
  "suggestedAction": "una acción práctica recomendada inmediata"
}

Texto del diario: "${entryText}"`;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      });

      if (response && response.text) {
        return JSON.parse(response.text);
      }
    } catch (e) {
      console.warn('Fallo en análisis directo de diario:', e);
    }
  }

  try {
    const res = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryText })
    });
    if (res.ok) {
      const data = await res.json();
      return data.analysis;
    }
  } catch {
    // fallback
  }

  return {
    dominantEmotion: "Reflexión profunda",
    intensityScore: 6,
    cognitiveDistortions: [],
    aiInsight: "Identificamos una oportunidad para pausar y respirar conscientemente.",
    suggestedAction: "Toma 3 respiraciones profundas y anota 1 cosa positiva del día."
  };
}

/**
 * Fallback contextual si la red no está disponible
 */
function generateClientLocalFallback(message: string, mode: string, mood?: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('ansiedad') || lower.includes('ansioso') || lower.includes('pánico') || lower.includes('nervios')) {
    return `Comprendo profundamente lo incómoda e intensa que puede sentirse la ansiedad en el cuerpo y la mente. 

Cuando la mente se acelera, nuestro sistema nervioso entra en modo de alerta. Probemos un ejercicio de anclaje rápido:

1. **Suspiro Fisiológico**: Inhala hondo por la nariz, toma un segundo aire extra al final, y exhala muy lentamente por la boca. Hazlo 3 veces.
2. **Técnica 3-2-1**: Mira a tu alrededor y nombra 3 cosas que puedas ver, 2 que puedas tocar con tus manos y 1 sonido que alcances a escuchar.

Recuerda: esta sensación es temporal y tu cuerpo sabe cómo volver a la calma paso a paso. ¿Cómo se siente tu respiración en este instante?`;
  }

  if (lower.includes('abrumado') || lower.includes('estrés') || lower.includes('muchas cosas') || lower.includes('trabajo')) {
    return `Es completamente natural sentirse abrumado cuando las demandas superan nuestra energía del momento.

Para despejar la carga mental, te sugiero la **Técnica de Fricción Cero**:
- Elige una única acción que te tome menos de 2 minutos.
- Permítete pausar todo lo demás durante ese breve lapso.
- Recuerda que no necesitas resolver toda la semana hoy, solo el siguiente paso inmediato.

¿Te gustaría que dividamos lo que tienes pendiente en pasos muy pequeños y manejables?`;
  }

  return `Gracias por compartir esto conmigo. En FluxGlow estamos aquí para escucharte y acompañarte con calma y claridad.

Tómate un momento para inhalar profundo y soltar los hombros. No tienes que tener todas las respuestas resueltas en este momento. 

¿Qué es lo que más te ayudaría a sentir un poco más de alivio o claridad ahora mismo?`;
}
