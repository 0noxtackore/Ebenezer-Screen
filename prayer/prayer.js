(function () {
    'use strict';

    const prayerForm = document.getElementById('prayer-container');
    const prayerStage = document.getElementById('prayer-stage');
    const refEl = document.getElementById('prayer-ref');
    const textEl = document.getElementById('prayer-text');

    const PRAYER_BACKGROUNDS = [
        'https://wallpapers.com/images/hd/praying-2778-x-2336-background-ik5ka8ubq8c1fxcj.jpg',
        'https://www.uckg.org/es/wp-content/uploads/2015/01/ayuno-de-daniel.jpg',
        'https://t3.ftcdn.net/jpg/07/08/96/18/360_F_708961853_Wz6z791evkm31nm2MtOwdAIXzJzBbaHM.jpg',
        'https://noticias-mx.laiglesiadejesucristo.org/media/960x540/iglesia_catolica_ayuno_orar_viernes_santo_pandemia_coronavirus_covid-19.jpg',
        'https://files.adventistas.org/noticias/es/2024/07/11162203/Diseno-sin-titulo-8.jpg',
        'https://e0.pxfuel.com/wallpapers/971/260/desktop-wallpaper-prayer.jpg',
        'https://e1.pxfuel.com/desktop-wallpaper/894/657/desktop-wallpaper-prayers-pray.jpg',
        'https://img.freepik.com/fotos-premium/mano-persona-oracion-fondo-negro-mujer-catolica-cristiana-esta-rezando-dios-oscuridad_2379-2800.jpg'
    ];

    const PRAYER_VERSES = [
        {
            ref: 'FILIPENSES 4:6-7',
            text: 'POR NADA ESTÉIS AFANOSOS, SINO SEAN CONOCIDAS VUESTRAS PETICIONES DELANTE DE DIOS EN TODA ORACIÓN Y RUEGO, CON ACCIÓN DE GRACIAS.'
        },
        {
            ref: '1 TESALONICENSES 5:17',
            text: 'ORAD SIN CESAR.'
        },
        {
            ref: 'MATEO 6:6',
            text: 'MAS TÚ, CUANDO ORES, ENTRA EN TU APOSENTO, Y CERRADA LA PUERTA, ORA A TU PADRE QUE ESTÁ EN SECRETO.'
        },
        {
            ref: 'JEREMÍAS 33:3',
            text: 'CLAMA A MÍ, Y YO TE RESPONDERÉ, Y TE ENSEÑARÉ COSAS GRANDES Y OCULTAS QUE TÚ NO CONOCES.'
        },
        {
            ref: 'SANTIAGO 5:16',
            text: 'LA ORACIÓN EFICAZ DEL JUSTO PUEDE MUCHO.'
        }
    ];

    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function showPrayerScene() {
        const bg = pickRandom(PRAYER_BACKGROUNDS);
        const bgEl = document.getElementById('bg-layer-prayer');
        if (bgEl) bgEl.style.backgroundImage = `url('${bg}')`;

        const verse = pickRandom(PRAYER_VERSES);
        if (verse) {
            if (refEl) refEl.textContent = verse.ref;
            if (textEl) textEl.textContent = `"${verse.text}"`;
        }
    }

    window.showPrayerScene = showPrayerScene;

    let prayerTimer = null;

    function resetToRest() {
        if (prayerForm) prayerForm.classList.add('form-hidden');
        document.getElementById('rest-container')?.classList.remove('form-hidden');
        document.getElementById('bg-layer')?.classList.remove('form-hidden');
        document.getElementById('overlay')?.classList.remove('form-hidden');
        console.log("[PRAYER] Tiempo finalizado. Volviendo a Rest.");
    }

    window.triggerPrayerFromSpeech = function () {
        console.log("[PRAYER] Iniciando momento de oración...");

        // Ocultar TODO lo demás
        const containers = [
            'rest-container', 'voice-container', 'bible-container',
            'hymns-container', 'messages-container', 'goodbye-container', 'bg-layer', 'overlay'
        ];
        containers.forEach(id => document.getElementById(id)?.classList.add('form-hidden'));

        showPrayerScene();
        if (prayerForm) prayerForm.classList.remove('form-hidden');

        if (prayerTimer) clearTimeout(prayerTimer);
        // 3 minutos para el momento de oración
        prayerTimer = setTimeout(resetToRest, 180000);
    };

    window.closePrayerFromSpeech = function (transcript) {
        if (!prayerForm || prayerForm.classList.contains('form-hidden')) return false;

        const norm = transcript.trim().toUpperCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[.,;:/!¡?¿()"]/g, '');

        if (norm.includes("AMEN")) {
            console.log("[PRAYER] Cerrando por comando 'Amen'");
            if (prayerTimer) clearTimeout(prayerTimer);
            resetToRest();
            return true;
        }
        return false;
    };

})();
