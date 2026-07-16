import os
import re

search_dir = r"c:\Users\admin\Documents\000 A PREPA\planeaciones especialidades\Proyectos y Otros\semestre_2\PM2\public"
suspects = []

pattern = re.compile(r'\$(.*?)\$')

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith(".html") or file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            matches = pattern.findall(content)
            for match in matches:
                # If the match is long and has spaces, it might be an accidental math block
                if len(match) > 50 and " " in match:
                    suspects.append(f"{file}: ${match}$")

for s in suspects:
    print(s)
if not suspects:
    print("No suspiciously long math blocks found.")
