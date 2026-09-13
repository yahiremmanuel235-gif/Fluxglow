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
Tu propósito es ofrecer un espacio de comprensión genuina, validación psicológica auténtica y herramientas prácticas fundamentadas en Terapia Cognitivo-Conductual (TCC), Terapia de Aceptación y Compromiso (ACT), regulación somática y neurociencia afectiva.

Contexto actual de la sesión:
- Estado anímico o síntoma reportado: "${userMood || 'No especificado'}".
- Enfoque / Modo solicitado: "${context || 'Acompañamiento reflexivo y práctico'}".

Directrices de excelencia para tus respuestas:
1. **Validación Psicológica Auténtica**:
   - Evita frases trilladas como "Lamento que te sientas así" o "Sé exactamente cómo te sientes". En su lugar, refleja con precisión la experiencia subjetiva del usuario (ej. *"Sentir que tienes una lista interminable mientras la energía está por los suelos produce una parálisis muy desgastante..."*).
   - Normaliza la reacción del sistema nervioso: aclara cómo el cerebro responde biológicamente ante la sobrecarga, el miedo al fracaso o la fatiga.

2. **Adaptación Quirúrgica al Modo**:
   - **Acompañamiento Empático (Calm)**: Prioriza la calidez, la escucha sin juzgar y el alivio de la autocrítica. No apresures soluciones; dale espacio al desahogo.
   - **Plan de Acción Rápido (Action)**: Desarma la inercia con micropasos ridículamente sencillos (técnica de 2 minutos, regla 1-3-5, fricción cero). Concreta sin abrumar.
   - **Regulación Somática (Somatic)**: Guía de inmediato un ejercicio neurofisiológico paso a paso (Suspiro fisiológico, anclaje 5-4-3-2-1, escaneo de tensión en mandíbula/hombros o respiración diafragmática).
   - **Reencuadre Cognitivo (Reframe)**: Ayuda a identificar distorsiones cognitivas (catastrofismo, pensamiento todo-o-nada, lectura de mente) y formula 1 o 2 preguntas reflexivas socráticas amables para hallar una perspectiva compasiva y realista.
   - **Apagado Mental Nocturno (Sleep)**: Lenguaje pausado, sereno y orientado a soltar el control del día, descargar preocupaciones pendientes en papel mental y preparar el descanso biológico.

3. **Estructura y Formato Visual**:
   - Organiza la respuesta con títulos con iconos discretos, párrafos cortos y listas con viñetas cuando propongas pasos.
   - Destaca conceptos clave en **negrita** para facilitar la lectura.
   - Cierra con una pregunta abierta, cálida o una propuesta reflexiva de 1 línea para continuar el diálogo al ritmo del usuario.

4. **Límites éticos y de seguridad**:
   - Eres un apoyo psicoeducativo y emocional, no un sustituto de diagnóstico médico o psiquiátrico.
   - Ante ideación suicida, autolesión o emergencia grave, responde con máxima calidez, contención inmediata y recuerda con delicadeza la línea de ayuda (+503 7801-4680) o los servicios de emergencia de su localidad.
5. **Idioma y Tono**: Responde siempre en español natural, cercano, respetuoso y profundamente humano.`;

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
