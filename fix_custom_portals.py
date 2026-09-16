import re

def process_file(file_path, state_var, button_text):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The custom mission modal
    # It might end with Crear Misión\s*</button>\s*</div>\s*</div>\s*</div>\s*\)
    # Let's use a regex to match the wrapper for the custom mission and add createPortal
    
    # We want to find: {isCustomMissionOpen && ( ... <div className="fixed inset-0 ... Crear Misión ... </button></div></div></div>)
    
    pattern_custom = r'(\{' + state_var + r'(\s*&&\s*activeGuide)?\s*&&\s*)\(\s*(<div className="fixed inset-0 z-\[100\].*?' + button_text + r'\s*</button>\s*</div>\s*</div>\s*</div>)\s*\)'
    content = re.sub(pattern_custom, r'\1createPortal(\n\3, document.body)', content, flags=re.DOTALL)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

process_file('src/components/modules/FluxFlowModule.tsx', 'isCustomMissionOpen', 'Crear Misión')
process_file('src/components/modules/LearnModule.tsx', 'showCustomMission', 'Crear Misión')
