import re

with open('src/components/modules/FluxFlowModule.tsx', 'r') as f:
    content = f.read()

if "isPositiveEmotion" not in content:
    content = content.replace("import { STORAGE_KEYS, getDynamicStorageKey } from '../../constants/storageKeys';", "import { STORAGE_KEYS, getDynamicStorageKey } from '../../constants/storageKeys';\nimport { isPositiveEmotion } from '../../utils/emotionUtils';")

# Find the string and replace it
target = "{intensity > 7 ? ' Es un nivel de intensidad donde priorizar el descanso y el desahogo consciente es clave.' : ' Mantener tu racha Flux en niveles estables demuestra una sólida autorregulación. Continúa con este equilibrio explorando la comunidad o charlando libremente con Flux AI.'}"
new_target = "{intensity > 7 ? (isPositiveEmotion(selectedMood) ? ' Una emoción positiva con esta intensidad es un gran recurso. Aprovéchala para la creatividad, compartir con otros o avanzar en tus proyectos.' : ' Es un nivel de intensidad donde priorizar el descanso y el desahogo consciente es clave.') : ' Mantener tu racha Flux en niveles estables demuestra una sólida autorregulación. Continúa con este equilibrio explorando la comunidad o charlando libremente con Flux AI.'}"

content = content.replace(target, new_target)

with open('src/components/modules/FluxFlowModule.tsx', 'w') as f:
    f.write(content)
