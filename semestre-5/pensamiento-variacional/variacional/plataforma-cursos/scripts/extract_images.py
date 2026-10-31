import fitz # PyMuPDF
import sys

def extract_images(pdf_path, out_dir):
    doc = fitz.open(pdf_path)
    img_count = 0
    
    for page_index in range(len(doc)):
        page = doc[page_index]
        image_list = page.get_images(full=True)
        
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            img_count += 1
            out_file = f"{out_dir}/img_{img_count}.{image_ext}"
            
            with open(out_file, "wb") as f:
                f.write(image_bytes)
            print(f"Extracted {out_file}")

if __name__ == "__main__":
    pdf = sys.argv[1]
    out = sys.argv[2]
    extract_images(pdf, out)
