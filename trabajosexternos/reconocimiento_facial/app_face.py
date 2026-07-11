import cv2
from deepface import DeepFace
import datetime
import os
import time
import requests

# Archivo donde se guardarán los registros
LOG_FILE = "registro_reconocimiento.txt"

def obtener_ubicacion():
    """Obtiene la latitud y longitud aproximada usando la IP pública."""
    try:
        response = requests.get("https://ipapi.co/json/", timeout=5)
        data = response.json()
        return f"Lat: {data.get('latitude', 'N/A')}, Lon: {data.get('longitude', 'N/A')}"
    except Exception as e:
        print(f"No se pudo obtener la ubicación: {e}")
        return "Lat: N/A, Lon: N/A"

def registrar_asistencia(nombre, ubicacion):
    """Guarda un registro con la fecha, hora y ubicación en el que se reconoció a la persona."""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    mensaje = f"[{timestamp}] Reconocido: {nombre} | Ubicación: {ubicacion}\n"
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(mensaje)
    print(mensaje.strip())

def main():
    imagen_referencia = "MANUEL.png"
    
    print("Obteniendo coordenadas de ubicación actual...")
    ubicacion_actual = obtener_ubicacion()
    print(f"Ubicación obtenida: {ubicacion_actual}")
    
    if not os.path.exists(imagen_referencia):
        print(f"Error: No se encontró la imagen de referencia '{imagen_referencia}'.")
        print("Por favor asegúrate de que el archivo exista en la misma carpeta.")
        return

    # Intentar abrir cualquier cámara disponible (empieza por 0)
    cap = None
    for i in range(5):
        cap = cv2.VideoCapture(i, cv2.CAP_DSHOW) # CAP_DSHOW ayuda a que cargue más rápido en Windows
        if cap.isOpened():
            print(f"Cámara {i} iniciada con éxito.")
            break
        cap.release()

    if cap is None or not cap.isOpened():
        print("No se encontró ninguna cámara conectada o disponible.")
        return

    # Usar un detector de caras rápido de OpenCV
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    tiempo_ultimo_registro = 0
    cooldown_registro = 15  # Segundos que deben pasar antes de volver a registrar a la misma persona
    
    frame_count = 0
    etiqueta_actual = "Detectando..."
    color_actual = (0, 255, 255) # Amarillo mientras detecta

    print("Iniciando sistema de reconocimiento. Presiona 'q' en la ventana de video para salir.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("No se pudo leer la imagen de la cámara. Revisa la conexión.")
            break
        
        # Convertir a escala de grises para el detector de OpenCV
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        caras = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))
        
        for (x, y, w, h) in caras:
            # Extraer la cara detectada con un pequeño margen
            margen = 20
            y1 = max(0, y - margen)
            y2 = min(frame.shape[0], y + h + margen)
            x1 = max(0, x - margen)
            x2 = min(frame.shape[1], x + w + margen)
            
            cara_recortada = frame[y1:y2, x1:x2]
            
            # Para no congelar el video, solo hacemos el reconocimiento profundo cada 10 frames
            if frame_count % 10 == 0 and cara_recortada.shape[0] > 0 and cara_recortada.shape[1] > 0:
                try:
                    # Comparar la cara capturada con la imagen de referencia usando DeepFace
                    # Se usa enforce_detection=False porque ya detectamos la cara con OpenCV
                    resultado = DeepFace.verify(
                        img1_path=cara_recortada,
                        img2_path=imagen_referencia,
                        model_name="VGG-Face",
                        enforce_detection=False,
                        align=False
                    )
                    
                    if resultado["verified"]:
                        etiqueta_actual = "Manuel"
                        color_actual = (0, 255, 0) # Verde
                        
                        # Guardar en el log si ya pasó el tiempo de cooldown
                        tiempo_actual = time.time()
                        if (tiempo_actual - tiempo_ultimo_registro) > cooldown_registro:
                            registrar_asistencia(etiqueta_actual, ubicacion_actual)
                            tiempo_ultimo_registro = tiempo_actual
                    else:
                        etiqueta_actual = "Desconocido"
                        color_actual = (0, 0, 255) # Rojo
                        
                except Exception as e:
                    # Si falla el reconocimiento por alguna razón interna de DeepFace
                    pass

            # Dibujar el rectángulo y el nombre
            cv2.rectangle(frame, (x, y), (x+w, y+h), color_actual, 2)
            cv2.putText(frame, etiqueta_actual, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color_actual, 2)
            
        cv2.imshow('Reconocimiento Facial - Presiona "q" para salir', frame)
        
        frame_count += 1
        
        # Salir con la tecla 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
