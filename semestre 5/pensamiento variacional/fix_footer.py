import os
import glob
import re

files = glob.glob("pages/PVS*.[hH][tT][mM][lL]")

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Limpiar todos los footers basura y navegaciones anteriores
    content = re.sub(r'<footer.*?>.*?</footer>', '', content, flags=re.DOTALL)
    content = re.sub(r'<nav class="session-nav.*?>.*?</nav>', '', content, flags=re.DOTALL)
    
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
    
    # HTML del footer y botones al final
    nav_html = f"""
        <footer style="text-align: center; margin-top: 50px; padding: 20px 0 10px 0; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); font-size: 0.9em;">
            <p>copyright &copy; JMGV-PTEL-2026. Curso Pensamiento Variacional. Todos los derechos reservados.</p>
        </footer>
        <nav class="session-nav" style="margin-bottom: 40px; width: 100%; display: flex; gap: 15px;">
            <a href="{prev_link}" class="{prev_class}">⬅ Anterior</a>
            <a href="../index.html" class="nav-btn">🏠 Inicio</a>
            <a href="{next_link}" class="{next_class}">Siguiente ➡</a>
            <a href="#" onclick="alert('¡Gracias por tu intención de apoyar el proyecto! Pronto habilitaremos los donativos.'); return false;" class="nav-btn btn-support">☕ Apoyar</a>
        </nav>"""
    
    # Insertar justo después del quiz (que es lo último de la página)
    content = re.sub(r'(<div id="quiz-mount-point"[^>]*></div>)', r'\1\n' + nav_html, content)
        
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Footer y Botones unificados y reubicados al final en {len(files)} archivos.")
