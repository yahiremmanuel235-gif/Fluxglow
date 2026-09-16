import re

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'(\{showCustomMission && activeGuide && )\(\s*(<div className="fixed inset-0 z-\[100\].*?Crear y Aceptar Misión\s*</button>\s*</div>\s*</div>\s*)\)'
    content = re.sub(pattern, r'\1createPortal(\n\2, document.body)', content, flags=re.DOTALL)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

process_file('src/components/modules/LearnModule.tsx')
