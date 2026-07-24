import fitz  # PyMuPDF
import json
import os

pdf_path = r"c:\Users\admin\Documents\000 A PREPA\planeaciones especialidades\Proyectos y Otros\semestre-5\pensamiento-variacional\cursos\Autocad\CAD_Exercises 2D.pdf"
json_dir = r"c:\Users\admin\Documents\000 A PREPA\planeaciones especialidades\Proyectos y Otros\semestre-5\pensamiento-variacional\cursos\Autocad"
output_dir = r"c:\Users\admin\Documents\000 A PREPA\planeaciones especialidades\Proyectos y Otros\semestre-5\pensamiento-variacional\variacional\plataforma-cursos\public\autocad"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

doc = fitz.open(pdf_path)
total_pages = len(doc)
print(f"Total pages in PDF: {total_pages}")

zoom_x = 3.0  # horizontal zoom
zoom_y = 3.0  # vertical zoom
mat = fitz.Matrix(zoom_x, zoom_y)  # zoom factor 3 to get higher resolution images

for i in range(1, 41):
    json_path = os.path.join(json_dir, f"ejercicio_{i}.json")
    if not os.path.exists(json_path):
        print(f"Warning: {json_path} does not exist.")
        continue

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    pagina_pdf = data.get("pagina_pdf", i)
    # PyMuPDF uses 0-based index
    page_index = pagina_pdf - 1

    if page_index < 0 or page_index >= total_pages:
        print(f"Error: Page index {page_index} out of bounds for {json_path}")
        continue

    page = doc.load_page(page_index)
    pix = page.get_pixmap(matrix=mat)
    
    output_path = os.path.join(output_dir, f"ejercicio_{i}.png")
    pix.save(output_path)
    print(f"Saved {output_path} (from PDF page {pagina_pdf})")

print("All images extracted successfully.")
