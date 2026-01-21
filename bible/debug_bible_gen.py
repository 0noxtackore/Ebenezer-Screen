import json
import codecs

try:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    bible_path = os.path.join(script_dir, 'Holy-bible', 'bible.json')
    with codecs.open(bible_path, 'r', 'utf-8') as f:
        data = json.load(f)
        
    genesis_1 = [d for d in data if d.get('libro') == 'GENESIS' and d.get('capitulo') == 1]
    print(f"Genesis 1 verses: {len(genesis_1)}")
    if len(genesis_1) > 0:
        print(f"Sample: {genesis_1[0]}")
        print(f"Chapter type: {type(genesis_1[0]['capitulo'])}")
        
except Exception as e:
    print(f"Error: {e}")
