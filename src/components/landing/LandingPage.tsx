import React, { useState } from 'react';
import { ViewMode, UserProfileData } from '../../types';
import { TeamSection } from './TeamSection';
import { InterfacesShowcase } from './InterfacesShowcase';
import { ContactSection } from './ContactSection';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { AuthModals } from '../common/AuthModals';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Lightbulb, 
  Waves, 
  SunMedium, 
  ShieldCheck, 
  Zap,
  Info,
  User,
  Layers,
  ChevronDown
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: ViewMode) => void;
  currentUser?: UserProfileData;
  onAuthSuccess?: (targetView: ViewMode, userProfile?: Partial<UserProfileData>) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate,
  currentUser,
  onAuthSuccess 
}) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const combinedFeatures = [
    { title: 'Educación emocional', desc: 'Recursos interactivos para comprender la mente y el cuerpo.' },
    { title: 'Monitoreo diario del estado de ánimo', desc: 'Registro de hábitos, energía, sueño y emociones.' },
    { title: 'Inteligencia artificial empática', desc: 'Modelos avanzados para acompañamiento y contención.' },
    { title: 'Análisis predictivo preventivo', desc: 'Detección temprana de sobrecarga y estrés antes de crisis.' },
    { title: 'Recomendaciones personalizadas', desc: 'Actividades y guías a tu propio ritmo.' },
    { title: 'Comunidad de apoyo segura', desc: 'Espacio libre de juicios moderado por expertos.' },
    { title: 'Integración inteligente', desc: 'Conexión con rutinas diarias y bienestar integral.' },
  ];

  const specificObjectives = [
    'Fomentar la educación emocional accesible y sin tecnicismos.',
    'Detectar cambios emocionales importantes y picos de sobrecarga.',
    'Promover hábitos saludables de sueño, hidratación y pausas activas.',
    'Brindar herramientas de regulación emocional (respiración 4-7-8, grounding).',
    'Reducir el estrés y la ansiedad académica y cotidiana.',
    'Facilitar el acceso inmediato a recursos de apoyo psicológico.',
    'Utilizar inteligencia artificial para personalizar la experiencia de cada usuario.'
  ];

  return (
    <div className="bg-[#faf7f2] text-stone-800">
      
      {/* Top Banner Navigation matching screenshot header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo on top-left */}
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <FluxGlowLogo size="sm" />
            </div>

            {/* Quick in-page nav (Desktop) */}
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
              <a href="#que-es" className="hover:text-[#4a7c59] transition-colors">¿Qué es?</a>
              <a href="#origen" className="hover:text-[#4a7c59] transition-colors">Origen</a>
              <a href="#objetivos" className="hover:text-[#4a7c59] transition-colors">Objetivos</a>
              <a href="#mision-vision" className="hover:text-[#4a7c59] transition-colors">Misión</a>
              <a href="#diseno" className="hover:text-[#4a7c59] transition-colors">7 Módulos</a>
              <a href="#equipo" className="hover:text-[#4a7c59] transition-colors">Equipo</a>
            </div>

            {/* Right actions matching screenshot: (i) Regístrate | 👤 Iniciar sesión */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                id="top-nav-register-btn"
                onClick={() => openAuth('register')}
                className="flex items-center gap-1.5 text-stone-800 hover:text-[#4a7c59] text-sm sm:text-base font-semibold transition-colors py-1 px-2 rounded-lg"
              >
                <div className="w-5 h-5 rounded-full border border-stone-400 flex items-center justify-center text-xs font-serif text-stone-600">
                  i
                </div>
                <span>Regístrate</span>
              </button>

              <button
                id="top-nav-login-btn"
                onClick={() => openAuth('login')}
                className="flex items-center gap-1.5 text-stone-800 hover:text-[#d4622a] text-sm sm:text-base font-semibold transition-colors py-1 px-2 rounded-lg"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" />
                <span>Iniciar sesión</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* SECCIÓN HERO PRINCIPAL RECREADA EXACTAMENTE COMO LA CAPTURA */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 bg-white border-b border-stone-200/80 overflow-hidden" id="inicio">
        
        {/* Soft background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#8DB596]/15 via-[#D8C97B]/15 to-[#E89A6B]/15 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          
          {/* Main Big FluxGlow Logo with sunburst, star and leaf sprouts */}
          <div className="flex justify-center mb-6">
            <FluxGlowLogo size="xl" showText={true} />
          </div>

          {/* Main Headline exact text: "Inteligente y a tu alcance" */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-black mb-5 font-sans leading-tight">
            Inteligente y a tu alcance
          </h1>

          {/* Subtitle text matching reference screenshot */}
          <p className="text-base sm:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            Transforma tu salud emocional con una plataforma que te entiende. Centraliza tu aprendizaje, registra tu progreso y recibe apoyo personalizado, todo en un solo lugar.
          </p>

          {/* Two Pill Buttons matching reference screenshot */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 max-w-xl mx-auto">
            
            {/* Green / Sage Pill Button: Regístrate */}
            <button
              id="hero-pill-register"
              onClick={() => openAuth('register')}
              className="w-full sm:w-60 py-3.5 px-8 rounded-full bg-[#5a8c72] hover:bg-[#4d7962] text-black font-extrabold text-base shadow-sm hover:shadow-md transition-all duration-200 text-center transform hover:-translate-y-0.5"
            >
              Regístrate
            </button>

            {/* Terracotta Orange Pill Button: Iniciar sesión */}
            <button
              id="hero-pill-login"
              onClick={() => openAuth('login')}
              className="w-full sm:w-60 py-3.5 px-8 rounded-full bg-[#e07a52] hover:bg-[#cf6b45] text-black font-extrabold text-base shadow-sm hover:shadow-md transition-all duration-200 text-center transform hover:-translate-y-0.5"
            >
              Iniciar sesión
            </button>

          </div>

          {/* Direct interactive demo bypass */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              id="hero-guest-explore-btn"
              onClick={() => onNavigate('learn')}
              className="text-xs sm:text-sm font-semibold text-[#4a7c59] hover:text-[#2d5a3f] flex items-center gap-1.5 underline underline-offset-4 py-1"
            >
              <span>O explora la aplicación interactiva de inmediato</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scroll Down Hint */}
          <div className="mt-12">
            <a 
              href="#que-es" 
              className="inline-flex flex-col items-center text-xs text-stone-400 hover:text-stone-700 transition-colors gap-1"
            >
              <span>Conoce todo sobre FluxGlow</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>

        </div>
      </section>

      {/* SECCIÓN ¿QUÉ ES FLUXGLOW? */}
      <section className="py-20 bg-[#faf7f2] border-b border-stone-200" id="que-es">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a7c59]/10 text-[#4a7c59] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma de Salud Emocional</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#4a7c59] via-[#8DB596] to-[#d4622a] bg-clip-text text-transparent uppercase">
              ¿QUÉ ES FLUXGLOW?
            </h2>
          </div>

          {/* Fila 1: Descripción + Tarjeta Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-base sm:text-lg text-stone-700 leading-relaxed text-justify">
                <strong>FLUXGLOW</strong> es una plataforma digital inteligente diseñada para acompañar a las personas en el conocimiento, gestión y fortalecimiento de su salud emocional mediante tecnología, inteligencia artificial y herramientas de autoconocimiento.
              </p>
              <p className="text-base sm:text-lg text-stone-700 leading-relaxed text-justify">
                Su propósito es ayudar a los usuarios a comprender cómo se sienten, identificar patrones emocionales, desarrollar hábitos saludables y recibir apoyo personalizado para mejorar su bienestar mental y emocional.
              </p>

              <div className="p-4 rounded-2xl bg-white border border-[#e8dfd5] flex items-center gap-3 shadow-xs">
                <div className="p-2.5 bg-[#4a7c59] text-white rounded-xl shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm text-stone-700 font-medium">
                  Un espacio 100% confidencial, amigable y diseñado pensando en la juventud de 15 a 30 años.
                </p>
              </div>
            </div>

            {/* Tarjeta Interactiva Flujo Visual */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#8DB596] via-[#D8C97B] to-[#E89A6B] p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                  Ecosistema Integral
                </span>
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <h4 className="text-2xl font-extrabold">Acompañamiento Inteligente 24/7</h4>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                No solo registras emociones; FluxGlow predice momentos de riesgo y te ofrece herramientas antes de que el estrés se convierta en crisis.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs font-semibold">
                <span>Bienestar Preventivo</span>
                <span>100% Adaptativo</span>
              </div>
            </div>
          </div>

          {/* Fila 2: FLUXGLOW COMBINA */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#d4622a]" />
              <span>FLUXGLOW combina:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {combinedFeatures.map((feat, idx) => (
                <div key={idx} className="bg-[#faf7f2] p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4a7c59] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{feat.title}</h4>
                    <p className="text-xs text-stone-600 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN ORIGEN DE FLUXGLOW */}
      <section className="py-20 bg-white border-b border-stone-200" id="origen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4622a]/10 text-[#d4622a] text-xs font-bold uppercase tracking-wider mb-3">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Identidad & Filosofía</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#4a7c59] via-[#8DB596] to-[#d4622a] bg-clip-text text-transparent uppercase mb-4">
              ORIGEN DE FLUXGLOW
            </h2>
            <p className="text-stone-600 text-base md:text-lg">
              El nombre <strong>FLUXGLOW</strong> nace de la unión armónica de dos conceptos fundamentales de la experiencia humana:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: FLUJO */}
            <div className="bg-[#faf7f2] p-8 rounded-3xl border border-orange-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#d4622a] flex items-center justify-center mb-5">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#d4622a] mb-2">FLUJO (Flux)</h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed text-justify">
                Representa el flujo constante de las emociones humanas. Las emociones cambian día a día, momento a momento, y forman parte natural de la vida. No hay emociones buenas o malas, sino estados en continuo movimiento.
              </p>
            </div>

            {/* Card 2: BRILLO */}
            <div className="bg-[#faf7f2] p-8 rounded-3xl border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <SunMedium className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#b8860b] mb-2">BRILLO (Glow)</h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed text-justify">
                Significa brillo, luz y crecimiento. Representa la capacidad que tiene cada persona de encontrar el equilibrio emocional, iluminar sus fortalezas y superar con resiliencia los desafíos cotidianos.
              </p>
            </div>

            {/* Card 3: SIGNIFICADO COMPLETO */}
            <div className="bg-gradient-to-br from-[#4a7c59] to-[#2d6a4f] p-8 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                  <Lightbulb className="w-6 h-6 text-amber-200" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Significado Completo</h3>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed text-justify">
                  FLUXGLOW significa <strong>"iluminar el flujo de las emociones"</strong>. La plataforma ayuda a transformar emociones difíciles en oportunidades de crecimiento personal y bienestar duradero.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20 text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Transformando retos en evolución personal</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN OBJETIVO GENERAL & ESPECÍFICOS */}
      <section className="py-20 bg-[#faf7f2] border-b border-stone-200" id="objetivos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Objetivo General */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4622a]/10 text-[#d4622a] text-xs font-bold uppercase tracking-wider border border-[#d4622a]/20">
                <Target className="w-3.5 h-3.5" />
                <span>Propósito Central</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#d4622a] font-serif">
                OBJETIVO GENERAL
              </h2>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed text-justify">
                Desarrollar una plataforma digital inteligente que promueva el bienestar emocional mediante el monitoreo, análisis y acompañamiento personalizado de las emociones de los usuarios.
              </p>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Innovación Principal
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Lo que hace único a FLUXGLOW no es solo registrar estados de ánimo, sino <strong>predecir riesgos emocionales</strong> y ofrecer apoyo personalizado antes de que los problemas se agraven.
                </p>
              </div>
            </div>

            {/* Objetivos Específicos */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#4a7c59]" />
                <span>OBJETIVOS ESPECÍFICOS:</span>
              </h3>

              <div className="space-y-3">
                {specificObjectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-[#faf7f2] rounded-2xl border border-stone-200/80 shadow-xs">
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#8DB596] to-[#4a7c59] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                      {obj}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN MISIÓN Y VISIÓN */}
      <section className="py-20 bg-white border-b border-stone-200" id="mision-vision">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* MISIÓN */}
            <div className="bg-[#faf7f2] p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a7c59]/10 text-[#4a7c59] text-xs font-bold uppercase tracking-wider">
                <span>Razón de Ser</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#4a7c59] to-[#8DB596] bg-clip-text text-transparent">
                MISIÓN
              </h2>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed text-justify">
                FluxGlow es una empresa donde buscamos brindar a los jóvenes de 15-18 años (y juventud hasta 30 años) una página digital accesible, segura e inteligente que se centra en la educación emocional, el registro diario de hábitos y el análisis de su progreso, buscando que los jóvenes se sientan seguros, transformando la información confiable en herramientas prácticas para la gestión del estrés y la ansiedad.
              </p>
            </div>

            {/* VISIÓN */}
            <div className="bg-[#faf7f2] p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4622a]/10 text-[#d4622a] text-xs font-bold uppercase tracking-wider">
                <span>Horizonte a Futuro</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#d4622a] to-[#E89A6B] bg-clip-text text-transparent">
                VISIÓN
              </h2>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed text-justify">
                Convertirnos en una plataforma web líder de apoyo emocional y prevención en el ámbito educativo de la salud emocional en Latinoamérica, siendo reconocidos por transformar la cultura de la salud mental en la juventud, promoviendo entornos más empáticos y conscientes del bienestar integral.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN ¿QUIÉNES SOMOS? (Equipo Fundador) */}
      <TeamSection />

      {/* SECCIÓN DISEÑO: INTERFACES DE LA PLATAFORMA (7 APARTADOS) */}
      <InterfacesShowcase onNavigate={onNavigate} />

      {/* SECCIÓN CONTACTO */}
      <ContactSection />

      {/* Auth Modals */}
      <AuthModals
        isOpen={authModalOpen}
        initialMode={authMode}
        currentUser={currentUser}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(targetView, updatedProfile) => {
          setAuthModalOpen(false);
          if (onAuthSuccess) {
            onAuthSuccess(targetView || 'learn', updatedProfile);
          } else {
            onNavigate(targetView || 'learn');
          }
        }}
      />

    </div>
  );
};

