# 🔥 Firebase - Cálculo Integral

## 📍 Respuesta Rápida: ¿Dónde se ingresa la estructura del usuario?

La **estructura del documento de usuario** se crea **AUTOMÁTICAMENTE** cuando usas el sistema que he configurado.

### ✅ Tienes 2 opciones:

---

## **OPCIÓN 1: Automática (Recomendada) ⭐**

La estructura se crea **automáticamente en Firestore** cuando un usuario se registra usando el archivo `login.html`.

### Cómo funciona:

1. Abre el archivo `login.html` en tu navegador
2. Ve a la pestaña **"Registrarse"**
3. Llena el formulario:
   - Nombre: `Juan Pérez`
   - Email: `juan@ejemplo.com`
   - Contraseña: `123456`
4. Click en **"Crear Cuenta"**

### ¿Qué pasa automáticamente?

El archivo `auth-manager.js` ejecuta la función `crearEstructuraUsuario()` que:

```javascript
✅ Crea el usuario en Authentication
✅ Crea automáticamente en Firestore:
   - Colección: users
   - Documento: [ID del usuario]
   - Con esta estructura:
     {
       email: "juan@ejemplo.com",
       displayName: "Juan Pérez",
       createdAt: [timestamp],
       courseAccess: {
         calculoIntegral: true,
         calculoDiferencial: false
       },
       progress: {
         modulo1: 0,
         modulo2: 0,
         modulo3: 0,
         modulo4: 0,
         modulo5: 0
       },
       lastActivity: [timestamp]
     }
```

### Verificar en Firebase Console:

1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto: `calculointegral-2601b`
3. Ve a **Firestore Database**
4. Verás la colección `users` con tu usuario creado

---

## **OPCIÓN 2: Manual (Para pruebas)**

Si quieres crear la estructura manualmente en Firebase Console:

1. **Ir a Firebase Console:**
   - https://console.firebase.google.com/
   - Proyecto: `calculointegral-2601b`

2. **Ir a Firestore Database:**
   - Menu: **Build → Firestore Database**

3. **Crear colección:**
   - Click: **"+ Start collection"**
   - ID: `users`
   - Click: **"Next"**

4. **Crear documento:**
   - Document ID: `usuario_prueba` (o auto-ID)
   
5. **Agregar campos uno por uno:**

| Campo | Tipo | Valor |
|-------|------|-------|
| email | string | `usuario@ejemplo.com` |
| displayName | string | `Usuario Prueba` |
| createdAt | timestamp | [fecha actual] |
| courseAccess | map | ⬇️ Ver abajo |
| progress | map | ⬇️ Ver abajo |
| lastActivity | timestamp | [fecha actual] |

6. **Campo courseAccess (tipo map):**
   - Click en el campo → Add field
   - `calculoIntegral` → boolean → `true`
   - `calculoDiferencial` → boolean → `false`

7. **Campo progress (tipo map):**
   - Click en el campo → Add field
   - `modulo1` → number → `0`
   - `modulo2` → number → `0`
   - `modulo3` → number → `0`
   - `modulo4` → number → `0`
   - `modulo5` → number → `0`

---

## 📁 Archivos Creados

### 1. `firebase.config.js` ✅
Ya lo tienes, contiene tu configuración de Firebase.

### 2. `auth-manager.js` ✅ NUEVO
Sistema completo de autenticación que incluye:
- ✅ Registro de usuarios
- ✅ Inicio de sesión
- ✅ Cierre de sesión
- ✅ **Creación automática de estructura en Firestore**
- ✅ Actualización de progreso
- ✅ Verificación de acceso

### 3. `login.html` ✅ NUEVO
Página de login/registro con:
- ✅ Interfaz moderna
- ✅ Formularios de login y registro
- ✅ Panel de usuario autenticado
- ✅ Visualización de progreso
- ✅ **Crea automáticamente la estructura en Firestore**

---

## 🚀 Cómo Usar el Sistema

### Paso 1: Configurar Firestore (Si no lo has hecho)

1. Ve a Firebase Console
2. **Build → Firestore Database**
3. Click: **"Create database"**
4. Modo: **"Test mode"** (por ahora)
5. Ubicación: Elige la más cercana
6. Click: **"Enable"**

### Paso 2: Activar Authentication

1. Ve a Firebase Console
2. **Build → Authentication**
3. Click: **"Get started"**
4. Pestaña: **"Sign-in method"**
5. Click en: **"Email/Password"**
6. Activar y guardar

### Paso 3: Usar la Aplicación

```bash
# Abre en tu navegador:
login.html
```

**Registra un usuario:**
- Nombre: `Test Usuario`
- Email: `test@ejemplo.com`
- Contraseña: `123456`

**Verifica en Firestore:**
- Ve a Firebase Console → Firestore Database
- Deberías ver: `users → [ID del usuario] → [estructura completa]`

---

## 🔍 Verificar que Funcionó

### En Firebase Console:

1. **Authentication → Users:**
   - Debes ver tu usuario registrado

2. **Firestore Database:**
   ```
   users (colección)
     └── [uid del usuario] (documento)
          ├── email: "test@ejemplo.com"
          ├── displayName: "Test Usuario"
          ├── createdAt: [timestamp]
          ├── courseAccess
          │    ├── calculoIntegral: true
          │    └── calculoDiferencial: false
          ├── progress
          │    ├── modulo1: 0
          │    ├── modulo2: 0
          │    ├── modulo3: 0
          │    ├── modulo4: 0
          │    └── modulo5: 0
          └── lastActivity: [timestamp]
   ```

### En la Consola del Navegador (F12):

Deberías ver mensajes como:
```
✅ Usuario creado en Authentication: [uid]
✅ Estructura de usuario creada en Firestore
✅ Sesión iniciada: test@ejemplo.com
```

---

## 🎯 Próximos Pasos

1. ✅ Estructura creada automáticamente
2. ⏭️ Crear páginas de los módulos
3. ⏭️ Implementar navegación entre módulos
4. ⏭️ Agregar sistema de progreso
5. ⏭️ Integrar ejercicios interactivos

---

## 🐛 Solución de Problemas

### Error: "Firebase not defined"
**Solución:** Asegúrate de abrir `login.html` desde un servidor web (no file://)

Usa uno de estos:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# VS Code
Instala: Live Server extension
```

### Error: "Missing or insufficient permissions"
**Solución:** 
1. Ve a Firestore → Rules
2. Cambia temporalmente a:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### No se crea la estructura en Firestore
**Verificar:**
1. ✅ Firestore está habilitado
2. ✅ Authentication está habilitado
3. ✅ Las reglas permiten escritura
4. ✅ Abrir consola del navegador (F12) para ver errores

---

## 📞 Contacto

**Proyecto:** Cálculo Integral  
**Firebase Project ID:** calculointegral-2601b  
**Autor:** José Manuel González Vargas  
**Fecha:** Octubre 2025

---

## ✅ Checklist Final

- [ ] Firestore Database activado
- [ ] Authentication (Email/Password) activado
- [ ] Archivo `auth-manager.js` creado
- [ ] Archivo `login.html` creado
- [ ] Usuario de prueba registrado
- [ ] Estructura visible en Firestore
- [ ] Sistema funcionando correctamente

---

**🎉 ¡Listo! La estructura se crea automáticamente cuando registras usuarios.**

