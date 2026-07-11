from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from deepface import DeepFace
import base64
import os
import cv2
import numpy as np
import datetime

app = Flask(__name__, static_folder='cliente_movil', static_url_path='')
CORS(app)  # Permite que el frontend web se comunique con este servidor

CARPETA_BUSCADAS = "personas_buscadas"
LOG_FILE = "registro_reconocimiento.txt"

# Crear carpeta si no existe
if not os.path.exists(CARPETA_BUSCADAS):
    os.makedirs(CARPETA_BUSCADAS)

import re
import utm

def registrar_hallazgo(persona, ubicacion):
    """Guarda un registro con la fecha, hora y ubicación en el que se reconoció a la persona."""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Intentar extraer Lat y Lon para calcular UTM
    ubicacion_final = ubicacion
    try:
        if "Lat:" in ubicacion and "Lon:" in ubicacion:
            # Extraer números
            numeros = re.findall(r"[-+]?(?:\d*\.*\d+)", ubicacion)
            if len(numeros) >= 2:
                lat = float(numeros[0])
                lon = float(numeros[1])
                # Convertir a UTM
                u = utm.from_latlon(lat, lon)
                utm_str = f"UTM: {u[0]:.2f} E, {u[1]:.2f} N, Zona {u[2]}{u[3]}"
                ubicacion_final = f"{ubicacion} | {utm_str}"
    except Exception as e:
        print("Error convirtiendo a UTM:", e)
        
    mensaje = f"[{timestamp}] ALERTA: {persona} detectada | Ubicación: {ubicacion_final}\n"
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(mensaje)
    print(mensaje.strip())

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/analizar_rostro', methods=['POST'])
def analizar_rostro():
    data = request.json
    
    if not data or 'image' not in data:
        return jsonify({"error": "No se proporcionó imagen"}), 400
        
    imagen_base64 = data['image']
    ubicacion = data.get('ubicacion', 'Desconocida')
    
    try:
        # Quitar el prefijo "data:image/jpeg;base64," si existe
        if "base64," in imagen_base64:
            imagen_base64 = imagen_base64.split("base64,")[1]
            
        # Corregir padding de base64 si es necesario (el navegador a veces lo omite)
        padding_needed = len(imagen_base64) % 4
        if padding_needed:
            imagen_base64 += "=" * (4 - padding_needed)
            
        img_bytes = base64.b64decode(imagen_base64)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({"error": "No se pudo decodificar la imagen"}), 400
        
        # Ruta temporal en RAM o guardado temporal para DeepFace (DeepFace.find usa el disco por defecto para DB)
        # DeepFace.find busca en un directorio, así que lo usaremos
        
        # Opcion 1: Usar DeepFace.find directamente
        # En caso de no encontrar el directorio o imágenes fallará elegantemente
        archivos_buscados = os.listdir(CARPETA_BUSCADAS)
        if len(archivos_buscados) == 0:
             return jsonify({"mensaje": "No hay personas registradas para buscar."}), 200

        # Guardar imagen temporalmente en disco porque DeepFace.find espera una ruta o numpy array, 
        # pero OpenCV numpy a veces falla con VGG-Face directo.
        temp_img_path = "temp_capture.jpg"
        cv2.imwrite(temp_img_path, img)

        print(f"Analizando rostro recibido desde: {ubicacion}...")
        
        # enforce_detection=False por si el rostro está muy borroso pero aún así queremos intentarlo.
        # model_name="ArcFace" es el modelo más robusto actualmente para baja resolución e iluminación extrema.
        # detector_backend="retinaface" es el mejor detector facial para condiciones extremas.
        resultados = DeepFace.find(
            img_path=temp_img_path, 
            db_path=CARPETA_BUSCADAS, 
            enforce_detection=False,
            model_name="ArcFace",
            detector_backend="retinaface",
            silent=True # Para no llenar la consola de logs innecesarios
        )
        
        # Eliminar archivo temporal inmediatamente para no dejar rastro
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)
        
        if len(resultados) > 0 and len(resultados[0]) > 0:
            # Si hay una coincidencia
            mejor_coincidencia = resultados[0].iloc[0]
            ruta_encontrada = mejor_coincidencia['identity']
            nombre_persona = os.path.basename(ruta_encontrada).split('.')[0]
            
            # DeepFace con ArcFace a veces devuelve distancias. Menor distancia = más seguro.
            # Umbral típico de ArcFace es ~0.68. DeepFace lo maneja internamente.
            
            registrar_hallazgo(nombre_persona, ubicacion)
            
            # La variable 'img' se descarta automáticamente al terminar la función
            return jsonify({
                "match": True, 
                "persona": nombre_persona,
                "mensaje": "¡Coincidencia encontrada!"
            }), 200
            
        else:
            # No hay coincidencias, la imagen se descarta al terminar la solicitud HTTP
            return jsonify({
                "match": False,
                "mensaje": "No es una persona buscada."
            }), 200
            
    except Exception as e:
        print(f"Error procesando imagen: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Iniciando Servidor Central de Búsqueda...")
    print("Asegúrate de colocar las fotos de las personas en la carpeta 'personas_buscadas'")
    
    # Volvemos a HTTP estándar para exponerlo vía túnel seguro
    app.run(host='0.0.0.0', port=5000, debug=True)
