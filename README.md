# Ebenezer - Sistema de Voz Interactivo 🦅

**"Hasta aquí nos ayudó Jehová"** - 1 Samuel 7:12

Ebenezer es un sistema de interfaz de voz interactivo diseñado para acceder a contenido espiritual mediante comandos de voz en español. El sistema integra la Biblia Reina Valera 1960, mensajes del profeta William Branham, himnos, oraciones y más.

## 🚀 Inicio Rápido

```bash
python ebenezer.py
```

El sistema abrirá automáticamente tu navegador en `http://localhost:8000` y activará:
- **Servidor Web** (Puerto 8000)
- **Servidor de Voz** (Puerto 2700)
- **Puente de Mensajes** (Puerto 2800)

## 📦 Instalación Completa

Para configurar Ebenezer por primera vez:

```bash
python setup.py
```

Este script automatizado:
1. ✅ Instala todas las dependencias de Python
2. ✅ **Descarga automáticamente el modelo de voz Vosk** (~40 MB)
3. ✅ Genera el índice de 416 sermones
4. ✅ Descarga la biblioteca completa de mensajes

> [!NOTE]
> El modelo de voz se descarga automáticamente. Si falla, puedes descargarlo manualmente:
> - Descarga: [vosk-model-small-es-0.42](https://alphacephei.com/vosk/models)
> - Extrae en: `speaker/model/`

## 📁 Estructura del Proyecto

```
Ebenezer/
├── bible/          # Módulo de la Biblia RV1960
├── messages/       # Biblioteca de mensajes (416+ sermones)
├── hymns/          # Himnos y canciones
├── prayer/         # Sección de oración
├── goodbye/        # Pantalla de despedida
├── rest/           # Vista de descanso
├── speaker/        # Motor de reconocimiento de voz (Vosk)
├── img/            # Recursos visuales
├── ebenezer.py     # Servidor unificado (TODO-EN-UNO)
├── index.html      # Interfaz principal
└── start.bat       # Script de inicio alternativo
```

## 🎤 Comandos de Voz

### Biblia
- `"Génesis capítulo 1"`
- `"Juan capítulo 3 versículo 16"`
- `"Apocalipsis capítulo 1"`

### Mensajes
- `"Mensaje La Señal"`
- `"Mensaje Fe Es La Sustancia párrafo 50"`

### Navegación
- `"Cerrar Biblia"`
- `"Adiós"` / `"Hasta luego"`
- `"Descanso"`

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Python 3.x
  - `vosk` - Reconocimiento de voz offline
  - `websockets` - Comunicación en tiempo real
  - `requests` - Integración con APIs externas
- **APIs**: table.branham.org (Mensajes del profeta)

## 📚 Características

### ✅ Implementadas
- [x] Búsqueda de versículos bíblicos por voz
- [x] Modo "Karaoke" con seguimiento de lectura
- [x] Biblioteca local de 416+ mensajes en español
- [x] Búsqueda difusa tolerante a errores
- [x] Interfaz cinemática con fondos dinámicos
- [x] Sistema unificado de un solo comando

### 🔄 En Desarrollo
- [ ] Expansión de la biblioteca de mensajes
- [ ] Integración de himnos con letra sincronizada
- [ ] Modo de oración guiada

## 📖 Documentación Detallada

Cada carpeta contiene su propio `README.md` con información específica:
- [Bible Module](./bible/README.md)
- [Messages Module](./messages/README.md)
- [Speaker Module](./speaker/README.md)

## 🤝 Contribuciones

Este es un proyecto personal de adoración. Si deseas contribuir o reportar problemas, contacta al desarrollador.

## 📄 Licencia

Proyecto de código abierto para uso personal y ministerial.

---

*"Y Samuel tomó una piedra y la puso entre Mizpa y Sen, y le puso por nombre Eben-ezer, diciendo: Hasta aquí nos ayudó Jehová."* - 1 Samuel 7:12
# Ebenezer-Screen
