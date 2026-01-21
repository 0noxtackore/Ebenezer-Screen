import sys
import json
import requests
import re
import os

# Configuración de Table Branham
SEARCH_API = "https://table.branham.org/rest/userQuery"
SERMON_API = "https://table.branham.org/rest/sermons/sermonRequest"
# Rutas relativas al script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TARGET_PATH = os.path.join(SCRIPT_DIR, "message_data.json")

# Headers estáticos identificados en la investigación
HEADERS = {
    "Csrf-Token": "csrf-key-value",
    "X-Requested-With": "j:Dm_eDEoMw9jxIU@=A2B8^Lz/Uh_fSrWW5ai7oAr6l@TiX7=wB0s`=;fC<9eT;^",
    "Content-Type": "application/json;charset=utf-8",
    "Accept": "application/json, text/plain, */*",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def clean_html(raw_html):
    """Limpia los tags HTML del contenido de los párrafos"""
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    cleantext = cleantext.replace("&nbsp;", " ").replace("&quot;", "\"")
    return cleantext.strip()

def normalize_simplify(text):
    if not text: return ""
    # Quitar acentos y pasar a mayúsculas
    text = text.upper()
    replacements = (("Á", "A"), ("É", "E"), ("Í", "I"), ("Ó", "O"), ("Ú", "U"), ("Ñ", "N"))
    for a, b in replacements:
        text = text.replace(a, b)
    return text.strip()

def clean_query_for_api(query):
    """Limpia artículos comunes que ensucian la búsqueda del API"""
    q = normalize_simplify(query)
    # Lista de stop-words en español para títulos
    stops = ["LA ", "EL ", "LAS ", "LOS ", "UN ", "UNA "]
    for stop in stops:
        if q.startswith(stop):
            q = q[len(stop):].strip()
    return q

def search_sermon(query):
    query = query.strip(",. ").strip()
    
    # 1. Limpieza agresiva para el API: "LA SEÑAL" -> "SEÑAL"
    api_query = clean_query_for_api(query)
    print(f"[API] Buscando término clave: {api_query}")
    
    # Intentar con AllWords (Más preciso)
    result = _do_search(api_query, "AllWords", page_size=10)
    if result:
        best = _find_best_by_title(query, result)
        if best: return best
    
    # 2. Intentar con AnyWords (Modo flexible)
    result = _do_search(api_query, "AnyWords", page_size=20)
    if result:
        best = _find_best_by_title(query, result)
        if best: return best
        
    return None

def _find_best_by_title(query, results):
    if not isinstance(results, list): results = [results]
    norm_query = normalize_simplify(query)
    best_match = None
    min_dist = 999
    
    for r in results:
        title = (r.get("Properties", {}).get("Title") or r.get("Title") or "").upper()
        norm_title = normalize_simplify(title)
        
        # Prioridad 1: Coincidencia de contenido de palabras
        if norm_query in norm_title or norm_title in norm_query:
            return r
            
        # Prioridad 2: Levenshtein para errores tipográficos
        from difflib import SequenceMatcher
        ratio = SequenceMatcher(None, norm_query, norm_title).ratio()
        if ratio > 0.6: # Bastante similar
            # Usamos el de mayor ratio
            if (1-ratio) * 10 < min_dist:
                min_dist = (1-ratio) * 10
                best_match = r
                
    return best_match

def _do_search(query, search_type, page_size=1):
    payload = {
        "Language": "es",
        "SearchType": search_type,
        "Text": query,
        "PageSize": page_size
    }
    
    try:
        response = requests.post(SEARCH_API, json=payload, headers=HEADERS)
        if response.status_code != 200: return None
        data = response.json()
        if "Result" in data and "Results" in data["Result"]:
            results = data["Result"]["Results"]
            if len(results) > 0:
                return results if page_size > 1 else results[0]
        return None
    except Exception: return None

def get_sermon_content(sermon_id, query):
    payload = {
        "Language": "es",
        "SermonRecordId": str(sermon_id),
        "GetAllContent": True,
        "HighlightQuery": {
            "SearchType": "AllWords",
            "Text": query
        }
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
    if len(sys.argv) < 2: return
    query = sys.argv[1]
    
    if os.path.exists(TARGET_PATH): os.remove(TARGET_PATH)

    sermon_meta = search_sermon(query)
    if not sermon_meta:
        print(f"No se encontraron resultados para: {query}")
        return

    sermon_id = sermon_meta.get("DocumentRecordId") or sermon_meta.get("RecordId")
    properties = sermon_meta.get("Properties", {})
    sermon_title = properties.get("Title") or sermon_meta.get("Title") or "Sermón sin título"
    
    content = get_sermon_content(sermon_id, query)
    if not content: return

    data = {
        "title": sermon_title.upper(),
        "id": str(sermon_id),
        "query": query.upper(),
        "content": content
    }
    
    with open(TARGET_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"¡Éxito! Encontrado: {sermon_title}")

if __name__ == "__main__":
    main()
