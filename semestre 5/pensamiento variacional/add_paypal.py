import os
import glob
import re

new_alert = "alert('¡Gracias por tu apoyo a la educación!\\n\\nPara realizar tu donativo, puedes usar:\\n\\n💳 CLABE Interbancaria: 722969020087766753\\n✉️ PayPal: primomanuel@hotmail.com');"

# 1. Update all PVS files
files = glob.glob("pages/PVS*.[hH][tT][mM][lL]")
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Replace the old alert which could be one of the previous ones
    content = re.sub(r'alert\([\'"].*?Apoyo.*?[\'"]\);', new_alert, content)
    # Just to be safe, replace the exact strings we used before
    content = re.sub(r"alert\('¡Gracias por tu apoyo a la educación!.*?CLABE.*?722969020087766753.*?\'\);", new_alert, content)
    content = re.sub(r"alert\('¡Gracias por tu intención de apoyar.*?donativos\.'\);", new_alert, content)
        
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

# 2. Update index.html
with open("index.html", "r", encoding="utf-8") as f:
    index_content = f.read()

support_btn_html = f"""
        <div style="display: flex; justify-content: center; margin-bottom: 40px; margin-top: 20px;">
            <a href="#" onclick="{new_alert} return false;" style="padding: 12px 30px; font-size: 1.1em; border-radius: 8px; text-decoration: none; color: #0f172a; font-weight: 800; background: linear-gradient(135deg, #f59e0b, #d97706); border: 1px solid #f59e0b; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">☕ Apoyar a la Educación</a>
        </div>
"""

# Inject before <footer> if not already there
if "☕ Apoyar a la Educación" not in index_content:
    index_content = index_content.replace('<footer>', support_btn_html + '        <footer>')
else:
    # Update the alert in index.html if it was already there
    index_content = re.sub(r'alert\([\'"].*?Apoyar.*?[\'"]\);', new_alert, index_content)
    index_content = re.sub(r"alert\('¡Gracias por tu apoyo a la educación!.*?CLABE.*?722969020087766753.*?\'\);", new_alert, index_content)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(index_content)

print("PayPal email added and index.html updated!")
