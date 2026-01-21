# Hymns Module 🎵

Módulo de himnos y canciones espirituales con visualización estilo karaoke.

## Archivos

- **`hymnal.json`** - Base de datos de himnos con letra estructurada
- **`song.js`** - Lógica de carga y visualización
- **`song.css`** - Estilos cinemáticos

## Funcionalidades

### ✅ Implementadas
- [x] Carga de himnos desde JSON
- [x] Visualización con formato verso/coro
- [x] Fondos aleatorios de naturaleza
- [x] Búsqueda por número de himno
- [x] Comando de voz

## Comandos de Voz

```
"Himno 1"
"Himno número 1"
```

## Estructura de Datos

```json
{
  "number": 1,
  "title": "GRACIA PARA VENCER",
  "verses": [
    {
      "type": "verse",
      "number": 1,
      "lines": ["LÍNEA 1", "LÍNEA 2", ...]
    },
    {
      "type": "chorus",
      "lines": ["LÍNEA 1", "LÍNEA 2", ...]
    }
  ]
}
```

## Himnos Disponibles

1. **Gracia Para Vencer** - Himno de fe y perseverancia
