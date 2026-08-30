import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  Clock, 
  Eye, 
  Share2, 
  BookOpen, 
  Headphones, 
  Tv, 
  BadgeCheck,
  Flame
} from 'lucide-react';
import { VideoPodcastItem } from '../../types';

interface YouTubePlayerModalProps {
  media: VideoPodcastItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia?: (media: VideoPodcastItem) => void;
  allMedia?: VideoPodcastItem[];
}

export const YouTubePlayerModal: React.FC<YouTubePlayerModalProps> = ({
  media,
  isOpen,
  onClose,
  onSelectMedia,
  allMedia = []
}) => {
  const [copied, setCopied] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset video loaded state when media changes
  useEffect(() => {
    setVideoLoaded(false);
  }, [media?.id]);

  if (!isOpen || !media) return null;

  const handleCopyLink = () => {
    const url = media.youtubeUrl || `https://www.youtube.com/watch?v=${media.youtubeId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handleShare = () => {
    const url = media.youtubeUrl || `https://www.youtube.com/watch?v=${media.youtubeId}`;
    if (navigator.share) {
      navigator.share({
        title: media.title,
        text: `Te recomiendo ver "${media.title}" por ${media.author} en YouTube:`,
        url: url,
      }).catch(() => handleCopyLink());
    } else {
      handleCopyLink();
    }
  };

  const relatedMedia = allMedia.filter(m => m.id !== media.id);

  // Direct YouTube embed URL with optimal compatibility
  const embedUrl = `https://www.youtube.com/embed/${media.youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-stone-900 text-stone-100 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-stone-800 shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-stone-900/95 backdrop-blur-md px-5 sm:px-7 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-red-600/90 text-white font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
              <Tv className="w-3 h-3" />
              <span>YouTube Oficial</span>
            </span>

            <span className="text-stone-400 text-xs font-medium">
              {media.type === 'video' ? '🎬 Video Conferencia' : '🎙️ Podcast Clínico'}
            </span>

            <span className="text-stone-600 hidden sm:inline">•</span>

            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              {media.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-full text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              title="Copiar enlace de YouTube"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-bold hidden sm:inline">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copiar enlace</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
              title="Compartir"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
              title="Cerrar reproductor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="px-5 sm:px-7 pt-5">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-xl">
            <iframe
              src={embedUrl}
              title={media.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setVideoLoaded(true)}
              className="w-full h-full border-0 absolute inset-0 z-10"
            />

            {!videoLoaded && (
              <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-stone-950 text-stone-400 gap-3">
                <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Cargando reproductor de YouTube...</span>
              </div>
            )}
          </div>

          {/* Quick Actions Under Video */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-stone-800/80 pb-4">
            <div className="flex items-center gap-3 text-stone-400">
              <span className="flex items-center gap-1 font-mono text-stone-300 bg-stone-800 px-2 py-0.5 rounded-md">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {media.duration}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {media.views}
              </span>
              <span>{media.timeAgo}</span>
            </div>

            <a
              href={media.youtubeUrl || `https://www.youtube.com/watch?v=${media.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-1.5 rounded-full text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ver directamente en YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Video Information & Verified Author Section */}
        <div className="px-5 sm:px-7 py-5 space-y-6">
          <div>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-white leading-snug mb-2">
              {media.title}
            </h3>

            {/* Author Profile Box */}
            <div className="flex items-center gap-3 bg-stone-800/60 border border-stone-700/50 p-3.5 rounded-2xl">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-stone-700 shrink-0 border-2 border-stone-600">
                <img
                  src={media.image}
                  alt={media.author}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${media.youtubeId}/hqdefault.jpg`;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">
                    {media.author}
                  </h4>
                  <BadgeCheck className="w-4 h-4 text-sky-400 shrink-0" />
                </div>
                <p className="text-xs text-stone-400 truncate">
                  {media.authorRole || 'Especialista en Psicología y Salud Mental'}
                </p>
                {media.channel && (
                  <p className="text-[11px] text-amber-300/90 font-medium">
                    Canal: {media.channel}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Resumen del episodio
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 bg-stone-800/40 p-4 rounded-2xl border border-stone-800 leading-relaxed">
              {media.description}
            </p>
          </div>

          {/* Key Takeaways / Puntos Clave */}
          {media.keyTakeaways && media.keyTakeaways.length > 0 && (
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-2xl p-4 sm:p-5">
              <h4 className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Puntos Clave y Aprendizajes de esta Sesión:</span>
              </h4>
              <ul className="space-y-2">
                {media.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-800/60 text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Verified Videos Switcher */}
          {relatedMedia.length > 0 && onSelectMedia && (
            <div className="pt-4 border-t border-stone-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Más conferencias y podcasts recomendados:</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {relatedMedia.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectMedia(item)}
                    className="group cursor-pointer bg-stone-800/70 hover:bg-stone-800 border border-stone-700/50 hover:border-stone-600 p-3 rounded-2xl transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-16 h-12 rounded-xl overflow-hidden bg-black shrink-0 relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
                          }}
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[9px] px-1 rounded">
                          {item.duration}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-amber-300 uppercase">
                          {item.category}
                        </span>
                        <h5 className="text-xs font-semibold text-white line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </h5>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-700/40 flex items-center justify-between text-[10px] text-stone-400">
                      <span className="truncate">{item.author}</span>
                      <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                        Ver →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-900 px-5 sm:px-7 py-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>Contenido avalado por profesionales de la salud mental</span>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white font-medium cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
