# Configuración de GitHub Pages - Curso de Cálculo Diferencial

## 🚀 Despliegue Automático

Este repositorio está configurado para desplegar automáticamente en GitHub Pages.

### Configuración Requerida

1. **Habilitar GitHub Pages**:
   - Ve a Settings > Pages
   - Selecciona "Deploy from a branch"
   - Elige la rama `main`
   - Selecciona la carpeta `/ (root)`

2. **Configurar Firebase**:
   - Actualiza `firebase-config.js` con las credenciales de producción
   - Configura el dominio autorizado en Firebase Console

## 📁 Estructura de Despliegue

```
/
├── index.html                          # Página principal
├── modulo1_relaciones_funciones.html   # Módulos del curso
├── modulo2_limites.html
├── modulo3_continuidad.html
├── modulo4_la_derivada.html
├── modulo5_aplicaciones_derivada.html
├── ejercicios_modulo1.html             # Ejercicios complementarios
├── firebase-config.js                  # Configuración Firebase
├── auth-manager.js                     # Gestión de autenticación
├── config.js                          # Configuración general
├── module-navigation.js                # Navegación entre módulos
├── server.py                          # Servidor local (no se despliega)
├── check_dependencies.py              # Verificador (no se despliega)
├── package.json                       # Configuración del proyecto
├── README.md                          # Documentación principal
├── LICENSE                            # Licencia MIT
├── CONTRIBUTING.md                    # Guía de contribución
├── CHANGELOG.md                       # Historial de cambios
├── SECURITY.md                        # Política de seguridad
├── CONTRIBUTORS.md                    # Lista de contribuidores
├── DEPENDENCIES.md                    # Documentación de dependencias
└── .github/                           # Configuración de GitHub
    ├── workflows/
    │   └── verify.yml                 # Verificación automática
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   ├── feature_request.md
    │   └── content_improvement.md
    └── pull_request_template.md
```

## 🔧 Configuración de Producción

### Variables de Entorno

```bash
# Configuración de producción
FIREBASE_PROJECT_ID=tu-proyecto-produccion
FIREBASE_AUTH_DOMAIN=tu-proyecto-produccion.firebaseapp.com
APP_ENVIRONMENT=production
DEBUG_MODE=false
```

### Configuración de Firebase

1. **Crear proyecto de producción**:
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto para producción
   - Configura Authentication y Firestore

2. **Configurar dominio autorizado**:
   - Ve a Authentication > Settings > Authorized domains
   - Agrega tu dominio de GitHub Pages
   - Ejemplo: `tu-usuario.github.io`

3. **Actualizar configuración**:
   - Edita `firebase-config.js` con las credenciales de producción
   - Actualiza `config.js` para modo producción

## 📊 Monitoreo de Despliegue

### GitHub Actions

El repositorio incluye un workflow de verificación que se ejecuta en cada push:

```yaml
name: Verificación del Curso de Cálculo Diferencial
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

### Verificaciones Automáticas

- ✅ Estructura de archivos
- ✅ Sintaxis HTML/CSS/JavaScript
- ✅ Configuración de Firebase
- ✅ Recursos CDN
- ✅ Derechos de autor
- ✅ Documentación

## 🔒 Seguridad en Producción

### Configuración de Seguridad

1. **Firebase Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

2. **Configuración de CORS**:
   - Configurar dominios autorizados en Firebase
   - Limitar acceso a recursos sensibles

3. **Monitoreo de Seguridad**:
   - Revisar logs de autenticación
   - Monitorear patrones de acceso anómalos

## 📱 Compatibilidad

### Navegadores Soportados

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos Soportados

- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

## 🚀 Proceso de Despliegue

### Despliegue Automático

1. **Push a main**:
   ```bash
   git add .
   git commit -m "feat: nueva funcionalidad"
   git push origin main
   ```

2. **Verificación automática**:
   - GitHub Actions ejecuta verificaciones
   - Se despliega automáticamente si pasa las pruebas

3. **Disponibilidad**:
   - El sitio estará disponible en `https://tu-usuario.github.io/curso-calculo-diferencial`
   - Tiempo de despliegue: 2-5 minutos

### Despliegue Manual

1. **Verificar localmente**:
   ```bash
   python check_dependencies.py
   python server.py
   ```

2. **Probar en producción**:
   - Abrir `https://tu-usuario.github.io/curso-calculo-diferencial`
   - Verificar funcionalidad completa
   - Probar autenticación

## 🔄 Actualizaciones

### Proceso de Actualización

1. **Desarrollo local**:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   # Hacer cambios
   python check_dependencies.py
   python server.py
   ```

2. **Pull Request**:
   ```bash
   git push origin feature/nueva-funcionalidad
   # Crear PR en GitHub
   ```

3. **Merge a main**:
   - Revisar PR
   - Merge a main
   - Despliegue automático

### Rollback

Si hay problemas en producción:

1. **Revertir commit**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Despliegue automático**:
   - GitHub Pages se actualiza automáticamente
   - Tiempo de rollback: 2-5 minutos

## 📊 Métricas de Despliegue

### Tiempos de Despliegue

- **Verificación**: 1-2 minutos
- **Despliegue**: 2-3 minutos
- **Disponibilidad**: 5 minutos total

### Tamaño del Sitio

- **Archivos HTML**: ~500KB
- **Recursos CDN**: ~1.2MB
- **Tiempo de carga**: 2-3 segundos

## 🆘 Solución de Problemas

### Problemas Comunes

1. **Error 404**:
   - Verificar que el archivo existe
   - Verificar configuración de GitHub Pages

2. **Error de Firebase**:
   - Verificar configuración de Firebase
   - Verificar dominios autorizados

3. **Error de CORS**:
   - Verificar configuración de Firebase
   - Verificar headers de respuesta

### Logs de Despliegue

- **GitHub Actions**: Ver logs en la pestaña Actions
- **GitHub Pages**: Ver logs en Settings > Pages
- **Firebase**: Ver logs en Firebase Console

## 📞 Soporte

### Recursos de Ayuda

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### Contacto

- **Issues**: Usa el sistema de issues de GitHub
- **Discusiones**: Participa en GitHub Discussions
- **Email**: Contacta a través del perfil del proyecto

---

© JMGV-PTEL-2025. TODOS LOS DERECHOS RESERVADOS.







