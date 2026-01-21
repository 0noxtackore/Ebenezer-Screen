# Bible Module 📖

Reina‑Valera 1960 Bible module with voice search and an interactive "karaoke" reading experience, optimized for projection.

## Main Files

- **`bible.json`** – Complete RV1960 Bible database (66 books, 1,189 chapters, 31,102 verses)
- **`bible.js`** – Logic for search, navigation, verse rendering and karaoke mode
- **`bible.css`** – Cinematic visual styles and responsive layout (1920p / 4K / 8K)
- **`matcher.py`** – Engine that detects Bible references inside recognized Spanish speech

## Features

### Voice Search

- Recognizes book names with fuzzy matching (tolerant of spelling errors)
- Supports abbreviations and aliases (e.g. "Génesis" = "Gen" = "Gn")
- Allows searching by whole chapter or by specific verses
- Accent‑insensitive matching while still displaying properly accented names

### Karaoke Reading Mode

- Highlights words in real time as the text is read
- Automatic verse progression
- Automatic scrolling to keep the active verse centered and visible

### Navigation

- Direct jumps to specific verses via voice commands
- Text search within the current chapter
- Integration with keyboard shortcuts for moving between verses and chapters

## Sample Voice Commands

```text
"Génesis capítulo 1"
"Juan 3:16"
"Apocalipsis capítulo 1 versículo 1"
"Versículo 10"
"Cerrar Biblia"
```

## Data Structure

```json
{
  "GÉNESIS": {
    "1": [
      "En el principio creó Dios los cielos y la tierra.",
      "Y la tierra estaba desordenada y vacía..."
    ]
  }
}
```

Each book is a top‑level key, each chapter is an object keyed by chapter number, and each verse is a string inside an ordered array.

## Visual Style

- Cinematic background with radial vignette
- Dark text on a warm, lightly textured background ("ink on paper" feel)
- Amber highlighting for active words and verses
- Minimal, custom scrollbar
- Large rem‑based typography that scales up on 1920p, 4K and 8K displays

## Keyboard Shortcuts & Display Scaling

The Bible module participates in the global shortcut scheme of the application (numeric keys for switching sections, plus additional keys for navigating verses/chapters and controlling the karaoke flow, where configured).

Font sizes and spacing are defined in `rem` units with dedicated media queries for:

- **1920p** – Comfortable reading size with clear hierarchy between book, chapter and verse
- **4K (3840×2160)** – Noticeably larger headers and verses, filling more of the screen width
- **8K (7680×4320)** – Very large, projector‑oriented text designed to be readable from long distances

This makes the same Bible layout suitable for small rooms and large auditoriums alike.
