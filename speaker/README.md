# Speaker Module 🎤

Motor de reconocimiento de voz offline usando Vosk.

## Archivos Principales

- **`server.py`** - Servidor WebSocket (Puerto 2700)
- **`speak.js`** - Cliente de reconocimiento de voz en el navegador
- **`model/`** - Modelo de lenguaje Vosk para español

## Tecnología

### Vosk Speech Recognition
- Reconocimiento de voz offline (sin internet)
- Modelo en español optimizado
- Resultados parciales y finales en tiempo real

### WebSocket Communication
- Conexión bidireccional en tiempo real
- Streaming de audio desde el navegador
- Respuestas instantáneas

## Flujo de Datos

```
Micrófono → speak.js → WebSocket → server.py → Vosk Model
                                        ↓
                                  Texto reconocido
                                        ↓
                                  bible.matcher
                                        ↓
                              Detección de comandos
                                        ↓
                            Respuesta al navegador
```

## Comandos Detectados

El servidor identifica automáticamente:
- Referencias bíblicas (ej: "Juan 3:16")
- Comandos de navegación
- Búsquedas de mensajes
- Controles de reproducción

## Configuración

### Requisitos
```bash
pip install vosk websockets
```

### Modelo de Voz
- Descarga: [vosk-model-small-es-0.42](https://alphacephei.com/vosk/models)
- Ubicación: `speaker/model/`

## Integración

El módulo `speak.js` se comunica con:
- `bible.js` - Para búsqueda de versículos
- `message.js` - Para búsqueda de mensajes
- `hymns.js` - Para himnos
- `prayer.js` - Para oraciones

## Estado del Micrófono

- 🔴 Rojo: Escuchando
- ⚪ Blanco: Inactivo
- Animación de pulso durante reconocimiento
