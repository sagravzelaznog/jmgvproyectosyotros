import os
import re

search_dir = r"c:\Users\admin\Documents\000 A PREPA\planeaciones especialidades\Proyectos y Otros\semestre_2\PM2\public"
count = 0

pattern = re.compile(r"(delimiters:\s*\[\s*\{left:\s*'\$\$',\s*right:\s*'\$\$',\s*display:\s*true\},\s*\{left:\s*'\\\\\(',\s*right:\s*'\\\\\)',\s*display:\s*false\}\s*\])")

replacement = r"""delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '\\(', right: '\\)', display: false},
                {left: '$', right: '$', display: false}
            ]"""

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith(".html"):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = pattern.sub(replacement, content)
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1

print(f"Updated {count} files.")
