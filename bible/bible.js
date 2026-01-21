// Fondos para la Biblia cuando ya se está leyendo un pasaje (pergaminos/antiguo)
const BIBLE_BACKGROUNDS = [
  "https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=1440&q=60",
  "https://image.slidesdocs.com/responsive-images/background/aged-and-organic-canvas-paper-texture-powerpoint-background_6a1c57cc7a__960_540.jpg",
  "https://wallpapers.com/images/hd/old-paper-texture-parchment-grodfr8ezxzzei6l.jpg",
  "https://i.pinimg.com/736x/06/11/f8/0611f85d965a2e471e3cdc02ec57f913.jpg"
];

// Fondos para la pantalla de búsqueda de Biblia (fotos de Biblias físicas)
const BIBLE_SEARCH_BACKGROUNDS = [
  "https://images.squarespace-cdn.com/content/v1/5148b380e4b0106646129f8e/1724769299816-OWR4TV4BASTCRBZNX2L9/que-es-la-biblia+2484.jpg",
  "https://files.adventistas.org/noticias/es/2021/08/09161442/shutterstock_19895020.jpg",
  "https://universalchurchusa.org/es/wp-content/uploads/sites/6/2022/08/La-Biblia-y-el-pueblo-Parte-2.jpg",
  "https://www.study-bible.org/wp-content/uploads/2023/03/Biblia-Reina-Valera-1960.jpg"
];

// Cache para la base de datos
let BIBLE_DB = [];
let UNIQUE_BOOKS = [];
let currentVersesList = [];
let currentVerseIndex = 0;
let currentMatchIndex = 0;

// Estado de pestañas de Biblia
let BIBLE_TABS = [];
let currentBibleTabId = null;

const titleEl = document.getElementById("bible-title");
const verseEl = document.getElementById("bible-verse");
const bibleForm = document.getElementById("bible-container");
const bibleTabsEl = document.getElementById("bible-tabs");

function setRandomBibleBackground() {
  const bgEl = document.querySelector('.background-bible');
  if (bgEl && BIBLE_BACKGROUNDS.length > 0) {
    const random = BIBLE_BACKGROUNDS[Math.floor(Math.random() * BIBLE_BACKGROUNDS.length)];
    bgEl.style.backgroundImage = `url('${random}')`;
  }
}

function setRandomBibleSearchBackground() {
  const bgEl = document.querySelector('.background-bible');
  if (bgEl && BIBLE_SEARCH_BACKGROUNDS.length > 0) {
    const random = BIBLE_SEARCH_BACKGROUNDS[Math.floor(Math.random() * BIBLE_SEARCH_BACKGROUNDS.length)];
    bgEl.style.backgroundImage = `url('${random}')`;
  }
}

window.setRandomBibleBackground = setRandomBibleBackground;
window.setRandomBibleSearchBackground = setRandomBibleSearchBackground;

// Mapa de sinónimos
const BOOK_ALIASES = {
  "1 SAMUEL": "1 SAMUEL", "PRIMERA DE SAMUEL": "1 SAMUEL", "1 DE SAMUEL": "1 SAMUEL",
  "2 SAMUEL": "2 SAMUEL", "SEGUNDA DE SAMUEL": "2 SAMUEL",
  "1 REYES": "1 REYES", "PRIMERA DE REYES": "1 REYES",
  "2 REYES": "2 REYES", "SEGUNDA DE REYES": "2 REYES",
  "1 CRONICAS": "1 CRONICAS", "PRIMERA DE CRONICAS": "1 CRONICAS", "1 CRÓNICAS": "1 CRONICAS",
  "2 CRONICAS": "2 CRONICAS", "SEGUNDA DE CRONICAS": "2 CRONICAS",
  "CANTAR DE LOS CANTARES": "CANTARES", "CANTAR": "CANTARES",
  "HECHOS DE LOS APOSTOLES": "HECHOS", "HECHOS APOSTOLES": "HECHOS",
  "1 CORINTIOS": "1 CORINTIOS", "PRIMERA DE CORINTIOS": "1 CORINTIOS", "PRIMERA CORINTIOS": "1 CORINTIOS",
  "2 CORINTIOS": "2 CORINTIOS", "SEGUNDA DE CORINTIOS": "2 CORINTIOS",
  "1 TESALONICENSES": "1 TESALONICENSES", "PRIMERA TESALONICENSES": "1 TESALONICENSES",
  "2 TESALONICENSES": "2 TESALONICENSES", "SEGUNDA TESALONICENSES": "2 TESALONICENSES",
  "1 TIMOTEO": "1 TIMOTEO", "PRIMERA TIMOTEO": "1 TIMOTEO",
  "2 TIMOTEO": "2 TIMOTEO", "SEGUNDA TIMOTEO": "2 TIMOTEO",
  "1 PEDRO": "1 PEDRO", "PRIMERA PEDRO": "1 PEDRO",
  "2 PEDRO": "2 PEDRO", "SEGUNDA PEDRO": "2 PEDRO",
  "1 JUAN": "1 JUAN", "PRIMERA DE JUAN": "1 JUAN", "PRIMERA JUAN": "1 JUAN",
  "2 JUAN": "2 JUAN", "SEGUNDA DE JUAN": "2 JUAN",
  "3 JUAN": "3 JUAN", "TERCERA DE JUAN": "3 JUAN",
  "SAN MATEO": "MATEO", "EVANGELIO DE MATEO": "MATEO", "LIBRO DE MATEO": "MATEO",
  "SAN MARCOS": "MARCOS", "EVANGELIO DE MARCOS": "MARCOS", "LIBRO DE MARCOS": "MARCOS",
  "SAN LUCAS": "LUCAS", "EVANGELIO DE LUCAS": "LUCAS", "LIBRO DE LUCAS": "LUCAS",
  "SAN JUAN": "JUAN", "EVANGELIO DE JUAN": "JUAN", "LIBRO DE JUAN": "JUAN",
  "APOCALIPSIS": "APOCALIPSIS", "REVELACION": "APOCALIPSIS", "REVELACIONES": "APOCALIPSIS",
  "SALMO": "SALMOS", "LOS SALMOS": "SALMOS", "SALMOS": "SALMOS"
};

// Nombres de libros con acentos para mostrar en pantalla (no afecta la búsqueda)
// Claves en formato normalizado (sin acentos, mayúsculas), valores con acentos.
const BOOK_DISPLAY_NAMES = {
  "GENESIS": "GÉNESIS",
  "EXODO": "ÉXODO",
  "LEVITICO": "LEVÍTICO",
  "NUMEROS": "NÚMEROS",
  "JOSUE": "JOSUÉ",
  "CRONICAS": "CRÓNICAS",
  "ESDRAS": "ESDRÁS",
  "NEHEMIAS": "NEHEMÍAS",
  "ISAIAS": "ISAÍAS",
  "JEREMIAS": "JEREMÍAS",
  "AMOS": "AMÓS",
  "JONAS": "JONÁS",
  "SOFONIAS": "SOFONÍAS",
  "HAGEO": "HAGEO",
  "ZACARIAS": "ZACARÍAS",
  "MALAQUIAS": "MALAQUÍAS"
};

function getDisplayBookName(rawBook) {
  if (!rawBook) return "";
  const norm = normalizeText(rawBook);
  return BOOK_DISPLAY_NAMES[norm] || rawBook;
}

// Frases comunes que NO deben disparar la Biblia
const BIBLE_SEARCH_BLOCKLIST = [
  "DIOS LES BENDIGA", "DIOS TE BENDIGA", "GLORIA A DIOS", "AMEN", "ALELUYA",
  "BUENAS TARDES", "BUENAS NOCHES", "BUENOS DIAS", "HERMANOS Y HERMANAS",
  "VAMOS A ORAR", "ESTAMOS AQUI", "MUCHAS GRACIAS", "BENDICIONES", "CRISTO VIVE",
  "CRISTO VIENE", "SANTO ES EL SEÑOR"
];

function normalizeText(text) {
  if (!text) return "";
  return text.trim().toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,;:/!¡?¿()"]/g, '');
}

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
    }
  }
  return matrix[b.length][a.length];
}

function tokenize(text) {
  return text.trim().split(/\s+/);
}

// Parseador para entradas manuales tipo "Génesis 1 1" o "Génesis 1:1"
function parseManualBibleReference(raw) {
  if (!raw) return null;

  // Reemplazar dos puntos por espacio y normalizar espacios
  const cleaned = raw.replace(/:/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return null;

  const parts = cleaned.split(" ");
  if (parts.length < 2) return null;

  const last = parts[parts.length - 1];
  const secondLast = parts[parts.length - 2];

  let chapter = null;
  let verse = null;
  let bookParts = [];

  // Caso "libro cap vers" -> ambos numéricos
  if (!isNaN(parseInt(last, 10)) && !isNaN(parseInt(secondLast, 10))) {
    chapter = parseInt(secondLast, 10);
    verse = parseInt(last, 10);
    bookParts = parts.slice(0, parts.length - 2);
  } else if (!isNaN(parseInt(last, 10))) {
    // Caso "libro cap" -> solo capítulo
    chapter = parseInt(last, 10);
    verse = null;
    bookParts = parts.slice(0, parts.length - 1);
  } else {
    return null;
  }

  const book = bookParts.join(" ");
  if (!book || !chapter || chapter <= 0) return null;

  return { book, chapter, verse };
}

async function loadBibleData() {
  try {
    console.log("Cargando Biblia local...");
    const response = await fetch('bible/Holy-bible/bible.json');
    if (!response.ok) throw new Error("No se pudo cargar bible.json");
    BIBLE_DB = await response.json();
    UNIQUE_BOOKS = [...new Set(BIBLE_DB.map(item => item.libro))];
    console.log("Biblia cargada:", BIBLE_DB.length, "versículos.");
  } catch (err) {
    console.error("Error cargando Biblia:", err);
  }
}

function findBookInDB(inputName) {
  const normInput = normalizeText(inputName);
  if (!normInput) return null;

  let searchKey = normInput;
  for (const [alias, target] of Object.entries(BOOK_ALIASES)) {
    if (normalizeText(alias) === normInput) {
      searchKey = normalizeText(target);
      break;
    }
  }

  const exactMatch = UNIQUE_BOOKS.find(b => normalizeText(b) === searchKey);
  if (exactMatch) return exactMatch;

  const startMatch = UNIQUE_BOOKS.find(b => normalizeText(b).startsWith(searchKey));
  if (startMatch) return startMatch;

  const includeMatches = UNIQUE_BOOKS.filter(b => normalizeText(b).includes(searchKey));
  if (includeMatches.length > 0) {
    includeMatches.sort((a, b) => a.length - b.length);
    return includeMatches[0];
  }

  if (searchKey.length >= 3) {
    let bestMatch = null;
    let minDist = Infinity;
    for (const book of UNIQUE_BOOKS) {
      const dist = levenshtein(searchKey, normalizeText(book));
      const threshold = Math.floor(Math.max(3, searchKey.length * 0.4));
      if (dist < minDist && dist <= threshold) {
        minDist = dist;
        bestMatch = book;
      }
    }
    return bestMatch;
  }
  return null;
}

// Estado persistente para evitar recargas redundantes
let lastLoadedBook = "";
let lastLoadedChapter = -1;
let bibleScrollTimeout = null;
let bibleScrollingProgrammatic = false; // true cuando estamos animando scroll por teclado/código
let bibleLastProgrammaticScrollEnd = 0; // timestamp (ms) del final del último scroll animado

async function searchAndShowLocal(libroInput, capitulo, versiculo) {
  const exactBookName = findBookInDB(libroInput);
  if (!exactBookName) return;

  const capNum = parseInt(capitulo, 10);
  const versNum = versiculo ? parseInt(versiculo, 10) : null;

  const verses = BIBLE_DB.filter(item => item.libro === exactBookName && item.capitulo == capNum);
  if (verses.length === 0) return;

  verses.sort((a, b) => a.versiculo - b.versiculo);

  lastLoadedBook = exactBookName;
  lastLoadedChapter = capNum;

  if (versNum) {
    displayPassage(exactBookName, capNum, verses, versNum);
  } else {
    displayPassage(exactBookName, capNum, verses, null);
  }
}

// Frases para CERRAR la Biblia y volver al inicio
const BIBLE_CLOSE_PHRASES = [
  "HASTA ALLÍ LO LEEMOS", "HASTA AQUÍ LO LEEMOS", "DIOS BENDIGA SU PALABRA", "DIOS BENDIGA HASTA AQUI SU PALABRA",
  "LEVANTEMOS NUESTRAS MANOS", "INCLINE SU CABEZA", "VAMOS A ORAR", "PADRE CELESTIAL",
  "PADRE NUESTRO", "SEÑOR"
];

function displayPassage(book, chapter, verses, startVerse = null) {
  if (!titleEl || !verseEl) return;

  // Si no hay versículo inicial, el usuario quiere que se "auto-entienda" como el 1
  const displayTitleVerse = startVerse || "1";

  // Formato pedido: "GÉNESIS 1:1" (con acentos cuando aplique)
  const displayBook = getDisplayBookName(book);
  titleEl.textContent = `${displayBook} ${chapter}:${displayTitleVerse}`;
  verseEl.innerHTML = "";

  // Siempre mostramos TODO el capítulo desde el versículo 1,
  // pero si hay startVerse lo marcamos como activo y empezamos el seguimiento desde ahí.
  currentVersesList = verses;
  currentVerseIndex = 0;
  currentMatchIndex = 0;

  let activeIndex = 0;
  if (startVerse) {
    const idx = verses.findIndex(v => v.versiculo == startVerse);
    if (idx !== -1) activeIndex = idx;
  }

  verses.forEach((v, i) => {
    const div = document.createElement("div");
    // Si es capítulo entero, el primero es activo. Si es versículo específico, ese es el activo.
    div.className = i === activeIndex ? "verse-item verse-active" : "verse-item";
    div.id = `verse-box-${i}`;
    const tokens = tokenize(v.texto);
    const contentHtml = tokens.map((t, ti) => `<span class="word" id="v-${i}-w-${ti}">${t}</span>`).join(" ");
    div.innerHTML = `<span class="verse-num">${v.versiculo}</span> ${contentHtml}`;
    verseEl.appendChild(div);
  });

  // Establecer versículo activo inicial y desplazar suavemente hasta él
  setActiveVerseIndex(activeIndex, { scroll: !!startVerse });

  const bibleContainer = document.getElementById("bible-container");
  if (bibleContainer) {
    bibleContainer.classList.remove("form-hidden");
    const bibleStage = bibleContainer.querySelector('.bible-stage');
    if (bibleStage) {
      bibleStage.classList.add('bible-stage--results');
    }
  }

  // Ocultar voz y resto
  document.getElementById("voice-container")?.classList.add("form-hidden");
  document.getElementById("rest-container")?.classList.add("form-hidden");
  document.getElementById("messages-container")?.classList.add("form-hidden");
  document.getElementById("hymns-container")?.classList.add("form-hidden");
  document.getElementById("goodbye-container")?.classList.add("form-hidden");

  const overlay = document.getElementById("overlay");
  if (overlay) overlay.style.display = "none";

  setRandomBibleBackground();
  if (!startVerse && verseEl) {
    verseEl.scrollTop = 0;
  }

  // Actualizar botones móviles al cargar un pasaje
  updateBibleMobileNavButtons();
}

// Desplazamiento suave del contenedor de versículos hasta el versículo activo,
// simulando un scroll manual del usuario.
function smoothScrollToActiveVerse(activeIndex) {
  if (!verseEl) return;
  const target = document.getElementById(`verse-box-${activeIndex}`);
  if (!target) return;

  const container = verseEl;
  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const current = container.scrollTop;
  const offset = (targetRect.top - containerRect.top) - (container.clientHeight / 2) + (target.clientHeight / 2);
  const destination = current + offset;

  const duration = 450; // ms
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    // easeInOutQuad
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    container.scrollTop = current + (destination - current) * eased;
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      // Al terminar el scroll animado, volvemos a permitir que el scroll manual
      // actualice el versículo activo.
      bibleScrollingProgrammatic = false;
      bibleLastProgrammaticScrollEnd = performance.now();
    }
  }

  requestAnimationFrame(step);
}

// Actualizar versículo activo por índice, opcionalmente con scroll animado
function setActiveVerseIndex(newIndex, options = {}) {
  const { scroll = false } = options;
  if (!currentVersesList || currentVersesList.length === 0) return;

  const maxIndex = currentVersesList.length - 1;
  const clamped = Math.max(0, Math.min(maxIndex, newIndex));
  currentVerseIndex = clamped;

  const prev = document.querySelector(".verse-item.verse-active");
  if (prev) prev.classList.remove("verse-active");

  const box = document.getElementById(`verse-box-${clamped}`);
  if (box) box.classList.add("verse-active");

  const v = currentVersesList[clamped];
  if (titleEl && v) {
    const displayBook = getDisplayBookName(v.libro);
    titleEl.textContent = `${displayBook} ${v.capitulo}:${v.versiculo}`;
  }

  if (scroll) {
    // Evitar que el manejador de scroll manual cambie el versículo activo
    // mientras estamos animando el desplazamiento por teclado o por código.
    bibleScrollingProgrammatic = true;
    smoothScrollToActiveVerse(clamped);
  }

  adjustActiveVerseFontSize();
  updateBibleMobileNavButtons();
}

function updateBibleMobileNavButtons() {
  const prevBtn = document.getElementById('bible-mobile-prev');
  const nextBtn = document.getElementById('bible-mobile-next');
  if (!prevBtn || !nextBtn || !currentVersesList || currentVersesList.length === 0) return;

  const lastIndex = currentVersesList.length - 1;

  // Ocultar ambos si solo hay un versículo
  if (lastIndex <= 0) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    return;
  }

  // Primer versículo: solo "Siguiente"
  if (currentVerseIndex <= 0) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
    nextBtn.textContent = 'Siguiente';
    return;
  }

  // Último versículo: solo "Atrás"
  if (currentVerseIndex >= lastIndex) {
    prevBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';
    prevBtn.textContent = 'Atrás';
    return;
  }

  // Versículo intermedio: ambos visibles
  prevBtn.style.display = 'inline-block';
  nextBtn.style.display = 'inline-block';
  prevBtn.textContent = 'Atrás';
  nextBtn.textContent = 'Siguiente';
}

function adjustActiveVerseFontSize() {
  if (!verseEl) return;

  const active = verseEl.querySelector('.verse-item.verse-active');
  if (!active) return;

  // Resetear tamaño por si se ajustó en otro versículo
  active.style.fontSize = "";

  const containerHeight = verseEl.clientHeight;
  if (!containerHeight) return;

  const maxAllowedHeight = containerHeight * 0.9;
  let fontSize = parseFloat(window.getComputedStyle(active).fontSize);
  if (!fontSize || isNaN(fontSize)) return;

  // No reducir por debajo del 88% del tamaño base para que siga siendo bien grande
  const minFontSize = fontSize * 0.88;
  let iterations = 0;
  const maxIterations = 5;

  while (active.scrollHeight > maxAllowedHeight && fontSize > minFontSize && iterations < maxIterations) {
    // Reducir en pasos muy suaves (3%) para mantener buena presencia en pantalla
    fontSize = fontSize * 0.97;
    active.style.fontSize = fontSize + 'px';
    iterations++;
  }
}

// Cuando el usuario hace scroll manual, detectar qué versículo está más centrado
// y marcarlo como activo, actualizando el título.
function handleBibleVerseScroll() {
  if (!verseEl || !currentVersesList || currentVersesList.length === 0) return;

  // Si el scroll viene de una animación programática (teclas, búsqueda, etc.),
  // no recalculamos el versículo activo para evitar saltos inesperados.
  if (bibleScrollingProgrammatic) return;

  // También ignorar el primer scroll justo DESPUÉS de terminar una animación
  // programática reciente (p.ej. evento residual de scroll), para que no
  // corrija el versículo decidido por el teclado.
  if (bibleLastProgrammaticScrollEnd &&
      performance.now() - bibleLastProgrammaticScrollEnd < 200) {
    return;
  }

  if (bibleScrollTimeout) clearTimeout(bibleScrollTimeout);
  bibleScrollTimeout = setTimeout(() => {
    const items = verseEl.querySelectorAll('.verse-item');
    if (!items.length) return;

    const containerRect = verseEl.getBoundingClientRect();
    const centerY = containerRect.top + containerRect.height / 2;

    let bestIndex = 0;
    let bestDist = Infinity;
    items.forEach((el, idx) => {
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      const dist = Math.abs(mid - centerY);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = idx;
      }
    });

    setActiveVerseIndex(bestIndex, { scroll: false });
  }, 80);
}

// Atajos de teclado: flechas arriba/abajo para cambiar de versículo activo
function handleBibleKeydown(event) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

  const bibleContainer = document.getElementById("bible-container");
  if (!bibleContainer || bibleContainer.classList.contains('form-hidden')) return;

  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

  if (!currentVersesList || currentVersesList.length === 0) return;

  event.preventDefault();

  const delta = event.key === 'ArrowDown' ? 1 : -1;
  const targetIndex = (typeof currentVerseIndex === 'number' ? currentVerseIndex : 0) + delta;
  setActiveVerseIndex(targetIndex, { scroll: true });
}

function getReferenceKey(book, chapter, verse) {
  return `${book} ${chapter}${verse ? ":" + verse : ""}`;
}

function updateBibleTabsCompression() {
  if (!bibleTabsEl) return;
  const count = BIBLE_TABS.length;
  const isMobile = window.innerWidth <= 768;
  const baseThreshold = isMobile ? 2 : 7;

  bibleTabsEl.classList.remove('bible-tabs--compressed');
  bibleTabsEl.classList.remove('bible-tabs--compressed-strong');

  if (count >= baseThreshold) {
    bibleTabsEl.classList.add('bible-tabs--compressed');
    // Compresión extra cuando hay muchas pestañas
    const strongThreshold = isMobile ? 4 : 10;
    if (count >= strongThreshold) {
      bibleTabsEl.classList.add('bible-tabs--compressed-strong');
    }
  }
}

function renderBibleTabs() {
  if (!bibleTabsEl) return;
  bibleTabsEl.innerHTML = "";
  BIBLE_TABS.forEach(tab => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bible-tab" + (tab.id === currentBibleTabId ? " bible-tab--active" : "");
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
    bibleTabsEl.appendChild(btn);
  });

  // Botón "+" para añadir nueva pestaña vacía
  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "bible-tab-add";
  addBtn.textContent = "+";
  addBtn.dataset.addTab = "true";
  bibleTabsEl.appendChild(addBtn);

  updateBibleTabsCompression();
}

function openBibleReferenceWithTab(book, chapter, verse) {
  const exactBookName = findBookInDB(book) || book;
  const refKey = getReferenceKey(exactBookName, chapter, verse || null);

  // Reutilizar pestaña actual si es "vacía" (sin referencia aún)
  let tab = BIBLE_TABS.find(t => t.key === refKey);
  if (!tab) {
    const activeBlank = BIBLE_TABS.find(t => t.id === currentBibleTabId && !t.key);
    if (activeBlank) {
      tab = activeBlank;
      tab.key = refKey;
      tab.label = refKey;
      tab.book = exactBookName;
      tab.chapter = chapter;
      tab.verse = verse || null;
    } else {
      if (BIBLE_TABS.length >= 10) {
        console.warn('[BIBLE] Límite máximo de 10 pestañas alcanzado.');
        return;
      }
      const newId = BIBLE_TABS.length > 0 ? Math.max(...BIBLE_TABS.map(t => t.id)) + 1 : 1;
      tab = {
        id: newId,
        key: refKey,
        label: refKey,
        book: exactBookName,
        chapter: chapter,
        verse: verse || null
      };
      BIBLE_TABS.push(tab);
    }
  }

  currentBibleTabId = tab.id;
  renderBibleTabs();
  searchAndShowLocal(tab.book, tab.chapter, tab.verse || null, { fromTab: true });
}

function activateBibleTab(tabId) {
  const tab = BIBLE_TABS.find(t => t.id === tabId);
  if (!tab) return;
  currentBibleTabId = tabId;
  renderBibleTabs();
  // Si es una pestaña en blanco (sin referencia), mostrar solo el buscador limpio
  if (!tab.key || !tab.book) {
    if (titleEl) titleEl.textContent = "";
    if (verseEl) verseEl.innerHTML = "";
    const searchInput = document.getElementById("bible-search-input");
    if (searchInput) searchInput.value = "";
    const bibleContainer = document.getElementById("bible-container");
    if (bibleContainer) {
      const bibleStage = bibleContainer.querySelector('.bible-stage');
      if (bibleStage) {
        bibleStage.classList.remove('bible-stage--results');
      }
    }
    if (typeof setRandomBibleSearchBackground === 'function') {
      setRandomBibleSearchBackground();
    }
    return;
  }

  // Si la pestaña tiene un pasaje asociado, reconstruirlo
  searchAndShowLocal(tab.book, tab.chapter, tab.verse || null, { fromTab: true });
}

function closeBibleTab(tabId) {
  const idx = BIBLE_TABS.findIndex(t => t.id === tabId);
  if (idx === -1) return;
  const wasActive = BIBLE_TABS[idx].id === currentBibleTabId;
  BIBLE_TABS.splice(idx, 1);

  if (BIBLE_TABS.length === 0) {
    // Si ya no quedan pestañas, crear una nueva pestaña en blanco por defecto
    const defaultTab = {
      id: 1,
      key: null,
      label: "Nueva pestaña",
      book: null,
      chapter: null,
      verse: null
    };
    BIBLE_TABS.push(defaultTab);
    currentBibleTabId = defaultTab.id;

    // Limpiar la vista y volver al modo búsqueda
    if (titleEl) titleEl.textContent = "";
    if (verseEl) verseEl.innerHTML = "";
    const searchInput = document.getElementById("bible-search-input");
    if (searchInput) searchInput.value = "";
    const bibleContainer = document.getElementById("bible-container");
    if (bibleContainer) {
      const bibleStage = bibleContainer.querySelector('.bible-stage');
      if (bibleStage) {
        bibleStage.classList.remove('bible-stage--results');
      }
    }
    if (typeof setRandomBibleSearchBackground === 'function') {
      setRandomBibleSearchBackground();
    }
    renderBibleTabs();
    return;
  }

  if (wasActive) {
    // Si cerramos la pestaña activa y aún quedan otras, activar una pestaña vecina
    const neighborIndex = idx < BIBLE_TABS.length ? idx : BIBLE_TABS.length - 1;
    const nextTab = BIBLE_TABS[neighborIndex];
    if (nextTab) {
      // Reusar la misma lógica de activación (limpiar o mostrar pasaje según tipo de pestaña)
      activateBibleTab(nextTab.id);
    } else {
      renderBibleTabs();
    }
  } else {
    renderBibleTabs();
  }
}

  if (bibleTabsEl) {
  bibleTabsEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    // Botón para añadir nueva pestaña vacía
    if (target.dataset.addTab === "true") {
      if (BIBLE_TABS.length >= 10) {
        console.warn('[BIBLE] Límite máximo de 10 pestañas alcanzado.');
        return;
      }
      const newId = BIBLE_TABS.length > 0 ? Math.max(...BIBLE_TABS.map(t => t.id)) + 1 : 1;
      const newTab = {
        id: newId,
        key: null,
        label: "Nueva pestaña",
        book: null,
        chapter: null,
        verse: null
      };
      BIBLE_TABS.push(newTab);
      currentBibleTabId = newId;
      renderBibleTabs();
      // Nueva pestaña debe mostrar el buscador (no un versículo anterior)
      if (titleEl) titleEl.textContent = "";
      if (verseEl) verseEl.innerHTML = "";
      const searchInput = document.getElementById("bible-search-input");
      if (searchInput) searchInput.value = "";
      const bibleContainer = document.getElementById("bible-container");
      if (bibleContainer) {
        const bibleStage = bibleContainer.querySelector('.bible-stage');
        if (bibleStage) {
          bibleStage.classList.remove('bible-stage--results');
        }
      }
      if (typeof setRandomBibleSearchBackground === 'function') {
        setRandomBibleSearchBackground();
      }
      return;
    }

    const closeId = target.dataset.closeTabId;
    if (closeId) {
      closeBibleTab(parseInt(closeId, 10));
      return;
    }

    const tabButton = target.closest(".bible-tab");
    if (tabButton && tabButton instanceof HTMLElement) {
      const tabIdStr = tabButton.dataset.tabId;
      if (tabIdStr) {
        activateBibleTab(parseInt(tabIdStr, 10));
      }
    }
  });
}

window.addEventListener('resize', () => {
  updateBibleTabsCompression();
});

// Buscar múltiples versículos por contenido de texto (para búsquedas manuales como "JEHOVA ES MI PASTOR")
function searchVersesByContent(query, maxResults = 20) {
  if (!BIBLE_DB || BIBLE_DB.length === 0 || !query) return [];
  const normSpoken = normalizeText(query);
  if (!normSpoken) return [];

  const wordsSpoken = normSpoken.split(/\s+/).filter(w => w.length >= 3);
  if (wordsSpoken.length === 0) return [];

  const results = [];

  for (const item of BIBLE_DB) {
    const normVerse = normalizeText(item.texto);

    // Coincidencia exacta de toda la frase: priorizar al máximo
    if (normVerse.includes(normSpoken)) {
      results.push({ item, score: 1 });
      continue;
    }

    let matches = 0;
    for (const ws of wordsSpoken) {
      if (normVerse.includes(ws)) matches++;
    }
    if (matches > 0) {
      const score = matches / wordsSpoken.length;
      results.push({ item, score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults).map(r => r.item);
}

// Función para cerrar la Biblia desde voz
window.closeBibleFromSpeech = function (transcript) {
  const norm = normalizeText(transcript);
  // Verificar si alguna frase de cierre está contenida en lo hablado
  const shouldClose = BIBLE_CLOSE_PHRASES.some(phrase => norm.includes(phrase));

  if (shouldClose) {
    console.log("[BIBLE] Cerrando por comando de voz. Abriendo Momento de Oración...");

    if (typeof window.triggerPrayerFromSpeech === 'function') {
      window.triggerPrayerFromSpeech();
    } else {
      // Fallback si no está cargado el script de prayer
      const bibleContainer = document.getElementById("bible-container");
      if (bibleContainer) bibleContainer.classList.add("form-hidden");
      document.getElementById("voice-container")?.classList.remove("form-hidden");
    }

    // Resetear estado de carga
    lastLoadedBook = "";
    lastLoadedChapter = -1;
    return true;
  }
  return false;
};

window.bibleTrackReading = function (transcript) {
  if (!currentVersesList || currentVersesList.length === 0) return;
  if (currentVerseIndex >= currentVersesList.length) return;

  const words = normalizeText(transcript).split(/\s+/);
  const currentVerseObj = currentVersesList[currentVerseIndex];
  const verseWords = tokenize(normalizeText(currentVerseObj.texto));

  for (const spokenWord of words) {
    if (currentMatchIndex >= verseWords.length) break;
    const targetWord = verseWords[currentMatchIndex];
    if (levenshtein(spokenWord, targetWord) <= 2 || targetWord.includes(spokenWord)) {
      const spanId = `v-${currentVerseIndex}-w-${currentMatchIndex}`;
      document.getElementById(spanId)?.classList.add("word-matched");
      currentMatchIndex++;
    }
  }

  if (currentMatchIndex / verseWords.length > 0.85) {
    currentVerseIndex++;
    currentMatchIndex = 0;
    if (currentVerseIndex < currentVersesList.length) {
      const nextBox = document.getElementById(`verse-box-${currentVerseIndex}`);
      document.querySelector(".verse-active")?.classList.remove("verse-active");
      if (nextBox) {
        nextBox.classList.add("verse-active");
        nextBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      const nextV = currentVersesList[currentVerseIndex];
      if (titleEl) {
        const displayBook = getDisplayBookName(nextV.libro);
        titleEl.textContent = `${displayBook} ${nextV.capitulo}:${nextV.versiculo}`;
      }
    }
  }
};

window.updateBibleFromSpeech = function (transcript) {
  if (!transcript) return false;

  // Normalizar y limpiar muletillas internas
  const normalized = normalizeText(transcript);

  const clean = normalized
    .replace(/\b(CAPITULO|VERSICULO|NUMERO|CITA|VERSO|PARTE|DE|LA|EL|LOS|LAS|LIBRO|CAP)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Regex mejorado: QUITAMOS el ancla ^ del inicio para ignorar basura previa (ej: "okey genesis 1")
  // Mantenemos el ancla $ al final para asegurar que termina en números del capítulo/versículo.
  const match = clean.match(/(\d?\s*[A-ZÑ\s]+?)\s*(\d+)(?:\s+(\d+))?$/);

  if (match) {
    const libroSegmento = match[1].trim();
    const cap = match[2];
    const vers = match[3];

    console.log(`[BIBLE-COMMAND] Intento: Segmento="${libroSegmento}", Cap=${cap}, Vers=${vers}`);

    // findBookInDB ya tiene lógica de fuzzy/substring, así que debería detectar "GENESIS"
    // incluso si libroSegmento es "OKEY GENESIS".
    const matchedBook = findBookInDB(libroSegmento);
    if (matchedBook) {
      openBibleReferenceWithTab(matchedBook, cap, vers || null);
      return true;
    }
  }
  return false;
};

window.findVerseByContent = function (spokenText) {
  if (!BIBLE_DB || BIBLE_DB.length === 0 || !spokenText || spokenText.length < 12) return null;
  const normSpoken = normalizeText(spokenText);

  // Lista extendida para evitar falsos positivos
  if (BIBLE_SEARCH_BLOCKLIST.some(phrase => normSpoken.includes(phrase) && normSpoken.length < phrase.length + 8)) return null;
  if (normSpoken.includes("ESTE") && normSpoken.length < 15) return null;

  const wordsSpoken = normSpoken.split(/\s+/).filter(w => w.length >= 3);
  if (wordsSpoken.length < 3) return null; // Subimos a 3 palabras mínimo para evitar ruidos

  let threshold = wordsSpoken.length <= 4 ? 0.85 : 0.70;
  let bestMatch = null, maxScore = 0;

  for (const item of BIBLE_DB) {
    const normVerse = normalizeText(item.texto);
    if (normVerse.includes(normSpoken)) return item;
    let matches = 0;
    for (const ws of wordsSpoken) {
      if (normVerse.includes(ws)) matches++;
      else if (ws.length > 5) {
        for (const vword of tokenize(normVerse)) {
          if (vword.length > 5 && levenshtein(ws, vword) <= 2) { matches++; break; }
        }
      }
    }
    const ratio = matches / wordsSpoken.length;
    if (ratio >= threshold && ratio > maxScore) { maxScore = ratio; bestMatch = item; if (ratio === 1) break; }
  }
  return bestMatch;
};

// Exports
window.loadBibleData = loadBibleData;
window.findBookInDB = findBookInDB;
window.searchAndShowLocal = searchAndShowLocal;
window.displayPassage = displayPassage;

loadBibleData();

function initManualBibleSearch() {
  const form = document.getElementById("bible-search-form");
  const searchInput = document.getElementById("bible-search-input");
  const resultsPanel = document.getElementById("bible-suggestions-panel");
  const resultsList = document.getElementById("bible-suggestions-list");
  if (!form || !searchInput || !resultsPanel || !resultsList) return;

  function clearBibleSuggestions() {
    resultsPanel.classList.add("search-suggestions--hidden");
    resultsList.innerHTML = "";
  }

  function renderBibleSuggestions(raw) {
    const value = raw.trim();
    if (!value) {
      clearBibleSuggestions();
      return;
    }

    // Si parece una referencia válida, no mostramos sugerencias: se usará búsqueda directa al enviar
    const parsed = parseManualBibleReference(value);
    if (parsed) {
      clearBibleSuggestions();
      return;
    }

    const normQuery = normalizeText(value);

    // 1) Sugerencias por NOMBRE DE LIBRO ("gen", "ge", "sal", etc.)
    const hasDigit = /\d/.test(normQuery);
    let matches = [];

    if (!hasDigit && UNIQUE_BOOKS && UNIQUE_BOOKS.length > 0) {
      const bookMatches = UNIQUE_BOOKS
        .filter(b => normalizeText(b).includes(normQuery))
        .slice(0, 10);

      if (bookMatches.length > 0) {
        // Si todavía no tenemos BIBLE_DB cargada, al menos sugerimos el libro apuntando a 1:1
        if (!BIBLE_DB || BIBLE_DB.length === 0) {
          matches = bookMatches.map(book => ({
            libro: book,
            capitulo: 1,
            versiculo: 1,
            texto: ""
          }));
        } else {
          const maxPerBook = 10; // número máx. de sugerencias por libro
          matches = [];
          bookMatches.forEach(book => {
            const versesInBook = BIBLE_DB.filter(v => v.libro === book);
            if (!versesInBook || versesInBook.length === 0) return;

            const used = new Set();
            const limit = Math.min(maxPerBook, versesInBook.length);
            while (used.size < limit) {
              const randomIdx = Math.floor(Math.random() * versesInBook.length);
              if (used.has(randomIdx)) continue;
              used.add(randomIdx);
              const randomVerse = versesInBook[randomIdx];
              matches.push({
                libro: randomVerse.libro,
                capitulo: randomVerse.capitulo,
                versiculo: randomVerse.versiculo,
                texto: randomVerse.texto
              });
            }
          });
        }
      }
    }

    // Para textos muy cortos (<3), solo mostramos sugerencias de libro y salimos
    if (value.length < 3) {
      if (matches.length === 0) {
        clearBibleSuggestions();
        return;
      }
      resultsList.innerHTML = "";
      matches.forEach((v) => {
        const li = document.createElement("li");
        li.className = "search-suggestions__item";
        const hasTextShort = v.texto && typeof v.texto === "string" && v.texto.length > 0;
        const snippetShort = hasTextShort
          ? ` — ${v.texto.substring(0, 80)}${v.texto.length > 80 ? '…' : ''}`
          : "";
        li.textContent = `${v.libro} ${v.capitulo}:${v.versiculo}${snippetShort}`;
        li.dataset.libro = v.libro;
        li.dataset.capitulo = v.capitulo;
        li.dataset.versiculo = v.versiculo;
        resultsList.appendChild(li);
      });
      resultsPanel.classList.remove("search-suggestions--hidden");
      return;
    }

    // 2) Si no hubo coincidencia clara de libro (o ya pasamos por ahí), buscamos por TEXTO DE VERSÍCULO
    if (matches.length === 0) {
      // Intento rápido de coincidencia exacta de frase: si existe, mostramos solo ese resultado
      let directMatch = null;
      for (const item of BIBLE_DB) {
        const normVerse = normalizeText(item.texto);
        if (normVerse.includes(normQuery)) {
          directMatch = item;
          break;
        }
      }

      if (directMatch) {
        matches = [directMatch];
      } else {
        matches = searchVersesByContent(value, 30);
      }
    }

    resultsList.innerHTML = "";

    if (!matches || matches.length === 0) {
      clearBibleSuggestions();
      return;
    }

    matches.forEach((v) => {
      const li = document.createElement("li");
      li.className = "search-suggestions__item";
      const hasText = v.texto && typeof v.texto === "string" && v.texto.length > 0;
      const snippet = hasText
        ? ` — ${v.texto.substring(0, 80)}${v.texto.length > 80 ? '…' : ''}`
        : "";
      li.textContent = `${v.libro} ${v.capitulo}:${v.versiculo}${snippet}`;
      li.dataset.libro = v.libro;
      li.dataset.capitulo = v.capitulo;
      li.dataset.versiculo = v.versiculo;
      resultsList.appendChild(li);
    });

    resultsPanel.classList.remove("search-suggestions--hidden");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = searchInput.value.trim();
    if (!raw) return;

    // Si se puede interpretar como referencia (libro + cap/vers), usamos búsqueda directa
    const parsed = parseManualBibleReference(raw);
    if (parsed) {
      clearBibleSuggestions();
      const { book, chapter, verse } = parsed;
      openBibleReferenceWithTab(book, chapter, verse || null);
      return;
    }

    // Si no es referencia, intentamos primero una búsqueda directa por contenido de versículo
    if (BIBLE_DB && BIBLE_DB.length > 0) {
      let directMatch = null;
      const normQuery = normalizeText(raw);

      // Intento rápido de coincidencia exacta de frase normalizada
      for (const item of BIBLE_DB) {
        const normVerse = normalizeText(item.texto);
        if (normVerse.includes(normQuery)) {
          directMatch = item;
          break;
        }
      }

      // Si no hubo coincidencia exacta, usamos el buscador difuso de contenido
      if (!directMatch) {
        const bestMatches = searchVersesByContent(raw, 1);
        if (bestMatches && bestMatches.length > 0) {
          directMatch = bestMatches[0];
        }
      }

      if (directMatch) {
        clearBibleSuggestions();
        openBibleReferenceWithTab(directMatch.libro, directMatch.capitulo, directMatch.versiculo || null);
        return;
      }
    }

    // Si no es referencia y no encontramos un versículo claro, mostramos sugerencias
    renderBibleSuggestions(raw);
  });

  // Sugerencias en vivo mientras escribe, como en Himnos
  searchInput.addEventListener("input", () => {
    renderBibleSuggestions(searchInput.value);
  });

  resultsList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest(".search-suggestions__item");
    if (!item) return;
    const book = item.dataset.libro;
    const chapter = item.dataset.capitulo;
    const verse = item.dataset.versiculo;
    if (!book || !chapter) return;
    openBibleReferenceWithTab(book, chapter, verse || null);
    clearBibleSuggestions();
  });
}

window.addEventListener("DOMContentLoaded", initManualBibleSearch);

// Asegurar que exista al menos una pestaña en blanco por defecto al cargar
window.addEventListener("DOMContentLoaded", () => {
  if (!bibleTabsEl) return;
  if (BIBLE_TABS.length === 0) {
    const defaultTab = {
      id: 1,
      key: null,
      label: "Nueva pestaña",
      book: null,
      chapter: null,
      verse: null
    };
    BIBLE_TABS.push(defaultTab);
    currentBibleTabId = defaultTab.id;
    renderBibleTabs();
  }

  // Escuchar teclas de flecha arriba/abajo para navegar versículos
  window.addEventListener('keydown', handleBibleKeydown);

  // Escuchar scroll manual en el contenedor de versículos para actualizar el versículo activo
  if (verseEl) {
    verseEl.addEventListener('scroll', handleBibleVerseScroll, { passive: true });
  }

  // Navegación móvil de versículos (botones Atrás / Siguiente)
  const mobilePrev = document.getElementById('bible-mobile-prev');
  const mobileNext = document.getElementById('bible-mobile-next');

  if (mobilePrev) {
    mobilePrev.addEventListener('click', () => {
      if (typeof currentVerseIndex !== 'number') return;
      setActiveVerseIndex(currentVerseIndex - 1, { scroll: true });
    });
  }

  if (mobileNext) {
    mobileNext.addEventListener('click', () => {
      if (typeof currentVerseIndex !== 'number') return;
      setActiveVerseIndex(currentVerseIndex + 1, { scroll: true });
    });
  }
});
