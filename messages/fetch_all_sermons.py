import requests
import json
import os
import time

SEARCH_API = "https://table.branham.org/rest/userQuery"
HEADERS = {
    "Csrf-Token": "csrf-key-value",
    "X-Requested-With": "j:Dm_eDEoMw9jxIU@=A2B8^Lz/Uh_fSrWW5ai7oAr6l@TiX7=wB0s`=;fC<9eT;^",
    "Content-Type": "application/json;charset=utf-8",
    "Accept": "application/json, text/plain, */*",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def fetch_all_metadata():
    print("Obteniendo lista completa de sermones en español (Objetivo: 1,206)...")
    
    unique_sermons = {}
    
    # Estrategia: Buscar por años (1947-1965) y por letras para cubrir todo.
    # El API parece devolver párrafos, así que deduplicamos por RecordId.
    search_terms = [str(y) for y in range(1947, 1966)]
    # Añadimos letras comunes para atrapar títulos que no tengan el año en el texto indexado
    search_terms += list("abcdefghijklmnopqrstuvwxyz")

    for term in search_terms:
        print(f"Buscando término: '{term}'...")
        payload = {
            "Language": "es",
            "SearchType": "AllWords",
            "Text": term, 
            "PageSize": 1000 
        }
        
        try:
            response = requests.post(SEARCH_API, json=payload, headers=HEADERS)
            if response.status_code == 200:
                results = response.json().get("Result", {}).get("Results", [])
                added_this_term = 0
                for r in results:
                    doc_id = r.get("DocumentRecordId") or r.get("RecordId")
                    if not doc_id: continue
                    
                    props = r.get("Properties", {})
                    title = props.get("Title") or r.get("Title") or "Sin Título"
                    product_id = r.get("ProductId") or props.get("ProductId")
                    
                    if str(doc_id) not in unique_sermons:
                        unique_sermons[str(doc_id)] = {
                            "id": str(doc_id),
                            "title": title.upper(),
                            "product_id": product_id
                        }
                        added_this_term += 1
                
                if added_this_term > 0:
                    print(f"  -> Encontrados {added_this_term} nuevos. (Total: {len(unique_sermons)})")
            else:
                print(f"  [!] Error {response.status_code} para '{term}'")
        except Exception as e:
            print(f"  [!] Error en '{term}': {e}")
        
        time.sleep(0.05) # Delay suave

    # Convertir a lista y ordenar por título o ID (mejor por fecha si el ID fuera cronológico, pero título está bien)
    index = sorted(unique_sermons.values(), key=lambda x: x["title"])
    
    # Ruta relativa al script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    target_path = os.path.join(script_dir, "sermon_index.json")
    
    # Guardar respaldo primero
    backup_path = target_path + ".bak"
    if os.path.exists(target_path):
        if os.path.exists(backup_path):
            os.remove(backup_path)
        os.rename(target_path, backup_path)

    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
            
    print(f"\n¡Éxito! Índice actualizado con {len(index)} sermones en {target_path}")
    
    if len(index) < 1000:
        print("[AVISO] El conteo es menor a 1000. Podrían faltar mensajes.")

if __name__ == "__main__":
    fetch_all_metadata()
