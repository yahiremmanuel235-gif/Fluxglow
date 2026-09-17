import re

with open('src/components/modules/ProfileModule.tsx', 'r') as f:
    content = f.read()

# Add useAuth to ProfileModule
if "useAuth" not in content:
    content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useAuth } from '../../hooks/useAuth';")
    content = content.replace("const [userEmail, setUserEmail] = useState(userProfile?.email || 'usuario@fluxglow.com');", "const { user } = useAuth();\n  const [userEmail, setUserEmail] = useState(userProfile?.email || (user ? user.email : 'invitado@local.app'));")

# Replace "🌱 Miembro Activo" with conditional
content = content.replace("🌱 Miembro Activo", "{user ? '🌱 Miembro Activo' : '🔒 Modo Invitado'}")

# Hide SignOut if not authenticated
content = content.replace("{onSignOut && (", "{onSignOut && user && (")

with open('src/components/modules/ProfileModule.tsx', 'w') as f:
    f.write(content)
