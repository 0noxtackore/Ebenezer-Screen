# Ebenezer Screen – Interactive Voice‑Driven Presentation System 🦅

**“Hitherto hath the Lord helped us.”** – 1 Samuel 7:12

Ebenezer Screen is an interactive, voice‑driven presentation system designed to project biblical content, sermons, hymns, and devotional material in Spanish. It combines:

- Bible verses (Reina‑Valera 1960)
- Sermons by William Branham
- Hymns and congregational songs
- Prayer and class material
- Rest / welcome / goodbye screens

All of this is orchestrated through a unified interface, with offline voice recognition (Vosk), unified search, and layouts carefully tuned for **1920p, 4K, and 8K** displays.

## 🚀 Quick Start

From the project root:

```bash
python ebenezer.py
```

The system will automatically open your browser at `http://localhost:8000` and start:

- **Web server** (port `8000`)
- **Voice server** (port `2700`, Vosk WebSocket)
- **Message bridge** (port `2800` for sermon search)

Use the numeric keys or the on‑screen menu to switch between sections (Bible, Hymns, Messages, Search, Class, Prayer, Specials, Rest, Goodbye, etc.).

## 📦 Full Setup

For a first‑time installation you can run:

```bash
python setup.py
```

This automated script will:

1. Install all required Python dependencies
2. **Download the Vosk Spanish speech model** (~40 MB)
3. Build the index of 416+ sermons
4. Download and prepare the local sermon library

> [!NOTE]
> If the automatic Vosk download fails, you can obtain it manually:
> - Download: [vosk-model-small-es-0.42](https://alphacephei.com/vosk/models)
> - Extract into: `speaker/model/`

## 📁 Project Structure (Overview)

```text
Ebenezer/
├── bible/           # Bible module (RV1960, karaoke verses, voice search)
├── hymns/           # Hymns module (lyrics, verses/chorus, karaoke highlighting)
├── messages/        # Sermon library (416+ messages, fuzzy search, local index)
├── search/          # Unified search across Bible, messages, and hymns
├── class/           # Class / teaching screen (verses and key points)
├── prayer/          # Guided prayer / prayer texts
├── specials/        # Special presentations (songs, readings, announcements)
├── goodbye/         # Goodbye / closing screen
├── rest/            # Rest / idle screen with animated logo
├── speaker/         # Vosk voice recognition bridge (WebSocket)
├── img/             # Visual assets and background images
├── ebenezer.py      # Unified Python server (HTTP + WebSocket bridges)
├── index.html       # Main application shell
└── start.bat        # Convenience launcher for Windows
```

Each module contains its own HTML/CSS/JS and, where applicable, a dedicated `README.md` with detailed behavior.

## 🎤 Voice Commands (Examples)

Voice recognition is handled by **Vosk** through the `speaker` module. Typical Spanish commands include:

### Bible

- `"Génesis capítulo 1"`
- `"Juan capítulo 3 versículo 16"`
- `"Apocalipsis capítulo 1"`

The system normalizes accents internally, accepts unaccented input, and displays accented book names on screen.

### Messages

- `"Mensaje La Señal"`
- `"Mensaje Fe Es La Sustancia párrafo 50"`

These commands are routed to the sermon search engine, which locates the best matching sermon and, optionally, jumps to a specific paragraph.

### Navigation / Control

- `"Cerrar Biblia"`
- `"Adiós"` / `"Hasta luego"`
- `"Descanso"`

Keyboard shortcuts are also available (e.g. numeric keys to jump between sections, controls for preacher mode and karaoke navigation).

## ⌨️ Keyboard Shortcuts

In addition to voice control, Ebenezer Screen supports keyboard shortcuts for fast navigation during a service:

- **Global navigation**
  - `1` – Bible
  - `2` – Hymns
  - `3` – Messages
  - `4` – Search
  - `5` – Class
  - `6` – Prayer
  - `7` – Specials
  - `8` – Rest
  - `9` – Goodbye

- **Within modules (where implemented)**
  - Arrow keys or dedicated keys to move between verses, paragraphs or hymn stanzas
  - Keys to toggle preacher‑oriented / karaoke modes
  - Close / escape commands to return to a neutral view (for example, Rest)

- **Utility**
  - `t` – Open a new internal tab in the current Bible, Hymns or Messages module (when available)

This allows the operator to drive the entire experience either hands‑free (voice) or with quick, low‑friction keyboard input.

## Technology Stack

- **Frontend**: HTML5, CSS3, vanilla JavaScript
  - Responsive layouts tuned for **1920p, 4K (3840×2160) and 8K (7680×4320)**
  - Large, cinematic typography (rem‑based) for projection
  - Karaoke‑style highlighting for words and lines
- **Backend**: Python 3.x
  - `vosk` – offline speech recognition (Spanish)
  - `websockets` – real‑time communication with the browser
  - `requests` – integration with external APIs where needed
- **External data**: `table.branham.org` (for sermon content by William Branham)

## 📚 Key Features

### ✅ Implemented

- **Bible module** with voice‑driven verse search and karaoke reading
- **Messages module** with local library of 416+ Spanish sermons
- **Fuzzy search** tolerant to spelling mistakes and partial phrases
- **Hymns module** with structured verses/chorus and large lyrics
- **Unified search** interface for Bible, sermons, and hymns
- **Speaker module** with offline Vosk recognition and WebSocket bridge
- **Cinematic UI** with dynamic backgrounds and strong text contrast
- Layout scaling for **1920p / 4K / 8K** (titles, bodies, search boxes, logos)

### 🔄 In Progress / Planned

- Expansion of the local sermon library
- Additional hymn sets and richer hymn metadata
- More advanced guided‑prayer flows
- Extra presets for special meetings and announcements

## 📖 Detailed Module Documentation

Each main folder includes its own `README.md` with more details:

- [Bible Module](./bible/README.md)
- [Hymns Module](./hymns/README.md)
- [Messages Module](./messages/README.md)
- [Prayer Module](./prayer/README.md)
- [Rest Module](./rest/README.md)
- [Speaker Module](./speaker/README.md)
- [Goodbye Module](./goodbye/README.md)
- (Planned) [Class Module](./class/README.md)
- (Planned) [Specials Module](./specials/README.md)

## 🤝 Contributions

This is a personal worship and ministry project. If you want to contribute, suggest improvements, or report an issue, please contact the developer directly or open an issue in the repository.

## 📄 License

Open‑source project intended for personal and ministerial use. Please review the repository for specific licensing details or attribution requirements.

---

**“Then Samuel took a stone, and set it between Mizpeh and Shen, and called the name of it Ebenezer, saying, Hitherto hath the Lord helped us.”** – 1 Samuel 7:12
