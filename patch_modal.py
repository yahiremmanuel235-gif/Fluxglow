import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # 1. Update state variables
    old_state = """  const [schedulingMissionId, setSchedulingMissionId] = useState<string | null>(null);
  const [scheduleTimeInput, setScheduleTimeInput] = useState<string>('');"""
    new_state = """  const [schedulingMissionId, setSchedulingMissionId] = useState<string | null>(null);
  const [scheduleDateInput, setScheduleDateInput] = useState<string>('');
  const [scheduleTimeInput, setScheduleTimeInput] = useState<string>('');"""
    content = content.replace(old_state, new_state)

    # 2. Update handleAcceptMission
    old_handle = """  const handleAcceptMission = (id: string) => {
    setSchedulingMissionId(id);
    const d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    setScheduleTimeInput(d.toTimeString().substring(0, 5));
  };"""
    new_handle = """  const handleAcceptMission = (id: string) => {
    setSchedulingMissionId(id);
    const d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    setScheduleDateInput(d.toISOString().split('T')[0]);
    setScheduleTimeInput(d.toTimeString().substring(0, 5));
  };"""
    content = content.replace(old_handle, new_handle)

    # 3. Update confirmSchedule
    old_confirm = """  const confirmSchedule = (id: string) => {
    if (!scheduleTimeInput) return;
    const [hours, minutes] = scheduleTimeInput.split(':').map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    if (d.getTime() < Date.now()) {
      d.setDate(d.getDate() + 1); // schedule for tomorrow if time passed
    }
    const updated = { ...schedules, [id]: d.toISOString() };
    saveSchedules(updated);
    setSchedulingMissionId(null);
    success('Misión programada correctamente.');
  };"""
    new_confirm = """  const confirmSchedule = (id: string) => {
    if (!scheduleTimeInput || !scheduleDateInput) return;
    const [year, month, day] = scheduleDateInput.split('-').map(Number);
    const [hours, minutes] = scheduleTimeInput.split(':').map(Number);
    const d = new Date();
    d.setFullYear(year, month - 1, day);
    d.setHours(hours, minutes, 0, 0);
    
    // Si la hora programada ya pasó, mostramos un aviso pero lo permitimos (o podemos bloquearlo)
    if (d.getTime() < Date.now()) {
        warning('La fecha seleccionada está en el pasado.');
        return;
    }
    
    const updated = { ...schedules, [id]: d.toISOString() };
    saveSchedules(updated);
    setSchedulingMissionId(null);
    success('Misión programada correctamente.');
  };"""
    content = content.replace(old_confirm, new_confirm)

    # 4. Remove inline form from Right Action Button
    old_inline = """                                  if (schedulingMissionId === m.id) {
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
                                  }"""
    content = content.replace(old_inline, "")
    
    # 5. Add Modal to the end of the component
    old_modal_end = """    </div>
  );
};"""
    new_modal_end = """
      {/* SCHEDULE MODAL */}
      {schedulingMissionId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setSchedulingMissionId(null)}
          ></div>
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-xl flex flex-col gap-5 border border-stone-100">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                Programa tu misión
              </h3>
              <p className="text-stone-500 text-sm">
                Selecciona cuándo te comprometes a realizar esta acción.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Fecha</label>
                <input 
                  type="date" 
                  value={scheduleDateInput}
                  onChange={(e) => setScheduleDateInput(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Hora</label>
                <input 
                  type="time" 
                  value={scheduleTimeInput}
                  onChange={(e) => setScheduleTimeInput(e.target.value)}
                  className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setSchedulingMissionId(null)}
                className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmSchedule(schedulingMissionId)}
                className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-white bg-[#5F927B] hover:bg-[#4C7563] shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};"""
    content = content.replace(old_modal_end, new_modal_end)

    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/components/modules/MissionsModule.tsx')
