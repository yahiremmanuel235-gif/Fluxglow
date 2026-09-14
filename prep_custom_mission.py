import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # 1. Update imports from missionsManager
    old_import_mgr = "import { activateAllMissionsFromGuide } from '../../utils/missionsManager';"
    new_import_mgr = "import { addSingleMissionFromGuide, addCustomMission } from '../../utils/missionsManager';"
    content = content.replace(old_import_mgr, new_import_mgr)

    # 2. Add local state
    old_state = "const [showMissions, setShowMissions] = useState<boolean>(false);"
    new_state = """const [showMissions, setShowMissions] = useState<boolean>(false);
  const [missionStatuses, setMissionStatuses] = useState<Record<string, 'accepted' | 'rejected'>>({});
  const [isCustomMissionOpen, setIsCustomMissionOpen] = useState(false);
  const [customMissionData, setCustomMissionData] = useState({ title: '', description: '', date: '', time: '' });"""
    content = content.replace(old_state, new_state)

    # 3. Reset state on activeGuide change
    old_setActiveGuide = """setActiveGuide(guide as any);
                        setShowMissions(false);"""
    new_setActiveGuide = """setActiveGuide(guide as any);
                        setShowMissions(false);
                        setMissionStatuses({});"""
    content = content.replace(old_setActiveGuide, new_setActiveGuide)

    # 4. Remove automatic activation
    old_activate = "activateAllMissionsFromGuide(activeGuide);"
    content = content.replace(old_activate, "/* manual accept only now */")

    # 5. Render individual missions
    old_missions_map = """                    {activeGuide.dailyMissions.map((mission, idx) => (
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
                    </div>"""
    
    new_missions_map = """                    {activeGuide.dailyMissions.map((mission: any, idx: number) => {
                      const status = missionStatuses[mission.id];
                      return (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-start md:items-center justify-between gap-3">
                        <div className="flex-1">
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
                        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0 justify-end">
                          {status === 'accepted' ? (
                            <span className="text-xs font-bold text-[#3E6855] bg-[#EBF1EA] px-3 py-1.5 rounded-lg flex items-center gap-1 border border-[#C5DDD0]">
                              <CheckCircle2 className="w-4 h-4" /> Aceptada
                            </span>
                          ) : status === 'rejected' ? (
                            <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
                              Rechazada
                            </span>
                          ) : (
                            <>
                              <button 
                                onClick={() => setMissionStatuses(prev => ({...prev, [mission.id]: 'rejected'}))}
                                className="px-3 py-1.5 text-xs font-bold text-stone-500 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200 cursor-pointer"
                              >
                                Rechazar
                              </button>
                              <button 
                                onClick={() => {
                                  addSingleMissionFromGuide(mission, activeGuide);
                                  setMissionStatuses(prev => ({...prev, [mission.id]: 'accepted'}));
                                  success('Misión agregada', 'Aparecerá en el apartado de Misiones.');
                                }}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-[#5F927B] hover:bg-[#4C7563] rounded-lg transition-colors shadow-xs cursor-pointer"
                              >
                                Aceptar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )})}
                    
                    <button 
                      onClick={() => setIsCustomMissionOpen(true)}
                      className="w-full mt-2 p-3 border-2 border-dashed border-[#5F927B]/40 hover:border-[#5F927B] bg-[#f8faf9] text-[#3E6855] rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      Crear misión personalizada
                    </button>"""
                    
    content = content.replace(old_missions_map, new_missions_map)
    
    # 6. Add Custom Mission Modal markup at the end of step 2
    # Find the end of active guide block: </button></div></div>)}
    # We will append the modal right inside the active guide block or at the end.
    
    old_end_active = """              </button>
            </div>
          </div>
        )}"""
        
    new_end_active = """              </button>
            </div>
          </div>
        )}

        {isCustomMissionOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              onClick={() => setIsCustomMissionOpen(false)}
            ></div>
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl flex flex-col gap-4 border border-stone-100">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
                  Misión Personalizada
                </h3>
                <p className="text-stone-500 text-sm">
                  ¿Quieres aplicar los conocimientos de la guía a tu manera? Crea una misión personalizada.
                </p>
              </div>
              
              <div className="space-y-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Nombre de la misión</label>
                  <input 
                    type="text" 
                    value={customMissionData.title}
                    onChange={(e) => setCustomMissionData(prev => ({...prev, title: e.target.value}))}
                    placeholder="Ej. Escribir 5 minutos en mi diario..."
                    className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Descripción</label>
                  <textarea 
                    value={customMissionData.description}
                    onChange={(e) => setCustomMissionData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Detalles sobre cómo lo aplicarás..."
                    className="w-full h-20 bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all resize-none"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Fecha</label>
                    <input 
                      type="date" 
                      value={customMissionData.date}
                      onChange={(e) => setCustomMissionData(prev => ({...prev, date: e.target.value}))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Hora</label>
                    <input 
                      type="time" 
                      value={customMissionData.time}
                      onChange={(e) => setCustomMissionData(prev => ({...prev, time: e.target.value}))}
                      className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setIsCustomMissionOpen(false)}
                  className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!customMissionData.title || !customMissionData.date || !customMissionData.time) {
                      warning('Faltan campos', 'Por favor ingresa nombre, fecha y hora.');
                      return;
                    }
                    
                    const newMission = addCustomMission(
                      customMissionData.title, 
                      customMissionData.description, 
                      activeGuide?.id || 'custom', 
                      activeGuide?.title || 'Personalizado', 
                      activeGuide?.category || 'General'
                    );
                    
                    // Add schedule
                    try {
                      const sch = localStorage.getItem('fluxglow_mission_schedules');
                      let parsedSch = sch ? JSON.parse(sch) : {};
                      const [year, month, day] = customMissionData.date.split('-').map(Number);
                      const [hours, minutes] = customMissionData.time.split(':').map(Number);
                      const d = new Date();
                      d.setFullYear(year, month - 1, day);
                      d.setHours(hours, minutes, 0, 0);
                      
                      parsedSch[newMission.id] = d.toISOString();
                      localStorage.setItem('fluxglow_mission_schedules', JSON.stringify(parsedSch));
                    } catch(e) {}

                    success('¡Misión creada!', 'Se ha programado con éxito.');
                    setIsCustomMissionOpen(false);
                    setCustomMissionData({ title: '', description: '', date: '', time: '' });
                  }}
                  className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-white bg-[#5F927B] hover:bg-[#4C7563] shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  Crear Misión
                </button>
              </div>
            </div>
          </div>
        )}"""
        
    content = content.replace(old_end_active, new_end_active)

    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/components/modules/FluxFlowModule.tsx')
