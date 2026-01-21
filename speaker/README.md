# Speaker Module 🎤

Offline speech‑recognition engine powered by Vosk, providing real‑time voice control for the entire application.

## Main Files

- **`server.py`** – WebSocket server (port 2700)
- **`speak.js`** – Browser‑side client that captures microphone audio and handles status UI
- **`model/`** – Vosk Spanish language model directory

## Technology

### Vosk Speech Recognition

- Fully offline recognition (no internet connection required)
- Spanish‑optimized acoustic and language model
- Partial and final results streamed in real time

### WebSocket Communication

- Bidirectional, low‑latency connection between browser and Python backend
- Continuous audio streaming from `speak.js` to `server.py`
- Recognized text streamed back to the browser and routed to command handlers

## Data Flow

```text
Microphone → speak.js → WebSocket → server.py → Vosk Model
                                         ↓
                                   Recognized text
                                         ↓
                                bible.matcher / routers
                                         ↓
                                 Command detection
                                         ↓
                              Response back to browser
```

## Detected Commands

The server and router logic automatically identify:

- Bible references (e.g. `"Juan 3:16"`)
- Navigation commands (open/close Bible, go to Rest, Goodbye, etc.)
- Sermon searches (Messages module)
- Hymn selection commands
- Playback and karaoke‑navigation controls

## Configuration

### Requirements

```bash
pip install vosk websockets
```

### Voice Model

- Download: [vosk-model-small-es-0.42](https://alphacephei.com/vosk/models)
- Location: `speaker/model/`

## Integration

The `speak.js` module coordinates with:

- `bible.js` – Bible verse search and navigation
- `message.js` – Sermon search and karaoke control
- `song.js` (Hymns) – Hymn selection and navigation
- `prayer.js` – Prayer‑related commands (where implemented)

## Microphone Status UI

- 🔴 Red: listening / recording
- ⚪ White: idle
- Pulsing animation while recognition is active

## Operator Usage

From the operator's perspective, the Speaker module works transparently in the background:

- Start the main server (`python ebenezer.py`) so the WebSocket voice server is available on port 2700.
- Ensure a compatible Vosk model is present in `speaker/model/`.
- Watch the microphone icon in the UI to confirm when the system is listening.
- Speak natural Spanish commands (Bible references, sermon titles, navigation phrases); recognized commands are dispatched automatically to the corresponding modules.
