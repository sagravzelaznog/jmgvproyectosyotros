import os
import glob
import re

files = glob.glob("pages/PVS*.[hH][tT][mM][lL]")
files.append("index.html")

fixed_onclick = r"""onclick="alert('¡Gracias por tu apoyo a la educación!\n\nPara realizar tu donativo, puedes usar:\n\n💳 CLABE Interbancaria: 722969020087766753\n✉️ PayPal: primomanuel@hotmail.com'); return false;\""""
fixed_onclick = fixed_onclick[:-2] + '"' # fixing the trailing quote

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    pattern = r"onclick=\"alert\('¡Gracias por tu apoyo a la educación!.*?primomanuel@hotmail\.com'\); return false;\""
    
    content = re.sub(pattern, fixed_onclick, content, flags=re.DOTALL)
        
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Fixed newlines in {len(files)} files.")
