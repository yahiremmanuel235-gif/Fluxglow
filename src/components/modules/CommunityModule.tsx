import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Users, 
  Trophy, 
  Award, 
  Send, 
  Heart, 
  MessageCircle, 
  Smile, 
  Share2, 
  ShieldCheck, 
  CheckCircle2,
  X,
  ArrowRight,
  UserCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { CommunityPost } from '../../types';
import { MOCK_COMMUNITY_POSTS } from '../../data/mockData';
import { useToast } from '../common/Toast';
import { Button } from '../common/Button';

export const CommunityModule: React.FC = () => {
  const { success, warning, info } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('fluxglow_community_posts');
    return saved ? JSON.parse(saved) : MOCK_COMMUNITY_POSTS;
  });

  const [postText, setPostText] = useState('');
  const [selectedForum, setSelectedForum] = useState('Motivación Personal');
  const [joinedGroups, setJoinedGroups] = useState<string[]>(['Estudiantes Universitarios']);
  const [enrolledChallenges, setEnrolledChallenges] = useState<string[]>(['Gratitud Diaria']);

  // 1. Foros Moderados
  const forums = [
    { name: 'Estrés Académico', icon: '🎓', count: '142 temas' },
    { name: 'Ansiedad y Bienestar', icon: '🌿', count: '289 temas' },
    { name: 'Motivación Personal', icon: '✨', count: '315 temas' },
    { name: 'Hábitos Saludables', icon: '💧', count: '198 temas' },
  ];

  // 2. Grupos de Apoyo
  const supportGroups = [
    { id: 'univ', name: 'Estudiantes Universitarios', icon: '📚', members: '120 participantes' },
    { id: 'estres', name: 'Manejo del Estrés', icon: '🧘', members: '95 participantes' },
    { id: 'crec', name: 'Crecimiento Personal', icon: '🌱', members: '87 participantes' },
  ];

  // 3. Retos Emocionales
  const challenges = [
    { id: 'gratitud', name: 'Gratitud Diaria', icon: '🙏', duration: '7 días', activeUsers: 340 },
    { id: 'sueno', name: 'Dormir 8 Horas', icon: '🌙', duration: '7 días', activeUsers: 210 },
    { id: 'registro', name: 'Registro Emocional', icon: '✍️', duration: '14 días', activeUsers: 512 },
  ];

  // 4. Reconocimientos
  const recognitions = [
    { badge: 'Miembro Activo', icon: '🌟', requirement: 'Participar durante 30 días seguidos' },
    { badge: 'Apoyo Constante', icon: '🤝', requirement: 'Ayudar a 10 miembros con palabras de ánimo' },
    { badge: 'Comunidad Destacada', icon: '👑', requirement: 'Participar activamente en foros y grupos' },
  ];

  const handleToggleGroup = (groupName: string) => {
    if (joinedGroups.includes(groupName)) {
      setJoinedGroups(joinedGroups.filter((g) => g !== groupName));
      info('Has salido del grupo', `Ya no recibirás notificaciones de ${groupName}`);
    } else {
      setJoinedGroups([...joinedGroups, groupName]);
      confetti({ particleCount: 25, spread: 45 });
      success('¡Te has unido al grupo!', `Ahora formas parte de ${groupName}. Puedes conversar con otros miembros.`);
    }
  };

  const handleToggleChallenge = (challengeName: string) => {
    if (enrolledChallenges.includes(challengeName)) {
      setEnrolledChallenges(enrolledChallenges.filter((c) => c !== challengeName));
      info('Reto pausado', `Has cancelado tu participación en ${challengeName}.`);
    } else {
      setEnrolledChallenges([...enrolledChallenges, challengeName]);
      confetti({ particleCount: 35, spread: 60 });
      success('¡Inscrito al reto!', `Has comenzado el reto "${challengeName}". ¡Mucho ánimo!`);
    }
  };

  const handlePublish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!postText.trim()) {
      warning('Mensaje requerido', 'Por favor escribe tu experiencia antes de publicar.');
      return;
    }

    const newPost: CommunityPost = {
      id: 'post-' + Date.now(),
      author: 'Tú (Comunidad)',
      authorAvatar: '/user.png',
      category: selectedForum,
      content: postText,
      timeAgo: 'Hace un momento',
      likes: 1,
      hugs: 1,
      commentsCount: 0,
      comments: []
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('fluxglow_community_posts', JSON.stringify(updated));
    setPostText('');

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    success('¡Publicación compartida!', 'Tu experiencia ha sido enviada al espacio seguro de FluxGlow.');
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleHug = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, hugs: p.hugs + 1 } : p));
    confetti({ particleCount: 20, spread: 40 });
  };

  return (
    <div className="w-full bg-brand-sand-50 min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">

        {/* Top Header with Brand Logo */}
        <div className="flex items-center justify-between py-2 border-b border-brand-sand-300 mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
          </div>

          <div className="text-xs font-semibold text-brand-sage-800 bg-brand-sage-100 border border-brand-sage-300 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-sage-600" />
            <span>Espacio 100% Moderado y Seguro</span>
          </div>
        </div>

        {/* Big Display Title: Comunidad FluxGlow */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-brand-sage-700">Comunidad </span>
            <span className="text-brand-terracotta-600">FluxGlow</span>
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">Conecta, comparte y avanza en compañía de personas como tú</p>
        </div>

        {/* TOP ROW: 4 Modern Rounded Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* CARD 1: 💬 Foros moderados */}
          <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
                  <span className="text-base">💬</span>
                  Foros moderados
                </h2>
                <span className="text-[10px] font-semibold text-stone-500">4 activos</span>
              </div>

              <div className="space-y-2">
                {forums.map((f, idx) => {
                  const isSelected = selectedForum === f.name;
                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedForum(f.name);
                        info('Foro seleccionado', `Ahora publicarás en "${f.name}"`);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-brand-sage-100 border-brand-sage-400 shadow-2xs' 
                          : 'bg-brand-sand-50 border-brand-sand-200 hover:bg-brand-sand-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm shrink-0">{f.icon}</span>
                        <div className="truncate">
                          <p className={`text-xs font-semibold truncate ${isSelected ? 'text-brand-sage-900 font-bold' : 'text-stone-800'}`}>
                            {f.name}
                          </p>
                          <span className="text-[10px] text-stone-500">{f.count}</span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected ? 'bg-brand-sage-600 text-white' : 'text-stone-500 bg-white border border-brand-sand-300'
                      }`}>
                        {isSelected ? 'Activo' : 'Ver'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 2: 👥 Grupos de apoyo */}
          <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
                  <span className="text-base">👥</span>
                  Grupos de apoyo
                </h2>
                <span className="text-[10px] font-semibold text-stone-500">Compañía</span>
              </div>

              <div className="space-y-2.5">
                {supportGroups.map((g) => {
                  const isJoined = joinedGroups.includes(g.name);
                  return (
                    <div 
                      key={g.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-brand-sand-50 border border-brand-sand-200 hover:border-brand-sand-300 transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-brand-sand-200 flex items-center justify-center text-xs shrink-0">
                          {g.icon}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-stone-900 truncate">{g.name}</p>
                          <p className="text-[10px] text-stone-500">{g.members}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleGroup(g.name)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                          isJoined
                            ? 'bg-brand-sage-100 text-brand-sage-900 border border-brand-sage-400'
                            : 'bg-stone-900 hover:bg-stone-800 text-white shadow-2xs'
                        }`}
                      >
                        {isJoined ? (
                          <>
                            <Check className="w-3 h-3 text-brand-sage-700" />
                            <span>Unido</span>
                          </>
                        ) : (
                          <span>Unirse</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 3: 🏆 Retos emocionales */}
          <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
                  <span className="text-base">🏆</span>
                  Retos emocionales
                </h2>
                <span className="text-[10px] font-semibold text-stone-500">Hábitos</span>
              </div>

              <div className="space-y-2.5">
                {challenges.map((c) => {
                  const isEnrolled = enrolledChallenges.includes(c.name);
                  return (
                    <div 
                      key={c.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-brand-sand-50 border border-brand-sand-200 hover:border-brand-sand-300 transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-brand-sage-100 flex items-center justify-center text-xs shrink-0">
                          {c.icon}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-stone-900 truncate">{c.name}</p>
                          <p className="text-[10px] text-stone-500">Duración: {c.duration}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleChallenge(c.name)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                          isEnrolled
                            ? 'bg-brand-sand-200 text-stone-900 border border-brand-sand-400 font-bold'
                            : 'bg-brand-sage-500 hover:bg-brand-sage-600 text-white shadow-2xs'
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <Check className="w-3 h-3 text-stone-800" />
                            <span>Inscrito</span>
                          </>
                        ) : (
                          <span>Aceptar</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 4: 🏅 Reconocimientos */}
          <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
                  <span className="text-base">🏅</span>
                  Reconocimientos
                </h2>
                <span className="text-[10px] font-semibold text-stone-500">Insignias</span>
              </div>

              <div className="space-y-2">
                {recognitions.map((r, idx) => (
                  <div key={idx} className="p-2.5 rounded-2xl bg-brand-sand-50 border border-brand-sand-200">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm">{r.icon}</span>
                      <p className="text-xs font-bold text-stone-900">{r.badge}</p>
                    </div>
                    <p className="text-[10.5px] text-stone-500 leading-tight pl-6">{r.requirement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM CARD: Compartir experiencias */}
        <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-6 sm:p-8 mb-10">
          
          <h2 className="text-2xl font-bold text-stone-900 mb-1 font-serif">
            Compartir experiencias
          </h2>
          <p className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <span>Foro actual:</span>
            <span className="bg-brand-sage-100 text-brand-sage-900 border border-brand-sage-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {selectedForum}
            </span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Input & Button Area (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="border border-dashed border-brand-sand-300 rounded-2xl p-4 bg-brand-sand-50">
                <textarea
                  id="community-experience-textarea"
                  rows={4}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Escribe aquí tu experiencia, tus reflexiones o palabras de aliento para la comunidad..."
                  className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 text-sm focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">Tu publicación será visible para todos los miembros</span>
                <Button
                  id="publish-experience-btn"
                  onClick={() => handlePublish()}
                  variant="primary"
                  size="md"
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Publicar
                </Button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-44 h-44 sm:w-52 sm:h-52 relative flex items-center justify-center">
                <img
                  src="/logo2.png"
                  alt="Comunidad unida FluxGlow"
                  className="w-full h-full object-contain p-4 rounded-3xl bg-brand-sand-50 border border-brand-sand-300 shadow-2xs"
                />
              </div>
              <span className="text-xs font-semibold text-stone-500 mt-2 text-center">
                Comunidad solidaria de apoyo mutuo en FluxGlow
              </span>
            </div>

          </div>

          {/* Feed of Shared Community Posts */}
          <div className="mt-8 pt-6 border-t border-brand-sand-300">
            <h3 className="text-sm font-bold text-stone-600 uppercase tracking-wider mb-4">
              Publicaciones Recientes de la Comunidad:
            </h3>

            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="bg-brand-sand-50 rounded-2xl p-4 border border-brand-sand-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <img src={post.authorAvatar || '/user.png'} alt={post.author} className="w-8 h-8 rounded-full object-cover border border-brand-sand-300" />
                      <div>
                        <p className="text-xs font-bold text-stone-900">{post.author}</p>
                        <span className="text-[10px] text-stone-500">{post.timeAgo} • Foro: {post.category}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed mb-3">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-stone-600">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>{post.likes} Me gusta</span>
                    </button>
                    <button 
                      onClick={() => handleHug(post.id)}
                      className="flex items-center gap-1 hover:text-brand-terracotta-600 transition-colors cursor-pointer"
                    >
                      <span>🤗 {post.hugs} Abrazos</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
