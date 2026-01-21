from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import sys
import os
import subprocess

# Agregar el directorio actual al path para importar sermon_search
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

class MessageBridgeHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        if parsed_path.path == '/search':
            params = urllib.parse.parse_qs(parsed_path.query)
            query = params.get('q', [''])[0]
            
            if not query:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "No query provided"}).encode())
                return

            print(f"[BRIDGE] Buscando mensaje: {query}")
            
            try:
                # Ejecutamos el script de búsqueda como un proceso para asegurar que los logs y la lógica de guardado funcionen
                # Podríamos importar las funciones, pero ejecutar el script garantiza que el archivo JSON se genere correctamente
                script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sermon_search.py")
                result = subprocess.run([sys.executable, script_path, query], capture_output=True, text=True, encoding='utf-8')
                
                if result.returncode == 0:
                    # El script guarda en message_data.json, lo leemos para devolverlo
                    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "message_data.json")
                    with open(json_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    self._set_headers(200)
                    self.wfile.write(json.dumps(data).encode())
                else:
                    print(f"[ERROR] Script falló: {result.stderr}")
                    self._set_headers(500)
                    self.wfile.write(json.dumps({"error": "Search failed", "details": result.stdout}).encode())
                    
            except Exception as e:
                print(f"[ERROR] Bridge: {e}")
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

def run(port=2800):
    server_address = ('', port)
    httpd = HTTPServer(server_address, MessageBridgeHandler)
    print(f"[INFO] Puente de Mensajes Ebenezer corriendo en http://localhost:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
