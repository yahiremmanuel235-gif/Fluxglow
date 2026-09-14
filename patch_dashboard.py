import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()

    # Find start and end indices
    start_idx = -1
    end_idx = -1
    for i, line in enumerate(lines):
        if "{/* 5. SECCIÓN PRINCIPAL: RECOMENDACIÓN BASADA EN EL ESTADO EMOCIONAL */}" in line:
            start_idx = i
        if "{/* 7. ACCESOS RÁPIDOS A MÓDULOS CLAVE (8 Ecosystem Apartados) */}" in line:
            end_idx = i
            break

    if start_idx != -1 and end_idx != -1:
        new_lines = lines[:start_idx] + lines[end_idx:]
        with open(filename, 'w') as f:
            f.writelines(new_lines)
        print(f"Removed lines {start_idx} to {end_idx-1}")
    else:
        print("Indices not found")

modify_file('src/components/modules/DashboardModule.tsx')
