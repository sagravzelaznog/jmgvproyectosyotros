import os

search_dir = r"c:\Users\admin\Documents\000 A PREPA\planeaciones especialidades\Proyectos y Otros\semestre_2\PM2\public"
anomalies = []

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith(".html") or file.endswith(".js"):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all $ characters
            dollar_count = content.count('$')
            # But wait, KaTeX delimiters are $$ and $. 
            # $$ is 2 dollars. $ is 1 dollar.
            # So the total number of $ characters must be EVEN if they are properly closed pairs.
            if dollar_count % 2 != 0:
                anomalies.append(f"{file} has ODD number of $ ({dollar_count})")

for a in anomalies:
    print(a)
if not anomalies:
    print("No files with odd $ count found.")
