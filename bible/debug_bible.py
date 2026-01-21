import json
import codecs

try:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    bible_path = os.path.join(script_dir, 'Holy-bible', 'bible.json')
    with codecs.open(bible_path, 'r', 'utf-8') as f:
        data = json.load(f)
        
    books = set()
    for item in data:
        books.add(item.get('libro'))
        
    print("Books found:", sorted(list(books)))
    
    genesis = [d for d in data if 'GENESIS' in d.get('libro').upper() or 'GÉNESIS' in d.get('libro').upper()]
    print(f"Genesis count: {len(genesis)}")
    
except Exception as e:
    print(f"Error: {e}")
