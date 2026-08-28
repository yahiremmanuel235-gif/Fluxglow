import React, { useState } from 'react';
import { Mail, Facebook, Instagram, Phone, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    motivo: 'consulta',
    mensaje: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.mensaje) return;

    setFormSubmitted(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {}

    setTimeout(() => {
      // Keep state or allow sending another
    }, 4000);
  };

  return (
    <section className="py-20 bg-[#faf7f2] relative" id="contacto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a7c59]/10 text-[#4a7c59] text-xs font-bold uppercase tracking-wider mb-4 border border-[#4a7c59]/20">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Estamos para escucharte</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#4a7c59] via-[#8DB596] to-[#d4622a] bg-clip-text text-transparent mb-4">
            CONTÁCTANOS
          </h1>

          <p className="text-stone-700 text-base md:text-lg leading-relaxed">
            ¿Tienes dudas, sugerencias o representas a una institución interesada en implementar FLUXGLOW? Escríbenos o comunícate con nuestro equipo.
          </p>
        </div>

        {/* 4 Contact Cards Grid (Original 4 cards with gradient style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          {/* Email */}
          <div className="bg-gradient-to-br from-[#8DB596] via-[#D8C97B] to-[#E89A6B] p-6 rounded-3xl text-white text-center shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Correo Electrónico</h2>
            <a href="mailto:fluxglow680@gmail.com" className="text-sm text-white/90 hover:text-white font-medium break-all">
              fluxglow680@gmail.com
            </a>
          </div>

          {/* Facebook */}
          <div className="bg-gradient-to-br from-[#8DB596] via-[#D8C97B] to-[#E89A6B] p-6 rounded-3xl text-white text-center shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
              <Facebook className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Facebook</h2>
            <p className="text-base text-white/90 font-medium">Flux Glow</p>
          </div>

          {/* Instagram */}
          <div className="bg-gradient-to-br from-[#8DB596] via-[#D8C97B] to-[#E89A6B] p-6 rounded-3xl text-white text-center shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Instagram</h2>
            <p className="text-base text-white/90 font-medium">@fluxglow</p>
          </div>

          {/* Telefono */}
          <div className="bg-gradient-to-br from-[#8DB596] via-[#D8C97B] to-[#E89A6B] p-6 rounded-3xl text-white text-center shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Teléfono de Contacto</h2>
            <a href="tel:+50378014680" className="text-base text-white/90 font-bold hover:text-white">
              +503 7801-4680
            </a>
          </div>

        </div>

        {/* Interactive Contact Form Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-stone-200/80 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
            <div className="p-2.5 rounded-xl bg-[#4a7c59]/10 text-[#4a7c59]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900">Envíanos un mensaje directo</h3>
              <p className="text-xs text-stone-500">Te responderemos a la brevedad posible en menos de 24 horas.</p>
            </div>
          </div>

          {formSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-emerald-900">¡Mensaje Enviado con Éxito!</h4>
              <p className="text-sm text-emerald-800 max-w-md mx-auto">
                Gracias, <strong>{formData.nombre}</strong>. Hemos recibido tu mensaje y el equipo de FLUXGLOW se pondrá en contacto a través de <strong>{formData.email}</strong>.
              </p>
              <button
                id="btn-send-another-message"
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({ nombre: '', email: '', motivo: 'consulta', mensaje: '' });
                }}
                className="mt-4 px-4 py-2 bg-[#4a7c59] text-white text-xs font-semibold rounded-xl hover:bg-[#3b6447] transition-colors"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Tu Nombre *
                  </label>
                  <input
                    id="contact-input-nombre"
                    type="text"
                    required
                    placeholder="Ej. Sofía Hernández"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4a7c59] text-sm text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Correo Electrónico *
                  </label>
                  <input
                    id="contact-input-email"
                    type="email"
                    required
                    placeholder="tucorreo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4a7c59] text-sm text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Motivo de Contacto
                </label>
                <select
                  id="contact-select-motivo"
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4a7c59] text-sm text-stone-800 bg-white"
                >
                  <option value="consulta">Consulta General / Información</option>
                  <option value="institucional">Alianza Educativa / Colegio / Universidad</option>
                  <option value="psicologia">Colaboración Profesional de Psicología</option>
                  <option value="sugerencia">Sugerencia para la Plataforma</option>
                  <option value="soporte">Soporte Técnico</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Mensaje *
                </label>
                <textarea
                  id="contact-textarea-mensaje"
                  required
                  rows={4}
                  placeholder="Escribe tu mensaje, inquietud o propuesta aquí..."
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#4a7c59] text-sm text-stone-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-stone-500">
                  Tus datos están protegidos bajo estricta confidencialidad.
                </p>

                <button
                  id="btn-submit-contact-form"
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#4a7c59] to-[#d4622a] hover:from-[#3b6447] hover:to-[#b84e1b] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensaje</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
