import re

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "createPortal" not in content:
        content = re.sub(
            r"(import React.*?from 'react';)",
            r"\1\nimport { createPortal } from 'react-dom';",
            content
        )
        
    # schedulingMission Modal
    pattern_sched = r'(\{schedulingMission && )\(\s*(<div className="fixed inset-0 z-\[100\].*?Confirmar y Programar\s*</button>\s*</div>\s*</div>\s*</div>)\s*\)'
    content = re.sub(pattern_sched, r'\1createPortal(\n\2, document.body)', content, flags=re.DOTALL)
    
    # isCustomMissionOpen Modal
    pattern_custom1 = r'(\{isCustomMissionOpen && )\(\s*(<div className="fixed inset-0 z-\[100\].*?Confirmar y Programar\s*</button>\s*</div>\s*</div>\s*</div>)\s*\)'
    content = re.sub(pattern_custom1, r'\1createPortal(\n\2, document.body)', content, flags=re.DOTALL)

    # showCustomMission && activeGuide Modal
    pattern_custom2 = r'(\{showCustomMission && activeGuide && )\(\s*(<div className="fixed inset-0 z-\[100\].*?Confirmar y Programar\s*</button>\s*</div>\s*</div>\s*</div>)\s*\)'
    content = re.sub(pattern_custom2, r'\1createPortal(\n\2, document.body)', content, flags=re.DOTALL)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

process_file('src/components/modules/FluxFlowModule.tsx')
process_file('src/components/modules/LearnModule.tsx')
process_file('src/components/modules/CompleteCoursePlayerModal.tsx')
