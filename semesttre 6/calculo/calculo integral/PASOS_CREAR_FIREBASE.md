# 📋 PASOS PARA CREAR UN PROYECTO FIREBASE

## Guía Completa para Configurar Firebase desde Cero

---

## **1. Crear la Cuenta y Acceder a Firebase Console**

- Ir a <https://console.firebase.google.com/>
- Iniciar sesión con tu cuenta de Google
- Si es tu primera vez, aceptar los términos y condiciones

---

## **2. Crear Nuevo Proyecto**

- Click en **"Agregar proyecto"** o **"Add project"**
- Nombre del proyecto: `CalculoIntegral` (o el nombre que prefieras)
- Click en **Continuar**

---

## **3. Configurar Google Analytics (Opcional)**

- Puedes activar o desactivar Google Analytics
- Si lo activas, selecciona una cuenta de Analytics o crea una nueva
- Click en **Crear proyecto**
- Esperar 30-60 segundos mientras se configura

---

## **4. Registrar tu Aplicación Web**

- En el dashboard del proyecto, click en el ícono **</>** (Web)
- Nombre de la app: `Calculo Integral Web`
- ✅ Marcar **"También configurar Firebase Hosting"** (opcional)
- Click en **Registrar app**

---

## **5. Copiar Configuración de Firebase**

Aparecerá un código como este (guárdalo para usarlo después):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "calculointegral.firebaseapp.com",
  projectId: "calculointegral",
  storageBucket: "calculointegral.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

⚠️ **IMPORTANTE:** Esta configuración es única para tu proyecto. Guárdala en un lugar seguro.

---

## **6. Activar Authentication (Autenticación)**

- En el menú lateral: **Build → Authentication**
- Click en **Get started** (Comenzar)
- Ir a la pestaña **Sign-in method**
- Click en **Email/Password**
- Activar el interruptor **Enable**
- Guardar cambios

### Opciones adicionales de autenticación

- Google
- Facebook
- GitHub
- Anónima

---

## **7. Activar Firestore Database**

- En el menú lateral: **Build → Firestore Database**
- Click en **Create database**
- Seleccionar modo:
  - **Modo de producción:** Reglas de seguridad estrictas (recomendado para producción)
  - **Modo de prueba:** Acceso abierto por 30 días (recomendado para desarrollo)
- Seleccionar ubicación del servidor:
  - `us-central` (Estados Unidos - Centro)
  - `southamerica-east1` (Brasil - São Paulo)
  - Otros según tu región
- Click en **Habilitar**
- Esperar mientras se crea la base de datos

---

## **8. Configurar Reglas de Seguridad de Firestore**

Ir a **Firestore Database → Rules** y agregar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regla para colección de usuarios
    match /users/{userId} {
      // Solo el usuario autenticado puede leer/escribir sus propios datos
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regla para datos públicos (opcional)
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## **9. Crear Estructura Inicial en Firestore**

### Colección: `users`

- En Firestore, click en **+ Start collection**
- Nombre de la colección: `users`
- ID del documento: `[ID del usuario]` (se creará automáticamente al registrar usuarios)

### Estructura del documento de usuario

```javascript
{
  email: "usuario@ejemplo.com",
  displayName: "Nombre del Usuario",
  createdAt: timestamp,
  courseAccess: {
    calculoIntegral: true,
    calculoDiferencial: false
  },
  progress: {
    modulo1: 0,  // Antiderivadas
    modulo2: 0,  // Integral Definida
    modulo3: 0,  // Técnicas de Integración
    modulo4: 0,  // Aplicaciones
    modulo5: 0   // Ecuaciones Diferenciales
  },
  lastActivity: timestamp
}
```

---

## **10. Integrar Firebase en tu Proyecto Web**

### Paso 10.1: Crear archivo `firebase-config.js`

```javascript
// Importar Firebase SDK (Versión 9+)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase (del paso 5)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar para usar en otros archivos
export { auth, db, app };
```

### Paso 10.2: Incluir Firebase SDK en HTML

**Opción A: Usar CDN (más simple)** 1

```html
<!DOCTYPE html>
<html>
<head>
  <title>Cálculo Integral</title>
</head>
<body>
  <!-- Tu contenido -->
  
  <!-- Firebase SDK -->
  <script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
    import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
    import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
    
    // Tu configuración aquí
    const firebaseConfig = { /* ... */ };
    const app = initializeApp(firebaseConfig);
  </script>
</body>
</html>
```

**Opción B: Usar npm (para proyectos con bundler)** 2

```bash
npm install firebase
```

---

## **11. Crear Usuarios de Prueba**

### Opción A: Desde Firebase Console

- Ir a **Authentication → Users**
- Click en **Add user**
- Ingresar email y contraseña
- Click en **Add user**

### Opción B: Programáticamente

```javascript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config.js';

async function registrarUsuario(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Usuario creado:', userCredential.user);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

---

## **12. Implementar Sistema de Login**

```javascript
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase-config.js';

// Iniciar sesión
async function iniciarSesion(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Sesión iniciada:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error de login:', error.message);
    throw error;
  }
}

// Cerrar sesión
async function cerrarSesion() {
  try {
    await signOut(auth);
    console.log('Sesión cerrada');
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
  }
}

// Verificar estado de autenticación
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('Usuario autenticado:', user.email);
  } else {
    console.log('No hay usuario autenticado');
  }
});
```

---

## **13. Guardar y Leer Datos de Firestore**

```javascript
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase-config.js';

// Guardar progreso del usuario
async function guardarProgreso(modulo, porcentaje) {
  const userId = auth.currentUser.uid;
  const userRef = doc(db, 'users', userId);
  
  try {
    await updateDoc(userRef, {
      [`progress.${modulo}`]: porcentaje,
      lastActivity: new Date()
    });
    console.log('Progreso guardado');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Leer datos del usuario
async function obtenerDatosUsuario() {
  const userId = auth.currentUser.uid;
  const userRef = doc(db, 'users', userId);
  
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('Usuario no encontrado');
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

---

## ✅ **Checklist de Verificación**

Marca cada paso conforme lo completes:

- [ ] Cuenta de Google creada/lista
- [ ] Proyecto Firebase creado
- [ ] Aplicación Web registrada
- [ ] Configuración de Firebase copiada
- [ ] Authentication activado (Email/Password)
- [ ] Firestore Database creado
- [ ] Reglas de seguridad configuradas
- [ ] Estructura de colecciones definida
- [ ] Firebase integrado en el proyecto web
- [ ] Usuario de prueba creado
- [ ] Sistema de login implementado
- [ ] Funciones de lectura/escritura probadas

---

## 🔧 **Recursos Adicionales**

### Documentación Oficial

- **Firebase Docs:** <https://firebase.google.com/docs>
- **Authentication:** <https://firebase.google.com/docs/auth>
- **Firestore:** <https://firebase.google.com/docs/firestore>

### Tutoriales Recomendados

- Firebase Get Started (Web): <https://firebase.google.com/docs/web/setup>
- Firestore Security Rules: <https://firebase.google.com/docs/firestore/security/get-started>

### Consolas Importantes

- **Firebase Console:** <https://console.firebase.google.com/>
- **Google Cloud Console:** <https://console.cloud.google.com/>

---

## 🚨 **Consejos de Seguridad**

1. **Nunca expongas tus credenciales** en repositorios públicos
2. **Configura reglas de seguridad** adecuadas en Firestore
3. **Usa variables de entorno** para datos sensibles
4. **Habilita autenticación de dos factores** en tu cuenta de Google
5. **Revisa regularmente** los usuarios y la actividad en Firebase Console
6. **Configura límites de cuota** para evitar costos inesperados

---

## 💰 **Planes de Firebase**

### Spark Plan (Gratuito)

- ✅ Authentication: Usuarios ilimitados
- ✅ Firestore: 1 GB almacenamiento
- ✅ Firestore: 50,000 lecturas/día
- ✅ Firestore: 20,000 escrituras/día

### Blaze Plan (Pago por uso)

- Ideal para producción
- Escala automáticamente
- Paga solo por lo que usas

---

## 🎯 **Próximos Pasos**

1. Crear interfaz de login/registro
2. Implementar sistema de navegación entre módulos
3. Agregar seguimiento de progreso visual
4. Implementar sistema de ejercicios interactivos
5. Configurar Firebase Hosting para deployment

---

**Versión:** 1.0  
**Fecha:** Octubre 2025  
**Autor:** José Manuel González Vargas

---

**© JMGV-PTEL-2025 - Guía de Implementación Firebase**  
*Este documento es de uso educativo.*
