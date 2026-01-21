import asyncio
import websockets
import sys
import os
import json
import sys
# Agregar ruta raíz al path para importar bible.matcher
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from bible import matcher
from vosk import Model, KaldiRecognizer

# Configuración
MODEL_PATH = "model"
PORT = 2700

# Verificación del modelo
if not os.path.exists(MODEL_PATH):
    print(f"\n[ERROR] No se encontró la carpeta '{MODEL_PATH}'.")
    print(f"Por favor descarga un modelo en español desde https://alphacephei.com/vosk/models")
    print(f"Recomiendo: 'vosk-model-small-es-0.42'")
    print(f"Descomprímelo y renombra la carpeta a '{MODEL_PATH}' dentro de 'speaker/'.\n")
    # No salimos violentamente para permitir que el script corra y avise, 
    # pero fallará al intentar cargar Model.
    try:
        input("Presiona ENTER para salir...")
    except:
        pass
    sys.exit(1)

print(f"Cargando modelo '{MODEL_PATH}'... (esto puede tardar unos segundos)")
try:
    model = Model(MODEL_PATH)
    print("Modelo cargado exitosamente.")
except Exception as e:
    print(f"Error cargando el modelo: {e}")
    sys.exit(1)

async def serve(websocket, path):
    # Reconocedor a 16kHz
    rec = KaldiRecognizer(model, 16000)
    print(f"[CONECTADO] Cliente: {websocket.remote_address}")
    
    try:
        async for message in websocket:
            # Si recibimos bytes, es audio
            if isinstance(message, bytes):
                if rec.AcceptWaveform(message):
                    result = json.loads(rec.Result())
                    # Enviar resultado final
                    # Formato deseado por el frontend: { "text": "...", "isFinal": true }
                    if result.get("text", ""):
                        text = result["text"]
                        print(f"Final: {text}")
                        
                        # 1. Intentar buscar cita bíblica por contenido
                        verse_match = matcher.search_verse(text)
                        
                        payload = {
                            "text": text,
                            "isFinal": True
                        }
                        
                        if verse_match:
                            payload["bibleNav"] = {
                                "libro": verse_match["libro"],
                                "capitulo": verse_match["capitulo"],
                                "versiculo": verse_match["versiculo"]
                            }
                        
                        await websocket.send(json.dumps(payload))
                else:
                    partial = json.loads(rec.PartialResult())
                    # Enviar parcial para Karaoke
                    # Formato: { "partial": "..." } -> frontend debe mapearlo
                    if partial.get("partial", ""):
                        # print(f"Parcial: {partial['partial']}", end='\r')
                        await websocket.send(json.dumps({
                            "text": partial["partial"],
                            "isFinal": False
                        }))
            
            # Si recibimos texto, comando de control (opcional)
            elif isinstance(message, str):
                if message == "PING":
                    await websocket.send("PONG")

    except websockets.exceptions.ConnectionClosed:
        print("[DESCONECTADO] Cliente cerrado.")
    except Exception as e:
        print(f"Error en conexión: {e}")

print(f"Servidor de Voz escuchando en ws://localhost:{PORT}")
start_server = websockets.serve(serve, "localhost", PORT)

try:
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    print("\nDeteniendo servidor...")
