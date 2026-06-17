# Guía de Contribución - Curso de Cálculo Diferencial

¡Gracias por tu interés en contribuir al Curso Interactivo de Cálculo Diferencial! 

## 📋 Cómo Contribuir

### 🐛 Reportar Problemas

Si encuentras un error o tienes una sugerencia:

1. **Busca si ya existe** un issue similar
2. **Crea un nuevo issue** con la siguiente información:
   - Descripción clara del problema
   - Pasos para reproducir el error
   - Capturas de pantalla (si aplica)
   - Información del navegador y sistema operativo

### 🔧 Contribuir con Código

#### Proceso de Contribución:

1. **Fork** del repositorio
2. **Clona** tu fork localmente:
   ```bash
   git clone https://github.com/tu-usuario/curso-calculo-diferencial.git
   cd curso-calculo-diferencial
   ```

3. **Crea una rama** para tu contribución:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

4. **Instala dependencias** y verifica el funcionamiento:
   ```bash
   python check_dependencies.py
   python server.py
   ```

5. **Realiza tus cambios** siguiendo las convenciones del proyecto

6. **Prueba tus cambios**:
   - Ejecuta el verificador de dependencias
   - Prueba en diferentes navegadores
   - Verifica la responsividad móvil

7. **Commit** tus cambios:
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   ```

8. **Push** a tu fork:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

9. **Crea un Pull Request** con:
   - Descripción clara de los cambios
   - Referencia al issue relacionado (si aplica)
   - Capturas de pantalla de los cambios

## 📝 Convenciones del Proyecto

### Estructura de Commits

Usa el formato de commits convencionales:

- `feat:` Nueva funcionalidad
- `fix:` Corrección de errores
- `docs:` Cambios en documentación
- `style:` Cambios de formato (espacios, comas, etc.)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar pruebas
- `chore:` Cambios en herramientas o configuración

### Estilo de Código

#### HTML
- Usar indentación de 4 espacios
- Atributos en comillas dobles
- Etiquetas auto-cerradas con `/>`
- Comentarios descriptivos para secciones complejas

#### CSS
- Usar indentación de 4 espacios
- Propiedades ordenadas alfabéticamente
- Usar variables CSS para colores y medidas
- Comentarios para secciones importantes

#### JavaScript
- Usar indentación de 2 espacios
- Nombres de variables en camelCase
- Funciones descriptivas
- Comentarios JSDoc para funciones públicas

### Estructura de Archivos

```
calculo diferencial/
├── 📄 index.html                          # Página principal
├── 📚 modulo1_relaciones_funciones.html   # Módulos del curso
├── 📚 modulo2_limites.html
├── 📚 modulo3_continuidad.html
├── 📚 modulo4_la_derivada.html
├── 📚 modulo5_aplicaciones_derivada.html
├── ⚙️ firebase-config.js                   # Configuración
├── ⚙️ auth-manager.js
├── ⚙️ config.js
├── ⚙️ module-navigation.js
├── 🛠️ server.py                           # Herramientas
├── 🛠️ check_dependencies.py
├── 📦 package.json
└── 📖 Documentación/
```

## 🎯 Áreas de Contribución

### 🐛 Corrección de Errores
- Errores de JavaScript
- Problemas de CSS/responsividad
- Errores de navegación
- Problemas de compatibilidad

### ✨ Nuevas Funcionalidades
- Nuevos ejercicios interactivos
- Mejoras en la interfaz de usuario
- Nuevas visualizaciones matemáticas
- Funcionalidades de accesibilidad

### 📚 Mejoras de Contenido
- Corrección de errores matemáticos
- Mejoras en explicaciones
- Nuevos ejemplos y ejercicios
- Traducciones a otros idiomas

### 🛠️ Herramientas de Desarrollo
- Mejoras en el servidor local
- Nuevas herramientas de verificación
- Automatización de tareas
- Mejoras en la documentación

## 🔍 Proceso de Revisión

### Criterios de Aceptación

Tu contribución será evaluada según:

1. **Funcionalidad**: ¿Funciona correctamente?
2. **Calidad**: ¿Sigue las convenciones del proyecto?
3. **Documentación**: ¿Está bien documentado?
4. **Pruebas**: ¿Se han probado los cambios?
5. **Compatibilidad**: ¿Funciona en diferentes navegadores?

### Tiempo de Revisión

- **Issues**: Revisados en 1-3 días hábiles
- **Pull Requests**: Revisados en 3-7 días hábiles
- **Cambios críticos**: Revisados en 1-2 días hábiles

## 📞 Contacto

Si tienes preguntas sobre cómo contribuir:

- **Issues**: Usa el sistema de issues de GitHub
- **Discusiones**: Usa GitHub Discussions
- **Email**: Contacta a través del perfil del proyecto

## 🙏 Reconocimientos

Los contribuidores serán reconocidos en:

- Archivo `CONTRIBUTORS.md`
- Sección de agradecimientos en el README
- Release notes de nuevas versiones

## 📄 Licencia

Al contribuir, aceptas que tu código será licenciado bajo la misma licencia MIT que el proyecto.

---

**¡Gracias por contribuir al aprendizaje de las matemáticas!** 🎓📚

© JMGV-PTEL-2025. TODOS LOS DERECHOS RESERVADOS.


