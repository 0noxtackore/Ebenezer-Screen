# Bible Module 📖

Módulo de la Biblia Reina Valera 1960 con búsqueda por voz y modo de lectura interactivo.

## Archivos Principales

- **`bible.json`** - Base de datos completa de la Biblia RV1960 (66 libros, 1,189 capítulos, 31,102 versículos)
- **`bible.js`** - Lógica de búsqueda, navegación y modo karaoke
- **`bible.css`** - Estilos cinemáticos para la interfaz
- **`matcher.py`** - Motor de detección de referencias bíblicas en texto hablado

## Funcionalidades

### Búsqueda por Voz
- Reconoce nombres de libros con fuzzy matching (tolerante a errores)
- Soporta abreviaciones y aliases (ej: "Génesis" = "Gen" = "Gn")
- Búsqueda por capítulo completo o versículos específicos

### Modo Karaoke
- Resalta palabras en tiempo real mientras lees
- Avance automático de versículos
- Scroll automático para mantener el versículo activo visible

### Navegación
- Salto directo a versículos específicos por voz
- Búsqueda de contenido dentro del capítulo actual

## Comandos de Voz

```
"Génesis capítulo 1"
"Juan 3:16"
"Apocalipsis capítulo 1 versículo 1"
"Versículo 10"
"Cerrar Biblia"
```

## Estructura de Datos

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

## Estilos Visuales

- Fondo cinemático con vignette radial
- Texto negro sobre fondo claro (estilo "tinta impresa")
- Resaltado amarillo ámbar para palabras activas
- Scrollbar personalizado minimalista
