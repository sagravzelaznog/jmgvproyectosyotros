# Política de Seguridad - Curso de Cálculo Diferencial

## 🛡️ Reportar Vulnerabilidades de Seguridad

Si descubres una vulnerabilidad de seguridad en este proyecto, por favor **NO** la reportes públicamente a través de issues de GitHub.

### 📧 Cómo Reportar

En su lugar, envía un email a: **security@jmgv-ptel.com**

### 📋 Información a Incluir

Por favor incluye la siguiente información en tu reporte:

- **Descripción detallada** de la vulnerabilidad
- **Pasos para reproducir** el problema
- **Impacto potencial** de la vulnerabilidad
- **Información del sistema** donde se encontró
- **Capturas de pantalla** o logs relevantes (si aplica)

### ⏱️ Proceso de Respuesta

- **Confirmación**: Recibirás confirmación del reporte en 24-48 horas
- **Evaluación**: Evaluaremos la vulnerabilidad en 3-5 días hábiles
- **Corrección**: Trabajaremos en una corrección si es válida
- **Disclosure**: Coordinaremos la divulgación pública después de la corrección

## 🔒 Medidas de Seguridad Implementadas

### Autenticación
- Autenticación basada en Firebase con tokens JWT
- Contraseñas hasheadas automáticamente
- Sesiones con timeout automático
- Límite de intentos de login

### Autorización
- Control de acceso basado en roles
- Reglas de Firestore para proteger datos
- Validación de permisos en cliente y servidor

### Protección de Datos
- Datos de usuario encriptados en tránsito
- Almacenamiento seguro en Firestore
- No almacenamiento de información sensible en localStorage

### Validación
- Validación de entrada en formularios
- Sanitización de datos de usuario
- Protección contra XSS básica

## 🚨 Vulnerabilidades Conocidas

Actualmente no hay vulnerabilidades de seguridad conocidas.

## 🔄 Actualizaciones de Seguridad

### Dependencias
- Revisamos regularmente las dependencias por vulnerabilidades
- Actualizamos dependencias críticas cuando es necesario
- Usamos herramientas automatizadas para detectar vulnerabilidades

### Monitoreo
- Monitoreamos logs de autenticación
- Revisamos patrones de acceso anómalos
- Mantenemos logs de seguridad

## 📚 Recursos de Seguridad

### Para Desarrolladores
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Web Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)

### Para Usuarios
- Usa contraseñas fuertes y únicas
- No compartas tus credenciales de acceso
- Cierra sesión cuando termines de usar el curso
- Reporta cualquier comportamiento sospechoso

## 🏆 Reconocimientos de Seguridad

Agradecemos a los investigadores de seguridad que reportan vulnerabilidades de manera responsable. Los contribuidores de seguridad serán reconocidos en:

- Archivo `SECURITY_CONTRIBUTORS.md`
- Release notes de correcciones de seguridad
- Sección de agradecimientos en el README

## 📞 Contacto de Seguridad

Para preguntas relacionadas con seguridad:

- **Email**: security@jmgv-ptel.com
- **Asunto**: [SECURITY] - Descripción breve del tema
- **Respuesta**: Dentro de 24-48 horas

## 🔄 Historial de Seguridad

### 2025-01-XX
- Implementación inicial de medidas de seguridad
- Configuración de Firebase Authentication
- Establecimiento de políticas de seguridad

---

**Gracias por ayudar a mantener seguro el Curso de Cálculo Diferencial** 🛡️

© JMGV-PTEL-2025. TODOS LOS DERECHOS RESERVADOS.







