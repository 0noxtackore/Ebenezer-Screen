import requests
import json

SEARCH_API = "https://table.branham.org/rest/userQuery"
HEADERS = {
    "Csrf-Token": "csrf-key-value",
    "X-Requested-With": "j:Dm_eDEoMw9jxIU@=A2B8^Lz/Uh_fSrWW5ai7oAr6l@TiX7=wB0s`=;fC<9eT;^",
    "Content-Type": "application/json;charset=utf-8",
    "Accept": "application/json, text/plain, */*",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def test_query(text, search_type="AllWords"):
    payload = {
        "Language": "es",
        "SearchType": search_type,
        "Text": text,
        "PageSize": 2000 # Intentamos pedir mucho
    }
    try:
        response = requests.post(SEARCH_API, json=payload, headers=HEADERS)
        if response.status_code == 200:
            results = response.json().get("Result", {}).get("Results", [])
            print(f"Query: '{text}' ({search_type}) -> Count: {len(results)}")
            return len(results)
        else:
            print(f"Query: '{text}' -> Error {response.status_code}")
    except Exception as e:
        print(f"Query: '{text}' -> Exception {e}")
    return 0

if __name__ == "__main__":
    # Probando diferentes comodines
    test_query("*")
    test_query(" ")
    test_query("a e i o u", "AnyWords")
    test_query("19", "AllWords")
    test_query("65", "AllWords")
