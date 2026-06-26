import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
    }),
  });
}

const db = getFirestore();

async function migrateCourses() {
  console.log("Iniciando migración de cursos...");

  try {
    // 1. Asignar courseId: "variacional" a módulos existentes
    const modulesRef = db.collection('Modules');
    const modulesSnap = await modulesRef.get();
    let updatedModules = 0;
    
    for (const doc of modulesSnap.docs) {
      if (!doc.data().courseId) {
        await doc.ref.update({ courseId: 'variacional' });
        updatedModules++;
      }
    }
    console.log(`✅ Actualizados ${updatedModules} módulos con courseId 'variacional'`);

    // 2. Asignar courseId: "variacional" a lecciones existentes
    const lessonsRef = db.collection('Lessons');
    const lessonsSnap = await lessonsRef.get();
    let updatedLessons = 0;

    for (const doc of lessonsSnap.docs) {
      if (!doc.data().courseId) {
        await doc.ref.update({ courseId: 'variacional' });
        updatedLessons++;
      }
    }
    console.log(`✅ Actualizadas ${updatedLessons} lecciones con courseId 'variacional'`);

    // 3. Crear Módulos para "Propiedades Matemáticas"
    const propsModules = [
      { id: 'prop_mod_1', title: 'Módulo 1: Fundamentos y Álgebra', order: 1, courseId: 'propiedades' },
      { id: 'prop_mod_2', title: 'Módulo 2: Cálculo y Temas Avanzados', order: 2, courseId: 'propiedades' }
    ];

    for (const mod of propsModules) {
      await db.collection('Modules').doc(mod.id).set(mod, { merge: true });
    }
    console.log("✅ Módulos de 'Propiedades Matemáticas' creados.");

    // 4. Crear Lecciones (Iframes) para "Propiedades Matemáticas"
    const propLessons = [
      // Módulo 1
      { title: 'Propiedades de la Igualdad', file: 'prop_igualdad.html', mod: 'prop_mod_1', order: 1 },
      { title: 'Propiedades de la Aritmética', file: 'prop_aritmetica.html', mod: 'prop_mod_1', order: 2 },
      { title: 'Propiedades de la Suma', file: 'prop_suma.html', mod: 'prop_mod_1', order: 3 },
      { title: 'Propiedades de la Resta', file: 'prop_resta.html', mod: 'prop_mod_1', order: 4 },
      { title: 'Propiedades de la Multiplicación', file: 'prop_multiplicacion.html', mod: 'prop_mod_1', order: 5 },
      { title: 'Propiedades de la División', file: 'prop_division.html', mod: 'prop_mod_1', order: 6 },
      { title: 'Números Primos', file: 'prop_primos.html', mod: 'prop_mod_1', order: 7 },
      { title: 'Propiedades de la Potencia', file: 'prop_potencia.html', mod: 'prop_mod_1', order: 8 },
      { title: 'Propiedades de las Raíces', file: 'prop_raices.html', mod: 'prop_mod_1', order: 9 },
      { title: 'Propiedades del Álgebra', file: 'prop_algebra.html', mod: 'prop_mod_1', order: 10 },
      { title: 'Polinomios', file: 'prop_polinomios.html', mod: 'prop_mod_1', order: 11 },
      { title: 'Binomios', file: 'prop_binomios.html', mod: 'prop_mod_1', order: 12 },
      { title: 'Trinomios', file: 'prop_trinomios.html', mod: 'prop_mod_1', order: 13 },
      { title: 'Productos Notables', file: 'prop_productosnotables.html', mod: 'prop_mod_1', order: 14 },
      { title: 'Factorización', file: 'prop_factorizacion.html', mod: 'prop_mod_1', order: 15 },
      
      // Módulo 2
      { title: 'Teoremas Geométricos', file: 'prop_teoremas.html', mod: 'prop_mod_2', order: 16 },
      { title: 'Identidades Trigonométricas', file: 'prop_identidadestrigono.html', mod: 'prop_mod_2', order: 17 },
      { title: 'Límites', file: 'limites.html', mod: 'prop_mod_2', order: 18 },
      { title: 'Propiedades de la Derivada', file: 'prop_derivada.html', mod: 'prop_mod_2', order: 19 },
      { title: 'Derivadas Parciales', file: 'prop_derivadas_parciales.html', mod: 'prop_mod_2', order: 20 },
      { title: 'Propiedades de la Integral', file: 'prop_integral.html', mod: 'prop_mod_2', order: 21 },
      { title: 'Integración por Partes', file: 'prop_integracionporpartes.html', mod: 'prop_mod_2', order: 22 },
      { title: 'Fracciones Parciales', file: 'prop_fraccparciales.html', mod: 'prop_mod_2', order: 23 },
      { title: 'Transformada de Laplace', file: 'prop_laplace.html', mod: 'prop_mod_2', order: 24 },
      { title: 'Series de Fourier', file: 'prop_fourier.html', mod: 'prop_mod_2', order: 25 },
    ];

    for (const lesson of propLessons) {
      const docId = `prop_lesson_${lesson.order}`;
      // Usar un iframe que apunte a los archivos copiados a public/recursos_propiedades/
      const iframeContent = `<iframe src="/recursos_propiedades/${lesson.file}" class="w-full h-[100vh] border-0" allowfullscreen></iframe>`;
      
      await db.collection('Lessons').doc(docId).set({
        title: `SESIÓN ${lesson.order}: ${lesson.title}`,
        moduleId: lesson.mod,
        order: lesson.order,
        content: iframeContent,
        courseId: 'propiedades'
      }, { merge: true });
    }
    console.log("✅ Lecciones de 'Propiedades Matemáticas' creadas exitosamente.");
    console.log("¡Migración completada!");
  } catch (error) {
    console.error("Error durante la migración:", error);
  }
}

migrateCourses();
