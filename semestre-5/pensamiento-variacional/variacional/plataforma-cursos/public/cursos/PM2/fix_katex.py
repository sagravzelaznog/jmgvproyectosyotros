import os
import glob

search_dir = r"c:\Users\admin\Documents\000 A PREPA\planeaciones especialidades\Proyectos y Otros\semestre_2\PM2\public"
count = 0

old_str = """            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '\\(', right: '\\)', display: false}
            ]"""

new_str = """            delimiters: [
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
            
            # handle windows line endings in old_str just in case
            old_str_win = old_str.replace('\n', '\r\n')
            
            if old_str in content:
                content = content.replace(old_str, new_str)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                count += 1
            elif old_str_win in content:
                content = content.replace(old_str_win, new_str.replace('\n', '\r\n'))
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                count += 1

print(f"Updated {count} files.")
