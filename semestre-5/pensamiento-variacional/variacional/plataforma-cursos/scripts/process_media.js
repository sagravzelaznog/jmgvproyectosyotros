const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const mcsDir = 'C:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional\\cursos\\ANALISIS FISICOS\\mcs';
const targetDir = 'C:\\Users\\admin\\Documents\\000 A PREPA\\planeaciones especialidades\\Proyectos y Otros\\semestre-5\\pensamiento-variacional\\variacional\\plataforma-cursos\\public\\courses\\fisica';

async function processMedia() {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let totalRawImgSize = 0;
  let totalCompImgSize = 0;
  let imgCount = 0;
  let videoCount = 0;

  for (let i = 1; i <= 50; i++) {
    const mcNum = String(i).padStart(2, '0');
    const mcFolder = `MC${mcNum}`;
    const srcFolder = path.join(mcsDir, mcFolder);
    const destFolder = path.join(targetDir, `mc${mcNum}`);

    if (!fs.existsSync(srcFolder)) continue;
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    const files = fs.readdirSync(srcFolder);

    for (const f of files) {
      const srcPath = path.join(srcFolder, f);
      const stat = fs.statSync(srcPath);

      if (/\.(png|jpg|jpeg|webp)$/i.test(f)) {
        totalRawImgSize += stat.size;
        imgCount++;

        // Convert PNG/JPG to compressed JPEG
        const baseName = path.parse(f).name;
        const destName = `${baseName}.jpg`;
        const destPath = path.join(destFolder, destName);

        try {
          await sharp(srcPath)
            .jpeg({ quality: 82, progressive: true })
            .toFile(destPath);
          const compStat = fs.statSync(destPath);
          totalCompImgSize += compStat.size;
        } catch (err) {
          console.error(`Error compressing ${f}:`, err.message);
          // Fallback copy
          fs.copyFileSync(srcPath, path.join(destFolder, f));
          totalCompImgSize += stat.size;
        }
      } else if (/\.(mp4|webm)$/i.test(f)) {
        videoCount++;
        // Copy video with clean name (no spaces)
        const cleanName = f.replace(/\s+/g, '_');
        const destPath = path.join(destFolder, cleanName);
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    if (i % 10 === 0) {
      console.log(`Processed up to MC${mcNum}...`);
    }
  }

  console.log('\n================ MEDIA PROCESSING COMPLETE ================');
  console.log(`Images processed: ${imgCount}`);
  console.log(`Raw image size: ${(totalRawImgSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Compressed image size: ${(totalCompImgSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Videos copied: ${videoCount}`);
}

processMedia().catch(e => console.error(e));
