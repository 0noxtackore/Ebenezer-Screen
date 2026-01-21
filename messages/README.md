# Messages Module 📚

Local library of sermons by William Branham translated into Spanish, with fast fuzzy search and karaoke‑style reading.

## Main Files

### Python Scripts

- **`sermon_search.py`** – Intelligent search engine with fuzzy matching
- **`sermon_index.json`** – Index of 416 unique sermons
- **`fetch_all_sermons.py`** – Metadata extractor using the official API
- **`bulk_downloader.py`** – Bulk downloader for sermon content
- **`finalize_index.py`** – Resolver from product IDs to record IDs
- **`message_bridge.py`** – HTTP bridge for dynamic searches (port 2800)

### Frontend

- **`message.js`** – Local search logic, UI wiring and karaoke mode
- **`message.css`** – Cinematic visual styles and responsive layout

### Data

- **`library/`** – Folder containing 386+ downloaded sermons in JSON form
- **`sermon_index.json`** – Master index with titles and IDs

## Features

### Instant Local Search

- In‑memory index of 416 sermons
- Fuzzy matching (Levenshtein‑based) tolerant of typos and partial names
- Automatic suggestion of the best match
- Example: `"La Señaol"` → `"LA SEÑAL"`

### Offline Library

- Sermons stored locally under `library/`
- Instant loading without internet access
- Fallback to the dynamic HTTP bridge if a sermon is not yet downloaded

### Karaoke Mode

- Word‑by‑word highlighting in real time
- Paragraph‑level navigation
- Automatic scrolling to keep the current paragraph visible

## Sample Voice Commands

```text
"Mensaje La Señal"
"Mensaje Fe Es La Sustancia"
"Mensaje La Señal párrafo 50"
"Párrafo 25"
```

## Data Structures

### `sermon_index.json`

```json
[
  {
    "id": "61910009",
    "title": "A UD. LE ES NECESARIO NACER DE NUEVO",
    "product_id": "61-1231M"
  }
]
```

### `library/[id].json`

```json
{
  "title": "LA SEÑAL",
  "id": "63530009",
  "content": [
    "🦅 Inclinemos nuestros rostros...",
    "Permanezcan de pie un momento..."
  ]
}
```

## API Integration

- **Endpoint**: `https://table.branham.org/rest/userQuery`
- **Method**: `POST`
- **Language**: Spanish (`"Language": "es"`)

The Python tools use this API to fetch metadata and content when building or extending the local library.

## Current Status

- ✅ 416 sermons indexed
- ✅ 386+ sermons downloaded locally
- ✅ Fuzzy search implemented
- 🔄 Investigating expansion towards ~1,200 sermons

## Keyboard Shortcuts & Display Scaling

The Messages view integrates with the global navigation and control shortcuts defined in the main application (for example, numeric keys to switch modules and keys to move between paragraphs or toggle preacher‑oriented modes, where implemented).

Typography and layout are based on `rem` units and tuned specifically for:

- **1920p** – Comfortable reading on typical HD projectors
- **4K (3840×2160)** – Significantly larger text and widened content area
- **8K (7680×4320)** – Very large titles and paragraphs for distant viewing

This ensures that sermon text remains readable and visually balanced across all supported resolutions.
