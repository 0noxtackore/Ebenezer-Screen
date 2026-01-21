# Messages Module 📚

Biblioteca local de mensajes del profeta William Branham traducidos al español.

## Archivos Principales

### Scripts de Python
- **`sermon_search.py`** - Motor de búsqueda inteligente con fuzzy matching
- **`sermon_index.json`** - Índice de 416 sermones únicos
- **`fetch_all_sermons.py`** - Extractor de metadata del API oficial
- **`bulk_downloader.py`** - Descargador masivo de contenido
- **`finalize_index.py`** - Resolución de IDs de producto a IDs de registro
- **`message_bridge.py`** - Servidor HTTP para búsquedas dinámicas (Puerto 2800)

### Frontend
- **`message.js`** - Lógica de búsqueda local y modo karaoke
- **`message.css`** - Estilos cinemáticos

### Datos
- **`library/`** - Carpeta con 386+ mensajes descargados en formato JSON
- **`sermon_index.json`** - Índice maestro con títulos y IDs

## Funcionalidades

### Búsqueda Local Instantánea
- Índice de 416 sermones en memoria
- Fuzzy matching con algoritmo de Levenshtein
- Corrección automática de errores tipográficos
- Ejemplo: "La Señaol" → "LA SEÑAL"

### Biblioteca Offline
- Mensajes almacenados localmente en `library/`
- Carga instantánea sin necesidad de internet
- Fallback al bridge dinámico si el mensaje no está descargado

### Modo Karaoke
- Resaltado de palabras en tiempo real
- Navegación por párrafos
- Scroll automático

## Comandos de Voz

```
"Mensaje La Señal"
"Mensaje Fe Es La Sustancia"
"Mensaje La Señal párrafo 50"
"Párrafo 25"
```

## Estructura de Datos

### sermon_index.json
```json
[
  {
    "id": "61910009",
    "title": "A UD. LE ES NECESARIO NACER DE NUEVO",
    "product_id": "61-1231M"
  }
]
```

### library/[id].json
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
- **Método**: POST
- **Idioma**: Español (`"Language": "es"`)

## Estado Actual

- ✅ 416 sermones indexados
- ✅ 386+ sermones descargados localmente
- ✅ Búsqueda fuzzy implementada
- 🔄 Investigando expansión a 1,206 sermones
