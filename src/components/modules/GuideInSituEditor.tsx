import React, { useState, useRef } from 'react';
import { 
  X, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Image as ImageIcon, 
  Quote, 
  HelpCircle, 
  MessageSquare, 
  Timer, 
  Award, 
  FileText, 
  ShieldCheck, 
  User, 
  ExternalLink,
  Layers,
  Eye,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  Info,
  Lightbulb,
  CheckCircle2,
  Lock,
  CornerDownRight,
  ListPlus
} from 'lucide-react';
import { 
  GuideItem, 
  GuideBlock, 
  GuideBlockType, 
  GuideAuthor, 
  GuideReference, 
  GuideDailyMission,
  GuideExplainedSection,
  GlossaryItem
} from '../../types';
import { saveOrUpdateSupabaseGuide, uploadGuideCoverImage } from '../../services/supabaseService';
import { useToast } from '../common/Toast';

interface GuideInSituEditorProps {
  initialGuide?: GuideItem | null;
  onClose: () => void;
  onSaved: (savedGuide: GuideItem) => void;
}

const CATEGORIES = [
  'Ansiedad',
  'Estrés',
  'Procrastinación',
  'Autoestima',
  'Mindfulness',
  'Sueño Reparador',
  'Inteligencia Emocional',
  'Relaciones Sanas',
  'Productividad Consciente',
  'Duelo y Pérdida'
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const GuideInSituEditor: React.FC<GuideInSituEditorProps> = ({
  initialGuide,
  onClose,
  onSaved
}) => {
  const { success, error: toastError, warning, info } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. BLOQUE FIJO: Encabezado y Metadatos
  const [guideType, setGuideType] = useState<'quick' | 'weekly'>(initialGuide?.guideType || 'quick');
  const [title, setTitle] = useState(initialGuide?.title || '');
  const [slug, setSlug] = useState(initialGuide?.slug || (initialGuide?.title ? generateSlug(initialGuide.title) : ''));
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialGuide?.slug));
  const [category, setCategory] = useState(initialGuide?.category || 'Ansiedad');
  const [badge, setBadge] = useState(initialGuide?.badge || 'Bienestar');
  const [readTime, setReadTime] = useState(initialGuide?.readTime || '3 min');
  const [authorName, setAuthorName] = useState(
    initialGuide?.author || initialGuide?.authors?.[0]?.name || 'Dra. Sofía Alarcón • Psicología y Neurociencia'
  );
  const [imageUrl, setImageUrl] = useState(
    initialGuide?.image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // 2. BLOQUE FIJO: Resumen Ejecutivo Simple (Obligatorio, no eliminable)
  const [simpleSummary, setSimpleSummary] = useState(
    initialGuide?.simpleSummary || 'Esta guía sintetiza un método clínico validado para regular el sistema nervioso ante momentos de sobrecarga emocional.'
  );

  // 3. BLOQUE FIJO: Aviso de Contenido y Salud Mental (Obligatorio, no eliminable)
  const [disclaimerNotice, setDisclaimerNotice] = useState(
    initialGuide?.demoNotice || 'Este contenido está diseñado para fines psicoeducativos y de aprendizaje sobre bienestar integral. No sustituye la valoración clínica, diagnóstico ni tratamiento de un profesional de la salud mental.'
  );

  // 4. BLOQUES DINÁMICOS: Secciones Numeradas de Desarrollo (1., 2., 3...)
  const [sections, setSections] = useState<GuideExplainedSection[]>(() => {
    if (initialGuide?.explainedContent && initialGuide.explainedContent.length > 0) {
      return initialGuide.explainedContent;
    }
    return [
      {
        heading: '1. Comprender la Respuesta Fisiológica de Alerta',
        text: 'Cuando el cerebro percibe una amenaza o sobreestimulación, la amígdala activa el sistema nervioso simpático. Reconocer las sensaciones físicas tempranas permite intervenir antes del desbordamiento.',
        bulletPoints: [
          'Aceleración del ritmo cardíaco y respiración superficial torácica.',
          'Visión de túnel y dificultad para concentrarse en tareas amplias.',
          'Tensión muscular involuntaria en cuello, hombros y mandíbula.'
        ]
      },
      {
        heading: '2. Técnica de Enraizamiento y Regulación Vagal',
        text: 'Para enviar una señal de seguridad fisiológica al cerebro, recurrimos al reflejo vagal. La prolongación deliberada de la exhalación activa el sistema parasimpático en menos de 90 segundos.',
        bulletPoints: [
          'Realiza una inhalación profunda seguida de una micro-inhalación adicional.',
          'Exhala lentamente por la boca durante 6 a 8 segundos completos.',
          'Siente el contacto firme de las plantas de los pies sobre el suelo.'
        ]
      }
    ];
  });

  // 5. BLOQUES DINÁMICOS: Glosario de Conceptos Clave
  const [glossary, setGlossary] = useState<GlossaryItem[]>(() => {
    if (initialGuide?.glossary && initialGuide.glossary.length > 0) {
      return initialGuide.glossary;
    }
    return [
      {
        term: 'Nervio Vago',
        definition: 'Principal componente del sistema nervioso parasimpático, encargado de enviar señales de calma del cuerpo al cerebro.'
      },
      {
        term: 'Exhalación Prolongada',
        definition: 'Patrón respiratorio donde la fase de vaciado pulmonar dura el doble que la inhalación, desacelerando el pulso cardíaco.'
      }
    ];
  });

  // 6. BLOQUES DINÁMICOS: Consejos Prácticos para la Rutina Diaria
  const [extraTips, setExtraTips] = useState<string[]>(() => {
    if (initialGuide?.extraTips && initialGuide.extraTips.length > 0) {
      return initialGuide.extraTips;
    }
    return [
      'Coloca una alarma suave a media tarde para realizar 3 respiraciones diafragmáticas conscientes.',
      'Si notas tensión mandibular, abre suavemente la boca y relaja la lengua en el paladar.',
      'Combina esta práctica con un vaso de agua fresca para reanclar tus sentidos.'
    ];
  });

  // 7. BLOQUE FIJO: 3 Retos Prácticos Desbloqueados (Misiones Diarias Obligatorias)
  const [dailyMissions, setDailyMissions] = useState<GuideDailyMission[]>(() => {
    const existing = initialGuide?.dailyMissions || [];
    const defaultMissions: GuideDailyMission[] = [
      {
        id: existing[0]?.id || `m1-${Date.now()}`,
        title: existing[0]?.title || 'Suspiro Fisiológico al Mediodía',
        description: existing[0]?.description || 'Realiza 3 ciclos de doble inhalación y exhalación larga antes de tu almuerzo o pausa principal.',
        timeEstimate: existing[0]?.timeEstimate || '3 min',
        xp: existing[0]?.xp || 30
      },
      {
        id: existing[1]?.id || `m2-${Date.now() + 1}`,
        title: existing[1]?.title || 'Registro Consciente de Disparadores',
        description: existing[1]?.description || 'Identifica y anota en tu diario una situación puntual del día que haya acelerado tu ritmo cardíaco.',
        timeEstimate: existing[1]?.timeEstimate || '5 min',
        xp: existing[1]?.xp || 35
      },
      {
        id: existing[2]?.id || `m3-${Date.now() + 2}`,
        title: existing[2]?.title || 'Pausa de Desconexión Digital Somática',
        description: existing[2]?.description || 'Apaga pantallas 10 minutos antes de dormir, apoyando la atención en las sensaciones físicas de tu respiración.',
        timeEstimate: existing[2]?.timeEstimate || '5 min',
        xp: existing[2]?.xp || 40
      }
    ];
    return defaultMissions;
  });

  // 8. Bloques interactivos adicionales opcionales (Quizzes, Callouts, Timers)
  const [interactiveBlocks, setInteractiveBlocks] = useState<GuideBlock[]>(
    initialGuide?.blocks || []
  );

  // 9. Autores y Fuentes
  const [authors, setAuthors] = useState<GuideAuthor[]>(
    initialGuide?.authors && initialGuide.authors.length > 0 
      ? initialGuide.authors 
      : [{ name: initialGuide?.author || 'Dra. Sofía Alarcón', role: 'Especialista en Psicología Clínica y Mindfulness', avatarUrl: '/assets/icons/nav-profile.png' }]
  );
  const [reviewedBy, setReviewedBy] = useState(
    initialGuide?.reviewedBy || 'Revisado por Comité Clínico FluxGlow • Psicología Cognitivo-Conductual'
  );
  const [references, setReferences] = useState<GuideReference[]>(
    initialGuide?.references && initialGuide.references.length > 0
      ? initialGuide.references
      : [
          { title: 'Physiological Sighing and Autonomous Regulation', author: 'Huberman, A. & Spiegel, D.', year: '2023', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
          { title: 'The Polyvagal Theory: Neurophysiological Foundations of Emotions', author: 'Porges, S. W.', year: '2021', url: 'https://pubmed.ncbi.nlm.nih.gov/' }
        ]
  );

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers para el encabezado
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(generateSlug(val));
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Archivo inválido', 'Por favor selecciona un archivo de imagen (PNG, JPG o WebP).');
      return;
    }

    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadGuideCoverImage(file);
      if (publicUrl) {
        setImageUrl(publicUrl);
        success('Imagen subida', 'La imagen de portada se ha guardado en Supabase Storage.');
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImageUrl(event.target.result as string);
            info('Imagen cargada localmente', 'Se utilizará la imagen seleccionada.');
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      toastError('Error al subir imagen', 'No se pudo cargar la imagen.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handlers de Secciones Numeradas
  const addSection = () => {
    const nextNumber = sections.length + 1;
    setSections(prev => [
      ...prev,
      {
        heading: `${nextNumber}. Nueva Sección de Desarrollo`,
        text: 'Detalla aquí la base conceptual o el paso práctico con un lenguaje cercano y fundamentado...',
        bulletPoints: [
          'Punto clave relevante para recordar.',
          'Aplicación práctica en la vida cotidiana.'
        ]
      }
    ]);
    success('Sección añadida', `Se creó la sección ${nextNumber}.`);
  };

  const updateSection = (idx: number, updates: Partial<GuideExplainedSection>) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, ...updates } : s));
  };

  const moveSection = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const newSections = [...sections];
    const [moved] = newSections.splice(idx, 1);
    newSections.splice(targetIdx, 0, moved);
    setSections(newSections);
  };

  const deleteSection = (idx: number) => {
    if (sections.length <= 1) {
      warning('Acción no permitida', 'La guía debe contar con al menos una sección de desarrollo.');
      return;
    }
    setSections(prev => prev.filter((_, i) => i !== idx));
    info('Sección eliminada', 'Se ha retirado la sección.');
  };

  // Handlers de viñetas dentro de una sección
  const addBulletPoint = (secIdx: number) => {
    const current = sections[secIdx];
    const updatedBullets = [...(current.bulletPoints || []), 'Nuevo punto clave de apoyo...'];
    updateSection(secIdx, { bulletPoints: updatedBullets });
  };

  const updateBulletPoint = (secIdx: number, bIdx: number, val: string) => {
    const current = sections[secIdx];
    const updatedBullets = [...(current.bulletPoints || [])];
    updatedBullets[bIdx] = val;
    updateSection(secIdx, { bulletPoints: updatedBullets });
  };

  const removeBulletPoint = (secIdx: number, bIdx: number) => {
    const current = sections[secIdx];
    const updatedBullets = (current.bulletPoints || []).filter((_, i) => i !== bIdx);
    updateSection(secIdx, { bulletPoints: updatedBullets });
  };

  // Handlers de Glosario
  const addGlossaryTerm = () => {
    setGlossary(prev => [
      ...prev,
      { term: 'Nuevo Concepto', definition: 'Definición breve y comprensible del término...' }
    ]);
  };

  const updateGlossaryTerm = (idx: number, updates: Partial<GlossaryItem>) => {
    setGlossary(prev => prev.map((g, i) => i === idx ? { ...g, ...updates } : g));
  };

  const removeGlossaryTerm = (idx: number) => {
    setGlossary(prev => prev.filter((_, i) => i !== idx));
  };

  // Handlers de Consejos Prácticos
  const addExtraTip = () => {
    setExtraTips(prev => [...prev, 'Nuevo consejo práctico para incorporar en la rutina diaria...']);
  };

  const updateExtraTip = (idx: number, val: string) => {
    setExtraTips(prev => prev.map((t, i) => i === idx ? val : t));
  };

  const removeExtraTip = (idx: number) => {
    setExtraTips(prev => prev.filter((_, i) => i !== idx));
  };

  // Handlers de Misiones (Exactamente 3 retos)
  const updateDailyMission = (index: number, updates: Partial<GuideDailyMission>) => {
    setDailyMissions(prev => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], ...updates };
      }
      return next;
    });
  };

  // Handlers de Referencias y Autores
  const addReference = () => {
    setReferences(prev => [
      ...prev,
      { title: '', author: '', year: new Date().getFullYear().toString(), url: '' }
    ]);
  };

  const updateReference = (idx: number, updates: Partial<GuideReference>) => {
    setReferences(prev => prev.map((r, i) => i === idx ? { ...r, ...updates } : r));
  };

  const removeReference = (idx: number) => {
    setReferences(prev => prev.filter((_, i) => i !== idx));
  };

  // Guardar y Publicar
  const handleSave = async (isDraft: boolean) => {
    if (!title.trim()) {
      warning('Título obligatorio', 'Por favor ingresa un título representativo para la guía.');
      return;
    }

    if (!simpleSummary.trim()) {
      warning('Resumen obligatorio', 'El Resumen Ejecutivo Simple es obligatorio.');
      return;
    }

    if (sections.length === 0 || !sections[0].heading.trim()) {
      warning('Secciones requeridas', 'Debes incluir al menos una sección de desarrollo con su título.');
      return;
    }

    // Asegurar 3 misiones
    if (dailyMissions.length < 3 || !dailyMissions[0]?.title || !dailyMissions[1]?.title || !dailyMissions[2]?.title) {
      warning('Misiones requeridas', 'La guía debe contener los 3 Retos Prácticos Asociados completamente definidos.');
      return;
    }

    const finalSlug = slug.trim() || generateSlug(title);

    setIsSubmitting(true);
    try {
      const payload = {
        id: initialGuide?.id,
        title: title.trim(),
        slug: finalSlug,
        category,
        badge: badge.trim() || category,
        readTime: readTime.trim() || '3 min',
        imageUrl: imageUrl.trim(),
        description: simpleSummary.trim(),
        author: authorName.trim() || (authors[0]?.name) || 'FluxGlow Editorial',
        guideType,
        authors: authors.map((a, i) => i === 0 ? { ...a, name: authorName.trim() || a.name } : a),
        reviewedBy: reviewedBy.trim(),
        references,
        blocks: interactiveBlocks,
        dailyMissions: dailyMissions.slice(0, 3),
        sections,
        glossary,
        extraTips
      };

      const result = await saveOrUpdateSupabaseGuide(payload);

      if (result.success && result.data) {
        // Enlazar el aviso predeterminado en el objeto devuelto
        result.data.demoNotice = disclaimerNotice;
        result.data.glossary = glossary;
        result.data.extraTips = extraTips;
        result.data.dailyMissions = dailyMissions.slice(0, 3);
        result.data.explainedContent = sections;

        success(
          isDraft ? 'Borrador guardado' : '¡Guía publicada con éxito! 🎉',
          isDraft 
            ? 'Los cambios se han guardado con éxito en Supabase.' 
            : `La guía "${title}" con sus 3 retos prácticos está activa en /explora/${finalSlug}.`
        );
        onSaved(result.data);
      } else {
        toastError('Error al guardar', result.error || 'No se pudo completar el guardado.');
      }
    } catch (err: any) {
      toastError('Fallo de conexión', err?.message || 'Ocurrió un error guardando la guía.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F9F7F4] flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* 1. TOP STICKY BAR: CONTROL ADMINISTRATIVO */}
      <div className="bg-stone-900 text-white px-4 sm:px-8 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-stone-800 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Cerrar editor"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#5F927B] text-white px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Panel de Administrador</span>
              </span>
              <span className="text-[11px] text-stone-400 hidden sm:inline font-mono">
                Plantilla Oficial Estricta FluxGlow
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-[280px] sm:max-w-md">
              {title || 'Nueva Guía de Bienestar'}
            </h1>
          </div>
        </div>

        {/* Selector de Modo: Editor In-Situ vs Vista Previa */}
        <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'editor' ? 'bg-[#5F927B] text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor Estructurado</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-[#5F927B] text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Previa Real</span>
          </button>
        </div>

        {/* Acciones de Publicación */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden sm:inline">Guardar Borrador</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#5F927B] hover:bg-[#4d7864] text-white shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Publicar Guía</span>
          </button>
        </div>
      </div>

      {/* 2. BODY WORKSPACE */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto space-y-8 pb-32">

          {/* VISTA 1: EDITOR IN-SITU CON LA ESTRUCTURA ESTRICTA DE FLUXGLOW */}
          {activeTab === 'editor' && (
            <div className="space-y-8 animate-in fade-in duration-200">

              {/* AVISO DE ESTRUCTURA Y CONSISTENCIA */}
              <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
                <Info className="w-4 h-4 text-[#5F927B] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Estructura Visual Estricta:</strong> Esta plantilla garantiza la coherencia estética de FluxGlow. Los bloques con borde verde continuo son <strong>fijos y obligatorios</strong> (no se pueden eliminar). Puedes añadir o alargar las <strong>secciones intermedias, glosario y consejos</strong> tanto como lo requiera el tema.
                </div>
              </div>

              {/* ========================================================================= */}
              {/* BLOQUE FIJO 1: ENCABEZADO Y METADATOS DE LA GUÍA */}
              {/* ========================================================================= */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#5F927B]/50 shadow-sm relative space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#3E6855] uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Bloque Fijo 1: Encabezado y Metadatos</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF1EA] text-[#3E6855]">
                    Obligatorio
                  </span>
                </div>

                {/* Tipo de Guía (Quick vs Weekly) */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Tipo de Guía Didáctica:
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      type="button"
                      onClick={() => setGuideType('quick')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        guideType === 'quick' 
                          ? 'border-[#5F927B] bg-[#EBF1EA] text-[#253D33] font-bold ring-2 ring-[#5F927B]/30' 
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-xs font-bold">⚡ Guía Rápida</div>
                      <div className="text-[11px] text-stone-500 font-normal">Lectura ágil de 2 a 5 minutos</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGuideType('weekly')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        guideType === 'weekly' 
                          ? 'border-[#5F927B] bg-[#EBF1EA] text-[#253D33] font-bold ring-2 ring-[#5F927B]/30' 
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-xs font-bold">🗓️ Guía Semanal</div>
                      <div className="text-[11px] text-stone-500 font-normal">Plan intensivo de 7 días</div>
                    </button>
                  </div>
                </div>

                {/* Título Principal */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
                    Título Principal de la Guía: *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ej. Cómo desactivar la hiperactividad de la amígdala ante un ataque de pánico"
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-3 text-base sm:text-lg font-bold text-stone-900 font-serif focus:outline-none focus:ring-2 focus:ring-[#5F927B] focus:bg-white"
                  />
                </div>

                {/* Fila: Categoría, Tiempo Estimado y Autor/Disciplina */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">Categoría:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">Tiempo estimado de lectura:</label>
                    <div className="flex items-center bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-stone-400 mr-2" />
                      <input
                        type="text"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        placeholder="4 min"
                        className="w-full bg-transparent font-semibold text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">Autor y Disciplina:</label>
                    <div className="flex items-center bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-xs">
                      <User className="w-3.5 h-3.5 text-stone-400 mr-2" />
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Dra. Sofía Alarcón • Psicología"
                        className="w-full bg-transparent font-semibold text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Imagen de Portada y Vista Previa */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
                    Imagen de Portada (Cargar Archivo o Enlace URL): *
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 bg-stone-50 border border-stone-300 rounded-2xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                    />

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? 'Subiendo...' : 'Subir Archivo'}</span>
                    </button>
                  </div>

                  {/* Vista Previa de la Portada */}
                  <div className="w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative group">
                    <img
                      src={imageUrl}
                      alt="Portada de la guía"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xs">
                        Vista previa de la portada
                      </span>
                    </div>
                  </div>
                </div>

                {/* Slug de la URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-700">
                      Ruta amigable (URL /explora/:slug):
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSlugManual(false);
                        setSlug(generateSlug(title));
                      }}
                      className="text-[11px] text-[#5F927B] hover:underline font-semibold cursor-pointer"
                    >
                      Regenerar desde título
                    </button>
                  </div>
                  <div className="flex items-center bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-xs font-mono text-stone-600">
                    <span className="text-stone-400 select-none mr-1">/explora/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setIsSlugManual(true);
                        setSlug(generateSlug(e.target.value));
                      }}
                      placeholder="desactivar-hiperactividad-amigdala"
                      className="flex-1 bg-transparent border-0 text-stone-900 font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* ========================================================================= */}
              {/* BLOQUE FIJO 2: RESUMEN EJECUTIVO SIMPLE */}
              {/* ========================================================================= */}
              <section className="p-6 sm:p-7 rounded-3xl bg-[#eaf4ef] border-2 border-[#548c71]/40 text-emerald-950 shadow-xs relative space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#548c71] uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Bloque Fijo 2: Resumen Ejecutivo Simple</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#548c71] text-white">
                    Obligatorio (No eliminable)
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Caja destacada inicial con la síntesis rápida del tema que el usuario lee de inmediato.
                </p>

                <textarea
                  value={simpleSummary}
                  onChange={(e) => setSimpleSummary(e.target.value)}
                  rows={3}
                  placeholder="Síntesis rápida: ¿Qué aprenderá y conseguirá el usuario con esta guía?..."
                  className="w-full bg-white border border-[#548c71]/30 rounded-2xl p-4 text-xs sm:text-sm text-stone-900 leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-[#548c71]"
                />
              </section>

              {/* ========================================================================= */}
              {/* BLOQUE FIJO 3: AVISO DE CONTENIDO / DESCARGO DE RESPONSABILIDAD */}
              {/* ========================================================================= */}
              <section className="p-5 sm:p-6 rounded-3xl bg-amber-50/95 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm shadow-xs relative space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Bloque Fijo 3: Aviso de Contenido y Salud Mental</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                    Obligatorio
                  </span>
                </div>

                <p className="text-xs text-amber-800">
                  Banner predeterminado de validez del contenido, ética y salvaguarda de salud mental de FluxGlow.
                </p>

                <textarea
                  value={disclaimerNotice}
                  onChange={(e) => setDisclaimerNotice(e.target.value)}
                  rows={2}
                  className="w-full bg-white/90 border border-amber-300 rounded-2xl p-3 text-xs text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </section>

              {/* ========================================================================= */}
              {/* BLOQUES DINÁMICOS Y EXPANDIBLES: SECCIONES NUMERADAS (1., 2., 3...) */}
              {/* ========================================================================= */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#5F927B]" />
                      <span>Secciones Numeradas de Desarrollo (Expandibles)</span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      Añade tantas secciones intermedias como necesites sin romper el diseño.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addSection}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-[#EBF1EA] text-[#3E6855] hover:bg-[#dbe7da] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Añadir Nueva Sección</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {sections.map((section, sIdx) => (
                    <div 
                      key={sIdx}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:border-[#5F927B]/40 transition-all space-y-4"
                    >
                      {/* Cabecera de la sección con controles */}
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-[#EBF1EA] text-[#3E6855] font-bold text-xs flex items-center justify-center">
                            {sIdx + 1}
                          </span>
                          <span className="text-xs font-bold text-stone-700">
                            Sección {sIdx + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveSection(sIdx, 'up')}
                            disabled={sIdx === 0}
                            className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 cursor-pointer"
                            title="Mover arriba"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(sIdx, 'down')}
                            disabled={sIdx === sections.length - 1}
                            className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 cursor-pointer"
                            title="Mover abajo"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => deleteSection(sIdx)}
                              className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Eliminar sección"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Título de la sección */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Título de la Sección:
                        </label>
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) => updateSection(sIdx, { heading: e.target.value })}
                          placeholder={`Ej. ${sIdx + 1}. Mecanismo Neurobiológico de la Calma`}
                          className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-bold text-stone-900 font-serif focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                        />
                      </div>

                      {/* Párrafo explicativo de fondo */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Párrafo Explicativo de Fondo:
                        </label>
                        <textarea
                          value={section.text}
                          onChange={(e) => updateSection(sIdx, { text: e.target.value })}
                          rows={3}
                          placeholder="Escribe la explicación detallada, fundamentada y accesible para el usuario..."
                          className="w-full bg-stone-50 border border-stone-300 rounded-2xl p-3 text-xs sm:text-sm text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                        />
                      </div>

                      {/* Lista de Puntos Clave / Viñetas */}
                      <div className="space-y-2 pt-2 border-t border-stone-100">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                            <ListPlus className="w-3.5 h-3.5 text-[#5F927B]" />
                            <span>Puntos Clave / Viñetas de Refuerzo:</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => addBulletPoint(sIdx)}
                            className="text-[11px] font-bold text-[#3E6855] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Añadir viñeta</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(section.bulletPoints || []).map((bp, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#5F927B] shrink-0 ml-1"></span>
                              <input
                                type="text"
                                value={bp}
                                onChange={(e) => updateBulletPoint(sIdx, bIdx, e.target.value)}
                                placeholder="Escribe un punto clave o viñeta de acción..."
                                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                              />
                              <button
                                type="button"
                                onClick={() => removeBulletPoint(sIdx, bIdx)}
                                className="text-stone-300 hover:text-rose-500 p-1 cursor-pointer"
                                title="Eliminar viñeta"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botón inferior para añadir más secciones */}
                <button
                  type="button"
                  onClick={addSection}
                  className="w-full py-4 rounded-3xl border-2 border-dashed border-[#5F927B]/40 hover:border-[#5F927B] text-[#3E6855] hover:bg-[#EBF1EA]/50 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Añadir Nueva Sección Numerada de Desarrollo</span>
                </button>
              </section>

              {/* ========================================================================= */}
              {/* BLOQUES DINÁMICOS: GLOSARIO DE CONCEPTOS CLAVE */}
              {/* ========================================================================= */}
              <section className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#5F927B]" />
                      <span>Glosario de Conceptos Clave (Expandible)</span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      Módulo de tarjetas dinámicas para añadir términos con sus definiciones cortas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addGlossaryTerm}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#EBF1EA] text-[#3E6855] hover:bg-[#dbe7da] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Término</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {glossary.map((item, gIdx) => (
                    <div key={gIdx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 relative group">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={item.term}
                          onChange={(e) => updateGlossaryTerm(gIdx, { term: e.target.value })}
                          placeholder="Término (ej. Neuroplasticidad)"
                          className="flex-1 bg-white border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#5F927B]"
                        />
                        <button
                          type="button"
                          onClick={() => removeGlossaryTerm(gIdx)}
                          className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer"
                          title="Eliminar término"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <textarea
                        value={item.definition}
                        onChange={(e) => updateGlossaryTerm(gIdx, { definition: e.target.value })}
                        rows={2}
                        placeholder="Definición corta y clara..."
                        className="w-full bg-white border border-stone-300 rounded-xl p-2 text-xs text-stone-700 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#5F927B]"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* ========================================================================= */}
              {/* BLOQUES DINÁMICOS: CONSEJOS PRÁCTICOS PARA LA RUTINA DIARIA */}
              {/* ========================================================================= */}
              <section className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-[#DE6943]" />
                      <span>Consejos Prácticos para la Rutina Diaria (Expandible)</span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      Lista de verificación interactiva para agregar tips con viñetas personalizadas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addExtraTip}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FAF0E6] text-[#DE6943] hover:bg-[#F2E0CE] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Consejo</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {extraTips.map((tip, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 p-2 rounded-2xl bg-stone-50 border border-stone-200">
                      <Check className="w-4 h-4 text-[#DE6943] shrink-0 ml-1 stroke-[3]" />
                      <input
                        type="text"
                        value={tip}
                        onChange={(e) => updateExtraTip(tIdx, e.target.value)}
                        placeholder="Consejo práctico (ej. Beber un vaso de agua antes de una reunión)..."
                        className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-stone-800 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeExtraTip(tIdx)}
                        className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer"
                        title="Eliminar consejo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* ========================================================================= */}
              {/* BLOQUE FIJO 4: BOTÓN FINAL DE ASIMILACIÓN */}
              {/* ========================================================================= */}
              <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#f2ece1] to-[#e8f1ec] border-2 border-[#548c71]/50 text-center shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#548c71]/20">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3E6855] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bloque Fijo 4: Final de Asimilación</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#548c71] text-white">
                    Obligatorio (Visualización en Guía)
                  </span>
                </div>

                <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  ¿Has asimilado los conceptos de esta guía?
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto">
                  Al hacer clic en este botón, el lector registra la lectura completa y el sistema <strong>activa automáticamente sus 3 retos prácticos en su panel diario</strong>.
                </p>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 bg-[#548c71] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-md pointer-events-none opacity-90 select-none">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>He terminado de leer la guía</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                </div>
              </section>

              {/* ========================================================================= */}
              {/* BLOQUE FIJO 5: MISIONES DESBLOQUEADAS (3 RETOS PRÁCTICOS ASOCIADOS) */}
              {/* ========================================================================= */}
              <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/50 border-2 border-amber-400 shadow-sm relative space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-amber-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Bloque Fijo 5: 3 Retos Prácticos Desbloqueados</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950">
                    Exactamente 3 Retos Obligatorios
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/80 border border-amber-200 text-xs text-stone-700 leading-relaxed">
                  📌 <strong>Regla de Negocio FluxGlow:</strong> Estos 3 retos prácticos se guardan en la base de datos de Supabase y quedan permanentemente asociados a esta guía. En cuanto el usuario presiona "He terminado de leer la guía", se activan en su panel personal de Misiones Diarias.
                </div>

                {/* Grid con las 3 tarjetas de Retos Prácticos */}
                <div className="space-y-4">
                  {dailyMissions.slice(0, 3).map((mission, mIdx) => (
                    <div 
                      key={mission.id || mIdx}
                      className="bg-white rounded-2xl p-5 border border-amber-300 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900">
                          Reto Práctico {mIdx + 1}
                        </span>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>+{mission.xp || 30} XP</span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{mission.timeEstimate || '5 min'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Título del Reto */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Título del Reto {mIdx + 1}: *
                        </label>
                        <input
                          type="text"
                          value={mission.title}
                          onChange={(e) => updateDailyMission(mIdx, { title: e.target.value })}
                          placeholder={`Ej. Reto ${mIdx + 1}: Práctica de respiración consciente`}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      {/* Descripción Corta */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Descripción Corta de la Acción Diaria: *
                        </label>
                        <textarea
                          value={mission.description}
                          onChange={(e) => updateDailyMission(mIdx, { description: e.target.value })}
                          rows={2}
                          placeholder="Indica qué debe hacer exactamente el usuario durante su día..."
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      {/* Ajustes de Tiempo y XP */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-1">Tiempo Estimado:</label>
                          <input
                            type="text"
                            value={mission.timeEstimate}
                            onChange={(e) => updateDailyMission(mIdx, { timeEstimate: e.target.value })}
                            placeholder="3 min"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-1">Recompensa de XP:</label>
                          <input
                            type="number"
                            value={mission.xp}
                            onChange={(e) => updateDailyMission(mIdx, { xp: parseInt(e.target.value) || 30 })}
                            min={10}
                            max={100}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ========================================================================= */}
              {/* BLOQUE FIJO 6: EVALUACIÓN DE CONTENIDO */}
              {/* ========================================================================= */}
              <section className="p-6 rounded-3xl bg-white border-2 border-stone-200 shadow-2xs text-center space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Bloque Fijo 6: Evaluación de Contenido
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600">
                    Obligatorio (Retroalimentación)
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-stone-900">
                  ¿Te ha resultado útil esta guía?
                </h4>
                <div className="flex items-center justify-center gap-3">
                  <div className="px-5 py-2 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 select-none opacity-80">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>👍 Me sirvió mucho</span>
                  </div>
                  <div className="px-5 py-2 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-2 select-none opacity-80">
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>👎 Podría mejorar</span>
                  </div>
                </div>
              </section>

              {/* ========================================================================= */}
              {/* VALIDACIÓN PROFESIONAL Y FUENTES BIBLIOGRÁFICAS */}
              {/* ========================================================================= */}
              <section className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#5F927B]" />
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif">
                    Validación Profesional y Fuentes Clínicas
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Validación Profesional ("Revisado por"):
                  </label>
                  <input
                    type="text"
                    value={reviewedBy}
                    onChange={(e) => setReviewedBy(e.target.value)}
                    placeholder="Ej. Revisado por Lic. María Pérez - Psicóloga Clínica (Col. 4821)"
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                  />
                </div>

                {/* Fuentes */}
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700">
                      Fuentes y Referencias Bibliográficas:
                    </label>
                    <button
                      type="button"
                      onClick={addReference}
                      className="text-[11px] font-bold text-[#3E6855] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Añadir Referencia</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {references.map((ref, rIdx) => (
                      <div key={rIdx} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={ref.title}
                          onChange={(e) => updateReference(rIdx, { title: e.target.value })}
                          placeholder="Título del artículo o libro..."
                          className="flex-1 min-w-[200px] bg-white border border-stone-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-stone-900"
                        />
                        <input
                          type="text"
                          value={ref.author || ''}
                          onChange={(e) => updateReference(rIdx, { author: e.target.value })}
                          placeholder="Autor (ej. Huberman, A.)"
                          className="w-32 bg-white border border-stone-200 rounded-xl px-2.5 py-1 text-xs text-stone-800"
                        />
                        <input
                          type="text"
                          value={ref.year || ''}
                          onChange={(e) => updateReference(rIdx, { year: e.target.value })}
                          placeholder="Año"
                          className="w-16 bg-white border border-stone-200 rounded-xl px-2.5 py-1 text-xs text-stone-800"
                        />
                        <button
                          type="button"
                          onClick={() => removeReference(rIdx)}
                          className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* VISTA 2: VISTA PREVIA REAL DE LA GUÍA (WYSIWYG) */}
          {activeTab === 'preview' && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md space-y-8 animate-in fade-in duration-200">
              
              {/* Header Preview */}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="bg-[#e2eee6] text-[#253d33] text-xs font-bold px-3 py-1 rounded-full border border-[#548c71]/30">
                    {category}
                  </span>
                  <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {readTime}
                  </span>
                  <span className="text-xs font-bold text-[#5F927B] bg-[#EBF1EA] px-2.5 py-0.5 rounded-full">
                    {guideType === 'weekly' ? '🗓️ Guía Semanal (7 Días)' : '⚡ Guía Rápida'}
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
                  {title || 'Título de la Guía'}
                </h1>

                <div className="flex items-center justify-between pb-6 border-b border-stone-200 text-xs sm:text-sm text-stone-500">
                  <span>Por <strong className="text-stone-800">{authorName}</strong></span>
                  <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-semibold">
                    Lectura Interactiva Respaldada
                  </span>
                </div>
              </div>

              {/* Cover image preview */}
              <div className="w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-3xl overflow-hidden shadow-sm border border-stone-200 bg-stone-100">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>

              {/* Resumen Simple */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#eaf4ef] border border-[#548c71]/30 text-emerald-950 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#548c71] uppercase tracking-wider mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Resumen Ejecutivo Simple</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed font-medium text-stone-800">
                  {simpleSummary}
                </p>
              </div>

              {/* Aviso de Salud Mental */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-bold text-amber-900 mb-0.5">Aviso de Contenido y Salud Mental:</p>
                  <p className="text-amber-800 text-xs">{disclaimerNotice}</p>
                </div>
              </div>

              {/* Secciones Numeradas */}
              <div className="space-y-8">
                {sections.map((sec, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-stone-50/70 border border-stone-200 space-y-3">
                    <h3 className="font-serif font-bold text-stone-900 text-xl sm:text-2xl">
                      {sec.heading}
                    </h3>
                    <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                      {sec.text}
                    </p>
                    {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-200/60 space-y-2">
                        {sec.bulletPoints.map((bp, bIdx) => (
                          <div key={bIdx} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-[#548c71] shrink-0 mt-1.5"></span>
                            <span className="leading-relaxed">{bp}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Glosario */}
              {glossary.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#548c71]" />
                    <span>Glosario de Conceptos Clave</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {glossary.map((g, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                        <p className="text-sm font-bold text-stone-900">{g.term}</p>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">{g.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consejos Prácticos */}
              {extraTips.length > 0 && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#de6943] uppercase tracking-wider mb-3">
                    <Lightbulb className="w-4 h-4" />
                    <span>Consejos Prácticos para tu Rutina Diaria</span>
                  </div>
                  <ul className="space-y-2.5">
                    {extraTips.map((tip, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#de6943] shrink-0 mt-0.5 stroke-[3]" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Botón Final de Asimilación */}
              <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#f2ece1] to-[#e8f1ec] border border-[#548c71]/40 text-center shadow-sm">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                  ¿Has asimilado los conceptos de esta guía?
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto mb-6">
                  Haz clic a continuación para registrar la lectura completa y activar tus <strong>3 misiones prácticas</strong> en tu plan diario.
                </p>
                <div className="bg-[#548c71] text-white px-8 py-4 rounded-full font-bold text-base inline-flex items-center gap-3 mx-auto shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>He terminado de leer la guía</span>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
              </div>

              {/* Evaluación */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  Evaluación de Contenido
                </span>
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-3">
                  ¿Te ha resultado útil esta guía?
                </h4>
                <div className="flex items-center justify-center gap-3">
                  <button className="px-5 py-2.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                    👍 Me sirvió mucho
                  </button>
                  <button className="px-5 py-2.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                    👎 Podría mejorar
                  </button>
                </div>
              </div>

              {/* Retos Prácticos Desbloqueados */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/50 border-2 border-amber-300 shadow-md space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-amber-200">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                      3 Retos Prácticos Asociados
                    </span>
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      Misiones que se activarán en el plan diario del usuario
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {dailyMissions.slice(0, 3).map((m, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Reto {idx + 1}</span>
                        <span className="text-amber-700">+{m.xp} XP</span>
                      </div>
                      <h5 className="text-xs font-bold text-stone-900 leading-snug">{m.title}</h5>
                      <p className="text-[11px] text-stone-600 leading-relaxed">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};
