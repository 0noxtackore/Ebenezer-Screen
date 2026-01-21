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

# Rutas relativas al script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_LIST_PATH = os.path.join(SCRIPT_DIR, "raw_sermon_list.json")
FINAL_INDEX_PATH = os.path.join(SCRIPT_DIR, "sermon_index.json")

def finalize_index():
    if not os.path.exists(RAW_LIST_PATH):
        print("Error: raw_sermon_list.json no encontrado.")
        return

    with open(RAW_LIST_PATH, "r", encoding="utf-8") as f:
        raw_rows = json.load(f)

    if os.path.exists(FINAL_INDEX_PATH):
        with open(FINAL_INDEX_PATH, "r", encoding="utf-8") as f:
            final_index = json.load(f)
    else:
        final_index = []

    existing_ids = {item["id"] for item in final_index}
    processed_count = 0

    print(f"Iniciando resolución de {len(raw_rows)} sermones...")

    for title, product_id in raw_rows:
        # Si ya lo tenemos o si el id ya es numérico (por si acaso)
        if product_id in existing_ids:
            continue

        print(f"[{processed_count+1}/{len(raw_rows)}] Resolviendo: {product_id} - {title}")
        
        # El API de búsqueda funciona muy bien con el ProductId (ej: 47-0412)
        payload = {
            "Language": "es",
            "SearchType": "AllWords",
            "Text": product_id, 
            "PageSize": 1
        }
        
        try:
            response = requests.post(SEARCH_API, json=payload, headers=HEADERS)
            if response.status_code == 200:
                results = response.json().get("Result", {}).get("Results", [])
                if results:
                    r = results[0]
                    record_id = str(r.get("DocumentRecordId") or r.get("RecordId"))
                    
                    final_index.append({
                        "id": record_id,
                        "title": title.upper(),
                        "product_id": product_id
                    })
                    existing_ids.add(record_id)
                else:
                    print(f"  [!] No se encontró RecordId para {product_id}")
            else:
                print(f"  [!] Error API {response.status_code}")
        except Exception as e:
            print(f"  [!] Error fatal: {e}")

        processed_count += 1
        
        # Guardado progresivo para no perder trabajo
        if processed_count % 10 == 0:
            with open(FINAL_INDEX_PATH, "w", encoding="utf-8") as f:
                json.dump(final_index, f, ensure_ascii=False, indent=2)
            print(f"--- Progreso guardado: {len(final_index)} items ---")
        
        # Delay corto para no saturar
        time.sleep(0.1)

    with open(FINAL_INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(final_index, f, ensure_ascii=False, indent=2)
        
    print(f"¡Éxito Final! Se generó el índice con {len(final_index)} sermones.")

if __name__ == "__main__":
    finalize_index()
