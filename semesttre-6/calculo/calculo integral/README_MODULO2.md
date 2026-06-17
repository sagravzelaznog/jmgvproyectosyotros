# Módulo 2: Sumas de Riemann y la Integral Definida

## 📋 Descripción General

Este módulo desarrolla de manera didáctica y progresiva los conceptos fundamentales de las sumas de Riemann y la integral definida, incluyendo el Teorema Fundamental del Cálculo. Está diseñado para facilitar la comprensión mediante visualizaciones interactivas, ejemplos paso a paso y ejercicios prácticos.

## 🎯 Objetivos de Aprendizaje

Al completar este módulo, los estudiantes serán capaces de:

- ✅ Calcular sumas de Riemann (izquierda, derecha, punto medio)
- ✅ Comprender la definición formal de integral definida
- ✅ Aplicar el Teorema Fundamental del Cálculo
- ✅ Evaluar integrales definidas usando antiderivadas
- ✅ Visualizar conceptos mediante gráficas interactivas
- ✅ Resolver problemas aplicados de áreas y física

## 📁 Estructura de Archivos

```
modulo2_integral_definida.html    # Página principal del módulo
modulo2-styles.css                # Estilos específicos del módulo
modulo2-script.js                 # Funcionalidades JavaScript
ejercicios_modulo2.html           # Ejercicios prácticos
ejercicios-styles.css             # Estilos para ejercicios
README_MODULO2.md                 # Este archivo
```

## 🚀 Características Principales

### 1. **Visualizaciones Interactivas**
- Canvas HTML5 para gráficas matemáticas
- Integración con GeoGebra para visualizaciones dinámicas
- Controles interactivos para explorar diferentes funciones
- Comparación en tiempo real de diferentes tipos de sumas de Riemann

### 2. **Ejemplos Paso a Paso**
- Desarrollo detallado de cada concepto
- Cálculos completos con explicaciones
- Verificación de resultados
- Conexión entre teoría y práctica

### 3. **Ejercicios Progresivos**
- 10 ejercicios categorizados por dificultad
- Soluciones detalladas con pasos explicados
- Aplicaciones en geometría y física
- Retroalimentación inmediata

### 4. **Navegación Intuitiva**
- Sistema de pestañas para organizar contenido
- Barra de progreso del módulo
- Navegación consistente entre secciones
- Diseño responsive para diferentes dispositivos

## 📚 Contenido del Módulo

### 2.1 Sumas de Riemann y Aproximación de Áreas
- **Conceptos clave:**
  - Problema del área bajo la curva
  - Particiones de intervalos
  - Sumas de Riemann (izquierda, derecha, punto medio)
  - Concepto de límite de sumas

- **Ejemplo principal:**
  - Función $f(x) = x^2$ en $[0, 2]$ con $n = 4$
  - Cálculo de las tres tipos de sumas
  - Comparación con el valor exacto

### 2.2 La Integral Definida
- **Definición formal:**
  $$\int_a^b f(x) \, dx = \lim_{n \to \infty} \sum_{i=1}^{n} f(x_i^*) \cdot \Delta x$$

- **Propiedades importantes:**
  - Linealidad
  - Aditividad en intervalos
  - Cambio de límites de integración
  - Comparación de integrales

### 2.3 Teorema Fundamental del Cálculo
- **Primera parte:** Derivada de una integral
- **Segunda parte:** Evaluación de integrales definidas (Regla de Barrow)
- **Aplicaciones:** Cálculo de áreas, trabajo en física, valor promedio

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5:** Estructura semántica y canvas para gráficas
- **CSS3:** Estilos modernos con variables CSS y Grid/Flexbox
- **JavaScript ES6+:** Interactividad y cálculos matemáticos
- **MathJax:** Renderizado de fórmulas matemáticas

### Librerías Externas
- **GeoGebra:** Visualizaciones matemáticas interactivas
- **Chart.js:** Gráficos adicionales (si se requiere)
- **Google Fonts:** Tipografía (Inter, Fira Code)

## 🎮 Funcionalidades Interactivas

### Calculadora de Sumas de Riemann
```javascript
// Ejemplo de uso
const riemannSum = calculateRiemannSum('x^2', 0, 2, 10, 'midpoint');
console.log(riemannSum); // Resultado aproximado
```

### Visualizador GeoGebra
- Selección de funciones predefinidas
- Control del número de rectángulos
- Comparación de diferentes tipos de sumas
- Cálculo automático de errores

### Calculadora de Integrales Definidas
- Entrada de funciones básicas
- Evaluación automática usando TFC
- Mostrar antiderivadas
- Verificación de resultados

## 📊 Ejercicios Incluidos

### Nivel Básico (3 ejercicios)
1. **Suma de Riemann por la izquierda** - $f(x) = x^2$ en $[0, 3]$
2. **Integral definida con propiedades** - $\int_1^4 (3x^2 + 2x - 1) \, dx$
3. **TFC básico** - $\int_0^{\pi/2} \cos(x) \, dx$

### Nivel Intermedio (4 ejercicios)
4. **Suma de Riemann por punto medio** - $f(x) = \sin(x)$ en $[0, \pi]$
5. **Propiedades de funciones impares** - Demostración teórica
6. **Primera parte del TFC** - Derivada de integral
7. **Cálculo de áreas** - $y = x^3 - 4x$ en $[-2, 2]$

### Nivel Avanzado (3 ejercicios)
8. **Comparación de métodos** - $f(x) = e^x$ en $[0, 2]$
9. **TFC con regla de la cadena** - Derivada de integral compuesta
10. **Aplicación física** - Desplazamiento con velocidad variable

## 🎨 Diseño y UX

### Principios de Diseño
- **Claridad:** Información organizada jerárquicamente
- **Accesibilidad:** Contraste adecuado y navegación por teclado
- **Responsividad:** Adaptable a diferentes tamaños de pantalla
- **Consistencia:** Patrones de diseño uniformes

### Paleta de Colores
```css
--primary-color: #2563eb    /* Azul principal */
--secondary-color: #1e40af  /* Azul secundario */
--success-color: #10b981    /* Verde para éxito */
--warning-color: #f59e0b    /* Amarillo para advertencias */
--error-color: #ef4444      /* Rojo para errores */
```

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Instalación y Uso

### Requisitos Previos
- Servidor web local (opcional para desarrollo)
- Navegador moderno con JavaScript habilitado
- Conexión a internet (para MathJax y GeoGebra)

### Instalación
1. Descargar todos los archivos del módulo
2. Colocar en directorio del servidor web
3. Abrir `modulo2_integral_definida.html` en navegador
4. Para ejercicios, abrir `ejercicios_modulo2.html`

### Configuración Opcional
```javascript
// Personalizar funciones disponibles
const availableFunctions = {
    'x^2': 'x^2',
    'x^3': 'x^3',
    'sin(x)': 'sin(x)',
    'exp(x)': 'exp(x)',
    'ln(x)': 'ln(x)'
};
```

## 🔧 Personalización

### Modificar Funciones Disponibles
Editar el array `availableFunctions` en `modulo2-script.js`:

```javascript
const availableFunctions = {
    'x^2': 'x^2',
    'x^3': 'x^3',
    'sin(x)': 'sin(x)',
    'cos(x)': 'cos(x)',
    'exp(x)': 'exp(x)',
    'ln(x)': 'ln(x)'
};
```

### Agregar Nuevos Ejercicios
1. Crear nuevo `exercise-card` en `ejercicios_modulo2.html`
2. Asignar nivel de dificultad apropiado
3. Incluir solución detallada paso a paso
4. Actualizar estadísticas en el resumen

### Modificar Estilos
Las variables CSS en `modulo2-styles.css` permiten personalizar:
- Colores del tema
- Espaciado y tipografía
- Bordes y sombras
- Animaciones y transiciones

## 📈 Métricas de Rendimiento

### Optimizaciones Implementadas
- **Lazy loading** para visualizaciones GeoGebra
- **Debouncing** en controles interactivos
- **Caching** de cálculos matemáticos
- **Compresión** de imágenes y recursos

### Tiempos de Carga
- Página principal: < 2 segundos
- Ejercicios: < 1 segundo
- Visualizaciones: < 3 segundos

## 🐛 Solución de Problemas

### Problemas Comunes

1. **GeoGebra no carga:**
   - Verificar conexión a internet
   - Comprobar bloqueadores de contenido
   - Actualizar navegador

2. **Fórmulas no se renderizan:**
   - Verificar carga de MathJax
   - Comprobar sintaxis LaTeX
   - Recargar página

3. **Controles no responden:**
   - Verificar JavaScript habilitado
   - Comprobar errores en consola
   - Limpiar caché del navegador

### Logs de Debug
```javascript
// Habilitar logs detallados
const DEBUG = true;
if (DEBUG) {
    console.log('Módulo 2 inicializado correctamente');
}
```

## 📚 Recursos Adicionales

### Bibliografía Recomendada
- Stewart, J. (2020). *Cálculo de una Variable*. 9ª edición
- Larson, R. & Edwards, B. (2018). *Cálculo Esencial*. 2ª edición
- Thomas, G.B. (2019). *Cálculo: Una Variable*. 14ª edición

### Enlaces Útiles
- [Khan Academy - Integral Calculus](https://www.khanacademy.org/math/integral-calculus)
- [MIT OpenCourseWare](https://ocw.mit.edu/courses/mathematics/)
- [GeoGebra Resources](https://www.geogebra.org/m/integrated-calculus)

## 🤝 Contribuciones

### Cómo Contribuir
1. Fork del repositorio
2. Crear rama para nueva funcionalidad
3. Implementar cambios con tests
4. Enviar pull request con descripción detallada

### Áreas de Mejora
- [ ] Más funciones matemáticas
- [ ] Ejercicios adicionales
- [ ] Visualizaciones 3D
- [ ] Integración con LMS
- [ ] Modo offline

## 📄 Licencia

Este material es de uso exclusivo para fines educativos de la institución.

**© JMGV-PTEL-2025 - Todos los derechos reservados**

---

## 📞 Soporte

Para soporte técnico o preguntas sobre el módulo:
- **Email:** profesor@institucion.edu
- **Horario:** Lunes a viernes 8:00-20:00
- **Documentación:** Ver archivos README adicionales

---

*Última actualización: Octubre 2025*
*Versión: 1.0*
