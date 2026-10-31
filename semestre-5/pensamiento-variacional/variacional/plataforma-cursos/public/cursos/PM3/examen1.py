from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def crear_pdf():
    doc = SimpleDocTemplate(
        "ejercicios_matematicas.pdf",
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    titulo_style = ParagraphStyle(
        'Titulo',
        parent=styles['Heading1'],
        fontSize=16,
        leading=20,
        alignment=1,
        textColor=colors.HexColor("#1A365D"),
        spaceAfter=10
    )
    
    meta_style = ParagraphStyle(
        'Meta',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#2D3748")
    )
    
    ejercicio_style = ParagraphStyle(
        'Ejercicio',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1A202C")
    )

    elementos = []

    # Encabezado
    elementos.append(Paragraph("<b>EVALUACIÓN FORMATIVA DE MATEMÁTICAS</b>", titulo_style))
    elementos.append(Paragraph("<b>Tema:</b> Operaciones Aritméticas Básicas y Evaluación de Funciones", meta_style))
    elementos.append(Spacer(1, 8))

    datos_alumno = [
        [Paragraph("<b>Nombre del alumno:</b> ________________________________________________", meta_style),
         Paragraph("<b>Fecha:</b> ______________", meta_style)],
        [Paragraph("<b>Grupo:</b> ______________", meta_style),
         Paragraph("<b>Calificación:</b> _________", meta_style)]
    ]
    
    tabla_datos = Table(datos_alumno, colWidths=[380, 150])
    tabla_datos.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elementos.append(tabla_datos)
    elementos.append(Spacer(1, 15))

    # Lista de 10 ejercicios
    ejercicios = [
        "<b>1.</b> Resuelve la siguiente operación con enteros respetando la jerarquía de operaciones:<br/><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>E = -14 + 6 × (-3) - (-28) ÷ 4 + 12</b>",
        
        "<b>2.</b> Calcula el resultado de la siguiente suma y resta con signos de agrupación:<br/><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>R = 25 - [ -8 + (15 - 22) - (-4 + 9) ]</b>",
        
        "<b>3.</b> Efectúa la siguiente adición y sustracción de números fraccionarios y simplifica:<br/><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>A = 3/4 - 5/6 + 7/12 - 1/2</b>",
        
        "<b>4.</b> Resuelve el producto de fracciones y reduce a su mínima expresión:<br/><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>M = ( -8/15 ) × ( 25/14 ) × ( -21/20 )</b>",
        
        "<b>5.</b> Realiza la división de fracciones y simplifica:<br/><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>D = ( 16/27 ) ÷ ( -8/9 )</b>",
        
        "<b>6.</b> Calcula la operación combinada de enteros y fracciones:<br/><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;<b>C = ( 2 - 3/5 ) ÷ ( 1/2 + 3/4 )</b>",
        
        "<b>7.</b> Dada la función lineal <b>f(x) = -4x + 9</b>, determina el valor de <b>f(-3)</b>.",
        
        "<b>8.</b> Dada la función cuadrática <b>g(x) = 2x² - 5x + 3</b>, halla el valor de <b>g(4)</b>.",
        
        "<b>9.</b> Dada la función polinomial <b>P(x) = x³ - 3x² + 4x - 8</b>, calcula el valor numérico de <b>P(-2)</b>.",
        
        "<b>10.</b> Para la función <b>h(x) = (2/3)x - 5/6</b>, encuentra el valor de la función evaluada en <b>x = 3/4</b>:"
    ]

    # Formato en tabla con recuadro para respuesta/desarrollo
    filas_tabla = []
    for ej in ejercicios:
        p = Paragraph(ej, ejercicio_style)
        filas_tabla.append([p, "Espacio de respuesta:\n\n\n"])

    tabla_ejercicios = Table(filas_tabla, colWidths=[370, 160])
    tabla_ejercicios.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#4A5568")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TEXTCOLOR', (1,0), (1,-1), colors.HexColor("#A0AEC0")),
    ]))
    
    elementos.append(tabla_ejercicios)
    doc.build(elementos)

if __name__ == "__main__":
    crear_pdf()
    