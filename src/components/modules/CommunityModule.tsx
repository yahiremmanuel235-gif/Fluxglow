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
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { CommunityPost } from '../../types';
import { MOCK_COMMUNITY_POSTS } from '../../data/mockData';

export const CommunityModule: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('fluxglow_community_posts');
    return saved ? JSON.parse(saved) : MOCK_COMMUNITY_POSTS;
  });

  const [postText, setPostText] = useState('');
  const [selectedForum, setSelectedForum] = useState('Motivación Personal');
  const [activeTabModal, setActiveTabModal] = useState<string | null>(null);

  // 1. Foros Moderados matching Image 8
  const forums = [
    { name: 'Estrés Académico', active: false },
    { name: 'Ansiedad y Bienestar', active: false },
    { name: 'Motivación Personal', active: true },
    { name: 'Hábitos Saludables', active: false },
  ];

  // 2. Grupos de Apoyo matching Image 8
  const supportGroups = [
    { name: 'Estudiantes Universitarios', members: '120 participantes' },
    { name: 'Manejo del Estrés', members: '95 participantes' },
    { name: 'Crecimiento Personal', members: '87 participantes' },
  ];

  // 3. Retos Emocionales matching Image 8
  const challenges = [
    { name: 'Gratitud Diaria', duration: '7 días' },
    { name: 'Dormir 8 Horas', duration: '7 días' },
    { name: 'Registro Emocional', duration: '14 días' },
  ];

  // 4. Reconocimientos matching Image 8
  const recognitions = [
    { badge: 'Miembro Activo', requirement: 'Participar durante 30 días.' },
    { badge: 'Apoyo Constante', requirement: 'Ayudar a 10 usuarios.' },
    { badge: 'Comunidad Destacada', requirement: 'Participar en foros y grupos.' },
  ];

  const handlePublish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!postText.trim()) {
      alert('Por favor escribe tu experiencia antes de publicar.');
      return;
    }

    const newPost: CommunityPost = {
      id: 'post-' + Date.now(),
      author: 'Tú (Comunidad)',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
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

    alert('¡Tu experiencia ha sido compartida en el espacio seguro de FluxGlow!');
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleHug = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, hugs: p.hugs + 1 } : p));
    confetti({ particleCount: 20, spread: 40 });
  };

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">

        {/* Top Header with Brand Logo */}
        <div className="flex items-center justify-between py-2 border-b border-[#ece4d9] mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
          </div>

          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Espacio 100% Moderado y Seguro</span>
          </div>
        </div>

        {/* Big Display Title: Comunidad FluxGlow */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-[#5a8c72]">Comunidad </span>
            <span className="text-[#e07a52]">FluxGlow</span>
          </h1>
        </div>

        {/* TOP ROW: 4 Rounded Cards from Image 8 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* CARD 1: 💬 Foros moderados */}
          <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 mb-3 font-serif flex items-center gap-2">
                <span className="text-lg">💬</span>
                Foros moderados
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-900 font-bold">
                      <th className="pb-2">Foro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {forums.map((f, idx) => (
                      <tr 
                        key={idx} 
                        onClick={() => setSelectedForum(f.name)}
                        className="cursor-pointer hover:bg-stone-50 transition-colors"
                      >
                        <td className={`py-2 underline ${f.active ? 'font-bold text-stone-900' : 'text-stone-700'}`}>
                          {f.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CARD 2: 👥 Grupos de apoyo */}
          <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 mb-3 font-serif flex items-center gap-2">
                <span className="text-lg">👥</span>
                Grupos de apoyo
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-900 font-bold">
                      <th className="pb-2">Grupo</th>
                      <th className="pb-2 text-right">Miembros</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {supportGroups.map((g, idx) => (
                      <tr 
                        key={idx}
                        onClick={() => alert(`Unido al grupo: ${g.name}`)}
                        className="cursor-pointer hover:bg-stone-50 transition-colors"
                      >
                        <td className="py-2 underline text-stone-800 font-medium">{g.name}</td>
                        <td className="py-2 text-stone-500 text-right">{g.members}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CARD 3: 🏆 Retos emocionales */}
          <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 mb-3 font-serif flex items-center gap-2">
                <span className="text-lg">🏆</span>
                Retos emocionales
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-900 font-bold">
                      <th className="pb-2">Reto</th>
                      <th className="pb-2 text-right">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {challenges.map((c, idx) => (
                      <tr 
                        key={idx}
                        onClick={() => {
                          confetti({ particleCount: 30, spread: 50 });
                          alert(`¡Inscrito al reto: ${c.name}!`);
                        }}
                        className="cursor-pointer hover:bg-stone-50 transition-colors"
                      >
                        <td className="py-2 text-stone-800 font-medium">{c.name}</td>
                        <td className="py-2 text-stone-500 text-right font-semibold">{c.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CARD 4: 🏅 Reconocimientos */}
          <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 mb-3 font-serif flex items-center gap-2">
                <span className="text-lg">🏅</span>
                Reconocimientos
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-900 font-bold">
                      <th className="pb-2">Insignia</th>
                      <th className="pb-2 text-right">Requisito</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {recognitions.map((r, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 transition-colors">
                        <td className="py-2 text-stone-800 font-bold">{r.badge}</td>
                        <td className="py-2 text-stone-500 text-right leading-tight text-[11px]">{r.requirement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM CARD: Compartir experiencias (Green Bordered Container from Image 8) */}
        <div className="bg-white rounded-3xl border-2 border-[#22c55e] shadow-sm p-6 sm:p-8 mb-10">
          
          <h2 className="text-2xl font-bold text-stone-900 mb-1 font-serif">
            Compartir experiencias
          </h2>
          <p className="text-sm font-semibold text-stone-700 mb-4">
            ¿Cómo te sientes hoy?
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Input & Button Area (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="border-2 border-dashed border-stone-400 rounded-2xl p-4 bg-stone-50/50">
                <textarea
                  id="community-experience-textarea"
                  rows={4}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Escribe aquí tu experiencia, lo que sientes o lo que te gustaría compartir"
                  className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden resize-none leading-relaxed"
                />
              </div>

              {/* Solid Green Publish Button from Image 8 */}
              <button
                id="publish-experience-btn"
                onClick={() => handlePublish()}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-xs hover:shadow-md transition-all"
              >
                Publicar
              </button>
            </div>

            {/* Right Illustration: Colorful hands holding around the globe from Image 8 */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 relative flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80"
                  alt="Comunidad unida FluxGlow"
                  className="w-full h-full object-cover rounded-full border-4 border-[#22c55e]/30 shadow-md"
                />
              </div>
              <span className="text-xs font-semibold text-stone-500 mt-2 text-center">
                Comunidad solidaria de apoyo mutuo
              </span>
            </div>

          </div>

          {/* Feed of Shared Community Posts */}
          <div className="mt-8 pt-6 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">
              Publicaciones Recientes de la Comunidad:
            </h3>

            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full object-cover" />
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
                      className="flex items-center gap-1 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-red-500" />
                      <span>{post.likes} Me gusta</span>
                    </button>
                    <button 
                      onClick={() => handleHug(post.id)}
                      className="flex items-center gap-1 hover:text-amber-600 transition-colors"
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
