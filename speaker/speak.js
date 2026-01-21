(function () {
    'use strict';

    // Configuración
    const RECONNECT_DELAY = 10000;

    // Referencias DOM
    const voiceForm = document.getElementById('voice-container');
    const subtitlesEl = document.getElementById('voice-subtitles');
    const mainBgLayer = document.getElementById('bg-layer');
    const restForm = document.getElementById('rest-container');
    const voiceBgSwitch = document.getElementById('voice-bg-switch');

    let hasSpoken = false;
    let recognitionNative = null;
    let voiceActive = false;

    // --- PALABRAS SANTAS ---
    const HOLY_WORDS = [
        "DIOS", "JESÚS", "JESUS", "ESPÍRITU", "ESPIRITU", "SANTO", "BIBLIA", "FE", "GRACIA", "AMOR",
        "ESPERANZA", "SALVACIÓN", "SALVACION", "CRUZ", "ALELUYA", "AMÉN", "AMEN", "GLORIA",
        "MISERICORDIA", "REDENCIÓN", "REDENCION", "ORACIÓN", "ORACION", "PAZ", "LUZ", "VIDA",
        "EVANGELIO", "DISCÍCULO", "DISCIPULO", "IGLESIA", "COMUNIÓN", "COMUNION", "SANTIDAD",
        "PERDÓN", "PERDON", "RESURRECCIÓN", "RESURRECCION", "REINO", "CIELO", "ETERNIDAD",
        "ADORACIÓN", "ADORACION", "ALABANZA", "BENDICIÓN", "BENDICION", "PROFETA", "APÓSTOL",
        "APOSTOL", "PASTOR", "SIERVO", "TESTIMONIO", "BAUTISMO", "SANGRE", "CORDERO", "SACRIFICIO",
        "LIBERTAD", "JUSTIFICACIÓN", "JUSTIFICACION", "SANTIFICACIÓN", "SANTIFICACION", "PROMESA",
        "MILAGRO", "DISCERNIMIENTO", "OBEDIENCIA", "FIDELIDAD", "CONSUELO", "FORTALEZA", "GOZO",
        "MAJESTAD", "OMNIPOTENTE", "OMNISCIENTE", "OMNIPRESENTE", "TRINIDAD", "PADRE", "HIJO",
        "CREACIÓN", "CREACION", "PECADO", "ARREPENTIMIENTO", "CONVERSIÓN", "CONVERSION", "CONFIANZA",
        "JUSTICIA", "BONDAD", "HUMILDAD", "DISCIPLINA", "PERSEVERANCIA", "SANTUARIO", "ALTAR",
        "SACERDOTE", "PROFECÍA", "PROFECIA", "REVELACIÓN", "REVELACION", "PALABRA", "VERDAD",
        "CAMINO", "PAN", "AGUA", "REBAÑO", "PODER", "AUTORIDAD", "PROMESA", "ALEGRÍA", "ALEGRIA",
        "AMISTAD", "HERMANDAD"
    ];

    function showInfoMessage(msg, isPermanent = false) {
        if (!subtitlesEl) return;
        subtitlesEl.textContent = msg;
        subtitlesEl.classList.add('voice-subtitles--info');
        if (!isPermanent) {
            setTimeout(() => {
                if (subtitlesEl.textContent === msg) {
                    subtitlesEl.textContent = '';
                    subtitlesEl.classList.remove('voice-subtitles--info');
                }
            }, 3000);
        }
    }

    function formatAndShowTranscript(text, isFinal) {
        if (!subtitlesEl) return;
        subtitlesEl.classList.remove('voice-subtitles--info');

        // En pantallas grandes (1920x1080+), limitar la cantidad de palabras visibles
        // para que el texto gigante no salga del contenedor.
        if (window.innerWidth >= 1920) {
            const rawWords = text.split(/\s+/).filter(w => w.length > 0);
            const MAX_WORDS = 40; // últimas N palabras visibles
            if (rawWords.length > MAX_WORDS) {
                text = rawWords.slice(rawWords.length - MAX_WORDS).join(' ');
            }
        }

        const words = text.split(/(\s+)/);

        const html = words.map(w => {
            if (!w.trim()) return w;

            const upper = w.toUpperCase().replace(/[.,;!?]/g, '');
            let classes = [];

            // Palabras santas siempre con su estilo especial
            if (HOLY_WORDS.includes(upper)) {
                return `<span class="voice-holy">${w}</span>`;
            }

            // Algunas palabras normales se pintan con colores suaves aleatorios SOLO en resultados finales
            if (isFinal) {
                const rnd = Math.random();
                if (rnd < 0.45) { // ~45% de las palabras finales
                    const variant = Math.floor(Math.random() * 3) + 1; // 1,2,3
                    classes.push(`voice-random-${variant}`);
                }
            }

            if (classes.length > 0) {
                return `<span class="${classes.join(' ')}">${w}</span>`;
            }

            return w;
        }).join('');

        subtitlesEl.innerHTML = html;
    }

    function handleTranscript(text, isFinal) {
        if (!text) return;

        let displayText = text;
        // Solo mostramos el texto formateado; no disparamos comandos ni karaoke.
        formatAndShowTranscript(displayText, isFinal);
    }

    function startNativeRecognition() {
        if (!voiceActive) return;
        if (!('webkitSpeechRecognition' in window)) {
            showInfoMessage("Tu navegador no soporta reconocimiento de voz.", true);
            return;
        }

        recognitionNative = new webkitSpeechRecognition();
        recognitionNative.continuous = true;
        recognitionNative.interimResults = true;
        recognitionNative.lang = 'es-ES';

        recognitionNative.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    handleTranscript(event.results[i][0].transcript, true);
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            if (interim) {
                handleTranscript(interim, false);
            }
        };

        recognitionNative.onend = () => {
            // Solo reintentar si la vista de voz sigue activa
            if (voiceActive) {
                try { recognitionNative.start(); } catch (e) { }
            }
        };

        recognitionNative.onerror = (e) => {
            if (e.error !== 'no-speech') console.warn("Native Error:", e.error);
        };

        try { recognitionNative.start(); } catch (e) { }
    }

    function startVoiceRecognition() {
        if (voiceActive) return;
        voiceActive = true;
        startNativeRecognition();
    }

    function stopVoiceRecognition() {
        voiceActive = false;

        if (recognitionNative) {
            try {
                recognitionNative.onresult = null;
                recognitionNative.onend = null;
                recognitionNative.onerror = null;
                recognitionNative.stop();
            } catch (e) { }
            recognitionNative = null;
        }
    }

    // Exponer control público para navegación
    window.startVoiceRecognition = startVoiceRecognition;
    window.stopVoiceRecognition = stopVoiceRecognition;

    // Fondos clásicos y nuevos para el módulo de voz
    const VOICE_BACKGROUNDS_CLASSIC = [
        'https://images.pexels.com/photos/1102915/pexels-photo-1102915.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=1440&q=60',
        'https://alohacamp.com/es/travels/wp-content/uploads/2024/09/montanas-de-espana-ZW.webp',
        'https://images.pexels.com/photos/1363876/pexels-photo-1363876.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=1440&q=60',
        'https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=1440&q=60',
        'https://content.nationalgeographic.com.es/medio/2025/01/18/himalaya_68c32f8b_250118135441_1280x720.webp',
        'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=1440&q=60'
    ];

    const VOICE_BACKGROUNDS_NEW = [
        "https://i.ibb.co/MX3Vq2g/Gemini-Generated-Image-qsg1zhqsg1zhqsg1.png",
        "https://i.ibb.co/qF4b1nkV/Gemini-Generated-Image-afcv43afcv43afcv.png",
        "https://i.ibb.co/vv6zzBYX/Gemini-Generated-Image-eekcl8eekcl8eekc.png"
    ];

    let useNewVoiceBackgrounds = false;

    function setRandomNatureBackground() {
        const bgVoice = document.getElementById('bg-layer-voice');
        if (!bgVoice) return;

        // Solo cargar/cambiar fondo cuando la vista de voz está realmente visible
        if (!voiceForm || voiceForm.classList.contains('form-hidden')) {
            return;
        }

        const sourceArray = useNewVoiceBackgrounds ? VOICE_BACKGROUNDS_NEW : VOICE_BACKGROUNDS_CLASSIC;
        const random = sourceArray[Math.floor(Math.random() * sourceArray.length)];
        bgVoice.style.backgroundImage = `url('${random}')`;
    }

    // Inicializar estado del switch y listener
    if (voiceBgSwitch) {
        voiceBgSwitch.addEventListener('click', () => {
            useNewVoiceBackgrounds = !useNewVoiceBackgrounds;
            voiceBgSwitch.classList.toggle('voice-bg-switch--on', useNewVoiceBackgrounds);
            setRandomNatureBackground();
        });
    }

    // Atajo de teclado: tecla "z" alterna el modo predicador (fondos de voz)
    window.addEventListener('keydown', (e) => {
        // Solo responder a la letra z/z sin modificadores
        if (e.key !== 'z' && e.key !== 'Z') return;
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

        // Asegurar que la vista de voz esté activa
        if (!voiceForm || voiceForm.classList.contains('form-hidden')) return;

        if (!voiceBgSwitch) return;

        e.preventDefault();
        voiceBgSwitch.click();
    });

    // Se llamará a setRandomNatureBackground solo cuando la vista de voz esté activa
    setRandomNatureBackground();

})();