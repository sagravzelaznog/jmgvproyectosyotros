# Sistema Conectado de Cálculo Integral

## Descripción General

Este sistema integra todos los módulos de cálculo integral en una plataforma unificada con autenticación de usuarios y navegación consistente. El sistema permite a los estudiantes acceder a todos los contenidos de manera organizada y rastrear su progreso de aprendizaje.

## Estructura del Sistema

### Archivos Principales

1. **`login.html`** - Portal de autenticación principal
2. **`index.html`** - Portal principal con navegación a todos los módulos
3. **`navigation.js`** - Componente de navegación unificado
4. **`auth-manager.js`** - Gestión de autenticación con Firebase

### Módulos de Contenido

1. **Módulo 1**: `modulo1_antiderivadas.html` - Antiderivadas e Integrales Indefinidas
2. **Módulo 2**: `modulo2_integral_definida.html` - Sumas de Riemann y la Integral Definida
3. **Módulo 3**: `modulo3_interactivo.html` - Técnicas de Integración
4. **Módulo 4**: `index_modulo4.html` - Portal del módulo de Aplicaciones
5. **Módulo 5**: `modulo5_ecuaciones_diferenciales.html` - Ecuaciones Diferenciales

### Archivos de Ejercicios

- `ejercicios_modulo1.html`
- `ejercicios_modulo2.html`
- `ejercicios_modulo4.html`
- `ejercicios_modulo5.html`
- `EJERCICIOS_MODULO3.md`

## Flujo de Usuario

### 1. Autenticación
- Los usuarios inician en `login.html`
- Pueden registrarse o iniciar sesión
- El sistema utiliza Firebase para la autenticación
- Después del login exitoso, redirige a `index.html`

### 2. Portal Principal
- `index.html` muestra el dashboard principal
- Muestra el progreso del usuario en cada módulo
- Proporciona acceso rápido a todos los módulos
- Incluye navegación consistente

### 3. Navegación entre Módulos
- Todos los módulos incluyen navegación unificada
- Los módulos sin navegación nativa usan `navigation.js`
- Navegación consistente entre todos los módulos
- Verificación de autenticación en cada módulo

## Características del Sistema

### Autenticación y Seguridad
- ✅ Sistema de login/registro con Firebase
- ✅ Verificación de autenticación en todas las páginas
- ✅ Redirección automática al login si no está autenticado
- ✅ Gestión de sesiones de usuario

### Navegación Unificada
- ✅ Navegación consistente en todos los módulos
- ✅ Componente de navegación reutilizable (`navigation.js`)
- ✅ Indicadores de módulo activo
- ✅ Enlaces de retorno al portal principal

### Progreso del Usuario
- ✅ Seguimiento del progreso en cada módulo
- ✅ Visualización de barras de progreso
- ✅ Persistencia de datos de usuario

### Diseño Responsivo
- ✅ Diseño adaptativo para móviles y desktop
- ✅ Interfaz moderna con efectos visuales
- ✅ Navegación optimizada para diferentes dispositivos

## Instalación y Configuración

### Requisitos
- Navegador web moderno
- Conexión a internet (para Firebase y CDNs)
- Servidor web local o hosting

### Configuración de Firebase
1. Crear proyecto en Firebase Console
2. Habilitar Authentication (Email/Password)
3. Configurar `firebase-config.js` con las credenciales
4. Configurar reglas de seguridad en Firestore

### Estructura de Archivos
```
calculo integral/
├── index.html                 # Portal principal
├── login.html                 # Autenticación
├── navigation.js              # Componente de navegación
├── auth-manager.js            # Gestión de autenticación
├── firebase-config.js         # Configuración de Firebase
├── modulo1_antiderivadas.html
├── modulo2_integral_definida.html
├── modulo3_interactivo.html
├── index_modulo4.html
├── modulo4_aplicaciones.html
├── modulo5_ecuaciones_diferenciales.html
├── ejercicios_modulo1.html
├── ejercicios_modulo2.html
├── ejercicios_modulo4.html
├── ejercicios_modulo5.html
└── styles.css                 # Estilos principales
```

## Uso del Sistema

### Para Estudiantes
1. Acceder a `login.html`
2. Registrarse o iniciar sesión
3. Navegar por el portal principal
4. Acceder a los módulos de interés
5. Completar ejercicios y seguir el progreso

### Para Profesores
1. Acceder con credenciales de administrador
2. Monitorear el progreso de los estudiantes
3. Acceder a todos los recursos educativos
4. Utilizar los materiales en clases

### Para Desarrolladores
1. El código está bien documentado
2. Arquitectura modular fácil de extender
3. Componentes reutilizables
4. APIs bien definidas

## Personalización

### Modificar Navegación
- Editar `navigation.js` para cambiar la estructura de navegación
- Personalizar estilos en la sección de CSS del archivo

### Agregar Nuevos Módulos
1. Crear el archivo HTML del módulo
2. Agregar enlaces en `navigation.js`
3. Actualizar `index.html` con la nueva tarjeta del módulo
4. Configurar autenticación si es necesario

### Personalizar Estilos
- Modificar `styles.css` para cambios globales
- Usar variables CSS para personalización de colores
- Adaptar el diseño responsive según necesidades

## Solución de Problemas

### Problemas Comunes

1. **Error de Firebase**: Verificar configuración en `firebase-config.js`
2. **Navegación no funciona**: Verificar que `navigation.js` esté cargado
3. **Estilos no se aplican**: Verificar rutas de archivos CSS
4. **Autenticación falla**: Verificar configuración de Firebase Auth

### Debugging
- Usar herramientas de desarrollador del navegador
- Verificar consola para errores JavaScript
- Comprobar conexión a Firebase
- Verificar permisos de archivos

## Actualizaciones Futuras

### Funcionalidades Planificadas
- [ ] Sistema de calificaciones automáticas
- [ ] Chat en tiempo real entre estudiantes
- [ ] Reportes de progreso detallados
- [ ] Integración con sistemas LMS
- [ ] Modo offline para uso sin internet
- [ ] Aplicación móvil nativa

### Mejoras Técnicas
- [ ] Optimización de rendimiento
- [ ] Mejores prácticas de seguridad
- [ ] Testing automatizado
- [ ] Documentación de API
- [ ] Internacionalización (i18n)

## Soporte y Contacto

Para soporte técnico o consultas sobre el sistema:
- **Desarrollador**: José Manuel González Vargas
- **Organización**: JMGV-PTEL
- **Año**: 2025

## Licencia

© 2025 JMGV-PTEL - Todos los derechos reservados

Este sistema está desarrollado para uso educativo y puede ser personalizado según las necesidades específicas de cada institución.
