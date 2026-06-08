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
    
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extraer el número del bloque
    bloque_match = re.search(r'Bloque (\d+)', content)
    bloque_num = bloque_match.group(1) if bloque_match else "1"
    
    prev_num = num - 1
    next_num = num + 1
    
    prev_link = f"PVS{prev_num:02d}.{ext}"
    next_link = f"PVS{next_num:02d}.{ext}"
    
    prev_class = "nav-btn" if prev_num > 0 else "nav-btn btn-disabled"
    next_class = "nav-btn" if next_num <= 50 else "nav-btn btn-disabled"
    
    new_bottom_html = f"""        <nav class="session-nav bottom-nav-all">
            <a href="{prev_link}" class="{prev_class}">⬅ Anterior</a>
            <a href="../index.html" class="nav-btn">🏠 Inicio</a>
            <a href="{next_link}" class="{next_class}">Siguiente ➡</a>
            <a href="#" onclick="alert('¡Gracias por tu intención de apoyar el proyecto! Pronto habilitaremos los donativos.'); return false;" class="nav-btn btn-support">☕ Apoyar</a>
        </nav>
        
        <footer class="session-footer">
            <p>copyright &copy; JMGV-PTEL-2026. curso pensamiento variacional bloque {bloque_num}, sesion {num}. Todos los derechos reservados.</p>
        </footer>
    </div>"""

    # Limpiar cualquier navegación existente inyectada anteriormente
    content = re.sub(r'\s*<nav class="session-nav top-nav">.*?</nav>', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*<nav class="session-nav bottom-nav">.*?</nav>', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*<nav class="session-nav bottom-nav-all">.*?</nav>', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*<footer class="session-footer">.*?</footer>', '', content, flags=re.DOTALL)
    
    # Remover el viejo <br><br> e inyectar el nuevo footer y nav justo antes de cerrar el div de contenedor
    content = re.sub(r'\s*<br><br>\s*</div>', '\n' + new_bottom_html, content)
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Footer y navegación unificada agregados en {len(files)} archivos!")
