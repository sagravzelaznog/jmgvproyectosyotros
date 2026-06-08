import os
import glob
import re

css_code = """
/* Session Navigation */
.session-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
    gap: 8px;
}
.nav-btn {
    background: rgba(255,255,255,0.1);
    color: white;
    text-decoration: none;
    padding: 10px 10px;
    border-radius: 8px;
    font-size: 0.9em;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.nav-btn:hover { background: rgba(255,255,255,0.2); transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.2); }
.btn-support { background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a; border-color: #f59e0b; font-weight: 800; }
.btn-support:hover { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
.btn-disabled { opacity: 0.3; pointer-events: none; }
@media (max-width: 400px) {
    .nav-btn { font-size: 0.75em; padding: 8px 4px; }
}
"""

with open("css/styles.css", "r", encoding="utf-8") as f:
    css_content = f.read()

if "/* Session Navigation */" not in css_content:
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
    
    # We will use alert for support button if we don't have a real link, or maybe a BuyMeACoffee placeholder
    nav_html = f"""
            <nav class="session-nav">
                <a href="{prev_link}" class="{prev_class}">⬅ Ant</a>
                <a href="../index.html" class="nav-btn">🏠 Inicio</a>
                <a href="{next_link}" class="{next_class}">Sig ➡</a>
                <a href="#" onclick="alert('¡Gracias por tu intención de apoyar el proyecto! Pronto habilitaremos los donativos.'); return false;" class="nav-btn btn-support">☕ Apoyar</a>
            </nav>"""
    
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Remove old back-btn if it exists
    content = re.sub(r'<a href="\.\./index\.html" class="back-btn">⬅ Inicio</a>\s*', '', content)
    
    # If the new nav is not already there, inject it right after <header ...>
    if 'class="session-nav"' not in content:
        content = re.sub(r'(<header class="info-header"[^>]*>)', r'\1' + nav_html, content)
        
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Navigation injected in {len(files)} files successfully!")
