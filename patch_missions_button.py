import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # In Step 2, Active Guide Reader, after the executive summary but before the explained content,
    # let's add the button and the toggle state.
    
    # Need to add state:
    # const [showMissions, setShowMissions] = useState(false);
    # To FluxFlowModule.tsx
    
    old_state = "const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);"
    new_state = """const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [showMissions, setShowMissions] = useState(false);"""
    
    content = content.replace(old_state, new_state)
    
    # We also need to reset it when changing guides
    old_setActiveGuide = """setActiveGuide(guide as any);"""
    new_setActiveGuide = """setActiveGuide(guide as any);
                        setShowMissions(false);"""
    content = content.replace(old_setActiveGuide, new_setActiveGuide)
    
    # Find the executive summary block to append the missions
    old_summary_block = """            <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#eaf4ef] border border-[#548c71]/30 text-emerald-950 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#548c71] uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Resumen Ejecutivo Simple</span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed font-medium text-stone-800">
                {activeGuide.simpleSummary}
              </p>
            </div>"""
    
    new_summary_block = """            <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#eaf4ef] border border-[#548c71]/30 text-emerald-950 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#548c71] uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Resumen Ejecutivo Simple</span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed font-medium text-stone-800">
                {activeGuide.simpleSummary}
              </p>
            </div>
            
            {/* Missions Toggle Button */}
            {activeGuide.dailyMissions && activeGuide.dailyMissions.length > 0 && (
              <div className="mb-8">
                <button
                  onClick={() => setShowMissions(!showMissions)}
                  className="w-full bg-white border border-[#548c71]/30 hover:border-[#548c71] p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EBF1EA] text-[#3E6855] flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-stone-900">Misiones Diarias ({activeGuide.dailyMissions.length})</h4>
                      <p className="text-xs text-stone-500 font-medium">Ver las acciones prácticas de esta guía</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-stone-400 transition-transform ${showMissions ? 'rotate-90' : ''}`} />
                </button>
                
                {showMissions && (
                  <div className="mt-4 space-y-3 pl-2 sm:pl-4 border-l-2 border-[#548c71]/20 animate-fadeIn">
                    {activeGuide.dailyMissions.map((mission, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Misión {idx + 1}
                            </span>
                            <h5 className="text-sm font-bold text-stone-800">{mission.title}</h5>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed mb-2">{mission.description}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {mission.timeEstimate}
                            </span>
                            <span className="text-[11px] font-bold text-[#3E6855] bg-[#EBF1EA] px-2 py-0.5 rounded-full">
                              +{mission.xp} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-[#f8faf9] p-3 rounded-lg text-[11px] text-[#3E6855] border border-[#548c71]/20 mt-2 italic flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 shrink-0" />
                       Al finalizar la guía, estas misiones se añadirán a tu Ecosistema Flux.
                    </div>
                  </div>
                )}
              </div>
            )}"""
            
    content = content.replace(old_summary_block, new_summary_block)
    
    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/components/modules/FluxFlowModule.tsx')
