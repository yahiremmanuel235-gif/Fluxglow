import re

def fix_scheduling_modal(content):
    # Fix the overlay and card container
    pattern = r'\{schedulingMission && \(\s*<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">\s*<div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-\[90vh\] overflow-y-auto">\s*<h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Programar Misión</h3>'
    
    new_wrapper = r"""{schedulingMission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm" onClick={() => setSchedulingMission(null)}>
          <div className="m-auto relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[101] max-h-[85vh] overflow-y-auto p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSchedulingMission(null)} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 pr-8">Programar Misión</h3>"""
            
    content = re.sub(pattern, new_wrapper, content)
    
    # Update Confirm button text
    content = re.sub(r'Confirmar\s*</button>', r'Confirmar y Programar\n              </button>', content)
    
    return content

def fix_custom_mission_modal(content, setter_name):
    # Fix the overlay and card container for Custom Mission
    # In LearnModule: {showCustomMission && activeGuide && (
    # In FluxFlowModule: {isCustomMissionOpen && (
    
    # 1. FluxFlowModule
    pattern_flux = r'\{(isCustomMissionOpen) && \(\s*<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">\s*<div \s*className="absolute inset-0"\s*onClick=\{\(\) => setIsCustomMissionOpen\(false\)\}\s*></div>\s*<div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl flex flex-col gap-4 border border-stone-100 max-h-\[90vh\] overflow-y-auto animate-in zoom-in-95 duration-200">\s*<div>\s*<h3 className="font-serif text-xl font-bold text-stone-900 mb-1">'
    
    new_wrapper_flux = r"""{\1 && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm" onClick={() => setIsCustomMissionOpen(false)}>
            <div className="m-auto relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[101] max-h-[85vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-4 border border-stone-100 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsCustomMissionOpen(false)} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-1 pr-8">"""
                
    content = re.sub(pattern_flux, new_wrapper_flux, content)
    
    # 2. LearnModule
    pattern_learn = r'\{(showCustomMission && activeGuide) && \(\s*<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">\s*<div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-\[90vh\] overflow-y-auto">\s*<div className="flex items-center justify-between mb-4">\s*<div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">\s*<Target className="w-5 h-5" />\s*</div>\s*<button onClick=\{\(\) => setShowCustomMission\(false\)\} className="text-stone-400 hover:text-stone-700">\s*<X className="w-5 h-5" />\s*</button>\s*</div>\s*<h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Crear Misión Personalizada</h3>'

    new_wrapper_learn = r"""{\1 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm" onClick={() => setShowCustomMission(false)}>
          <div className="m-auto relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[101] max-h-[85vh] overflow-y-auto p-6 sm:p-8 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowCustomMission(false)} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 pr-8">Crear Misión Personalizada</h3>"""
            
    content = re.sub(pattern_learn, new_wrapper_learn, content)
    
    return content

# Process FluxFlowModule
with open('src/components/modules/FluxFlowModule.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = fix_scheduling_modal(content)
content = fix_custom_mission_modal(content, 'setIsCustomMissionOpen')

# Add ESC key listener to FluxFlowModule
esc_hook_flux = """  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCustomMissionOpen(false);
        setSchedulingMission(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
"""
if "window.addEventListener('keydown', handleKeyDown)" not in content:
    content = re.sub(r'(const \[schedulingMission.*?;\n)', r'\1' + esc_hook_flux, content, count=1)

with open('src/components/modules/FluxFlowModule.tsx', 'w', encoding='utf-8') as f:
    f.write(content)


# Process LearnModule
with open('src/components/modules/LearnModule.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = fix_scheduling_modal(content)
content = fix_custom_mission_modal(content, 'setShowCustomMission')

# Add ESC key listener to LearnModule
esc_hook_learn = """  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCustomMission(false);
        setSchedulingMission(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
"""
if "window.addEventListener('keydown', handleKeyDown)" not in content:
    content = re.sub(r'(const \[showCustomMission.*?;\n)', r'\1' + esc_hook_learn, content, count=1)

with open('src/components/modules/LearnModule.tsx', 'w', encoding='utf-8') as f:
    f.write(content)


# Process CompleteCoursePlayerModal
with open('src/components/modules/CompleteCoursePlayerModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = fix_scheduling_modal(content)

# Add ESC key listener to CompleteCoursePlayerModal
esc_hook_course = """  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSchedulingMission(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
"""
if "window.addEventListener('keydown', handleKeyDown)" not in content:
    content = re.sub(r'(const \[schedulingMission.*?;\n)', r'\1' + esc_hook_course, content, count=1)

with open('src/components/modules/CompleteCoursePlayerModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

