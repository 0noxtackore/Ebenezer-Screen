// Fondos aleatorios para himnos
const HYMN_BACKGROUNDS = [
  "https://www.shutterstock.com/image-photo/breathtaking-summer-day-wild-mountains-600nw-2499073105.jpg",
  "https://thumbs.dreamstime.com/b/claro-en-el-bosque-la-ma%C3%B1ana-de-primavera-fondo-naturaleza-117325739.jpg",
  "https://cdn.pixabay.com/photo/2019/09/28/14/51/forest-4510963_1280.jpg",
  "https://img.freepik.com/foto-gratis/colores-otono-hojas-color-amarillo-dorado-marron-cubren-suelo-debajo-arboles_181624-31091.jpg?semt=ais_hybrid&w=740&q=80",
  "https://img.freepik.com/foto-gratis/hermoso-paisaje-montanas-carpatos-ucranianos-cielo-nublado_176420-7166.jpg?semt=ais_hybrid&w=740&q=80",
  "https://st4.depositphotos.com/3835425/30122/i/450/depositphotos_301226934-stock-photo-amazing-nature-background-wallpaper.jpg",
  "https://wallpaper.forfun.com/fetch/f6/f6e136fe1ed4adba9ee831f47b2ac5d1.jpeg",
  "https://www.xtrafondos.com/wallpapers/montana-en-la-naturaleza-canada-10154.jpg",
  "https://www.xtrafondos.com/wallpapers/paisaje-de-montanas-en-bosque-con-rio-6094.jpg",
  "https://img2.wallspic.com/crops/1/0/1/7/7/177101/177101-montana-paisaje_natural-la_gente_en_la_naturaleza-la_superficie_de_la_carretera-pendiente-3840x2400.jpg",
  "https://media.istockphoto.com/id/1696167872/es/foto/vista-a%C3%A9rea-del-bosque-al-atardecer-en-el-fondo-de-las-monta%C3%B1as-en-los-dolomitas.jpg?s=612x612&w=0&k=20&c=SPOFpagbKrLl6iIZxvt_i8dqAe5ymDoRt-P7HPk0jFk=",
  "https://wallpapers.com/images/featured/montanas-al-atardecer-oly4p350y8tjfw8a.jpg",
  "https://m.media-amazon.com/images/I/61kLu30STQL._AC_UF894,1000_QL80_.jpg",
  "https://static.vecteezy.com/system/resources/thumbnails/037/384/282/small/ai-generated-christian-cross-on-mountaintop-at-sunset-photo.jpg",
  "https://media.istockphoto.com/id/1447608173/es/foto/cruz-de-madera-cristiana-sobre-el-fondo-del-atardecer.jpg?s=612x612&w=0&k=20&c=dJFxBFd7mvmLmIyhPhY6pfZj5QKAXxXbZLR1M53_Gl0=",
  "https://img.freepik.com/free-vector/watercolor-good-friday-illustration_23-2149317015.jpg?semt=ais_hybrid&w=740&q=80",
  "https://www.pixelstalk.net/wp-content/uploads/images6/Jesus-Desktop-Wallpaper.jpg",
  "https://t4.ftcdn.net/jpg/10/13/74/19/360_F_1013741929_7gov5J5CoaEmAUfa4QxWXoJ9dh5hVIdi.jpg",
  "https://t3.ftcdn.net/jpg/02/11/12/28/360_F_211122852_GHnBXHNb8LHy7yUSGTN4SsSgbOVi48eB.jpg",
  "https://t4.ftcdn.net/jpg/09/20/37/05/360_F_920370579_H8nSfLJv0x0h0ZaxbewZ8NeG2Acb3y1P.jpg",
];

let hymnalData = [];
let currentHymn = null;
let allHymnWords = [];
let hymnWordMap = new Map();
let currentWordIndex = 0;
let currentHymnSections = [];
let currentHymnSectionIndex = 0;
let hymnSectionIndexByKey = {};

const hymnSuggestionsPanel = document.getElementById("hymn-suggestions-panel");
const hymnSuggestionsList = document.getElementById("hymn-suggestions-list");
const hymnTabsEl = document.getElementById("hymn-tabs");

let HYMN_TABS = [];
let currentHymnTabId = null;

// Intenta extraer el número de himno desde entradas tipo "1", "H1", "H-1" o "1 - TÍTULO" o solo título.
function resolveHymnNumberFromInput(raw) {
  if (!raw) return null;
  const trimmed = raw.trim();

  // 1) Si empieza con H/h y luego número opcionalmente con guion: H1, H-1
  const hMatch = trimmed.match(/^H-?(\d+)$/i);
  if (hMatch) {
    const num = parseInt(hMatch[1], 10);
    return isNaN(num) ? null : num;
  }

  // 2) Si empieza por número (ej: "1" o "1 - TÍTULO")
  const leadingNumMatch = trimmed.match(/^(\d+)/);
  if (leadingNumMatch) {
    const num = parseInt(leadingNumMatch[1], 10);
    return isNaN(num) ? null : num;
  }

  // 3) Buscar por título aproximado en hymnalData
  const normInput = normalizeText(trimmed);
  if (!normInput || !Array.isArray(hymnalData) || hymnalData.length === 0) return null;

  // Búsqueda exacta por título normalizado
  for (const h of hymnalData) {
    if (!h || !h.title) continue;
    if (normalizeText(h.title) === normInput) return h.number;
  }

  // Búsqueda por inclusión parcial
  const candidates = hymnalData.filter(h => h && h.title && normalizeText(h.title).includes(normInput));
  if (candidates.length === 1) return candidates[0].number;

  return null;
}

// Conversión sencilla de números arábigos a romanos
function toRoman(num) {
  num = parseInt(num, 10);
  if (!num || num <= 0) return '';
  const romans = [
    { value: 1000, symbol: 'M' }, { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' }, { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' }, { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' }, { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' }, { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' }, { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];
  let result = '';
  for (const r of romans) {
    while (num >= r.value) {
      result += r.symbol;
      num -= r.value;
    }
  }
  return result;
}

// Conversión inversa de números romanos a arábigos (para mapear etiquetas de estrofas)
function romanToInt(roman) {
  if (!roman || typeof roman !== 'string') return null;
  const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  const s = roman.toUpperCase().trim();
  let total = 0;
  let prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const value = map[s[i]] || 0;
    if (value < prev) {
      total -= value;
    } else {
      total += value;
      prev = value;
    }
  }
  return total > 0 ? total : null;
}

// Normalización de texto para coincidencias
function normalizeText(text) {
  return text
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "");
}

// Fondo aleatorio sin repetición inmediata
function setRandomHymnBackground() {
  const bgLayer = document.getElementById("bg-layer-hymns");
  if (!bgLayer || HYMN_BACKGROUNDS.length === 0) return;
  let lastBg = bgLayer.dataset.lastBg || null;
  let random;
  do {
    random = HYMN_BACKGROUNDS[Math.floor(Math.random() * HYMN_BACKGROUNDS.length)];
  } while (HYMN_BACKGROUNDS.length > 1 && random === lastBg);
  bgLayer.style.backgroundImage = `url('${random}')`;
  bgLayer.dataset.lastBg = random;
}

window.setRandomHymnBackground = setRandomHymnBackground;

// Cargar himnario
async function loadHymnal() {
  try {
    const resp = await fetch('hymns/hymnal.json');
    if (resp.ok) {
      hymnalData = await resp.json();
      console.log(`Himnario cargado: ${hymnalData.length} himnos.`);
      // Las sugerencias se mostrarán en un panel personalizado (no datalist)
    }
  } catch (e) {
    console.error("Error cargando himnario:", e);
  }
}
loadHymnal();

const hymnsContainer = document.getElementById("hymns-container");
const hymnTitleEl = document.getElementById("hymn-title");
const hymnLyricsEl = document.getElementById("hymn-lyrics");
let hymnCarouselPrevBtn = null;
let hymnCarouselNextBtn = null;
let hymnShortcutInput = null;

// Mostrar himno
function showHymn(number) {
  if (!hymnsContainer || !hymnTitleEl || !hymnLyricsEl) return;
  const hymn = hymnalData.find(h => h.number === parseInt(number));
  if (!hymn) {
    hymnLyricsEl.innerHTML = `<p>Himno no encontrado: ${number}</p>`;
    return;
  }

  currentHymn = hymn;
  allHymnWords = [];
  hymnWordMap.clear();
  currentWordIndex = 0;
  hymnSectionIndexByKey = {};
  setRandomHymnBackground();

  hymnTitleEl.innerText = `No.${hymn.number} - ${hymn.title}`;
  hymnLyricsEl.innerHTML = "";

  // Contenedor interno para separar el texto de las flechas del carrusel
  const hymnLyricsContent = document.createElement("div");
  hymnLyricsContent.id = "hymn-lyrics-content";
  hymnLyricsContent.className = "hymn-lyrics-content";
  hymnLyricsEl.appendChild(hymnLyricsContent);

  // Primera "diapositiva" del carrusel: el título del himno
  if (hymnTitleEl) {
    hymnLyricsContent.appendChild(hymnTitleEl);
  }

  currentHymnSections = [];
  currentHymnSectionIndex = 0;
  if (hymnTitleEl) {
    currentHymnSections.push(hymnTitleEl);
  }

  // Construir todas las secciones (estrofas y coro) y recolectar metadatos
  const sectionsMeta = [];

  hymn.verses.forEach((section, sectionIdx) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "hymn-section";

    if (section.type === "chorus") {
      const chorusLabel = document.createElement("div");
      chorusLabel.className = "hymn-chorus-label";
      chorusLabel.innerText = "CORO";
      sectionDiv.appendChild(chorusLabel);
    } else if (section.type === "verse" && section.number) {
      const verseLabel = document.createElement("div");
      verseLabel.className = "hymn-verse-label";
      verseLabel.innerText = toRoman(section.number);
      sectionDiv.appendChild(verseLabel);
    }

    // Construir la estrofa/coro como un solo párrafo corrido
    const lineDiv = document.createElement("div");
    lineDiv.className = "hymn-line";

    section.lines.forEach((line, lineIdx) => {
      const words = line.split(/(\s+)/);
      words.forEach((word, wordIdx) => {
        if (!word.trim()) {
          lineDiv.appendChild(document.createTextNode(word));
        } else {
          const span = document.createElement("span");
          span.className = "hymn-word";
          span.textContent = word;
          const norm = normalizeText(word);
          span.dataset.normalized = norm;
          lineDiv.appendChild(span);
          allHymnWords.push({ element: span, normalized: norm });
          hymnWordMap.set(norm, { element: span, normalized: norm });
        }
      });

      // Añadir un espacio entre líneas para que quede como texto corrido
      lineDiv.appendChild(document.createTextNode(" "));
    });

    sectionDiv.appendChild(lineDiv);

    hymnLyricsContent.appendChild(sectionDiv);

    sectionsMeta.push({
      el: sectionDiv,
      type: section.type,
      number: section.number || null
    });
  });

  // Definir el orden de las diapositivas según si hay coro o no, respetando
  // siempre el orden original en hymnal.json.
  const versesMeta = sectionsMeta.filter(s => s.type === "verse");
  const chorusesMeta = sectionsMeta.filter(s => s.type === "chorus");

  const orderedSections = [];

  if (chorusesMeta.length > 0 && versesMeta.length > 0) {
    // Tomar el primer coro definido en el himno como referencia
    const chorusBaseEl = chorusesMeta[0].el;

    // Usar las estrofas en el mismo orden en que vienen en el JSON.
    // Para que el coro aparezca en cada diapositiva correspondiente,
    // clonamos el nodo base y lo añadimos al DOM como sección independiente.
    let slideIndex = (hymnTitleEl ? 1 : 0);
    versesMeta.forEach(v => {
      orderedSections.push(v.el); // Estrofa
      slideIndex += 1;
      if (typeof v.number === 'number' && hymnSectionIndexByKey[`VERSE_${v.number}`] == null) {
        hymnSectionIndexByKey[`VERSE_${v.number}`] = slideIndex;
      }

      const chorusClone = chorusBaseEl.cloneNode(true);
      hymnLyricsContent.appendChild(chorusClone);
      orderedSections.push(chorusClone); // Coro clonado para esta posición
      slideIndex += 1;
      if (hymnSectionIndexByKey['CHORUS'] == null) {
        hymnSectionIndexByKey['CHORUS'] = slideIndex;
      }
    });
  } else {
    // Sin coro (o sin estrofas): usar todas las secciones tal como vienen
    sectionsMeta.forEach(s => orderedSections.push(s.el));
  }

  currentHymnSections = [
    ...(hymnTitleEl ? [hymnTitleEl] : []),
    ...orderedSections
  ];

  if (typeof rebuildHymnSectionIndexMap === 'function') {
    rebuildHymnSectionIndexMap();
  } else if (typeof window !== 'undefined' && typeof window.rebuildHymnSectionIndexMap === 'function') {
    window.rebuildHymnSectionIndexMap();
  }

  updateHymnCarouselView();
  ensureHymnCarouselControls();
  ensureHymnShortcutInput();

  // Asegurar que haya una pestaña asociada a este himno
  openHymnWithTab(hymn.number, hymn.title);
  showOnlyHymnsForm();
  if (hymnsContainer) {
    hymnsContainer.classList.add('hymns-container--results');
  }
}

function updateHymnCarouselView() {
  if (!currentHymnSections || currentHymnSections.length === 0) return;

  // Ocultar todas las secciones del himno (incluyendo coros clonados)
  const content = document.getElementById("hymn-lyrics-content");
  if (content) {
    const allSections = content.querySelectorAll('.hymn-section, #hymn-title');
    allSections.forEach(sec => {
      sec.style.display = 'none';
    });
  }

  // Mostrar solo el elemento correspondiente al índice actual
  currentHymnSections.forEach((sec, idx) => {
    if (!sec) return;
    sec.style.display = idx === currentHymnSectionIndex ? "block" : "none";
  });

  syncHymnShortcutWithCurrentSection();
}

function showPrevHymnSection() {
  if (!currentHymnSections || currentHymnSections.length === 0) return;

  const total = currentHymnSections.length;
  if (total <= 1) return; // Solo título, nada que recorrer

  const firstContentIndex = 1; // índice 0 = título
  const lastContentIndex = total - 1;

  if (currentHymnSectionIndex <= firstContentIndex) {
    // Si estamos en la primera diapositiva de contenido (o antes), saltar al último contenido
    currentHymnSectionIndex = lastContentIndex;
  } else {
    currentHymnSectionIndex -= 1;
  }

  updateHymnCarouselView();
}

function showNextHymnSection() {
  if (!currentHymnSections || currentHymnSections.length === 0) return;

  const total = currentHymnSections.length;
  if (total <= 1) return; // Solo título, nada que recorrer

  const firstContentIndex = 1; // índice 0 = título
  const lastContentIndex = total - 1;

  if (currentHymnSectionIndex < firstContentIndex) {
    // Si estamos en el título, ir a la primera diapositiva de contenido
    currentHymnSectionIndex = firstContentIndex;
  } else if (currentHymnSectionIndex >= lastContentIndex) {
    // Si estamos en el último contenido, volver al primero (bucle)
    currentHymnSectionIndex = firstContentIndex;
  } else {
    currentHymnSectionIndex += 1;
  }

  updateHymnCarouselView();
}

function handleHymnKeydown(event) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

  const hymnsContainer = document.getElementById('hymns-container');
  if (!hymnsContainer || hymnsContainer.classList.contains('form-hidden')) return;

  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

  if (!currentHymnSections || currentHymnSections.length === 0) return;

  event.preventDefault();

  if (event.key === 'ArrowRight') {
    showNextHymnSection();
  } else if (event.key === 'ArrowLeft') {
    showPrevHymnSection();
  }
}

function ensureHymnCarouselControls() {
  if (!hymnLyricsEl) return;
  let controls = document.getElementById("hymn-carousel-controls");
  if (!controls) {
    controls = document.createElement("div");
    controls.id = "hymn-carousel-controls";
    controls.className = "hymn-carousel-controls";

    hymnCarouselPrevBtn = document.createElement("button");
    hymnCarouselPrevBtn.type = "button";
    hymnCarouselPrevBtn.id = "hymn-carousel-prev";
    hymnCarouselPrevBtn.className = "hymn-carousel-button hymn-carousel-button--prev";
    hymnCarouselPrevBtn.textContent = "◀";

    hymnCarouselNextBtn = document.createElement("button");
    hymnCarouselNextBtn.type = "button";
    hymnCarouselNextBtn.id = "hymn-carousel-next";
    hymnCarouselNextBtn.className = "hymn-carousel-button hymn-carousel-button--next";
    hymnCarouselNextBtn.textContent = "▶";

    controls.appendChild(hymnCarouselPrevBtn);
    controls.appendChild(hymnCarouselNextBtn);
    hymnLyricsEl.appendChild(controls);
  }
  // Asegurar que siempre haya manejadores para las flechas
  if (!hymnCarouselPrevBtn) {
    hymnCarouselPrevBtn = document.getElementById("hymn-carousel-prev");
  }
  if (!hymnCarouselNextBtn) {
    hymnCarouselNextBtn = document.getElementById("hymn-carousel-next");
  }

  if (hymnCarouselPrevBtn) {
    hymnCarouselPrevBtn.onclick = showPrevHymnSection;
  }
  if (hymnCarouselNextBtn) {
    hymnCarouselNextBtn.onclick = showNextHymnSection;
  }
}

function jumpToHymnSectionByShortcut(raw) {
  if (!raw) return;
  if (!currentHymnSections || currentHymnSections.length === 0) return;

  const value = raw.trim().toUpperCase();
  let targetIndex = null;

  // Buscar directamente en las diapositivas actuales por etiquetas de verso/coro
  if (value === 'CORO') {
    // Primer slide que tenga etiqueta de coro
    for (let i = 0; i < currentHymnSections.length; i++) {
      const sec = currentHymnSections[i];
      if (!sec) continue;
      const chorusLabel = sec.querySelector?.('.hymn-chorus-label');
      if (chorusLabel) {
        targetIndex = i;
        break;
      }
    }
  } else {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      const roman = toRoman(num);
      for (let i = 0; i < currentHymnSections.length; i++) {
        const sec = currentHymnSections[i];
        if (!sec) continue;
        const verseLabel = sec.querySelector?.('.hymn-verse-label');
        if (!verseLabel) continue;
        const text = (verseLabel.textContent || '').trim().toUpperCase();
        if (text === roman) {
          targetIndex = i;
          break;
        }
      }
    }
  }

  if (targetIndex != null) {
    const total = currentHymnSections.length;
    if (targetIndex >= 0 && targetIndex < total) {
      currentHymnSectionIndex = targetIndex;
      updateHymnCarouselView();
    }
  }
}

function ensureHymnShortcutInput() {
  if (!hymnLyricsEl) return;

  let shortcut = document.getElementById('hymn-shortcut');
  if (!shortcut) {
    shortcut = document.createElement('div');
    shortcut.id = 'hymn-shortcut';
    shortcut.className = 'hymn-shortcut';

    const label = document.createElement('span');
    label.className = 'hymn-shortcut__label';
    label.textContent = 'Ir a estrofa/coro:';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'hymn-shortcut-input';
    input.className = 'hymn-shortcut__input';
    input.placeholder = 'Ej: 1, 2, coro';

    shortcut.appendChild(label);
    shortcut.appendChild(input);
    hymnLyricsEl.appendChild(shortcut);

    hymnShortcutInput = input;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        jumpToHymnSectionByShortcut(input.value);
      }
    });
  } else {
    const existingInput = document.getElementById('hymn-shortcut-input');
    if (existingInput) {
      hymnShortcutInput = existingInput;
    }
  }
}

function syncHymnShortcutWithCurrentSection() {
  if (!hymnShortcutInput) {
    const existingInput = document.getElementById('hymn-shortcut-input');
    if (existingInput) hymnShortcutInput = existingInput;
  }

  if (!hymnShortcutInput) return;
  if (!currentHymnSections || currentHymnSections.length === 0) return;

  const sec = currentHymnSections[currentHymnSectionIndex];
  if (!sec) {
    hymnShortcutInput.value = '';
    return;
  }

  const chorusLabel = sec.querySelector?.('.hymn-chorus-label');
  if (chorusLabel) {
    hymnShortcutInput.value = 'coro';
    return;
  }

  const verseLabel = sec.querySelector?.('.hymn-verse-label');
  if (verseLabel) {
    const roman = (verseLabel.textContent || '').trim().toUpperCase();
    const num = romanToInt(roman);
    hymnShortcutInput.value = num ? String(num) : '';
  } else {
    hymnShortcutInput.value = '';
  }
}

function renderHymnTabs() {
  if (!hymnTabsEl) return;
  hymnTabsEl.innerHTML = "";

  HYMN_TABS.forEach(tab => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bible-tab" + (tab.id === currentHymnTabId ? " bible-tab--active" : "");
    btn.dataset.tabId = String(tab.id);

    const spanTitle = document.createElement("span");
    spanTitle.className = "bible-tab__title";
    if (tab.label === "Nueva pestaña") {
      const ns = "http://www.w3.org/2000/svg";
      const icon = document.createElementNS(ns, "svg");
      icon.setAttribute("class", "bible-tab__icon");
      icon.setAttribute("viewBox", "0 0 16 16");
      icon.setAttribute("aria-hidden", "true");

      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", "M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783");

      icon.appendChild(path);

      spanTitle.appendChild(icon);
      spanTitle.appendChild(document.createTextNode(" " + tab.label));
    } else {
      spanTitle.textContent = tab.label;
    }

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "bible-tab__close";
    closeBtn.textContent = "×";
    closeBtn.dataset.closeTabId = String(tab.id);

    btn.appendChild(spanTitle);
    btn.appendChild(closeBtn);
    hymnTabsEl.appendChild(btn);
  });

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "bible-tab-add";
  addBtn.textContent = "+";
  addBtn.dataset.addTab = "true";
  hymnTabsEl.appendChild(addBtn);
}

function getHymnKey(number) {
  return `Himno ${number}`;
}

function openHymnWithTab(number, title) {
  const key = getHymnKey(number);
  let tab = HYMN_TABS.find(t => t.key === key);
  if (!tab) {
    const activeBlank = HYMN_TABS.find(t => t.id === currentHymnTabId && !t.key);
    if (activeBlank) {
      tab = activeBlank;
      tab.key = key;
      tab.label = key;
      tab.number = number;
    } else {
      if (HYMN_TABS.length >= 10) {
        console.warn('[HYMNS] Límite máximo de 10 pestañas alcanzado.');
        return;
      }
      const newId = HYMN_TABS.length > 0 ? Math.max(...HYMN_TABS.map(t => t.id)) + 1 : 1;
      tab = { id: newId, key, label: key, number };
      HYMN_TABS.push(tab);
    }
  }
  currentHymnTabId = tab.id;
  renderHymnTabs();
  updateHymnTabsCompression();
}

function activateHymnTab(tabId) {
  const tab = HYMN_TABS.find(t => t.id === tabId);
  if (!tab) return;
  currentHymnTabId = tabId;
  renderHymnTabs();

  if (!tab.key || !tab.number) {
    // pestaña en blanco: solo mostrar el buscador, sin letras
    if (hymnTitleEl) hymnTitleEl.innerText = "";
    if (hymnLyricsEl) hymnLyricsEl.innerHTML = "";
    const input = document.getElementById("hymn-number-input");
    if (input) input.value = "";
    if (hymnsContainer) hymnsContainer.classList.remove('hymns-container--results');
    return;
  }

  // Recargar himno asociado a la pestaña
  showHymn(tab.number);
}

function closeHymnTab(tabId) {
  const idx = HYMN_TABS.findIndex(t => t.id === tabId);
  if (idx === -1) return;
  const wasActive = HYMN_TABS[idx].id === currentHymnTabId;
  HYMN_TABS.splice(idx, 1);

  if (HYMN_TABS.length === 0) {
    const defaultTab = { id: 1, key: null, label: "Nueva pestaña", number: null };
    HYMN_TABS.push(defaultTab);
    currentHymnTabId = defaultTab.id;

    if (hymnTitleEl) hymnTitleEl.innerText = "";
    if (hymnLyricsEl) hymnLyricsEl.innerHTML = "";
    const input = document.getElementById("hymn-number-input");
    if (input) input.value = "";
    if (hymnsContainer) hymnsContainer.classList.remove('hymns-container--results');
    renderHymnTabs();
    return;
  }

  if (wasActive) {
    const neighborIndex = idx < HYMN_TABS.length ? idx : HYMN_TABS.length - 1;
    const nextTab = HYMN_TABS[neighborIndex];
    if (nextTab) {
      activateHymnTab(nextTab.id);
    } else {
      renderHymnTabs();
    }
  } else {
    renderHymnTabs();
  }
}

function showOnlyHymnsForm() {
  const containers = [
    'rest-container','voice-container','bible-container',
    'messages-container','prayer-container','goodbye-container','bg-layer','overlay'
  ];
  containers.forEach(id => document.getElementById(id)?.classList.add('form-hidden'));
  hymnsContainer.classList.remove("form-hidden");
}

// Coincidencia tolerante (Levenshtein simplificado)
function similar(a, b) {
  if (!a || !b) return false;
  return a.startsWith(b) || b.startsWith(a);
}

// Karaoke tracking
window.hymnTrackReading = function (transcript) {
  if (!currentHymn || allHymnWords.length === 0) return;
  const normalized = normalizeText(transcript);
  const words = normalized.split(/\s+/).filter(Boolean);

  words.forEach(spokenWord => {
    for (let i = currentWordIndex; i < allHymnWords.length; i++) {
      if (similar(spokenWord, allHymnWords[i].normalized)) {
        const wordEl = allHymnWords[i].element;
        wordEl.classList.add('word-matched');
        setTimeout(() => {
          wordEl.classList.remove('word-matched');
        }, 1000);
        const lineEl = wordEl.closest('.hymn-line');
        if (lineEl) {
          const currentActive = document.querySelector('.hymn-line.active-line');
          if (currentActive && currentActive !== lineEl) {
            currentActive.classList.remove('active-line');
          }
          if (!lineEl.classList.contains('active-line')) {
            lineEl.classList.add('active-line');
            
            const sectionEl = lineEl.closest('.hymn-section');
            if (sectionEl) {
              const currentActiveSection = document.querySelector('.hymn-section.active-section');
              if (currentActiveSection !== sectionEl) {
                if (currentActiveSection) currentActiveSection.classList.remove('active-section');
                sectionEl.classList.add('active-section');
                sectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
          }
        }
        currentWordIndex = i + 1;
        break;
      }
    }
  });
};

// Actualizar himno desde voz
window.updateHymnFromSpeech = function (transcript) {
  if (!transcript) return false;
  const raw = transcript.trim().toUpperCase();
  const regex = /HIMNO\s+(?:N[ÚU]MERO\s+)?(.+)/i;
  const match = raw.match(regex);
  if (match) {
    const numberPart = match[1].trim();
    let hymnNumber = parseInt(numberPart, 10);

    if (isNaN(hymnNumber)) {
      hymnNumber = spanishWordsToNumber(numberPart);
    }

    if (hymnNumber !== null && !isNaN(hymnNumber)) {
      showHymn(hymnNumber);
      return true;
    }
  }
  return false;
};

function initManualHymnSearch() {
  const form = document.getElementById("hymn-search-form");
  const input = document.getElementById("hymn-number-input");
  if (!form || !input) return;

  function renderHymnSuggestions(query) {
    if (!hymnSuggestionsPanel || !hymnSuggestionsList || !Array.isArray(hymnalData)) return;

    const raw = (query || '').trim();
    const norm = normalizeText(raw);

    let items = hymnalData;
    if (norm) {
      items = hymnalData.filter(h => {
        if (!h || typeof h.number === 'undefined' || !h.title) return false;
        const titleNorm = normalizeText(h.title || '');
        const numStr = String(h.number || '');
        return titleNorm.includes(norm) || numStr.startsWith(norm.replace(/\D/g, ''));
      });
    }

    // Limitar cantidad de sugerencias para no saturar
    items = items.slice(0, 12);

    hymnSuggestionsList.innerHTML = '';

    if (items.length === 0) {
      hymnSuggestionsPanel.classList.add('search-suggestions--hidden');
      return;
    }

    items.forEach(h => {
      if (!h || typeof h.number === 'undefined' || !h.title) return;
      const li = document.createElement('li');
      li.className = 'search-suggestions__item';
      li.dataset.number = String(h.number);
      li.textContent = `${h.number} - ${h.title}`;
      hymnSuggestionsList.appendChild(li);
    });

    hymnSuggestionsPanel.classList.remove('search-suggestions--hidden');
  }

  // Actualizar sugerencias mientras el usuario escribe
  input.addEventListener('input', () => {
    renderHymnSuggestions(input.value);
  });

  // Selección con clic en la lista
  if (hymnSuggestionsList) {
    hymnSuggestionsList.addEventListener('click', (e) => {
      const li = e.target.closest('.search-suggestions__item');
      if (!li || !li.dataset.number) return;
      const num = parseInt(li.dataset.number, 10);
      if (!isNaN(num)) {
        input.value = `${num} - ${li.textContent.replace(/^\d+\s*-\s*/, '')}`;
        showHymn(num);
        if (hymnSuggestionsPanel) hymnSuggestionsPanel.classList.add('search-suggestions--hidden');
      }
    });
  }

  // Ocultar sugerencias al perder foco (ligero retardo para permitir clic)
  input.addEventListener('blur', () => {
    setTimeout(() => {
      if (hymnSuggestionsPanel) hymnSuggestionsPanel.classList.add('search-suggestions--hidden');
    }, 150);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = input.value || "";
    let n = resolveHymnNumberFromInput(raw);

    // Si el resolver flexible no encuentra nada, intentar extraer
    // un número inicial directamente (ej: "1 - TÍTULO")
    if ((n === null || isNaN(n)) && raw.trim()) {
      const directMatch = raw.trim().match(/^(\d+)/);
      if (directMatch) {
        const parsed = parseInt(directMatch[1], 10);
        if (!isNaN(parsed) && parsed > 0) {
          n = parsed;
        }
      }
    }

    // Si aún no se pudo resolver, pero hay sugerencias visibles, usar la primera
    if ((n === null || isNaN(n)) && hymnSuggestionsList && !hymnSuggestionsPanel.classList.contains('search-suggestions--hidden')) {
      const firstLi = hymnSuggestionsList.querySelector('.search-suggestions__item');
      if (firstLi && firstLi.dataset.number) {
        const parsed = parseInt(firstLi.dataset.number, 10);
        if (!isNaN(parsed) && parsed > 0) {
          n = parsed;
        }
      }
    }

    if (n !== null && !isNaN(n) && n > 0) {
      showHymn(n);
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initManualHymnSearch();
  if (hymnTabsEl && HYMN_TABS.length === 0) {
    const defaultTab = { id: 1, key: null, label: "Nueva pestaña", number: null };
    HYMN_TABS.push(defaultTab);
    currentHymnTabId = defaultTab.id;
    renderHymnTabs();
  }
  updateHymnTabsCompression();
  hymnTabsEl.addEventListener('click', (e) => {
    const tabId = e.target.dataset.tabId;
    if (tabId) {
      activateHymnTab(parseInt(tabId));
    } else if (e.target.dataset.addTab === "true") {
      if (HYMN_TABS.length >= 10) {
        console.warn('[HYMNS] Límite máximo de 10 pestañas alcanzado.');
        return;
      }
      const newId = HYMN_TABS.length > 0 ? Math.max(...HYMN_TABS.map(t => t.id)) + 1 : 1;
      const newTab = { id: newId, key: null, label: "Nueva pestaña", number: null };
      HYMN_TABS.push(newTab);
      currentHymnTabId = newTab.id;
      renderHymnTabs();

      if (hymnTitleEl) hymnTitleEl.innerText = "";
      if (hymnLyricsEl) hymnLyricsEl.innerHTML = "";
      const input = document.getElementById("hymn-number-input");
      if (input) input.value = "";
      if (hymnsContainer) hymnsContainer.classList.remove('hymns-container--results');
    } else if (e.target.dataset.closeTabId) {
      closeHymnTab(parseInt(e.target.dataset.closeTabId));
    }
  });

  // Atajos de teclado: flechas izquierda/derecha para navegar entre diapositivas de himnos
  window.addEventListener('keydown', handleHymnKeydown);
});

window.addEventListener('resize', () => {
  updateHymnTabsCompression();
});

function updateHymnTabsCompression() {
  if (!hymnTabsEl) return;
  const count = HYMN_TABS.length;
  const isMobile = window.innerWidth <= 768;
  const baseThreshold = isMobile ? 2 : 7;

  hymnTabsEl.classList.remove('bible-tabs--compressed');
  hymnTabsEl.classList.remove('bible-tabs--compressed-strong');

  if (count >= baseThreshold) {
    hymnTabsEl.classList.add('bible-tabs--compressed');
    const strongThreshold = isMobile ? 4 : 10;
    if (count >= strongThreshold) {
      hymnTabsEl.classList.add('bible-tabs--compressed-strong');
    }
  }
}

// Convierte un número escrito en palabras en español a su valor numérico.
// Es una implementación simple que funciona para números de himnos comunes.
function spanishWordsToNumber(text) {
    const numberMap = {
        'CERO': 0, 'UNO': 1, 'UN': 1, 'DOS': 2, 'TRES': 3, 'CUATRO': 4, 'CINCO': 5, 'SEIS': 6, 'SIETE': 7, 'OCHO': 8, 'NUEVE': 9,
        'DIEZ': 10, 'ONCE': 11, 'DOCE': 12, 'TRECE': 13, 'CATORCE': 14, 'QUINCE': 15,
        'DIECISEIS': 16, 'DIECISIETE': 17, 'DIECIOCHO': 18, 'DIECINUEVE': 19,
        'VEINTE': 20, 'VEINTI': 20, 'VEINTIUNO': 21, 'VEINTIUN': 21, 'VEINTIDOS': 22, 'VEINTITRES': 23, 'VEINTICUATRO': 24, 'VEINTICINCO': 25, 'VEINTISEIS': 26, 'VEINTISIETE': 27, 'VEINTIOCHO': 28, 'VEINTINUEVE': 29,
        'TREINTA': 30, 'CUARENTA': 40, 'CINCUENTA': 50, 'SESENTA': 60, 'SETENTA': 70, 'OCHENTA': 80, 'NOVENTA': 90,
        'CIEN': 100, 'CIENTO': 100,
        'DOSCIENTOS': 200, 'TRESCIENTOS': 300, 'CUATROCIENTOS': 400, 'QUINIENTOS': 500, 'SEISCIENTOS': 600, 'SETECIENTOS': 700, 'OCHOCIENTOS': 800, 'NOVECIENTOS': 900,
        'MIL': 1000
    };

    const normalizedText = text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const words = normalizedText.split(/\s+/).filter(w => w && w !== 'Y');
    
    let total = 0;
    
    for (const word of words) {
        if (numberMap[word] !== undefined) {
            total += numberMap[word];
        } else {
            // Si una palabra no es un número, asumimos que el número ha terminado.
            break; 
        }
    }

    return (total > 0 || normalizedText.startsWith('CERO')) ? total : null;
}