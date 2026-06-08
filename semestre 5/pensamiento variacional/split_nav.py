import os
import glob
import re

files = glob.glob("pages/PVS*.[hH][tT][mM][lL]")

for file in files:
    filename = os.path.basename(file)
    match = re.search(r'PVS(\d+)\.(HTML|html)', filename, re.IGNORECASE)
    if not match: continue
    
    num = int(match.group(1))
    ext = match.group(2)
    
    prev_num = num - 1
    next_num = num + 1
    
    prev_link = f"PVS{prev_num:02d}.{ext}"
    next_link = f"PVS{next_num:02d}.{ext}"
    
    prev_class = "nav-btn" if prev_num > 0 else "nav-btn btn-disabled"
    next_class = "nav-btn" if next_num <= 50 else "nav-btn btn-disabled"
    
    top_nav_html = f"""
            <nav class="session-nav top-nav">
                <a href="{prev_link}" class="{prev_class}">⬅ Anterior</a>
                <a href="../index.html" class="nav-btn">🏠 Inicio</a>
            </nav>"""
            
    bottom_nav_html = f"""
            <nav class="session-nav bottom-nav">
                <a href="{next_link}" class="{next_class}">Siguiente ➡</a>
                <a href="#" onclick="alert('¡Gracias por tu intención de apoyar el proyecto! Pronto habilitaremos los donativos.'); return false;" class="nav-btn btn-support">☕ Apoyar</a>
            </nav>"""
    
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Eliminar navegaciones anteriores
    content = re.sub(r'\s*<nav class="session-nav.*?>.*?</nav>', '', content, flags=re.DOTALL)
    
    # Inyectar Top Nav después del header
    content = re.sub(r'(<header class="info-header"[^>]*>)', r'\1' + top_nav_html, content)
    
    # Inyectar Bottom Nav después del quiz mount point
    content = re.sub(r'(<div id="quiz-mount-point"[^>]*></div>)', r'\1' + bottom_nav_html, content)
        
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Navegación dividida en top y bottom para {len(files)} archivos!")
