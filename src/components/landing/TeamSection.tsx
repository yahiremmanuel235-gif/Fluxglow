import React from 'react';
import { TEAM_MEMBERS } from '../../data/mockData';
import { Award, CheckCircle2, Sparkles, User } from 'lucide-react';

export const TeamSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#f5f0e8]/70 relative overflow-hidden" id="nosotros">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#8DB596]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E89A6B]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a7c59]/10 text-[#4a7c59] text-xs font-bold uppercase tracking-wider mb-4 border border-[#4a7c59]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Liderazgo y Pasión Juvenil</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#4a7c59] via-[#8DB596] to-[#d4622a] bg-clip-text text-transparent mb-6">
            ¿QUIÉNES SOMOS?
          </h2>

          <h3 className="text-2xl md:text-3xl font-bold text-[#d4622a] mb-4">
            Nuestro Equipo Fundador
          </h3>

          <p className="text-stone-700 text-base md:text-lg leading-relaxed text-justify sm:text-center">
            FLUXGLOW está formado por un equipo de jóvenes emprendedores comprometidos con la innovación y el bienestar emocional. Cada integrante aporta conocimientos, creatividad y liderazgo para desarrollar una plataforma capaz de transformar la manera en que las personas comprenden y gestionan sus emociones.
          </p>
        </div>

        {/* Team Grid (2 columns on md/lg, responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              id={`team-card-${member.id}`}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80 flex flex-col sm:flex-row gap-6 relative group overflow-hidden"
            >
              {/* Colored top accent bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5 opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: member.accentColor }}
              />

              {/* Avatar Photo */}
              <div className="shrink-0 flex flex-col items-center sm:items-start">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md border-2 border-stone-100 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span 
                    className="absolute -bottom-2 -right-2 p-1.5 rounded-lg text-white shadow-xs"
                    style={{ backgroundColor: member.accentColor }}
                  >
                    <Award className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Member Details */}
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-stone-900">{member.name}</h3>
                    <span 
                      className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: member.accentColor }}
                    >
                      {member.role.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#d4622a] mt-0.5">{member.role}</p>
                  <p className="text-xs text-stone-500 font-medium">{member.subtitle}</p>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed italic bg-[#faf7f2] p-2.5 rounded-xl border border-stone-200/60">
                  "{member.bio}"
                </p>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4a7c59]" />
                    <span>Funciones Clave:</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {member.functions.map((func, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4622a] mt-1.5 shrink-0"></span>
                        <span>{func}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Target Audience Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#4a7c59] via-[#69937a] to-[#d4622a] text-white rounded-3xl p-8 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Público Objetivo</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-extrabold">¿A quién está dirigido?</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                Diseñado para acompañar procesos evolutivos en el ámbito personal, académico y profesional.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <h5 className="font-bold text-amber-200 text-sm mb-1">Público Principal:</h5>
                <p className="text-sm font-semibold text-white">Jóvenes de 15 a 30 años</p>
                <p className="text-xs text-white/80 mt-1">Estudiantes de secundaria, bachillerato y universitarios en transición.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <h5 className="font-bold text-emerald-200 text-sm mb-1">Público Secundario:</h5>
                <p className="text-sm font-semibold text-white">Comunidad & Profesionales</p>
                <p className="text-xs text-white/80 mt-1">Instituciones educativas, psicólogos, docentes y empresas comprometidas con el bienestar.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
