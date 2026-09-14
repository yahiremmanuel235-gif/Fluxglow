import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Disable left side icon if not scheduled
    old_icon = """                                <button
                                  onClick={() => handleToggleComplete(m.id, m.status)}
                                  disabled={isItemLoading}
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer mt-0.5 ${"""
    new_icon = """                                <button
                                  onClick={() => {
                                      const isScheduled = !!schedules[m.id];
                                      if (!isDone && (!isScheduled || now.getTime() < new Date(schedules[m.id]).getTime() + 60 * 1000)) return;
                                      handleToggleComplete(m.id, m.status);
                                  }}
                                  disabled={isItemLoading}
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer mt-0.5 ${"""
    content = content.replace(old_icon, new_icon)

    # Right side action button
    old_action = """                              {/* Right: Action Button */}
                              <div className="w-full md:w-auto flex md:flex-col items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                                {isDone ? (
                                  <div className="w-full md:w-auto flex items-center gap-2">
                                    <span className="flex-1 md:flex-initial text-xs font-bold text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs">
                                      <CheckCircle2 className="w-4 h-4 text-[#5F927B]" />
                                      <span>Completada</span>
                                    </span>
                                    <button
                                      onClick={() => handleToggleComplete(m.id, m.status)}
                                      disabled={isItemLoading}
                                      className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer disabled:opacity-50"
                                      title="Deshacer y marcar como pendiente"
                                      aria-label="Deshacer completado"
                                    >
                                      {isItemLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                                      ) : (
                                        <RotateCcw className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleToggleComplete(m.id, m.status)}
                                    disabled={isItemLoading}
                                    className="w-full md:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-[#E87A52] to-[#B54F2C] hover:opacity-95 text-white disabled:opacity-75 disabled:cursor-wait active:scale-95"
                                  >
                                    {isItemLoading ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                                        <span>Guardando...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Check className="w-4 h-4 stroke-[2.5]" />
                                        <span>Completar misión</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>"""
                              
    new_action = """                              {/* Right: Action Button */}
                              <div className="w-full md:w-auto flex md:flex-col items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                                {(() => {
                                  if (isDone) {
                                    return (
                                      <div className="w-full md:w-auto flex items-center gap-2">
                                        <span className="flex-1 md:flex-initial text-xs font-bold text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs">
                                          <CheckCircle2 className="w-4 h-4 text-[#5F927B]" />
                                          <span>Completada</span>
                                        </span>
                                      </div>
                                    );
                                  }

                                  const isScheduled = !!schedules[m.id];
                                  if (isScheduled) {
                                    const scheduledTime = new Date(schedules[m.id]).getTime();
                                    const currentTime = now.getTime();
                                    const canComplete = currentTime >= scheduledTime + 60 * 1000;
                                    
                                    return (
                                      <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                                        <span className="text-[11px] font-bold text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-2 py-1 rounded-md">
                                          Programada: {new Date(schedules[m.id]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                        <button
                                          onClick={() => handleToggleComplete(m.id, m.status)}
                                          disabled={isItemLoading || !canComplete}
                                          title={!canComplete ? "Espera 1 minuto después de la hora programada" : ""}
                                          className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                                            !canComplete 
                                              ? 'bg-stone-200 text-stone-500 cursor-not-allowed' 
                                              : 'bg-gradient-to-r from-[#E87A52] to-[#B54F2C] hover:opacity-95 text-white cursor-pointer hover:shadow-md'
                                          }`}
                                        >
                                          {isItemLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : <Check className="w-4 h-4 stroke-[2.5]" />}
                                          <span>Completar misión</span>
                                        </button>
                                      </div>
                                    );
                                  }

                                  if (schedulingMissionId === m.id) {
                                    return (
                                      <div className="flex flex-col gap-2 w-full md:w-auto bg-stone-50 p-2 rounded-xl border border-stone-200">
                                        <input 
                                          type="time" 
                                          value={scheduleTimeInput}
                                          onChange={(e) => setScheduleTimeInput(e.target.value)}
                                          className="px-2 py-1.5 border border-stone-300 rounded-lg text-sm bg-white"
                                        />
                                        <div className="flex gap-2">
                                          <button 
                                            onClick={() => confirmSchedule(m.id)}
                                            className="flex-1 bg-[#5F927B] hover:bg-[#4C7563] transition-colors text-white text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                                          >
                                            Confirmar
                                          </button>
                                          <button 
                                            onClick={() => setSchedulingMissionId(null)}
                                            className="flex-1 bg-stone-200 hover:bg-stone-300 transition-colors text-stone-700 text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                                          >
                                            Cancelar
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className="flex gap-2 w-full md:w-auto">
                                      <button
                                        onClick={() => handleRejectMission(m.id)}
                                        className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                                      >
                                        Rechazar
                                      </button>
                                      <button
                                        onClick={() => handleAcceptMission(m.id)}
                                        className="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#5F927B] hover:bg-[#3E6855] transition-colors cursor-pointer shadow-xs"
                                      >
                                        Aceptar
                                      </button>
                                    </div>
                                  );
                                })()}
                              </div>"""
    content = content.replace(old_action, new_action)

    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/components/modules/MissionsModule.tsx')
