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

      const contents = [
        ...history.map((h: { role?: string; sender?: string; content?: string; text?: string }) => ({
          role: (h.role === 'user' || h.sender === 'user') ? 'user' : 'model',
          parts: [{ text: h.content || h.text || '' }]
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

function generateFallbackAssistantResponse(message: string, mood?: string, context?: string): string {
  const lower = message.toLowerCase();
  const ctx = (context || '').toLowerCase();
  
  if (lower.includes("suicid") || lower.includes("quitarme la vida") || lower.includes("no quiero vivir") || lower.includes("hacerme daño")) {
    return `💙 **Estoy aquí contigo y lo que estás sintiendo importa mucho.**
Por favor, no atravieses este dolor en soledad. Hay personas capacitadas y dispuestas a escucharte con absoluto respeto y confidencialidad en este preciso momento:

- 📞 **Línea de Apoyo y Acompañamiento Emocional**: [+503 7801-4680](tel:+50378014680)
- 🚨 **Servicios de Emergencia Local**: Llama al 911 o acude al centro de salud más cercano.

Respira despacio. Tu vida tiene un valor inmenso y este momento de oscuridad profunda puede ser atendido y acompañado paso a paso.`;
  }

  if (ctx.includes("somatic") || lower.includes("somatic") || lower.includes("cuerpo") || lower.includes("respirar") || lower.includes("pecho apretado") || lower.includes("palpitaciones")) {
    return `🌿 **Regulación Somática en Tiempo Real**:
Cuando el cuerpo entra en estado de alerta, la corteza prefrontal pierde claridad. Necesitamos enviarle señales directas de seguridad a través del nervio vago.

1. **Suspiro Fisiológico**: Inhala hondo por la nariz, haz una segunda micro-inhalación arriba y exhala lentamente por la boca en un suspiro largo. Repítelo 3 veces.
2. **Descenso Muscular**: Suelta la lengua del paladar, baja los hombros y afloja conscientemente la mandíbula.
3. **Anclaje de Peso**: Siente el soporte firme del suelo bajo tus pies y el respaldo de la silla en tu espalda.

¿Cómo sientes la tensión en tu cuerpo tras estas tres respiraciones?`;
  }

  if (ctx.includes("reframe") || lower.includes("reframe") || lower.includes("sobrepensando") || lower.includes("rumiacion") || lower.includes("rumiación") || lower.includes("pensar de más")) {
    return `🧠 **Reencuadre Cognitivo (TCC & Claridad Mental)**:
El sobrepensamiento suele ser un intento de la mente por controlar la incertidumbre futura. Sin embargo, pensar más no siempre significa resolver mejor.

🔍 **Filtro de Desactivación de Rumiación**:
1. **Diferencia Hechos de Interpretaciones**: ¿Esto que temes es un hecho comprobable en este instante, o es una predicción de tu mente asustada?
2. **El Escenario Realista**: Si el peor escenario ocurriera, ¿qué recursos y apoyos tendrías para afrontarlo?
3. **Regla de la Utilidad**: ¿Pensar en esto por los próximos 10 minutos cambiará el resultado o solo agotará tu batería emocional?

¿Qué pensamiento concreto te está dando más vueltas en este momento? Si me lo compartes, lo examinamos juntos con calma.`;
  }

  if (lower.includes("flojera") || lower.includes("procrastin") || lower.includes("motivo") || lower.includes("empezar mi tarea") || lower.includes("tarea") || ctx.includes("action")) {
    return `Es completamente normal experimentar esa resistencia mental. En psicología sabemos que la mal llamada "flojera" suele ser una respuesta del cerebro a la fatiga, a una tarea percibida como abrumadora o al miedo a no hacerla perfecto.

⚡ **Técnica del Micropaso de 2 Minutos**:
1. **Reduce la meta a lo ridículamente fácil**: No pienses en terminar toda la tarea. Tu único objetivo en este momento es abrir el archivo o colocar el cuaderno en la mesa.
2. **Quita la fricción ambiental**: Pon tu teléfono fuera de tu vista y sirve un vaso de agua fresca.
3. **Compromiso mínimo**: Trabaja solo 5 minutos seguidos con cronómetro. El 80% de las veces, romper la inercia inicial es suficiente para continuar.

¿De qué tema o materia es lo que necesitas avanzar hoy? Si me cuentas, te ayudo a desglosarlo en 3 pasos muy pequeños.`;
  }

  if (lower.includes("15 minutos") || lower.includes("plan de acción") || lower.includes("plan")) {
    return `¡Me parece un excelente plan! Establecer un bloque de tiempo acotado le envía a tu cerebro una señal de alivio porque sabe que el esfuerzo tiene un final inmediato.

⏱️ **Protocolo de Enfoque Relámpago de 15 Minutos**:
- **Minutos 0 a 2 (Claridad)**: Elige solo UN entregable concreto (ej. redactar un párrafo, revisar 5 diapositivas o responder 2 correos urgentes).
- **Minutos 3 a 12 (Inmersión sin interrupciones)**: Trabaja en modo avión. Si surge una idea dispersa, anótala en un papel al lado y continúa.
- **Minutos 13 a 15 (Cierre y dopamina)**: Detén el cronómetro, tacha lo avanzado y haz 3 respiraciones profundas.

¿Cuál es ese primer objetivo específico al que le dedicaremos estos 15 minutos?`;
  }

  if (lower.includes("organizar") || lower.includes("pendientes") || lower.includes("no estresarme")) {
    return `Cuando tenemos muchos pendientes en la cabeza, la memoria de trabajo se satura y se dispara la sensación de agobio. Para recuperar la tranquilidad, necesitamos sacarlo todo de la mente hacia el papel.

📋 **Estrategia de Descarga Mental 1-3-5**:
1. **1 Tarea Crucial**: Aquella que si la terminas hoy, te vas a dormir sintiendo que tu día valió la pena.
2. **3 Tareas Medias**: Pendientes necesarios pero manejables en 20 minutos cada uno.
3. **5 Tareas Menores**: Cosas rápidas (enviar un mensaje, pagar algo, ordenar tu mesa).

Todo lo que no quepa en esta lista queda formalmente programado para mañana sin culpa. ¿Quieres que ordenemos tus pendientes actuales con esta fórmula?`;
  }

  if (lower.includes("ansiedad") || lower.includes("nervios") || lower.includes("panico") || lower.includes("pánico") || lower.includes("ansios")) {
    return `Siento que estés experimentando esta activación tan intensa. Lo primero que quiero que recuerdes es: **esto es una respuesta biológica temporal del sistema nervioso simpático, no estás en peligro real y va a pasar**.

🫁 **Hagamos juntos el Suspiro Fisiológico (la técnica neuroquímica más rápida)**:
1. Inhala profundo por la nariz llenando el abdomen.
2. Al llegar arriba, toma una segunda inhalación corta por la nariz sin soltar el aire.
3. Exhala muy despacio por la boca con un suspiro largo y relajado.
*Repite esto 3 veces ahora mismo mientras me lees.*

🌿 **Anclaje al presente (Técnica 3-3-3)**:
- Nombra mentalmente 3 cosas que puedas ver a tu alrededor.
- Identifica 3 sonidos presentes en este instante.
- Mueve 3 partes de tu cuerpo (tobillos, dedos de las manos, cuello).

¿Cómo sientes tu respiración ahora? Estoy aquí contigo.`;
  }

  if (lower.includes("triste") || lower.includes("llorar") || lower.includes("desánimo") || lower.includes("solo") || lower.includes("soledad") || lower.includes("vacio") || lower.includes("vacío")) {
    return `Gracias por abrirte y confiar en este espacio. Quiero validar lo que sientes: la tristeza no es un defecto ni un error que debas arreglar a la fuerza; es una respuesta biológica que pide descanso, ternura y un trato amable hacia ti mismo.

🤍 **Recordatorios de compasión para hoy**:
- No te exijas fingir entusiasmo ni rendir al 100% si tus reservas de energía están bajas.
- Abrígate, bebe algo tibio y date permiso de tomar una pausa sin culpa.
- Tu valor como persona sigue exactamente intacto, incluso en los días donde todo se siente gris.

Si sientes ganas de contarme qué detonó este sentimiento o qué pesa en tu mente, te leo con total respeto y sin juicios. ¿Prefieres desahogarte o te gustaría que hagamos una práctica suave de calma?`;
  }

  if (lower.includes("dormir") || lower.includes("insomnio") || lower.includes("noche") || lower.includes("desvelo") || ctx.includes("sleep")) {
    return `Tener dificultades para conciliar el sueño suele ocurrir cuando la mente intenta resolver los problemas del día en la oscuridad.

🌙 **Ritual de Apagado Mental para esta noche**:
1. **Descarga en papel**: Escribe en un cuaderno 3 cosas que te preocupan y añade al lado: *"Lo resolveré mañana a las 10:00 AM"*. Cerrar el cuaderno le envía a la amígdala la señal de que está a salvo de olvidar.
2. **Disminuye la estimulación lumínica**: Pon tu pantalla en modo noche cálido y baja el brillo al mínimo.
3. **Respiración 4-7-8**: Inhala en 4 segundos, sostén 7 segundos y exhala suavemente en 8 segundos por 4 ciclos.

¿Te gustaría que te guíe en una relajación progresiva para preparar el descanso?`;
  }

  return `Hola. Es un gusto acompañarte en FluxGlow. Estoy aquí para ofrecerte un espacio de escucha genuina, orden mental y herramientas prácticas sin juicios.

${mood ? `Veo que tu registro anímico reciente es: **${mood}**.` : ''}

💡 **¿En qué te gustaría que enfoquemos nuestra conversación?**
- 🫁 Regular ansiedad o sobrepensamiento con técnicas somáticas.
- ⚡ Vencer el bloqueo mental y organizar una tarea específica en micropasos.
- 🧠 Reencuadrar un pensamiento que te esté generando malestar con TCC.
- 💬 Simplemente conversar y desahogarte sobre cómo ha ido tu día.

Dime con total libertad qué necesitas en este instante.`;
}

startServer();
