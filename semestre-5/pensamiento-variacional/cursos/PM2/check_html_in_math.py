import os
import re

search_dir = r"c:\Users\admin\Documents\000 A PREPA\planeaciones especialidades\Proyectos y Otros\semestre_2\PM2\public"
anomalies = []

# Regex to find text between $ ... $
pattern = re.compile(r'\$(.*?)\$')

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith(".html") or file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            matches = pattern.findall(content)
            for match in matches:
                # If match contains HTML tags
                if '<' in match and '>' in match:
                    anomalies.append(f"{file}: HTML inside math: ${match}$")
                # Or if it's completely empty?
                if match == "":
                    # $$ is fine, it means display math, handled by KaTeX. But regex might catch it.
                    pass

for a in anomalies:
    print(a)
if not anomalies:
    print("No HTML found inside inline math delimiters.")
