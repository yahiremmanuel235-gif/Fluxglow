import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    old_state = """  // Step 2 State
  const [activeGuide, setActiveGuide] = useState<any | null>(null);
  const [activeCourse, setActiveCourse] = useState<any | null>(null);"""
    
    new_state = """  // Step 2 State
  const [activeGuide, setActiveGuide] = useState<any | null>(null);
  const [activeCourse, setActiveCourse] = useState<any | null>(null);
  const [showMissions, setShowMissions] = useState<boolean>(false);"""
    
    content = content.replace(old_state, new_state)
    
    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/components/modules/FluxFlowModule.tsx')
