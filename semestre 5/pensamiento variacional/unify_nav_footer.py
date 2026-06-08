import os
import glob
import re

css_code = """
/* Footer and Nav Updates */
footer {
    text-align: center;
    padding: 20px;
    color: #64748b;
    font-size: 0.85em;
    margin-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
}
.session-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 15px;
    flex-wrap: wrap;
}
.bottom-nav { margin-top: 30px; margin-bottom: 10px; }
"""

with open("css/styles.css", "r", encoding="utf-8") as f:
    css_content = f.read()

if "/* Footer and Nav Updates */" not in css_content:
    with open("css/styles.css", "a", encoding="utf-8") as f:
        f.write("\n" + css_code)

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
    
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Extraer el bloque
    bloque_match = re.search(r'<div class="badge">Bloque (\d+)', content)
    bloque_num = bloque_match.group(1) if bloque_match else "1"
    
    # Eliminar navegaciones anteriores
    content = re.sub(r'\s*<nav class="session-nav.*?>.*?</nav>', '', content, flags=re.DOTALL)
    
    # Eliminar el footer anterior si existe
    content = re.sub(r'\s*<footer>.*?</footer>', '', content, flags=re.DOTALL)
    
    unified_nav_and_footer = f"""
        <nav class="session-nav bottom-nav">
            <a href="{prev_link}" class="{prev_class}">⬅ Anterior</a>
            <a href="../index.html" class="nav-btn">🏠 Inicio</a>
            <a href="{next_link}" class="{next_class}">Siguiente ➡</a>
            <a href="#" onclick="alert('¡Gracias por tu intención de apoyar el proyecto! Pronto habilitaremos los donativos.'); return false;" class="nav-btn btn-support">☕ Apoyar</a>
        </nav>
        
        <footer>
            <p>copyright &copy; JMGV-PTEL-2026. curso pensamiento variacional bloque {bloque_num}, sesion {num:02d}. Todos los derechos reservados.</p>
        </footer>
    """
    
    # Inyectar el bloque completo justo antes de cerrar el div principal (infographic-container)
    # Normalmente está antes de <div id="quiz-mount-point" o al final.
    # We want it AFTER the quiz mount point.
    content = re.sub(r'(<div id="quiz-mount-point"[^>]*></div>)', r'\1\n' + unified_nav_and_footer, content)
        
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Navegación unificada y footer agregado en {len(files)} archivos!")
