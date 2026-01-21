import json
import os
import unicodedata
from difflib import SequenceMatcher

# Configuración
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BIBLE_PATH = os.path.join(BASE_DIR, "Holy-bible", "bible.json")

BIBLE_DB = []

def load_bible():
    global BIBLE_DB
    print(f"[MATCHER] Cargando Biblia desde {BIBLE_PATH}...")
    try:
        with open(BIBLE_PATH, 'r', encoding='utf-8') as f:
            BIBLE_DB = json.load(f)
        print(f"[MATCHER] Biblia cargada: {len(BIBLE_DB)} versículos.")
    except Exception as e:
        print(f"[MATCHER] Error cargando Biblia: {e}")

def normalize(text):
    if not text: return ""
    return ''.join(c for c in unicodedata.normalize('NFD', text)
                   if unicodedata.category(c) != 'Mn') \
           .lower().replace(",", "").replace(".", "").replace(";", "").replace(":", "").strip()

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def search_verse(spoken_text):
    if not BIBLE_DB:
        load_bible()
    
    if len(spoken_text) < 10: # Ignorar frases muy cortas
        return None

    norm_spoken = normalize(spoken_text)
    best_match = None
    best_score = 0.0
    
    # Optimización: Escaneo lineal simple. 
    # Para 31k versículos en Python esto toma ~200-500ms dependiendo de la CPU.
    # Si fuera lento, usaríamos un índice de palabras, pero para empezar esto vale.
    
    threshold = 0.85 # 85% de coincidencia requerida

    for item in BIBLE_DB:
        verse_text = item.get('texto', '')
        norm_verse = normalize(verse_text)
        
        # Filtro rápido de longitud (si difieren mucho en longitud, no es match)
        len_diff = abs(len(norm_spoken) - len(norm_verse))
        if len_diff > len(norm_spoken) * 0.4: 
            continue

        score = similar(norm_spoken, norm_verse)
        
        if score > best_score:
            best_score = score
            best_match = item
    
    if best_score >= threshold:
        print(f"[MATCHER] Match encontrado ({best_score:.2f}): {best_match['libro']} {best_match['capitulo']}:{best_match['versiculo']}")
        return best_match
    
    return None

# Cargar al importar
load_bible()
