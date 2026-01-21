// Fondos aleatorios para mensajes (Alta calidad optimizada)
const MESSAGE_BACKGROUNDS = [
  "https://s.widget-club.com/images/YyiR86zpwIMIfrCZoSs4ulVD9RF3/acd8d5a4791aacdaeeef26cfd0f92ce1/c9a939842efb5c49ca2b6d5b02902ef1.jpg?q=70&w=1920",
  "https://w0.peakpx.com/wallpaper/521/362/HD-wallpaper-the-golden-eagle-nature-majestic-wings-raptor.jpg",
  "https://cals.cornell.edu/sites/default/files/styles/article_hero_wide/public/2021-03/0324_eagle.jpeg?h=6ffd3e8a&itok=u8tU0PqJ",
  "https://wallpapers.com/images/featured/imagenes-de-aguilas-84sl8xy8izpmzt1o.jpg",
  "https://www.shutterstock.com/image-photo/bald-eagle-diving-fish-alaska-600nw-2493030963.jpg",
  "https://wallpapers.com/images/high/bald-eagle-ready-to-fly-rdvytzncp9w99lbm.webp",
  "https://wallpapers.com/images/high/aguila-spreading-wings-gliding-above-sea-p5pgkaivdl87d8nk.webp",
  "https://wallpapers.com/images/high/white-tailed-eagle-over-mountains-vc738a39uhcgugxy.webp",
  "https://wallpapers.com/images/high/bald-eagle-flock-87r2i95mgu5cp45y.webp",
  "https://wallpapers.com/images/high/bald-eagle-over-snow-capped-mountain-u2u7dblgq2wsce43.webp",
  "https://wallpapers.com/images/high/flying-aguila-bird-over-glacier-mountains-gbr87rdyqgjd2gcr.webp",
  "https://wallpapers.com/images/high/bald-eagle-observing-viewer-hku22iyztvvya71w.webp",
];

const messageContainer = document.getElementById("messages-container");
const messagesStage = document.getElementById("messages-stage");
const messageTitleEl = document.getElementById("message-title");
const messageTextEl = document.getElementById("message-text");
const bgLayerMessages = document.getElementById("bg-layer-messages");
const messageSearchInput = document.getElementById("message-search-input");
const messageSuggestionsPanel = document.getElementById("message-suggestions-panel");
const messageSuggestionsList = document.getElementById("message-suggestions-list");
const messageTabsEl = document.getElementById("message-tabs");

let sermonIndex = [];
let currentSermon = null;
let messageCurrentParagraphIndex = 0;
let messageCurrentWordIndex = 0;

// Secciones del carrusel de mensajes (título + párrafos)
let currentMessageSections = [];
let currentMessageSectionIndex = 0;
let messageCarouselPrevBtn = null;
let messageCarouselNextBtn = null;

let MESSAGE_TABS = [];
let currentMessageTabId = null;
let messageShortcutInput = null;

function renderMessageTabs() {
  if (!messageTabsEl) return;
  messageTabsEl.innerHTML = "";
  MESSAGE_TABS.forEach(tab => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bible-tab" + (tab.id === currentMessageTabId ? " bible-tab--active" : "");
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
    messageTabsEl.appendChild(btn);
  });

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "bible-tab-add";
  addBtn.textContent = "+";
  addBtn.dataset.addTab = "true";
  messageTabsEl.appendChild(addBtn);

  updateMessageTabsCompression();
}

function updateMessageTabsCompression() {
  if (!messageTabsEl) return;
  const count = MESSAGE_TABS.length;
  const isMobile = window.innerWidth <= 768;
  const baseThreshold = isMobile ? 2 : 7;

  messageTabsEl.classList.remove('bible-tabs--compressed');
  messageTabsEl.classList.remove('bible-tabs--compressed-strong');

  if (count >= baseThreshold) {
    messageTabsEl.classList.add('bible-tabs--compressed');
    const strongThreshold = isMobile ? 4 : 10;
    if (count >= strongThreshold) {
      messageTabsEl.classList.add('bible-tabs--compressed-strong');
    }
  }
}

function updateMessageCarouselView() {
  if (!currentMessageSections || currentMessageSections.length === 0) return;

  currentMessageSections.forEach((sec, idx) => {
    if (!sec) return;

    if (idx === currentMessageSectionIndex) {
      sec.style.display = "block";
      // En la diapositiva del título ocultamos el bloque de texto
      if (sec === messageTitleEl && messageTextEl) {
        messageTextEl.style.display = "none";
      }
    } else {
      sec.style.display = "none";
    }
  });

  // Si no estamos en el título, aseguramos que el bloque de texto sea visible
  if (currentMessageSectionIndex !== 0 && messageTextEl) {
    messageTextEl.style.display = "block";
  }

  // Esperar a que el navegador termine de dibujar antes de centrar, para que funcione también al inicio
  setTimeout(centerActiveMessageSlide, 0);

  updateMessageCarouselControlsVisibility();
}

function showPrevMessageSection() {
  if (!currentMessageSections || currentMessageSections.length === 0) return;
  if (currentMessageSectionIndex > 0) {
    currentMessageSectionIndex -= 1;
    updateMessageCarouselView();
  }
}

function showNextMessageSection() {
  if (!currentMessageSections || currentMessageSections.length === 0) return;
  if (currentMessageSectionIndex < currentMessageSections.length - 1) {
    currentMessageSectionIndex += 1;
    updateMessageCarouselView();
  }
}

function ensureMessageCarouselControls() {
  if (!messagesStage) return;

  let controls = document.getElementById("message-carousel-controls");
  if (!controls) {
    controls = document.createElement("div");
    controls.id = "message-carousel-controls";
    controls.className = "message-carousel-controls";

    messageCarouselPrevBtn = document.createElement("button");
    messageCarouselPrevBtn.type = "button";
    messageCarouselPrevBtn.id = "message-carousel-prev";
    messageCarouselPrevBtn.className = "message-carousel-button message-carousel-button--prev";
    messageCarouselPrevBtn.textContent = "◀";

    messageCarouselNextBtn = document.createElement("button");
    messageCarouselNextBtn.type = "button";
    messageCarouselNextBtn.id = "message-carousel-next";
    messageCarouselNextBtn.className = "message-carousel-button message-carousel-button--next";
    messageCarouselNextBtn.textContent = "▶";

    controls.appendChild(messageCarouselPrevBtn);
    controls.appendChild(messageCarouselNextBtn);
    messagesStage.appendChild(controls);

    messageCarouselPrevBtn.addEventListener("click", showPrevMessageSection);
    messageCarouselNextBtn.addEventListener("click", showNextMessageSection);
  }
}

function updateMessageCarouselControlsVisibility() {
  const controls = document.getElementById("message-carousel-controls");
  if (!controls) return;

  const hasSlides = Array.isArray(currentMessageSections) && currentMessageSections.length > 1;
  const inResultsMode = !!(messagesStage && messagesStage.classList.contains('messages-stage--results'));

  const shouldShow = hasSlides && inResultsMode;
  controls.style.display = shouldShow ? 'flex' : 'none';
}

function removeMessageCarouselControls() {
  const controls = document.getElementById("message-carousel-controls");
  if (controls && controls.parentNode) {
    controls.parentNode.removeChild(controls);
  }
  messageCarouselPrevBtn = null;
  messageCarouselNextBtn = null;
}

function removeMessageShortcutInput() {
  const shortcut = document.getElementById('message-shortcut');
  if (shortcut && shortcut.parentNode) {
    shortcut.parentNode.removeChild(shortcut);
  }
  messageShortcutInput = null;
}

// Centrar verticalmente la diapositiva activa (título o párrafo) sin romper el fondo
function centerActiveMessageSlide() {
  if (!messagesStage) return;

  // Resetear márgenes previos
  messageTitleEl.style.marginTop = "";
  const paragraphs = messagesStage.querySelectorAll(".message-paragraph");
  paragraphs.forEach(p => { p.style.marginTop = ""; });

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  let activeEl = null;

  if (currentMessageSectionIndex === 0) {
    // Diapositiva de título
    activeEl = messageTitleEl;
  } else {
    const pIdx = currentMessageSectionIndex - 1;
    activeEl = document.getElementById(`msg-p-${pIdx}`);
  }

  if (!activeEl) return;

  // Si el párrafo activo es muy largo, quitar el límite interno de altura
  if (messageTextEl) {
    if (activeEl.classList && activeEl.classList.contains("message-paragraph--compact")) {
      messageTextEl.classList.add("message-text--fullheight");
    } else {
      messageTextEl.classList.remove("message-text--fullheight");
    }
  }

  const rect = activeEl.getBoundingClientRect();
  const available = viewportHeight - rect.height;

  // Solo centramos si hay espacio suficiente (texto corto). Para textos largos se mantiene alineado arriba.
  if (available > 40) {
    const offset = available / 2;
    // Convertir offset de ventana a margen relativo dentro del stage
    const stageRect = messagesStage.getBoundingClientRect();
    const relativeOffset = offset - (rect.top - stageRect.top);
    activeEl.style.marginTop = `${Math.max(relativeOffset, 0)}px`;
  }
}

function getMessageKey(title) {
  return title ? title.toUpperCase() : "";
}

function openMessageWithTab(title) {
  const key = getMessageKey(title);
  if (!key) return;

  let tab = MESSAGE_TABS.find(t => t.key === key);
  if (!tab) {
    const activeBlank = MESSAGE_TABS.find(t => t.id === currentMessageTabId && !t.key);
    if (activeBlank) {
      tab = activeBlank;
      tab.key = key;
      tab.label = title;
      tab.title = title;
    } else {
      if (MESSAGE_TABS.length >= 10) {
        console.warn('[MESSAGES] Límite máximo de 10 pestañas alcanzado.');
        return;
      }
      const newId = MESSAGE_TABS.length > 0 ? Math.max(...MESSAGE_TABS.map(t => t.id)) + 1 : 1;
      tab = { id: newId, key, label: title, title };
      MESSAGE_TABS.push(tab);
    }
  }
  currentMessageTabId = tab.id;
  renderMessageTabs();
}

function activateMessageTab(tabId) {
  const tab = MESSAGE_TABS.find(t => t.id === tabId);
  if (!tab) return;
  currentMessageTabId = tabId;
  renderMessageTabs();

  if (!tab.key || !tab.title) {
    // pestaña en blanco: solo mostrar buscador limpio
    if (messageTitleEl) {
      messageTitleEl.innerText = "";
      messageTitleEl.style.display = "none";
    }
    if (messageTextEl) {
      messageTextEl.innerHTML = "";
      messageTextEl.style.display = "none";
    }
    if (messageSearchInput) messageSearchInput.value = "";
    if (messagesStage) messagesStage.classList.remove('messages-stage--results');
    currentMessageSections = [];
    currentMessageSectionIndex = 0;
    removeMessageCarouselControls();
    removeMessageShortcutInput();
    return;
  }

  // Recargar mensaje asociado a la pestaña
  showMessage(tab.title);
}

function closeMessageTab(tabId) {
  const idx = MESSAGE_TABS.findIndex(t => t.id === tabId);
  if (idx === -1) return;
  const wasActive = MESSAGE_TABS[idx].id === currentMessageTabId;
  MESSAGE_TABS.splice(idx, 1);

  if (MESSAGE_TABS.length === 0) {
    const defaultTab = { id: 1, key: null, label: "Nueva pestaña", title: null };
    MESSAGE_TABS.push(defaultTab);
    currentMessageTabId = defaultTab.id;

    if (messageTitleEl) messageTitleEl.innerText = "";
    if (messageTextEl) messageTextEl.innerHTML = "";
    if (messageSearchInput) messageSearchInput.value = "";
    if (messagesStage) messagesStage.classList.remove('messages-stage--results');
    currentMessageSections = [];
    currentMessageSectionIndex = 0;
    removeMessageCarouselControls();
    removeMessageShortcutInput();
    renderMessageTabs();
    return;
  }

  if (wasActive) {
    const neighborIndex = idx < MESSAGE_TABS.length ? idx : MESSAGE_TABS.length - 1;
    const nextTab = MESSAGE_TABS[neighborIndex];
    if (nextTab) {
      activateMessageTab(nextTab.id);
    } else {
      renderMessageTabs();
    }
  } else {
    renderMessageTabs();
  }
}

function renderMessageSuggestions(query) {
  if (!messageSuggestionsPanel || !messageSuggestionsList || !Array.isArray(sermonIndex)) return;

  const normQuery = normalizeText(query || "");
  messageSuggestionsList.innerHTML = "";

  if (!normQuery) {
    messageSuggestionsPanel.classList.add("search-suggestions--hidden");
    return;
  }

  const matches = sermonIndex.filter(s => {
    if (!s || !s.title) return false;
    const normTitle = normalizeText(s.title);
    return normTitle.includes(normQuery);
  }).slice(0, 30);

  if (matches.length === 0) {
    messageSuggestionsPanel.classList.add("search-suggestions--hidden");
    return;
  }

  matches.forEach(s => {
    const li = document.createElement("li");
    li.className = "search-suggestions__item";
    li.textContent = s.title;
    li.dataset.title = s.title;
    messageSuggestionsList.appendChild(li);
  });

  messageSuggestionsPanel.classList.remove("search-suggestions--hidden");
}

// Cargar el índice de sermones al inicio para búsquedas instantáneas
async function initSermonIndex() {
  try {
    const resp = await fetch('messages/sermon_index.json');
    if (resp.ok) sermonIndex = await resp.json();
    console.log(`Índice cargado: ${sermonIndex.length} sermones.`);
    // Las sugerencias ahora se renderizan dinámicamente según lo que el usuario escribe
  } catch (e) {
    console.error("Error cargando índice de sermones:", e);
  }
}

window.setRandomMessageBackground = setRandomMessageBackground;
initSermonIndex();

function setRandomMessageBackground() {
  if (bgLayerMessages) {
    const random = MESSAGE_BACKGROUNDS[Math.floor(Math.random() * MESSAGE_BACKGROUNDS.length)];
    bgLayerMessages.style.backgroundImage = `url('${random}')`;
  }
}

function normalizeText(text) {
  if (!text) return "";
  return text.trim().toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,;:/!¡?¿()"]/g, '');
}

function tokenize(text) {
  return text.trim().split(/\s+/);
}

function findBestSermonInIndex(query) {
  const normQuery = normalizeText(query);
  if (!normQuery) return null;

  for (const s of sermonIndex) {
    const normTitle = normalizeText(s.title);
    if (normTitle === normQuery) {
      return s;
    }
  }
  return null;
}

async function fetchSermonContent(sermonObj, query) {
  try {
    const localResp = await fetch(`messages/library/${sermonObj.id}.json`);
    if (localResp.ok) return await localResp.json();
  } catch (e) {
    console.error("Error cargando mensaje local:", e);
  }
  return null;
}

async function showMessage(query, paragraphNumber = null) {
  if (!messageContainer || !messageTitleEl || !messageTextEl) return;

  // Estado de carga discreto
  messageTitleEl.innerText = "MENSAJE";
  messageTextEl.innerHTML = `
    <div style="text-align:center; padding: 100px; font-size: 2rem; color: rgba(255, 255, 255, 0.1);">
      <p>...</p>
    </div>
  `;
  showOnlyMessagesForm();

  // Búsqueda inteligente en el índice local
  const matchedSermon = findBestSermonInIndex(query);
  let localData = null;

  if (matchedSermon) {
    console.log("Coincidencia local encontrada:", matchedSermon.title);
    localData = await fetchSermonContent(matchedSermon, query);
  }

  if (!localData) {
    messageTitleEl.innerText = "ERROR";
    messageTextEl.innerHTML = `
      <div style="text-align:center; padding: 50px; color: #ff3d00;">
        <p>NO SE ENCONTRÓ EL MENSAJE: "${query.toUpperCase()}"</p>
        <p style="font-size: 1rem;">Intenta con otras palabras clave.</p>
      </div>
    `;
    return;
  }

  currentSermon = localData;
  setRandomMessageBackground();

  messageTitleEl.innerText = localData.title;
  messageTextEl.innerHTML = "";

   // Inicializar secciones del carrusel: primera diapositiva = título
   currentMessageSections = [];
   currentMessageSectionIndex = 0;
   currentMessageSections.push(messageTitleEl);

  // Renderizar párrafos
  localData.content.forEach((pText, pIdx) => {
    const pDiv = document.createElement("div");
    pDiv.className = "message-paragraph";
    pDiv.id = `msg-p-${pIdx}`;
    const tokens = tokenize(pText);

    // Si el párrafo contiene más de 94 palabras Y más de 528 caracteres, marcarlo como compacto
    if (tokens.length > 94 && pText.length > 528) {
      pDiv.classList.add("message-paragraph--compact");
    }

    const contentHtml = tokens.map((t, tIdx) =>
      `<span class="word" id="p-${pIdx}-w-${tIdx}">${t}</span>`
    ).join(" ");
    pDiv.innerHTML = `<span class="paragraph-num-label">${pIdx + 1}</span> ${contentHtml}`;
    messageTextEl.appendChild(pDiv);

    // Cada párrafo es una diapositiva adicional del carrusel
    currentMessageSections.push(pDiv);
  });

  // Si se pidió un párrafo específico, saltar directamente a esa diapositiva (título = índice 0)
  messageCurrentParagraphIndex = (paragraphNumber !== null) ? paragraphNumber - 1 : 0;
  messageCurrentWordIndex = 0;
  if (paragraphNumber !== null && paragraphNumber >= 1 && paragraphNumber <= currentSermon.content.length) {
    currentMessageSectionIndex = paragraphNumber; // 1 = primer párrafo, 0 = título
  } else {
    currentMessageSectionIndex = 0;
  }

  // Activar modo resultados antes de actualizar el carrusel y las flechas
  if (messagesStage) {
    messagesStage.classList.add('messages-stage--results');
  }

  updateMessageCarouselView();
  ensureMessageCarouselControls();
  updateMessageCarouselControlsVisibility();

  // Asociar este mensaje con una pestaña
  openMessageWithTab(localData.title);

  // Asegurar atajo para saltar a párrafo
  ensureMessageShortcutInput();
}

function jumpToMessageSectionByShortcut(raw) {
  if (!raw) return;
  if (!Array.isArray(currentMessageSections) || currentMessageSections.length === 0) return;

  const value = raw.trim().toUpperCase();

  // Si contiene la palabra TITULO/TÍTULO en cualquier parte, ir al título
  if (value.includes('TITULO') || value.includes('TÍTULO')) {
    currentMessageSectionIndex = 0;
    updateMessageCarouselView();
    return;
  }

  // Extraer el primer número que aparezca en el texto
  const match = value.match(/\d+/);
  if (!match) return;
  const num = parseInt(match[0], 10);

  // Si el número es 0, también se interpreta como título
  if (num === 0) {
    currentMessageSectionIndex = 0;
    updateMessageCarouselView();
    return;
  }

  // Índice 0 corresponde al título, los párrafos comienzan en 1
  if (num < 1 || num >= currentMessageSections.length) return;

  currentMessageSectionIndex = num;
  updateMessageCarouselView();
}

function ensureMessageShortcutInput() {
  if (!messagesStage) return;

  let shortcut = document.getElementById('message-shortcut');
  if (!shortcut) {
    shortcut = document.createElement('div');
    shortcut.id = 'message-shortcut';
    shortcut.className = 'message-shortcut';

    const label = document.createElement('span');
    label.className = 'message-shortcut__label';
    label.textContent = 'Ir a párrafo:';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'message-shortcut-input';
    input.className = 'message-shortcut__input';
    input.placeholder = 'Ej: 1, 2, 3';

    shortcut.appendChild(label);
    shortcut.appendChild(input);
    messagesStage.appendChild(shortcut);

    messageShortcutInput = input;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        jumpToMessageSectionByShortcut(input.value);
      }
    });
  } else {
    const existingInput = document.getElementById('message-shortcut-input');
    if (existingInput) {
      messageShortcutInput = existingInput;
    }
  }
}

// Navegación con teclado para el carrusel de mensajes (flechas izquierda/derecha)
function initMessageKeyboardNavigation() {
  window.addEventListener("keydown", (e) => {
    // Solo actuar si estamos en la vista de mensajes con resultados cargados
    if (!messagesStage || !messagesStage.classList.contains("messages-stage--results")) return;

    // No interferir cuando el foco está en un campo de texto o textarea
    const target = e.target;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      showPrevMessageSection();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      showNextMessageSection();
    }
  });
}

function showOnlyMessagesForm() {
  const containers = [
    'rest-container', 'voice-container', 'bible-container',
    'hymns-container', 'prayer-container', 'goodbye-container', 'bg-layer', 'overlay'
  ];
  containers.forEach(id => document.getElementById(id)?.classList.add('form-hidden'));
  messageContainer.classList.remove("form-hidden");
}

window.messageTrackReading = function (transcript) {
  // Efecto de colorear texto con voz desactivado a petición del usuario.
  return;
};

window.findParagraphByContent = function (spokenText) {
  if (!currentSermon || !spokenText || spokenText.length < 15) return;
  const normSpoken = normalizeText(spokenText);
  const wordsSpoken = normSpoken.split(/\s+/).filter(w => w.length >= 4);

  if (wordsSpoken.length < 3) return;

  let bestIdx = -1;
  let maxMatches = 0;

  currentSermon.content.forEach((pText, idx) => {
    const normP = normalizeText(pText);
    let matches = 0;
    wordsSpoken.forEach(w => {
      if (normP.includes(w)) matches++;
    });
    if (matches > maxMatches) {
      maxMatches = matches;
      bestIdx = idx;
    }
  });

  if (maxMatches / wordsSpoken.length > 0.7) {
    messageCurrentParagraphIndex = bestIdx;
    messageCurrentWordIndex = 0;
    document.querySelector(".paragraph-active")?.classList.remove("paragraph-active");
    const targetP = document.getElementById(`msg-p-${bestIdx}`);
    if (targetP) {
      targetP.classList.add("paragraph-active");
      targetP.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
};

window.updateMessageFromSpeech = function (transcript) {
  if (!transcript) return false;
  const raw = transcript.trim().toUpperCase();

  // 1. Navegación directa por párrafo (Si ya hay un mensaje abierto)
  const paragraphOnly = raw.match(/(?:PARRAFO|PÁRRAFO|PÁGINA|PAGINA)\s+(\d+)/);
  if (paragraphOnly && currentSermon) {
    const pNum = parseInt(paragraphOnly[1], 10);
    const pIdx = pNum - 1;
    if (pIdx >= 0 && pIdx < currentSermon.content.length) {
      currentParagraphIndex = pIdx;
      currentWordIndex = 0;
      document.querySelector(".paragraph-active")?.classList.remove("paragraph-active");
      const targetP = document.getElementById(`msg-p-${pIdx}`);
      if (targetP) {
        targetP.classList.add("paragraph-active");
        targetP.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return true;
    }
  }

  // 2. Búsqueda de Mensaje (con o sin párrafo)
  let query = "";
  let paragraph = null;
  let explicitCommand = false;

  const messageRegex = /MENSAJE\s+(.+)/i;
  const messageMatch = raw.match(messageRegex);

  if (messageMatch) {
    explicitCommand = true;
    const content = messageMatch[1].trim();
    const pMatch = content.match(/(.*?)\s+(?:PARRAFO|PÁRRAFO|PÁGINA|PAGINA)\s+(\d+)/);
    if (pMatch) {
      query = pMatch[1].trim();
      paragraph = parseInt(pMatch[2], 10);
    } else {
      query = content;
    }
  } else {
    // Intento directo sin la palabra clave "MENSAJE"
    const pMatch = raw.match(/(.*?)\s+(?:PARRAFO|PÁRRAFO|PÁGINA|PAGINA)\s+(\d+)/);
    if (pMatch) {
      query = pMatch[1].trim();
      paragraph = parseInt(pMatch[2], 10);
    } else {
      query = raw;
    }
  }

  query = query.replace(/^[^\w\sÁÉÍÓÚÑ]+|[^\w\sÁÉÍÓÚÑ]+$/g, '').trim();

  if (query.length > 2) {
    if (explicitCommand) {
      showMessage(query, paragraph);
      return true;
    } else {
      // Si no es explícito, verificamos si existe en el índice para no falsos positivos
      const match = findBestSermonInIndex(query);
      if (match) {
        showMessage(query, paragraph);
        return true;
      }
    }
  }

  return false;
};

function initManualMessageSearch() {
  const form = document.getElementById("message-search-form");
  const input = document.getElementById("message-search-input");
  const button = document.getElementById("message-search-button");
  if (!form || !input || !button) return;
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q.length > 2) {
      showMessage(q);
      if (messageSuggestionsPanel && messageSuggestionsList) {
        messageSuggestionsPanel.classList.add("search-suggestions--hidden");
        messageSuggestionsList.innerHTML = "";
      }
    }
  });

  // Permitir buscar mensaje con la tecla Enter
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = input.value.trim();
      if (q.length > 2) {
        showMessage(q);
        if (messageSuggestionsPanel && messageSuggestionsList) {
          messageSuggestionsPanel.classList.add("search-suggestions--hidden");
          messageSuggestionsList.innerHTML = "";
        }
      }
    }
  });

  if (messageSearchInput && messageSuggestionsPanel && messageSuggestionsList) {
    messageSearchInput.addEventListener("input", () => {
      renderMessageSuggestions(messageSearchInput.value);
    });

    messageSuggestionsList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const item = target.closest(".search-suggestions__item");
      if (!item) return;
      const title = item.dataset.title || item.textContent;
      if (title) {
        showMessage(title);
      }
      messageSuggestionsPanel.classList.add("search-suggestions--hidden");
      messageSuggestionsList.innerHTML = "";
    });
  }
}
window.addEventListener("DOMContentLoaded", () => {
  initManualMessageSearch();
  initMessageKeyboardNavigation();
  if (messageTabsEl && MESSAGE_TABS.length === 0) {
    const defaultTab = { id: 1, key: null, label: "Nueva pestaña", title: null };
    MESSAGE_TABS.push(defaultTab);
    currentMessageTabId = defaultTab.id;
    renderMessageTabs();
    currentMessageSections = [];
    currentMessageSectionIndex = 0;
    removeMessageCarouselControls();
    removeMessageShortcutInput();
  }

  if (messageTabsEl) {
    messageTabsEl.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.dataset.addTab === "true") {
        if (MESSAGE_TABS.length >= 10) {
          console.warn('[MESSAGES] Límite máximo de 10 pestañas alcanzado.');
          return;
        }
        const newId = MESSAGE_TABS.length > 0 ? Math.max(...MESSAGE_TABS.map(t => t.id)) + 1 : 1;
        const newTab = { id: newId, key: null, label: "Nueva pestaña", title: null };
        MESSAGE_TABS.push(newTab);
        currentMessageTabId = newId;
        renderMessageTabs();

        if (messageTitleEl) {
          messageTitleEl.innerText = "";
          messageTitleEl.style.display = "none";
        }
        if (messageTextEl) {
          messageTextEl.innerHTML = "";
          messageTextEl.style.display = "none";
        }
        if (messageSearchInput) messageSearchInput.value = "";
        if (messagesStage) messagesStage.classList.remove('messages-stage--results');
        currentMessageSections = [];
        currentMessageSectionIndex = 0;
        removeMessageCarouselControls();
        removeMessageShortcutInput();
        return;
      }

      const closeId = target.dataset.closeTabId;
      if (closeId) {
        closeMessageTab(parseInt(closeId, 10));
        return;
      }

      const tabButton = target.closest(".bible-tab");
      if (tabButton && tabButton instanceof HTMLElement) {
        const tabIdStr = tabButton.dataset.tabId;
        if (tabIdStr) {
          activateMessageTab(parseInt(tabIdStr, 10));
        }
      }
    });
  }
});

window.addEventListener('resize', () => {
  updateMessageTabsCompression();
});
