import os
import glob
import re

css_code = """
/* Footer & Final Nav */
.site-footer {
    text-align: center;
    padding: 20px 10px;
    margin-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8;
    font-size: 0.85em;
    font-family: 'Outfit', sans-serif;
}
"""

with open("css/styles.css", "r", encoding="utf-8") as f:
    css_content = f.read()

if "/* Footer & Final Nav */" not in css_content:
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
        
    bloque = "1"
    b_match = re.search(r'<div class="badge">Bloque (\d+)', content)
    if b_match:
        bloque = b_match.group(1)
        
    final_html = f"""
    <nav class="session-nav bottom-nav">
        <a href="{prev_link}" class="{prev_class}">⬅ Ant</a>
        <a href="../index.html" class="nav-btn">🏠 Inicio</a>
        <a href="#" onclick="alert('¡Gracias por tu intención de apoyar el proyecto! Pronto habilitaremos los donativos.'); return false;" class="nav-btn btn-support">☕ Apoyar</a>
        <a href="{next_link}" class="{next_class}">Sig ➡</a>
    </nav>
    <footer class="site-footer">
        <p>copyright &copy; JMGV-PTEL-2026. curso pensamiento variacional bloque {bloque}, sesion {num:02d}. Todos los derechos reservados.</p>
    </footer>"""
    
    # Remover TODAS las etiquetas <nav> existentes
    content = re.sub(r'\s*<nav[^>]*>.*?</nav>', '', content, flags=re.DOTALL)
    
    # Remover el footer si existiera
    content = re.sub(r'\s*<footer[^>]*>.*?</footer>', '', content, flags=re.DOTALL)
    
    # Insertar el nuevo bloque de navegacion y footer justo antes de </body>
    content = content.replace('</body>', final_html + '\n</body>')
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Modificación aplicada a {len(files)} sesiones: Navegación unificada al final y Footer agregados.")
