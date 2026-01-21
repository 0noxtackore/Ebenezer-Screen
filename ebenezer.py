import asyncio
import websockets
import json
import os
import sys
import threading
import subprocess
import webbrowser
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler, BaseHTTPRequestHandler
import urllib.parse

# Configuración de rutas
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(ROOT_DIR)

# Importar lógica de la Biblia
from bible import matcher

# Importar lógica de mensajes
SERMON_SEARCH_SCRIPT = os.path.join(ROOT_DIR, "messages", "sermon_search.py")
MESSAGE_DATA_JSON = os.path.join(ROOT_DIR, "messages", "message_data.json")

# --- SERVIDOR WEB ESTÁTICO (PUERTO 8000) ---
# Esto reemplaza a Live Server
class EbenezerWebHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

def run_web_server():
    server = HTTPServer(('', 8000), EbenezerWebHandler)
    print("  [✓] Interfaz Web: http://localhost:8000")
    server.serve_forever()

# --- SERVIDOR HTTP (PUENTE DE MENSAJES - PUERTO 2800) ---
class MessageBridgeHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self): self._set_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/search':
            query = urllib.parse.parse_qs(parsed.query).get('q', [''])[0]
            if not query:
                self._set_headers(400)
                return self.wfile.write(b'{"error":"no query"}')

            print(f"[BRIDGE] Buscando: {query}")
            try:
                # Ejecutar búsqueda inteligente
                res = subprocess.run([sys.executable, SERMON_SEARCH_SCRIPT, query], capture_output=True, text=True, encoding='utf-8')
                if res.returncode == 0 and os.path.exists(MESSAGE_DATA_JSON):
                    with open(MESSAGE_DATA_JSON, 'r', encoding='utf-8') as f:
                        self._set_headers(200)
                        self.wfile.write(f.read().encode())
                else:
                    self._set_headers(404)
                    self.wfile.write(json.dumps({"error": "not found"}).encode())
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self._set_headers(404)

def run_http_bridge():
    server = HTTPServer(('', 2800), MessageBridgeHandler)
    print("  [✓] Puente Mensajes: http://localhost:2800")
    server.serve_forever()

# --- SERVIDOR WEBSOCKET (VOZ VOSK - PUERTO 2700) ---
from vosk import Model, KaldiRecognizer

MODEL_PATH = os.path.join(ROOT_DIR, "speaker", "model")

async def voice_handler(websocket, path):
    if not os.path.exists(MODEL_PATH):
        print("[ERROR] Modelo Vosk no encontrado en speaker/model")
        return

    model = Model(MODEL_PATH)
    rec = KaldiRecognizer(model, 16000)
    print(f"  [✓] Voz activada: {websocket.remote_address}")

    try:
        async for message in websocket:
            if isinstance(message, bytes):
                if rec.AcceptWaveform(message):
                    result = json.loads(rec.Result())
                    text = result.get("text", "")
                    if text:
                        print(f"[VOZ] {text}")
                        verse_match = matcher.search_verse(text)
                        payload = {"text": text, "isFinal": True}
                        if verse_match:
                            payload["bibleNav"] = verse_match
                        await websocket.send(json.dumps(payload))
                else:
                    partial = json.loads(rec.PartialResult()).get("partial", "")
                    if partial:
                        await websocket.send(json.dumps({"text": partial, "isFinal": False}))
    except Exception:
        pass

def run_voice_server():
    print("  [✓] Servidor de Voz: ws://localhost:2700")
    
    async def start_server():
        async with websockets.serve(voice_handler, "localhost", 2700):
            await asyncio.Future()  # run forever
    
    asyncio.run(start_server())

# --- MAIN ---
if __name__ == "__main__":
    print("\n" + "="*50)
    print("      EBENEZER - SERVIDOR TODO-EN-UNO")
    print("="*50)

    # 1. Iniciar Web Server (Puerto 8000)
    threading.Thread(target=run_web_server, daemon=True).start()

    # 2. Iniciar Puente HTTP (Puerto 2800)
    threading.Thread(target=run_http_bridge, daemon=True).start()

    # 3. Lanzar el navegador (localhost para evitar problemas de CORS)
    print("  [✓] Lanzando Ebenezer...")
    time.sleep(1) # Esperar un segundo a que los servidores calienten
    webbrowser.open("http://localhost:8000")

    # 4. Iniciar Voz (Hilo Principal)
    run_voice_server()
