import os

target_str = ''
target_py_str = ''
d = r'c:\Users\admin\Documents\000 A PREPA\planeaciones especialidades\Proyectos y Otros'
count = 0

for root, dirs, files in os.walk(d):
    for f in files:
        if f.endswith('.html') or f.endswith('.py'):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8') as file:
                    content = file.read()
            except Exception:
                continue
                        if 'polyfill.io' in content:
                new_content = content.replace(target_str, '')
                new_content = new_content.replace(target_py_str, '')
                # also clean up leading spaces that might be left
                new_content = new_content.replace('    \n', '')
                with open(p, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                count += 1
                print('Cleaned ' + p)

print('Cleaned polyfill from ' + str(count) + ' files.')
