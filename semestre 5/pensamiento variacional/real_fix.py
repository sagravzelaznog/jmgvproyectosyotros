import glob
import re

files = glob.glob("pages/PVS*.[hH][tT][mM][lL]")
files.append("index.html")

# The correct literal string with escaped \n for JS
new_str = r"onclick=\"alert('¡Gracias por tu apoyo a la educación!\\n\\nPara realizar tu donativo, puedes usar:\\n\\n💳 CLABE Interbancaria: 722969020087766753\\n✉️ PayPal: primomanuel@hotmail.com'); return false;\""

# Pattern to match the multiline onclick attribute
pattern = re.compile(r'onclick="alert\([^)]*primomanuel@hotmail\.com\'\);\s*return false;"', re.DOTALL)

count = 0
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    if pattern.search(content):
        content = pattern.sub(new_str, content)
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed {file}")
        count += 1
    else:
        print(f"Not found in {file}")

print(f"Total fixed: {count}")
