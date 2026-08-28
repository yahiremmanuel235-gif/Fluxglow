import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Lazy initialization for Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Healthcheck endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "FluxGlow", timestamp: new Date().toISOString() });
  });

  // Flux AI Conversational endpoint
  app.post(["/api/chat", "/api/gemini/chat"], async (req, res) => {
    try {
      const { message, history = [], userMood, context } = req.body;
      if (!message) {
        return res.status(400).json({ error: "El mensaje es requerido." });
      }

      const client = getGeminiClient();

      if (!client) {
        // Fallback intelligent emotional counselor response engine
        const fallbackResponses = generateFallbackAssistantResponse(message, userMood, context);
        return res.json({ response: fallbackResponses, isFallback: true });
      }

      const systemInstruction = `Eres Flux AI, el asistente virtual empático e inteligente de FluxGlow, una plataforma de bienestar emocional diseñada especialmente para jóvenes de 15 a 30 años.
Tu misión es acompañar, validar emociones con calidez, enseñar técnicas prácticas de regulación emocional (respiración, mindfulness, reestructuración cognitiva suave, autocompasión) y orientar sin juzgar.
Estado emocional actual del usuario reportado: "${userMood || 'No especificado'}".
Contexto adicional: "${context || 'Conversación en plataforma FluxGlow'}".

Pautas clave:
1. Sé cálido, empático, cercano y claro. Usa un tono comprensivo pero profesional.
2. Si detectas señales de crisis severa o ideación suicida, proporciona amablemente contención inmediata e invita a contactar a los números de emergencia y apoyo psicológico disponibles en la sección "Alerta Emocional" o al teléfono +503 7801-4680.
3. Ofrece pasos breves y concretos cuando el usuario exprese ansiedad, sobrepensamiento o estrés.
4. Responde en español y mantén tus respuestas concisas (2 a 4 párrafos dinámicos con viñetas cuando sea útil).`;

      const contents = [
        ...history.map((h: { role: string; content: string }) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({
        response: response.text || "Estoy aquí para escucharte y apoyarte en lo que necesites.",
        isFallback: false,
      });

    } catch (error: any) {
      console.error("Error in /api/gemini/chat:", error);
      // Fallback gracefully on any API failure
      const fallback = generateFallbackAssistantResponse(req.body.message, req.body.userMood);
      return res.json({ response: fallback, isFallback: true });
    }
  });

  // Emotional Entry Analysis Endpoint
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { text, mood, tags } = req.body;
      const client = getGeminiClient();

      if (!client || !text) {
        return res.json({
          analysis: {
            dominantEmotion: mood || "Reflexión",
            sentimentScore: 78,
            keywords: tags?.length ? tags : ["Autoconocimiento", "Paz interior", "Resiliencia"],
            aiInsight: "Identificamos una clara disposición al autoconocimiento y apertura. Mantener este hábito diario fortalecerá tu capacidad de gestionar tensiones.",
            suggestedAction: "Dedica 3 minutos a una respiración diafragmática 4-7-8 antes de continuar tus actividades."
          }
        });
      }

      const prompt = `Analiza la siguiente entrada de diario emocional de un usuario en FluxGlow:
Texto del usuario: "${text}"
Emoción seleccionada: "${mood}"
Etiquetas: "${tags?.join(', ')}"

Genera un breve análisis psicológico positivo y constructivo con formato JSON:
{
  "dominantEmotion": "emoción principal identificada",
  "sentimentScore": número entre 1 y 100 indicando nivel de balance y optimismo,
  "keywords": ["3", "palabras", "clave"],
  "aiInsight": "breve observación comprensiva de 2 oraciones",
  "suggestedAction": "una acción práctica recomendada inmediata"
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ analysis: parsed });
    } catch (err) {
      return res.json({
        analysis: {
          dominantEmotion: req.body.mood || "En balance",
          sentimentScore: 75,
          keywords: ["Consciencia", "Bienestar", "Crecimiento"],
          aiInsight: "Has registrado tus emociones con honestidad. Expresar lo que sientes es el primer paso para procesarlo de forma saludable.",
          suggestedAction: "Toma un vaso de agua y realiza 3 respiraciones profundas."
        }
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FluxGlow server running on http://0.0.0.0:${PORT}`);
  });
}

function generateFallbackAssistantResponse(message: string, mood?: string, _context?: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes("ansiedad") || lower.includes("nervios") || lower.includes("ansios")) {
    return `Comprendo profundamente lo desafiante que es sentir ansiedad en este momento. Recuerda que la ansiedad es una respuesta natural de alerta de tu cuerpo, no un peligro inminente ni algo permanente.

🌬️ **Ejercicio Rápido de Respiración 4-7-8**:
1. Inhala suavemente por la nariz contando mentalmente hasta 4.
2. Sostén el aire con calma contando hasta 7.
3. Exhala despacio por la boca en 8 tiempos como si soplaras una vela sin apagarla.

💡 *Pregúntate*: ¿Hay algo que esté bajo mi control inmediato en este minuto exacto? Si no, permítete soltarlo por hoy. Estoy aquí contigo para lo que necesites expresar.`;
  }

  if (lower.includes("triste") || lower.includes("llorar") || lower.includes("desánimo") || lower.includes("solo")) {
    return `Siento mucho que estés pasando por este momento de tristeza. Todas las emociones tienen un propósito, y la tristeza es una invitación amable a cuidarnos, descansar y ser comprensivos con nosotros mismos.

✨ **Paso suave para hoy**:
- No te exijas sentirte al 100% de inmediato; valida lo que sientes.
- Tómate una pausa, abrígate y toma algo tibio.
- Escribir lo que tienes en el pecho en nuestro **Diario Emocional** te ayudará a soltar peso mental.

¿Te gustaría que hagamos una meditación corta de 3 minutos o prefieres contarme más sobre lo que pasó?`;
  }

  if (lower.includes("estrés") || lower.includes("estres") || lower.includes("tarea") || lower.includes("examen") || lower.includes("trabajo")) {
    return `El estrés acumulado por exigencias académicas o personales puede sentirse abrumador. ¡Vamos a ordenar el flujo mental paso a paso!

📋 **Estrategia anti-sobrecarga FluxGlow**:
1. **Divide la montaña**: Elige solo UNA sola tarea pequeña para los próximos 20 minutos.
2. **Desconexión táctica**: Haz pausas de 5 minutos estirando cuello y hombros.
3. **Perspectiva**: Tu valor personal no depende de una nota ni de un día de alta demanda.

¿Quieres que armemos una rutina equilibrada para hoy?`;
  }

  if (lower.includes("medit") || lower.includes("calma") || lower.includes("relaj")) {
    return `¡Excelente decisión! Tomarte un instante para pausar transforma tu día.

🧘 **Micro-Meditación de Conexión (3 minutos)**:
- Cierra suavemente los ojos o baja la mirada.
- Siente los pies firmes sobre el suelo y suelta la tensión en la mandíbula y hombros.
- Con cada inhalación imagina una luz cálida y serena (*el brillo de FluxGlow*), y con cada exhalación libera cualquier peso.
- Quédate aquí durante 5 ciclos de respiración consciente.

¿Cómo sientes tu cuerpo ahora?`;
  }

  return `¡Hola! Gracias por compartirte conmigo. Como tu compañero en FluxGlow, estoy aquí para ayudarte a comprender lo que sientes, estructurar tus pensamientos o simplemente acompañarte en un espacio seguro.

Actualmente registras un estado: **${mood || 'en reflexión'}**. 

¿Te gustaría que hagamos un ejercicio de respiración consciente, exploremos tus detonantes de hoy, o que te recomiende un artículo o podcast de nuestro Centro de Aprendizaje?`;
}

startServer();
