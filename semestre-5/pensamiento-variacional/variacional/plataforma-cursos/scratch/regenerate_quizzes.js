const admin = require('firebase-admin');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: '.env.local' });
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-3.6-flash", 
  generationConfig: { responseMimeType: "application/json" }
});

async function rewriteOptions(question, options, correctAnswerIndex) {
  const prompt = `
  Eres un experto profesor de física. Tienes una pregunta de opción múltiple.
  El objetivo es reescribir LAS OPCIONES INCORRECTAS para que tengan una longitud, estilo y nivel de detalle muy similar a la opción correcta.
  Esto es para evitar que los estudiantes adivinen la correcta basándose en que suele ser la opción más larga y explicativa.
  
  REGLAS ESTRICTAS:
  1. LA OPCIÓN CORRECTA (índice ${correctAnswerIndex}) DEBE PERMANECER EXACTAMENTE IGUAL. ¡No le quites ni agregues una sola letra!
  2. Las opciones incorrectas deben ser reescritas para parecerse en formato a la correcta. Si la correcta usa fórmulas LaTeX (\\(...\\)) o viñetas, las incorrectas también deberían.
  3. Las opciones reescritas deben seguir siendo conceptualmente INCORRECTAS respecto a la pregunta.
  4. Mantén exactamente 4 opciones en el mismo orden original.
  
  PREGUNTA: "${question}"
  OPCIÓN CORRECTA (índice ${correctAnswerIndex}): "${options[correctAnswerIndex]}"
  OPCIONES ORIGINALES:
  ${options.map((opt, i) => `${i}: ${opt}`).join('\n')}
  
  Devuelve ÚNICAMENTE un arreglo JSON de 4 strings con las nuevas opciones.
  Ejemplo de salida:
  [
    "Opción 0 reescrita",
    "Opción 1 reescrita (esta era la correcta, se mantiene idéntica)",
    "Opción 2 reescrita",
    "Opción 3 reescrita"
  ]
  `;
  
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  try {
    const newOptions = JSON.parse(responseText);
    if (!Array.isArray(newOptions) || newOptions.length !== 4) {
      throw new Error("El modelo no devolvió un array de 4 elementos.");
    }
    // Ensure the correct answer wasn't modified
    newOptions[correctAnswerIndex] = options[correctAnswerIndex];
    return newOptions;
  } catch(e) {
    console.error("Error parseando respuesta del LLM:", responseText);
    return options; // Fallback to original
  }
}

async function run() {
  console.log('--- REGENERANDO RESPUESTAS INCORRECTAS (MC11 a MC50) ---');
  
  const quizzesSnapshot = await db.collection('Quizzes')
    .where('courseId', '==', 'fisica')
    .get();
    
  let processed = 0;
    
  for (const doc of quizzesSnapshot.docs) {
    const data = doc.data();
    const lessonId = data.lessonId;
    
    // Parse lesson number (e.g. lesson_11_fisica)
    const match = lessonId.match(/lesson_(\d+)_fisica/);
    if (!match) continue;
    
    const num = parseInt(match[1], 10);
    if (num <= 11 || num > 50) continue; // Only process MC12 to MC50
    
    console.log(`\nProcesando ${lessonId}...`);
    
    let updatedQuestions = [];
    let hasChanges = false;
    
    for (const q of data.questions) {
      console.log(`  Pregunta: ${q.question.substring(0, 50)}...`);
      try {
        const newOptions = await rewriteOptions(q.question, q.options, q.correctAnswer);
        
        updatedQuestions.push({
          ...q,
          options: newOptions
        });
        hasChanges = true;
      } catch (err) {
        console.error(`  Error reescribiendo opciones: ${err.message}`);
        updatedQuestions.push(q);
      }
      
      // Pausa de 5 segundos para respetar los límites de la capa gratuita (15 RPM)
      await new Promise(r => setTimeout(r, 5000));
    }
    
    if (hasChanges) {
      await db.collection('Quizzes').doc(doc.id).update({
        questions: updatedQuestions
      });
      console.log(`✅ ${lessonId} actualizado.`);
      processed++;
    }
  }
  
  console.log(`\n--- FINALIZADO. ${processed} QUIZZES ACTUALIZADOS ---`);
  process.exit(0);
}

run().catch(console.error);
