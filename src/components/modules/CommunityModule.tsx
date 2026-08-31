import React, { useState, useMemo } from 'react';
import { 
  Users, 
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
  Check,
  Sparkles,
  Info,
  Lock,
  Search,
  Plus,
  Compass,
  ThumbsUp,
  Tag,
  AlertCircle,
  HelpCircle,
  Clock,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { CommunityGroup, CommunityPost } from '../../types';
import { COMMUNITY_GROUPS, INITIAL_FACEBOOK_STYLE_POSTS } from '../../data/communityData';
import { useToast } from '../common/Toast';
import { Button } from '../common/Button';

export const CommunityModule: React.FC = () => {
  const { success, warning, info } = useToast();

  // Stored posts with fallback to clean Facebook-style initial posts
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_community_posts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FACEBOOK_STYLE_POSTS;
  });

  // User's joined groups (starts empty or with 1 sample group, editable)
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_joined_groups');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Selected active group for modal details & rules
  const [activeGroupModal, setActiveGroupModal] = useState<CommunityGroup | null>(null);

  // Feed filter: 'all' | 'my_groups' | groupId
  const [activeFeedFilter, setActiveFeedFilter] = useState<string>('all');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');

  // Post Creator State
  const [postContent, setPostContent] = useState('');
  const [selectedPostGroup, setSelectedPostGroup] = useState<string>(COMMUNITY_GROUPS[0].name);
  const [selectedFeeling, setSelectedFeeling] = useState<string>('🌿 En calma');
  const [isCreatingPostExpanded, setIsCreatingPostExpanded] = useState(false);

  // Comment input per post: { [postId: string]: string }
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);

  const FEELING_OPTIONS = [
    '🌿 En calma',
    '✨ Agradecido/a',
    '💭 Reflexivo/a',
    '🫂 Necesito desahogo',
    '🎯 Cumpliendo metas',
    '💪 Motivación recargada'
  ];

  // Save joined groups to localStorage
  const handleToggleJoinGroup = (groupId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const group = COMMUNITY_GROUPS.find(g => g.id === groupId);
    if (!group) return;

    if (joinedGroupIds.includes(groupId)) {
      const updated = joinedGroupIds.filter(id => id !== groupId);
      setJoinedGroupIds(updated);
      try {
        localStorage.setItem('fluxglow_joined_groups', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      info('Has salido del grupo', `Ya no estás suscrito a ${group.name}.`);
    } else {
      const updated = [...joinedGroupIds, groupId];
      setJoinedGroupIds(updated);
      try {
        localStorage.setItem('fluxglow_joined_groups', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      confetti({ particleCount: 30, spread: 50 });
      success('¡Te has unido al grupo!', `Bienvenido/a a "${group.name}". Ahora puedes ver sus temas en tu feed.`);
    }
  };

  const handlePublishPost = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!postContent.trim()) {
      warning('Escribe un mensaje', 'Por favor redacta lo que deseas compartir en la comunidad.');
      return;
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: 'Tú (Usuario FluxGlow)',
      authorRole: 'Miembro de la Comunidad',
      authorAvatar: '/user.png',
      avatarColor: '#548c71',
      timeAgo: 'Hace un momento',
      content: postContent.trim(),
      category: selectedPostGroup,
      tags: [selectedFeeling.split(' ')[1] || 'Bienestar', 'Comunidad'],
      likes: 1,
      hugs: 1,
      commentsCount: 0,
      comments: []
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    try {
      localStorage.setItem('fluxglow_community_posts', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setPostContent('');
    setIsCreatingPostExpanded(false);
    confetti({ particleCount: 35, spread: 60 });
    success('¡Publicado con éxito!', 'Tu mensaje ha sido compartido en la comunidad de manera segura.');
  };

  const handleLike = (postId: string) => {
    const updated = posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    setPosts(updated);
    try {
      localStorage.setItem('fluxglow_community_posts', JSON.stringify(updated));
    } catch (err) {}
  };

  const handleHug = (postId: string) => {
    const updated = posts.map(p => p.id === postId ? { ...p, hugs: p.hugs + 1 } : p);
    setPosts(updated);
    try {
      localStorage.setItem('fluxglow_community_posts', JSON.stringify(updated));
    } catch (err) {}
    confetti({ particleCount: 20, spread: 40 });
    success('Abrazo enviado', 'Has enviado un abrazo solidario a esta publicación.');
  };

  const handleAddComment = (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const updated = posts.map(p => {
      if (p.id === postId) {
        const newComments = [
          ...(p.comments || []),
          {
            id: `c-${Date.now()}`,
            author: 'Tú (Usuario)',
            text,
            timeAgo: 'Hace un momento'
          }
        ];
        return {
          ...p,
          commentsCount: newComments.length,
          comments: newComments
        };
      }
      return p;
    });

    setPosts(updated);
    try {
      localStorage.setItem('fluxglow_community_posts', JSON.stringify(updated));
    } catch (err) {}

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    success('Comentario añadido', 'Tu respuesta empática ha sido compartida.');
  };

  // Filtered groups
  const filteredGroups = useMemo(() => {
    if (!groupSearchQuery.trim()) return COMMUNITY_GROUPS;
    const q = groupSearchQuery.toLowerCase();
    return COMMUNITY_GROUPS.filter(g => 
      g.name.toLowerCase().includes(q) || 
      g.description.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q)
    );
  }, [groupSearchQuery]);

  // Filtered posts based on active feed tab
  const filteredPosts = useMemo(() => {
    if (activeFeedFilter === 'all') return posts;
    if (activeFeedFilter === 'my_groups') {
      const myGroupNames = COMMUNITY_GROUPS
        .filter(g => joinedGroupIds.includes(g.id))
        .map(g => g.name.toLowerCase());
      if (myGroupNames.length === 0) return posts;
      return posts.filter(p => myGroupNames.includes(p.category.toLowerCase()));
    }
    // Specific group
    const targetGroup = COMMUNITY_GROUPS.find(g => g.id === activeFeedFilter);
    if (!targetGroup) return posts;
    return posts.filter(p => p.category.toLowerCase() === targetGroup.name.toLowerCase());
  }, [posts, activeFeedFilter, joinedGroupIds]);

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">

        {/* Top Header Row with Logo */}
        <div className="flex items-center justify-between py-2 border-b border-brand-sand-300 mb-6">
          <div className="flex items-center gap-3">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
            <span className="hidden sm:inline text-xs font-bold text-brand-sage-700 bg-brand-sage-100 px-3 py-1 rounded-full border border-brand-sage-300">
              👥 Comunidad & Grupos de Apoyo
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveGroupModal(COMMUNITY_GROUPS[0]);
              }}
              className="text-xs font-semibold text-stone-600 hover:text-brand-sage-700 bg-white border border-brand-sand-300 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-brand-sand-100 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#548c71]" />
              <span className="hidden sm:inline">Normas de Convivencia</span>
              <span className="sm:hidden">Normas</span>
            </button>
          </div>
        </div>

        {/* Facebook-style 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================== */}
          {/* LEFT SIDEBAR: GRUPOS DE LA COMUNIDAD (TIPO FACEBOOK)    */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-sage-600" />
                  <span>Grupos de Apoyo</span>
                </h2>
                <span className="text-xs font-bold text-brand-sage-700 bg-brand-sage-50 px-2 py-0.5 rounded-full border border-brand-sage-200">
                  {COMMUNITY_GROUPS.length}
                </span>
              </div>

              <p className="text-xs text-stone-500 mb-3">
                Explora grupos seguros, revisa sus normas y únete para compartir experiencias afines.
              </p>

              {/* Group Search input */}
              <div className="relative flex items-center bg-brand-sand-50 rounded-xl border border-stone-200 px-3 py-2 text-xs mb-3 focus-within:border-brand-sage-500">
                <Search className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                  placeholder="Buscar grupos..."
                  className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 focus:outline-none"
                />
                {groupSearchQuery && (
                  <button onClick={() => setGroupSearchQuery('')} className="text-stone-400 hover:text-stone-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Feed Filter Shortcuts */}
              <div className="space-y-1 mb-4">
                <button
                  onClick={() => setActiveFeedFilter('all')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    activeFeedFilter === 'all'
                      ? 'bg-brand-sage-700 text-white font-bold shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🌐</span>
                    <span>Feed General (Todos)</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveFeedFilter('my_groups')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    activeFeedFilter === 'my_groups'
                      ? 'bg-brand-sage-700 text-white font-bold shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>⭐</span>
                    <span>Mis Grupos Unidos</span>
                  </span>
                  <span className="text-[11px] opacity-80">({joinedGroupIds.length})</span>
                </button>
              </div>

              <div className="border-t border-stone-100 pt-3">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  Directorio de Grupos
                </span>

                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredGroups.map((group) => {
                    const isJoined = joinedGroupIds.includes(group.id);
                    const isSelectedFilter = activeFeedFilter === group.id;

                    return (
                      <div
                        key={group.id}
                        onClick={() => setActiveGroupModal(group)}
                        className={`group p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                          isSelectedFilter
                            ? 'bg-brand-sage-50/80 border-brand-sage-400 shadow-xs'
                            : 'bg-white hover:bg-brand-sand-50/70 border-stone-200'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-brand-sand-100 flex items-center justify-center text-xl shrink-0 border border-stone-200">
                            {group.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-bold text-stone-900 group-hover:text-brand-sage-700 transition-colors leading-snug line-clamp-1">
                              {group.name}
                            </h3>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                              {group.description}
                            </p>
                            <span className="text-[10px] text-stone-400 mt-1 block">
                              👥 {group.membersCount + (isJoined ? 1 : 0)} miembros
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveGroupModal(group);
                            }}
                            className="text-brand-sage-700 hover:underline font-semibold flex items-center gap-1"
                          >
                            <Info className="w-3 h-3" /> Ver info y normas
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleToggleJoinGroup(group.id, e)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 ${
                              isJoined
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-brand-sage-600 hover:bg-brand-sage-700 text-white shadow-2xs'
                            }`}
                          >
                            {isJoined ? (
                              <>
                                <Check className="w-2.5 h-2.5" /> Miembro
                              </>
                            ) : (
                              <>
                                <Plus className="w-2.5 h-2.5" /> Unirme
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* CENTER FEED: PUBLICAR Y FEED TIPO FACEBOOK               */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 xl:col-span-6 space-y-5">
            
            {/* 1. Post Creator Box (Tipo Facebook) */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
              <div className="flex items-start gap-3 mb-3">
                <img
                  src="/user.png"
                  alt="Tu perfil"
                  className="w-10 h-10 rounded-full border border-stone-200 bg-stone-100 object-cover shrink-0"
                />
                <div className="flex-1">
                  <textarea
                    rows={isCreatingPostExpanded ? 3 : 2}
                    value={postContent}
                    onFocus={() => setIsCreatingPostExpanded(true)}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="¿Qué estás pensando o sintiendo hoy? Comparte en este espacio seguro..."
                    className="w-full text-xs sm:text-sm bg-brand-sand-50/80 rounded-2xl p-3.5 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-sage-500 focus:bg-white text-stone-800 placeholder-stone-400 resize-none transition-all"
                  />
                </div>
              </div>

              {/* Extended Options Bar */}
              <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Selectors for Group & Emotion feeling */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Target Group Selector */}
                  <div className="flex items-center gap-1 bg-stone-100 rounded-xl px-2.5 py-1 text-xs border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-semibold">Grupo:</span>
                    <select
                      value={selectedPostGroup}
                      onChange={(e) => setSelectedPostGroup(e.target.value)}
                      className="bg-transparent border-none text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
                    >
                      {COMMUNITY_GROUPS.map(g => (
                        <option key={g.id} value={g.name}>
                          {g.icon} {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Feeling selector */}
                  <div className="flex items-center gap-1 bg-stone-100 rounded-xl px-2.5 py-1 text-xs border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-semibold">Estado:</span>
                    <select
                      value={selectedFeeling}
                      onChange={(e) => setSelectedFeeling(e.target.value)}
                      className="bg-transparent border-none text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
                    >
                      {FEELING_OPTIONS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Publish Button */}
                <Button
                  onClick={handlePublishPost}
                  variant="primary"
                  disabled={!postContent.trim()}
                  className="px-5 py-2 text-xs font-bold shadow-xs shrink-0 self-end sm:self-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Publicar
                </Button>
              </div>
            </div>

            {/* Active Feed Header Banner */}
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-brand-sage-600" />
                <span>
                  {activeFeedFilter === 'all' 
                    ? 'Publicaciones recientes de toda la comunidad' 
                    : activeFeedFilter === 'my_groups'
                    ? 'Publicaciones de tus grupos unidos'
                    : `Feed del grupo: ${COMMUNITY_GROUPS.find(g => g.id === activeFeedFilter)?.name || ''}`
                  }
                </span>
              </span>
              <span className="text-xs text-stone-400">
                {filteredPosts.length} publicaciones
              </span>
            </div>

            {/* 2. Posts Feed */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-sand-100 text-stone-400 mx-auto flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-stone-800">Aún no hay publicaciones en este filtro</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Sé el primero en compartir una reflexión o experiencia en este espacio de confianza.
                </p>
                <Button
                  onClick={() => setActiveFeedFilter('all')}
                  variant="outline"
                  className="text-xs font-semibold"
                >
                  Ver todas las publicaciones
                </Button>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isCommentsOpen = openCommentsPostId === post.id;
                const currentCommentText = commentInputs[post.id] || '';

                return (
                  <article 
                    key={post.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4 hover:border-stone-300 transition-all"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar || '/user.png'}
                          alt={post.author}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-stone-200 bg-stone-100 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                              {post.author}
                            </h4>
                            {post.authorRole && (
                              <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                                {post.authorRole}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                            <span className="font-semibold text-brand-sage-700 bg-brand-sage-50 px-2 py-0.5 rounded-md border border-brand-sage-200/60">
                              {post.category}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {post.timeAgo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Post Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {post.tags.map((t, tidx) => (
                          <span 
                            key={tidx}
                            className="text-[10px] font-semibold text-stone-600 bg-brand-sand-100 px-2.5 py-0.5 rounded-full border border-brand-sand-200"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Reaction Stats Counter Bar */}
                    <div className="flex items-center justify-between text-[11px] text-stone-400 pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          👍 <strong className="text-stone-700">{post.likes}</strong> identificaciones
                        </span>
                        <span className="flex items-center gap-1">
                          🫂 <strong className="text-stone-700">{post.hugs}</strong> abrazos
                        </span>
                      </div>
                      <span>{(post.comments || []).length} comentarios</span>
                    </div>

                    {/* Action Bar (Like, Hug, Comment, Share) */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-xs">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="py-2 px-2 rounded-xl text-stone-600 hover:text-brand-sage-700 hover:bg-stone-50 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-4 h-4 text-brand-sage-600" />
                        <span>Me sirve</span>
                      </button>

                      <button
                        onClick={() => handleHug(post.id)}
                        className="py-2 px-2 rounded-xl text-stone-600 hover:text-amber-700 hover:bg-amber-50/70 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>Abrazo</span>
                      </button>

                      <button
                        onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                        className="py-2 px-2 rounded-xl text-stone-600 hover:text-brand-terracotta-700 hover:bg-stone-50 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-brand-terracotta-500" />
                        <span>Comentar</span>
                      </button>
                    </div>

                    {/* Comments Drawer (Facebook-style) */}
                    {isCommentsOpen && (
                      <div className="bg-brand-sand-50/90 rounded-2xl p-4 border border-brand-sand-200 space-y-3 animate-fadeIn">
                        <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                          Comentarios ({post.comments?.length || 0})
                        </span>

                        {/* Existing Comments */}
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                          {(post.comments && post.comments.length > 0) ? (
                            post.comments.map((comment) => (
                              <div key={comment.id} className="bg-white p-3 rounded-xl border border-stone-200 text-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-stone-900">{comment.author}</span>
                                  <span className="text-[10px] text-stone-400">{comment.timeAgo}</span>
                                </div>
                                <p className="text-stone-700 leading-snug">{comment.text}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-stone-400 italic">
                              Aún no hay comentarios. Escribe unas palabras de aliento.
                            </p>
                          )}
                        </div>

                        {/* Comment Input */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            value={currentCommentText}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id);
                              }
                            }}
                            placeholder="Escribe una respuesta comprensiva..."
                            className="flex-1 px-3.5 py-2 text-xs bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-sage-500"
                          />
                          <Button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!currentCommentText.trim()}
                            variant="primary"
                            className="px-3.5 py-2 text-xs font-bold"
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}

          </div>

          {/* ======================================================== */}
          {/* RIGHT SIDEBAR: NORMAS, RETOS Y SOS                       */}
          {/* ======================================================== */}
          <div className="lg:col-span-12 xl:col-span-3 space-y-4">
            
            {/* Normas Rápidas Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-brand-sage-50 rounded-3xl p-5 border border-brand-sage-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-brand-sage-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-[#548c71]" />
                <span>Espacio Seguro FluxGlow</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Nuestra comunidad está diseñada para acompañarte sin juicios ni comparaciones tóxicas.
              </p>
              <ul className="space-y-1.5 text-xs text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Respeto absoluto y empatía activa</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Confidencialidad de testimonios</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>No dar prescripciones médicas</span>
                </li>
              </ul>
            </div>

            {/* Retos Colectivos */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Retos de la Semana</span>
                </h3>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-950">
                    <span>🌙 Cero Pantallas 30min antes</span>
                    <span className="text-[10px] bg-amber-200/60 px-2 py-0.5 rounded-full">Activo</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    260 personas unidas para mejorar su calidad de sueño esta semana.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span>🙏 3 Cosas de Gratitud Diaria</span>
                    <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded-full">Activo</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    382 personas registrando 3 motivos de gratitud al atardecer.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* VENTANA DE LA COMUNIDAD (MODAL CON INFO, NORMAS Y ESPACIO)*/}
      {/* ======================================================== */}
      {activeGroupModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Cover Header */}
            <div className="relative h-40 sm:h-48 w-full bg-stone-900 overflow-hidden">
              <img
                src={activeGroupModal.coverImage}
                alt={activeGroupModal.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setActiveGroupModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title and Icon */}
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white text-3xl flex items-center justify-center shadow-lg border border-stone-200 shrink-0">
                    {activeGroupModal.icon}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold-300 bg-black/40 px-2.5 py-0.5 rounded-full border border-brand-gold-300/30">
                      {activeGroupModal.category}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white leading-tight mt-0.5">
                      {activeGroupModal.name}
                    </h2>
                  </div>
                </div>

                <div className="hidden sm:block text-xs text-brand-sand-300">
                  👥 {activeGroupModal.membersCount + (joinedGroupIds.includes(activeGroupModal.id) ? 1 : 0)} miembros
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* About Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#548c71] flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  <span>¿De qué trata esta comunidad?</span>
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {activeGroupModal.description}
                </p>
                <div className="bg-brand-sand-50 rounded-2xl p-4 border border-brand-sand-200 text-xs text-stone-700">
                  <strong className="text-stone-900 block mb-1">Propósito principal:</strong>
                  {activeGroupModal.purpose}
                </div>
              </div>

              {/* Normas del Grupo */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-terracotta-600" />
                  <span>Normas de Convivencia y Seguridad</span>
                </h4>
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2.5">
                  {activeGroupModal.rules.map((rule, ridx) => (
                    <div key={ridx} className="flex items-start gap-2.5 text-xs text-stone-800">
                      <span className="w-5 h-5 rounded-full bg-brand-sage-100 text-brand-sage-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {ridx + 1}
                      </span>
                      <span className="leading-snug">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Espacio para escribir directamente en este grupo */}
              <div className="bg-gradient-to-br from-brand-sage-50 to-emerald-50 rounded-2xl p-4 border border-brand-sage-200 space-y-2">
                <h5 className="text-xs font-bold text-brand-sage-900 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-brand-sage-700" />
                  <span>¿Quieres escribir algo en {activeGroupModal.name}?</span>
                </h5>
                <p className="text-[11px] text-stone-600">
                  Puedes seleccionar este grupo en la caja de publicación del feed principal y compartir tus vivencias.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                {joinedGroupIds.includes(activeGroupModal.id) ? 'Ya eres miembro de este grupo' : 'Únete para participar'}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleToggleJoinGroup(activeGroupModal.id)}
                  variant={joinedGroupIds.includes(activeGroupModal.id) ? 'outline' : 'primary'}
                  className="px-5 py-2.5 text-xs font-bold shadow-xs"
                >
                  {joinedGroupIds.includes(activeGroupModal.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" /> Eres Miembro (Salir)
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 mr-1" /> Unirme a este Grupo
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => {
                    setSelectedPostGroup(activeGroupModal.name);
                    setActiveFeedFilter(activeGroupModal.id);
                    setActiveGroupModal(null);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  variant="outline"
                  className="px-4 py-2.5 text-xs font-bold text-brand-sage-800 border-brand-sage-300"
                >
                  Ver Feed de este Grupo <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
