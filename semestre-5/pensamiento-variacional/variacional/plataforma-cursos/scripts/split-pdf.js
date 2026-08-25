const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function splitPdf() {
  console.log('🚀 Iniciando división del PDF...');
  
  const pdfPath = path.join(__dirname, '../public/courses/autocad/CAD_Exercises 2D.pdf');
  const outputDir = path.join(__dirname, '../public/courses/autocad/ejercicios');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const existingPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const totalPages = pdfDoc.getPageCount();
  
  console.log(`Encontradas ${totalPages} páginas.`);

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);
    
    const pdfBytes = await newPdf.save();
    // Guardamos la página usando el index 1-based (Página 1 = ejercicio_1.pdf)
    fs.writeFileSync(path.join(outputDir, `ejercicio_${i + 1}.pdf`), pdfBytes);
    console.log(`✅ Página ${i + 1} exportada.`);
  }
  
  console.log('🎉 División completa.');
}

splitPdf().catch(console.error);
