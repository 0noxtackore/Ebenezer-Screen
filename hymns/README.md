# Hymns Module 🎵

Hymns and spiritual songs module with large‑format, karaoke‑style lyric projection.

## Files

- **`hymnal.json`** – Hymn database with structured lyrics
- **`song.js`** – Logic for loading hymns, formatting verses/chorus, and handling navigation
- **`song.css`** – Cinematic styles and responsive layout for 1920p / 4K / 8K

## Features

### ✅ Implemented

- [x] Loading hymns from a JSON hymnal
- [x] Verse / chorus layout with clear labels
- [x] Random nature‑themed backgrounds
- [x] Search by hymn number
- [x] Optional voice command integration (e.g. via Speaker module)

Lyrics are rendered in very large typography suitable for projection, with line‑by‑line highlighting for congregational singing.

## Sample Voice Commands

```text
"Himno 1"
"Himno número 1"
```

## Data Structure

```json
{
  "number": 1,
  "title": "GRACIA PARA VENCER",
  "verses": [
    {
      "type": "verse",
      "number": 1,
      "lines": ["LÍNEA 1", "LÍNEA 2", "..."]
    },
    {
      "type": "chorus",
      "lines": ["LÍNEA 1", "LÍNEA 2", "..."]
    }
  ]
}
```

Each hymn has a numeric identifier, a title, and a list of blocks. Blocks can be of type `"verse"` (with a `number`) or `"chorus"`; each block contains an ordered list of lyric `lines`.

## Available Hymns (Example)

1. **GRACIA PARA VENCER** – Hymn of faith and perseverance

## Keyboard Shortcuts & Display Scaling

The Hymns module is controlled both from the on‑screen UI and through the same global shortcut scheme used by the rest of the application (for example, switching modules with numeric keys and moving between verses/chorus with dedicated controls, where implemented).

The lyric layout uses large `rem`‑based fonts and explicit media queries for:

- **1920p** – Big, readable lines suitable for medium‑sized rooms
- **4K (3840×2160)** – Even larger lyrics and wider stanza columns
- **8K (7680×4320)** – Extremely large text for distant viewing while keeping lines grouped cleanly

This ensures that congregational singing remains comfortable regardless of the resolution of the projector or display.
