import requests
import json
import os
import time
import re

# Configuración
SERMON_API = "https://table.branham.org/rest/sermons/sermonRequest"
HEADERS = {
    "Csrf-Token": "csrf-key-value",
    "X-Requested-With": "j:Dm_eDEoMw9jxIU@=A2B8^Lz/Uh_fSrWW5ai7oAr6l@TiX7=wB0s`=;fC<9eT;^",
    "Content-Type": "application/json;charset=utf-8",
    "Accept": "application/json, text/plain, */*",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Rutas relativas al script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_PATH = os.path.join(SCRIPT_DIR, "sermon_index.json")
LIBRARY_DIR = os.path.join(SCRIPT_DIR, "library")

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    cleantext = cleantext.replace("&nbsp;", " ").replace("&quot;", "\"")
    return cleantext.strip()

def download_sermon(sermon_id):
    payload = {
        "Language": "es",
        "SermonRecordId": str(sermon_id),
        "GetAllContent": True
    }
    
    try:
        response = requests.post(SERMON_API, json=payload, headers=HEADERS)
        if response.status_code != 200: return None
        data = response.json()
        paragraphs = []
        if "Result" in data and "Sections" in data["Result"]:
            for section in data["Result"]["Sections"]:
                html = section.get("Content", "")
                if 'class="heading"' in html or 'class="title1"' in html or 'class="productid"' in html:
                    continue
                html = re.sub(r'<span class="eagle[^>]*>.*?</span>', '🦅 ', html)
                parts = re.split(r'<span class="pn">.*?</span>', html)
                for p_html in parts:
                    text = clean_html(p_html)
                    if text:
                        if (text.startswith('"') or text.startswith('“')) and not text.startswith('🦅'):
                            text = "🦅 " + text[1:].strip()
                        paragraphs.append(text)
        return paragraphs
    except Exception: return None

def main():
    if not os.path.exists(LIBRARY_DIR): os.makedirs(LIBRARY_DIR)
    
    if not os.path.exists(INDEX_PATH):
        print("Índice no encontrado. Esperando a que finalize_index.py lo cree...")
        return

    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        index = json.load(f)

    print(f"Sincronizando {len(index)} sermones a la librería local...")
    
    downloaded = 0
    skipped = 0
    errors = 0

    for item in index:
        s_id = item["id"]
        title = item["title"]
        target_file = os.path.join(LIBRARY_DIR, f"{s_id}.json")
        
        if os.path.exists(target_file):
            skipped += 1
            continue
            
        print(f"[*] Descargando: {title} ({s_id})...")
        content = download_sermon(s_id)
        
        if content:
            with open(target_file, "w", encoding="utf-8") as f:
                json.dump({"title": title, "id": s_id, "content": content}, f, ensure_ascii=False, indent=2)
            downloaded += 1
            time.sleep(0.05) # Delay suave
        else:
            print(f"  [!] Error al descargar {s_id}")
            errors += 1
            
        if downloaded % 5 == 0 and downloaded > 0:
            print(f"--- Progreso: {downloaded} descargados, {skipped} omitidos ---")

    print(f"\nFinalizado: {downloaded} descargados, {skipped} ya existían, {errors} errores.")

if __name__ == "__main__":
    main()
