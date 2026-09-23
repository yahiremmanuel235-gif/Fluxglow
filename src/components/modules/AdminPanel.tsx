import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  PlusCircle, 
  Trash2, 
  Upload, 
  ExternalLink, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  Check, 
  Eye, 
  Sparkles,
  Layers,
  Clock,
  Tag,
  FileText,
  Edit3,
  Target,
  CheckCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import { GuideInSituEditor } from './GuideInSituEditor';
import { 
  createSupabaseGuide,
  saveOrUpdateSupabaseGuide,
  fetchSupabaseGuides, 
  deleteSupabaseGuide, 
  uploadGuideCoverImage,
  generateSlug,
  fetchSupabaseCommunityPosts,
  adminDeleteCommunityPost,
  adminBanUser
} from '../../services/supabaseService';
import { DEMO_GUIDES_CATALOG } from '../../data/guidesData';
import { GuideItem, UserProfileData, CommunityPost } from '../../types';

interface AdminPanelProps {
  userProfile?: UserProfileData;
  onNavigate?: (view: any) => void;
}

interface NewSection {
  heading: string;
  text: string;
  bulletPoints: string[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ userProfile, onNavigate }) => {
  const { success, warning, error: toastError, info } = useToast();
  const [activeTab, setActiveTab] = useState<'create-guide' | 'manage-guides' | 'moderation'>('create-guide');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Ansiedad');
  const [badge, setBadge] = useState('Salud Mental');
  const [readTime, setReadTime] = useState('6 min');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('Equipo Clínico FluxGlow');
  
  // Dynamic Sections
  const [sections, setSections] = useState<NewSection[]>([
    { heading: '1. Introducción y Fundamentos', text: '', bulletPoints: [''] }
  ]);

  // Bloques Fijos y Obligatorios FluxGlow
  const [contentDisclaimer, setContentDisclaimer] = useState(
    'Aviso de Contenido: El material proporcionado en esta guía es de carácter psicoeducativo y preventivo. No reemplaza el diagnóstico, psicoterapia ni la intervención clínica de un profesional de la salud mental colegiado. Si estás experimentando una crisis aguda, contacta con tu línea de emergencia local.'
  );

  const [formMissions, setFormMissions] = useState<Array<{
    title: string;
    description: string;
    xp: number;
    timeEstimate: string;
  }>>([
    {
      title: 'Respiración Diafragmática 4-7-8',
      description: 'Realiza 4 ciclos de inhalación profunda en 4s, retención en 7s y exhalación sonora en 8s antes de dormir.',
      xp: 35,
      timeEstimate: '3 min'
    },
    {
      title: 'Diario de Descarga Emocional',
      description: 'Escribe sin filtro 3 pensamientos intrusivos y reformúlalos en una frase de autocompasión.',
      xp: 40,
      timeEstimate: '5 min'
    },
    {
      title: 'Pausa de Anclaje Sensorial 5-4-3-2-1',
      description: 'Conecta con tu entorno identificando 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles y 1 que saboreas.',
      xp: 45,
      timeEstimate: '4 min'
    }
  ]);

  const updateFormMission = (idx: number, field: string, val: any) => {
    setFormMissions(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  // Loading & upload states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Managed Guides State
  const [dbGuides, setDbGuides] = useState<GuideItem[]>([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const [guideToEdit, setGuideToEdit] = useState<GuideItem | null>(null);
  const [showInSituEditor, setShowInSituEditor] = useState(false);

  // Moderation state
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Auto-generate slug when title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(generateSlug(val));
  };

  // Section managers
  const handleAddSection = () => {
    setSections(prev => [
      ...prev,
      { heading: `${prev.length + 1}. Nuevo Punto Clave`, text: '', bulletPoints: [''] }
    ]);
  };

  const handleRemoveSection = (idx: number) => {
    if (sections.length <= 1) {
      warning('Mínimo de secciones', 'La guía debe contar con al menos una sección explicativa.');
      return;
    }
    setSections(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSectionHeadingChange = (idx: number, val: string) => {
    setSections(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], heading: val };
      return copy;
    });
  };

  const handleSectionTextChange = (idx: number, val: string) => {
    setSections(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], text: val };
      return copy;
    });
  };

  const handleAddBullet = (secIdx: number) => {
    setSections(prev => {
      const copy = [...prev];
      copy[secIdx] = {
        ...copy[secIdx],
        bulletPoints: [...copy[secIdx].bulletPoints, '']
      };
      return copy;
    });
  };

  const handleBulletChange = (secIdx: number, bIdx: number, val: string) => {
    setSections(prev => {
      const copy = [...prev];
      const bullets = [...copy[secIdx].bulletPoints];
      bullets[bIdx] = val;
      copy[secIdx] = { ...copy[secIdx], bulletPoints: bullets };
      return copy;
    });
  };

  const handleRemoveBullet = (secIdx: number, bIdx: number) => {
    setSections(prev => {
      const copy = [...prev];
      copy[secIdx] = {
        ...copy[secIdx],
        bulletPoints: copy[secIdx].bulletPoints.filter((_, i) => i !== bIdx)
      };
      return copy;
    });
  };

  // Image Upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      warning('Formato inválido', 'Por favor selecciona un archivo de imagen (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsUploadingImage(true);
      const uploadedUrl = await uploadGuideCoverImage(file);
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
        success('Imagen subida', 'La imagen de portada fue almacenada exitosamente en Supabase Storage.');
      } else {
        // Fallback: FileReader data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result as string);
          info('Imagen local cargada', 'Se usó almacenamiento en línea como vista previa.');
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      toastError('Error al subir imagen', 'No se pudo subir la imagen.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Submit Guide
  const handleSubmitGuide = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      warning('Título requerido', 'Por favor ingresa un título para la guía.');
      return;
    }

    if (!slug.trim()) {
      warning('Slug requerido', 'El identificador URL (slug) es necesario.');
      return;
    }

    if (!description.trim()) {
      warning('Descripción requerida', 'Ingresa una síntesis o descripción inicial.');
      return;
    }

    const cleanedSections = sections.map(s => ({
      heading: s.heading.trim(),
      text: s.text.trim(),
      bulletPoints: s.bulletPoints.map(b => b.trim()).filter(Boolean)
    })).filter(s => s.heading.length > 0 || s.text.length > 0);

    const defaultCover = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80';
    const finalImage = imageUrl.trim() || defaultCover;

    const formattedMissions = formMissions.map((m, idx) => ({
      id: `mission-${slug.trim()}-${idx + 1}`,
      title: m.title.trim() || `Reto ${idx + 1}`,
      description: m.description.trim() || 'Completa esta acción reflexiva.',
      xp: Number(m.xp) || 30,
      timeEstimate: m.timeEstimate.trim() || '5 min'
    }));

    // Estructurar los bloques estandarizados FluxGlow
    const assembledBlocks: any[] = [
      {
        id: `block-disclaimer-${Date.now()}`,
        type: 'callout',
        calloutType: 'warning',
        calloutTitle: 'Aviso de Contenido y Descargo de Responsabilidad',
        calloutText: contentDisclaimer.trim()
      },
      ...cleanedSections.map((s, idx) => ({
        id: `block-sec-${idx + 1}`,
        type: 'text',
        heading: s.heading,
        content: s.text,
        listItems: s.bulletPoints
      })),
      {
        id: `block-unlocked-missions-${Date.now()}`,
        type: 'unlocked_missions',
        triggerLabel: 'He terminado de leer la guía',
        rewardXp: 50,
        missions: formattedMissions
      }
    ];

    setIsSubmitting(true);
    try {
      const res = await saveOrUpdateSupabaseGuide({
        title: title.trim(),
        slug: slug.trim(),
        category,
        badge: badge.trim() || category,
        readTime,
        imageUrl: finalImage,
        description: description.trim(),
        author: author.trim() || 'FluxGlow Editorial',
        sections: cleanedSections,
        blocks: assembledBlocks,
        dailyMissions: formattedMissions
      });

      if (res.success) {
        success('¡Guía Creada Exitosamente!', `Tu guía con estructura FluxGlow ya está disponible en /explora/${slug}`);
        // Reset form
        setTitle('');
        setSlug('');
        setDescription('');
        setImageUrl('');
        setSections([{ heading: '1. Introducción y Fundamentos', text: '', bulletPoints: [''] }]);
        loadGuides();
        setActiveTab('manage-guides');
      } else {
        // Even if table doesn't exist yet, save locally for seamless testing
        const newGuideLocal: GuideItem = {
          id: `local-guide-${Date.now()}`,
          slug: slug.trim(),
          badge: badge.trim() || category,
          title: title.trim(),
          image: finalImage,
          category,
          author: author.trim() || 'FluxGlow Editorial',
          readTime,
          isDemoContent: false,
          simpleSummary: description.trim(),
          demoNotice: contentDisclaimer.trim(),
          explainedContent: cleanedSections,
          glossary: [],
          extraTips: ['Aplica estos conceptos paso a paso.'],
          dailyMissions: formattedMissions,
          blocks: assembledBlocks
        };

        try {
          const currentLocal = JSON.parse(localStorage.getItem('fluxglow_custom_guides') || '[]');
          localStorage.setItem('fluxglow_custom_guides', JSON.stringify([newGuideLocal, ...currentLocal]));
        } catch {}

        success('Guía guardada localmente', `Disponible en /explora/${slug} (Aviso Supabase: ${res.error || 'Modo Fallback'})`);
        loadGuides();
        setActiveTab('manage-guides');
      }
    } catch (err: any) {
      toastError('Error al crear guía', err?.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load guides for management
  const loadGuides = async () => {
    setIsLoadingGuides(true);
    try {
      const supabaseGuides = await fetchSupabaseGuides();
      let localGuides: GuideItem[] = [];
      try {
        localGuides = JSON.parse(localStorage.getItem('fluxglow_custom_guides') || '[]');
      } catch {}

      // Combine Supabase guides, local custom guides, and demo catalog
      const combined = [...supabaseGuides, ...localGuides];
      setDbGuides(combined);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingGuides(false);
    }
  };

  // Load community posts for moderation
  const loadPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const dbPosts = await fetchSupabaseCommunityPosts();
      setPosts(dbPosts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage-guides') {
      loadGuides();
    } else if (activeTab === 'moderation') {
      loadPosts();
    }
  }, [activeTab]);

  // Delete Guide
  const handleDeleteGuide = async (guideId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta guía? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const ok = await deleteSupabaseGuide(guideId);
      // Clean local storage if it's there
      try {
        const localGuides: GuideItem[] = JSON.parse(localStorage.getItem('fluxglow_custom_guides') || '[]');
        const filtered = localGuides.filter(g => g.id !== guideId);
        localStorage.setItem('fluxglow_custom_guides', JSON.stringify(filtered));
      } catch {}

      setDbGuides(prev => prev.filter(g => g.id !== guideId));
      success('Guía eliminada', 'La guía fue retirada del catálogo.');
    } catch (err) {
      toastError('Error eliminando', 'No se pudo eliminar la guía.');
    }
  };

  // Moderate Post
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta publicación de la comunidad?')) {
      return;
    }

    try {
      await adminDeleteCommunityPost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      success('Publicación eliminada', 'El contenido fue moderado y eliminado con éxito.');
    } catch {
      toastError('Error al moderar', 'No se pudo eliminar la publicación.');
    }
  };

  // Ban User
  const handleBanUser = async (userId: string, authorName: string) => {
    const reason = window.prompt(`Motivo de suspensión para "${authorName}":`, 'Incumplimiento reiterado de normas comunitarias');
    if (!reason) return;

    try {
      await adminBanUser(userId, reason);
      success('Usuario suspendido', `Se ha suspendido la cuenta de "${authorName}".`);
    } catch {
      toastError('Error al suspender', 'No se pudo aplicar la sanción.');
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-6 sm:py-10 animate-fadeIn">
      {/* Admin Top Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#5F927B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5F927B] to-[#3E6855] flex items-center justify-center text-white shadow-lg shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#5F927B] bg-[#5F927B]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Acceso Restringido • Rol Administrador
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                Panel de Control y Gestión Editorial
              </h1>
              <p className="text-sm text-stone-300 mt-1 max-w-2xl">
                Crea y publica guías clínicas, administra URLs dinámicas y modera publicaciones de la comunidad en tiempo real.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <Button
              variant="outline"
              onClick={() => onNavigate && onNavigate('explora')}
              className="text-white border-stone-700 hover:bg-stone-800 text-xs font-bold"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Ver en Explora
            </Button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-stone-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('create-guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'create-guide'
                ? 'bg-[#5F927B] text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Crear Nueva Guía</span>
          </button>

          <button
            onClick={() => setActiveTab('manage-guides')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'manage-guides'
                ? 'bg-[#5F927B] text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Gestionar Catálogo de Guías</span>
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'moderation'
                ? 'bg-[#5F927B] text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Moderación de Comunidad</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FORMULARIO CREAR NUEVA GUÍA */}
      {activeTab === 'create-guide' && (
        <div className="space-y-6">
          {/* Banner de Acceso al Editor de Estructura Visual Estricta FluxGlow */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#EBF1EA] via-[#F4EFE6] to-[#FBF9F5] border-2 border-[#5F927B]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#5F927B] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  Creador Oficial In-Situ FluxGlow (Estructura Estricta)
                </h3>
                <p className="text-xs text-stone-600 leading-snug">
                  Respeta los 5 bloques obligatorios (Encabezado, Resumen, Descargo, Asimilación y 3 Retos Prácticos) con vista previa real y secciones intermedias ampliables.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setGuideToEdit(null);
                setShowInSituEditor(true);
              }}
              className="px-5 py-3 rounded-2xl bg-[#5F927B] hover:bg-[#4d7864] text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0 hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Abrir Creador de Guías</span>
            </button>
          </div>

          <form onSubmit={handleSubmitGuide} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Principal: Contenido y Secciones (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tarjeta de Información Básica */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <FileText className="w-5 h-5 text-[#5F927B]" />
                <h2 className="text-lg font-bold text-stone-900">Datos Principales de la Guía</h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Título de la Guía *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Ej. Guía paso a paso para desactivar el pánico nocturno"
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#5F927B] focus:bg-white transition-all text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    URL Slug Dinámico (Ruta limpia) *
                  </label>
                  <div className="flex items-center rounded-2xl bg-stone-100 border border-stone-200 px-3 py-2.5 text-xs text-stone-500 font-mono">
                    <span className="shrink-0 text-stone-400">/explora/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="desactivar-panico-nocturno"
                      className="w-full bg-transparent border-none text-stone-800 font-bold focus:outline-none px-1"
                    />
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Se generará la ruta accesible directamente: <code className="text-[#3E6855]">/explora/{slug || 'mi-guia'}</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Categoría Temática
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                  >
                    <option value="Ansiedad">Ansiedad y Calma</option>
                    <option value="Estrés">Estrés y Descompresión</option>
                    <option value="Procrastinación">Procrastinación y Foco</option>
                    <option value="Autoestima">Autoestima y Autocompasión</option>
                    <option value="Mindfulness">Mindfulness y Meditación</option>
                    <option value="Sueño Reparador">Sueño y Descanso</option>
                    <option value="Inteligencia Emocional">Inteligencia Emocional</option>
                    <option value="Relaciones Sanas">Relaciones Sanas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Bloque Resumen Ejecutivo Simple *</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Bloque Fijo Obligatorio</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Síntesis rápida del tema: Explica en 2 o 3 oraciones de qué trata esta guía y qué beneficio concreto obtendrá la persona..."
                  className="w-full px-4 py-3 rounded-2xl bg-amber-50/40 border border-amber-200 text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5F927B] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Bloque Fijo: Aviso de Contenido y Descargo de Responsabilidad */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Bloque Aviso de Contenido / Descargo de Responsabilidad</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">Fijo</span>
                </div>
                <textarea
                  rows={2}
                  value={contentDisclaimer}
                  onChange={(e) => setContentDisclaimer(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-amber-200 text-xs text-stone-700 leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <p className="text-[10px] text-stone-500">
                  Aviso predeterminado sobre validez del contenido y salud mental obligatorio en toda guía.
                </p>
              </div>
            </div>

            {/* Constructor de Secciones y Contenido Explicado */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-[#5F927B]" />
                  <h2 className="text-lg font-bold text-stone-900">Secciones de Contenido Explicado</h2>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSection}
                  className="text-xs font-bold text-[#3E6855] border-[#C5DDD0] hover:bg-[#EBF1EA]"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Agregar Sección
                </Button>
              </div>

              <div className="space-y-6">
                {sections.map((section, sIdx) => (
                  <div 
                    key={sIdx}
                    className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200 relative group transition-all hover:border-[#5F927B]/40"
                  >
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <span className="text-xs font-bold text-[#5F927B] bg-[#5F927B]/10 px-2.5 py-0.5 rounded-full">
                        Sección #{sIdx + 1}
                      </span>
                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(sIdx)}
                          className="text-stone-400 hover:text-red-600 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar esta sección"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Encabezado de la Sección
                        </label>
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) => handleSectionHeadingChange(sIdx, e.target.value)}
                          placeholder="Ej. 1. La respuesta neurofisiológica ante el agobio"
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Desarrollo y Explicación
                        </label>
                        <textarea
                          rows={4}
                          value={section.text}
                          onChange={(e) => handleSectionTextChange(sIdx, e.target.value)}
                          placeholder="Escribe el texto detallado de esta sección, evidencia clínica y recomendaciones..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#5F927B] resize-none"
                        />
                      </div>

                      {/* Puntos Clave / Viñetas */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-bold text-stone-600">
                            Puntos clave destacados (Viñetas didácticas):
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddBullet(sIdx)}
                            className="text-[11px] font-bold text-[#3E6855] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            + Añadir viñeta
                          </button>
                        </div>

                        <div className="space-y-2">
                          {section.bulletPoints.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#5F927B] shrink-0" />
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => handleBulletChange(sIdx, bIdx, e.target.value)}
                                placeholder="Clave práctica de acción inmediata..."
                                className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#5F927B]"
                              />
                              {section.bulletPoints.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveBullet(sIdx, bIdx)}
                                  className="text-stone-300 hover:text-red-500 p-1 cursor-pointer"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOQUE FIJO 4: BLOQUE FINAL DE ASIMILACIÓN */}
            <div className="bg-gradient-to-r from-[#EBF1EA] to-[#F5EFE6] rounded-3xl p-6 sm:p-7 border border-[#5F927B]/30 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[#3E6855]" />
                  <h3 className="text-sm sm:text-base font-bold text-stone-900">
                    Bloque Final de Asimilación (Obligatorio)
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#3E6855] bg-white px-2 py-0.5 rounded-md border border-[#5F927B]/20">
                  Bloque Fijo
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Este bloque renderiza el botón interactivo de cierre en la guía del usuario:
              </p>
              <div className="p-4 rounded-2xl bg-white border border-[#5F927B]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#5F927B]/10 flex items-center justify-center text-[#5F927B] shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">"He terminado de leer la guía"</div>
                    <div className="text-[11px] text-stone-500">Otorga +50 XP y desbloquea inmediatamente los 3 Retos Prácticos Diarios</div>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-[#5F927B] text-white text-xs font-bold shadow-xs pointer-events-none opacity-90">
                  Vista Previa del Botón
                </div>
              </div>
            </div>

            {/* BLOQUE FIJO 5: BLOQUE DE MISIONES DESBLOQUEADAS (3 RETOS PRÁCTICOS) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <Target className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      Bloque de Misiones Desbloqueadas (3 Retos Prácticos)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Los 3 micro-retos asociados a esta guía que se activan al completar la asimilación.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                  Fijo: Exactamente 3 Retos
                </span>
              </div>

              <div className="space-y-4">
                {formMissions.map((mission, mIdx) => (
                  <div 
                    key={mIdx}
                    className="bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900">
                        Reto Práctico #{mIdx + 1}
                      </span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          +{mission.xp} XP
                        </span>
                        <span className="font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          {mission.timeEstimate}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Título del Reto #{mIdx + 1}: *
                      </label>
                      <input
                        type="text"
                        value={mission.title}
                        onChange={(e) => updateFormMission(mIdx, 'title', e.target.value)}
                        placeholder={`Ej. Reto ${mIdx + 1}: Acción concreta`}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Descripción Corta de la Acción Diaria: *
                      </label>
                      <textarea
                        rows={2}
                        value={mission.description}
                        onChange={(e) => updateFormMission(mIdx, 'description', e.target.value)}
                        placeholder="Indica qué debe hacer exactamente el usuario en su día a día..."
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-1">Tiempo Estimado:</label>
                        <input
                          type="text"
                          value={mission.timeEstimate}
                          onChange={(e) => updateFormMission(mIdx, 'timeEstimate', e.target.value)}
                          placeholder="3 min"
                          className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-1">Recompensa (XP):</label>
                        <input
                          type="number"
                          value={mission.xp}
                          onChange={(e) => updateFormMission(mIdx, 'xp', Number(e.target.value))}
                          placeholder="30"
                          className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Lateral: Portada, Metadatos y Publicación (1 col) */}
          <div className="space-y-6">
            
            {/* Tarjeta de Portada e Imagen */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#5F927B]" /> Imagen de Portada
              </h3>

              {imageUrl ? (
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-stone-200 group bg-stone-100">
                  <img
                    src={imageUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-full text-xs font-bold shadow-md cursor-pointer hover:bg-red-700"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center hover:border-[#5F927B] transition-colors">
                  <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-700 mb-1">Subir archivo o foto</p>
                  <p className="text-[11px] text-stone-400 mb-3">Recomendado: 800x600 o 16:9</p>
                  
                  <label className="inline-flex items-center justify-center px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                    <span>{isUploadingImage ? 'Subiendo...' : 'Seleccionar Imagen'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  O ingresar URL directa de la imagen:
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                />
              </div>
            </div>

            {/* Metadatos Adicionales */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#5F927B]" /> Metadatos y Estilo
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Etiqueta / Badge Flotante
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Ej. Domina tu mente, Calma Express"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Tiempo de lectura
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="6 min"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Autoría
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="FluxGlow Editorial"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
                  />
                </div>
              </div>
            </div>

            {/* Botón de Publicación */}
            <div className="bg-gradient-to-br from-[#FBF9F5] to-[#F5EFE6] rounded-3xl p-6 border border-[#E8E4DC] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3E6855]">
                <Sparkles className="w-4 h-4 text-[#E87A52]" />
                <span>Listo para la audiencia</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Al publicar, la guía se registrará en la base de datos de Supabase y quedará indexada de forma inmediata para todos los usuarios.
              </p>

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="w-full py-3.5 text-sm font-black shadow-md justify-center"
              >
                <Check className="w-4 h-4 mr-2" /> Publicar Guía Ahora
              </Button>
            </div>

          </div>

        </form>
        </div>
      )}

      {/* TAB 2: GESTIONAR GUÍAS EXISTENTES */}
      {activeTab === 'manage-guides' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-stone-200">
            <div>
              <h2 className="text-base font-bold text-stone-900">Catálogo General de Guías</h2>
              <p className="text-xs text-stone-500">
                Visualiza, accede directamente a su URL dinámica o retira contenidos según sea necesario.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={loadGuides}
              className="text-xs font-bold"
            >
              Actualizar
            </Button>
          </div>

          {isLoadingGuides ? (
            <div className="p-12 text-center text-stone-400">
              <div className="w-8 h-8 border-3 border-[#5F927B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Cargando guías...</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
              {/* Combinar dbGuides con DEMO_GUIDES_CATALOG */}
              {[...dbGuides, ...DEMO_GUIDES_CATALOG].map((guide, idx) => {
                const guideSlug = guide.slug || generateSlug(guide.title);
                return (
                  <div
                    key={guide.id || idx}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
                        <img
                          src={guide.image}
                          alt={guide.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold bg-white/95 text-stone-800 px-2 py-0.5 rounded-full shadow-2xs">
                            {guide.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="text-sm font-bold text-stone-900 line-clamp-2">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-stone-500 line-clamp-2">
                          {guide.simpleSummary}
                        </p>
                        <div className="pt-2 text-[11px] font-mono text-stone-400">
                          Slug: <span className="text-[#3E6855]">/explora/{guideSlug}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/explora/${guideSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#3E6855] hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setGuideToEdit(guide);
                            setShowInSituEditor(true);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-[#5F927B] px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Editar en el creador oficial"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Editar
                        </button>
                      </div>

                      {guide.id.startsWith('guide-') ? (
                        <span className="text-[10px] text-stone-400 italic">Preinstalada</span>
                      ) : (
                        <button
                          onClick={() => handleDeleteGuide(guide.id)}
                          className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar guía"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MODERACIÓN DE COMUNIDAD */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-stone-200">
            <div>
              <h2 className="text-base font-bold text-stone-900">Control de Publicaciones de la Comunidad</h2>
              <p className="text-xs text-stone-500">
                Supervisa el feed social, elimina mensajes inapropiados o suspende usuarios infractores.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={loadPosts}
              className="text-xs font-bold"
            >
              Recargar Feed
            </Button>
          </div>

          {isLoadingPosts ? (
            <div className="p-12 text-center text-stone-400">
              <div className="w-8 h-8 border-3 border-[#5F927B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Cargando publicaciones...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
              <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-700">No hay publicaciones para moderar</p>
              <p className="text-xs text-stone-400">Todas las entradas están al día.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-stone-900">
                        {post.author}
                      </span>
                      <span className="text-[10px] text-stone-400">•</span>
                      <span className="text-[10px] font-semibold text-[#5F927B] bg-[#5F927B]/10 px-2 py-0.5 rounded-md">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-stone-400">• {post.timeAgo}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="text-[11px] text-stone-400 flex items-center gap-3">
                      <span>👍 {post.likes} apoyos</span>
                      <span>💬 {(post.comments || []).length} comentarios</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBanUser(post.id, post.author)}
                      className="text-xs font-bold text-amber-700 border-amber-200 hover:bg-amber-50"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Suspender
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-xs font-bold text-red-700 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL DEL CREADOR/EDITOR OFICIAL DE GUÍAS DE FLUXGLOW */}
      {showInSituEditor && (
        <GuideInSituEditor
          initialGuide={guideToEdit}
          onClose={() => {
            setShowInSituEditor(false);
            setGuideToEdit(null);
          }}
          onSaved={(savedGuide) => {
            setShowInSituEditor(false);
            setGuideToEdit(null);
            loadGuides();
            success('Guía guardada', `La guía "${savedGuide.title}" ha sido procesada correctamente.`);
          }}
        />
      )}

    </div>
  );
};
