import os
import glob

files = glob.glob("pages/PVS*.[hH][tT][mM][lL]")

old_str = "alert('¡Gracias por tu intención de apoyar el proyecto! Pronto habilitaremos los donativos.');"
new_str = "alert('¡Gracias por tu apoyo a la educación!\\n\\nPara realizar tu donativo, utiliza la siguiente cuenta:\\n\\nCLABE Interbancaria: 722969020087766753');"

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    content = content.replace(old_str, new_str)
        
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print(f"CLABE added to {len(files)} files.")
