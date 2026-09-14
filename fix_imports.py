import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Add ChevronRight to imports
    old_imports = """  Square, Heart, BookmarkCheck, Play, ArrowLeft, Quote, Flame, Activity, Timer, Wind
} from 'lucide-react';"""
    new_imports = """  Square, Heart, BookmarkCheck, Play, ArrowLeft, Quote, Flame, Activity, Timer, Wind, ChevronRight
} from 'lucide-react';"""
    content = content.replace(old_imports, new_imports)
    
    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/components/modules/FluxFlowModule.tsx')
