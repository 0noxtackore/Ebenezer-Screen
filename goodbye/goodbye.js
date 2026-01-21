// Escena de despedida web con fondos de montañas y versículos aleatorios.

(function () {
  'use strict';

  const goodbyeForm = document.getElementById('goodbye-container');
  const goodbyeStage = document.getElementById('goodbye-stage');
  const refEl = document.getElementById('goodbye-ref');
  const textEl = document.getElementById('goodbye-text');

  if (!goodbyeForm || !goodbyeStage || !refEl || !textEl) {
    console.warn("Faltan elementos de goodbye. Check IDs in index.html");
    return;
  }

  // Fondos de montañas
  // Fondos de despedida (Atardeceres y montañas seleccionados)
  const MOUNTAIN_BACKGROUNDS = [
    'https://wallpapers.com/images/hd/red-sunset-sky-above-quiet-ocean-1xkm6xs57shfvvd2.jpg', // Atardecer montaña (Clásico)
    'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_640.jpg', // Cielo púrpura
    'https://img.freepik.com/foto-gratis/hermosa-toma-puesta-sol-orilla-mar-barco-medio_181624-443.jpg?semt=ais_hybrid&w=740&q=80', // Noche despejada
    'https://img.freepik.com/fotos-premium/vista-panoramica-mar-contra-cielo-dramatico-puesta-sol_1048944-12255833.jpg?semt=ais_hybrid&w=740&q=80',  // Nubes místicas
    'https://p4.wallpaperbetter.com/wallpaper/966/423/594/tranquil-scenery-wallpaper-preview.jpg', // Amanecer místico entre nubes
    'https://wallpapers.com/images/hd/quiet-enchanted-forest-6sk40qqvtlt496ub.jpg', // Horizonte despejado dorado
  ];

  // Versículos de despedida (ejemplos)
  const GOODBYE_VERSES = [
    {
      ref: 'NÚMEROS 6:24-26',
      text: 'JEHOVÁ TE BENDIGA, Y TE GUARDE; JEHOVÁ HAGA RESPLANDECER SU ROSTRO SOBRE TI, Y TENGA DE TI MISERICORDIA; JEHOVÁ ALCE SOBRE TI SU ROSTRO, Y PONGA EN TI PAZ.'
    },
    {
      ref: 'HECHOS 20:32',
      text: 'Y AHORA, HERMANOS, OS ENCOMIENDO A DIOS, Y A LA PALABRA DE SU GRACIA, QUE TIENE PODER PARA SOBREEDIFICAROS.'
    },
    {
      ref: '2 CORINTIOS 13:11',
      text: 'POR LO DEMÁS, HERMANOS, Tened gozo, perfeccionaos, consolaos, sed de un mismo sentir, y vivid en paz; Y EL DIOS DE AMOR Y DE PAZ ESTARÁ CON VOSOTROS.'
    },
    {
      ref: 'ROMANOS 15:33',
      text: 'Y EL DIOS DE PAZ SEA CON TODOS VOSOTROS. AMÉN.'
    },
    {
      ref: 'JUDAS 1:21',
      text: 'CONSERVAOS EN EL AMOR DE DIOS, ESPERANDO LA MISERICORDIA DE NUESTRO SEÑOR JESUCRISTO PARA VIDA ETERNA.'
    }
  ];

  function pickRandom(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  }

  function showRandomGoodbyeScene() {
    const bg = pickRandom(MOUNTAIN_BACKGROUNDS);
    if (bg) {
      const bgEl = document.getElementById('bg-layer-goodbye');
      if (bgEl) bgEl.style.backgroundImage = `url('${bg}')`;
    }

    const verse = pickRandom(GOODBYE_VERSES);
    if (verse) {
      refEl.textContent = verse.ref;
      textEl.textContent = `"${verse.text || ''}"`;
    }
  }

  function showOnlyGoodbyeForm() {
    const restForm = document.getElementById('rest-container');
    const voiceForm = document.getElementById('voice-container');
    const bibleForm = document.getElementById('bible-container');
    const hymnsForm = document.getElementById('hymns-container');
    const msgsForm = document.getElementById('messages-container');
    const bgLayer = document.getElementById('bg-layer');

    if (restForm) restForm.classList.add('form-hidden');
    if (voiceForm) voiceForm.classList.add('form-hidden');
    if (bibleForm) bibleForm.classList.add('form-hidden');
    if (hymnsForm) hymnsForm.classList.add('form-hidden');
    if (msgsForm) msgsForm.classList.add('form-hidden');
    if (bgLayer) bgLayer.classList.add('form-hidden');
    document.getElementById('overlay')?.classList.add('form-hidden');

    goodbyeForm.classList.remove('form-hidden');
  }

  let goodbyeTimer = null;

  function resetToRest() {
    // Restaurar vista de reposo
    const restForm = document.getElementById('rest-container');
    const bgLayer = document.getElementById('bg-layer');

    // Ocultar despedida
    goodbyeForm.classList.add('form-hidden');

    // Mostrar reposo
    if (restForm) restForm.classList.remove('form-hidden');
    if (bgLayer) bgLayer.classList.remove('form-hidden');
    document.getElementById('overlay')?.classList.remove('form-hidden');

    console.log("Tiempo de despedida finalizado. Volviendo a Rest.");
  }

  // Función global que speak.js puede invocar cuando detecte la frase de despedida
  window.triggerGoodbyeFromSpeech = function () {
    showRandomGoodbyeScene();
    showOnlyGoodbyeForm();

    // Reiniciar temporizador si se vuelve a invocar
    if (goodbyeTimer) {
      clearTimeout(goodbyeTimer);
    }

    // 2 minutos (120,000 ms) para volver a Rest
    goodbyeTimer = setTimeout(resetToRest, 120000);
  };

  // Función global para activar la despedida desde el menú (sin depender de voz)
  window.showGoodbyeFromMenu = function () {
    showRandomGoodbyeScene();
    showOnlyGoodbyeForm();
  };

})();
