import re

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where the activeTest modal ends
    # It ends with: "Finalizar Test" button? Let's check
    pass
