(function () {
    'use strict';

    function showSection(sectionKey) {
        const rest = document.getElementById('rest-container');
        const voice = document.getElementById('voice-container');
        const bible = document.getElementById('bible-container');
        const hymns = document.getElementById('hymns-container');
        const messages = document.getElementById('messages-container');
        const classBible = document.getElementById('class-container');
        const specials = document.getElementById('specials-container');
        const prayer = document.getElementById('prayer-container');
        const goodbye = document.getElementById('goodbye-container');

        const bgLayer = document.getElementById('bg-layer');
        const overlay = document.getElementById('overlay');

        const allSections = [rest, voice, bible, hymns, messages, classBible, specials, prayer, goodbye];

        // Reset layout state for search/result views
        const bibleStage = bible ? bible.querySelector('.bible-stage') : null;
        if (bibleStage) bibleStage.classList.remove('bible-stage--results');
        if (hymns) hymns.classList.remove('hymns-container--results');

        // Controlar reconocimiento de voz: solo activo en sección "Voz"
        if (typeof window.stopVoiceRecognition === 'function') {
            window.stopVoiceRecognition();
        }

        allSections.forEach(sec => {
            if (!sec) return;
            if (!sec.classList.contains('form-hidden')) {
                sec.classList.add('form-hidden');
            }
        });

        // Fondo principal solo para la pantalla de descanso
        if (sectionKey === 'home') {
            if (bgLayer) bgLayer.classList.remove('form-hidden');
            if (overlay) overlay.classList.remove('form-hidden');
            if (rest) rest.classList.remove('form-hidden');
        } else {
            if (bgLayer) bgLayer.classList.add('form-hidden');
            if (overlay) overlay.classList.add('form-hidden');

            if (sectionKey === 'voice' && voice) {
                voice.classList.remove('form-hidden');
                if (typeof window.startVoiceRecognition === 'function') {
                    window.startVoiceRecognition();
                }
            }
            if (sectionKey === 'bible' && bible) {
                // Resetear contenido visible de Biblia al entrar desde el menú
                const bibleTitle = document.getElementById('bible-title');
                const bibleVerse = document.getElementById('bible-verse');
                const bibleInput = document.getElementById('bible-search-input');
                const bibleSuggestionsPanel = document.getElementById('bible-suggestions-panel');
                const bibleSuggestionsList = document.getElementById('bible-suggestions-list');
                if (bibleTitle) bibleTitle.textContent = '';
                if (bibleVerse) bibleVerse.innerHTML = '';
                if (bibleInput) bibleInput.value = '';
                if (bibleSuggestionsPanel && bibleSuggestionsList) {
                    bibleSuggestionsPanel.classList.add('search-suggestions--hidden');
                    bibleSuggestionsList.innerHTML = '';
                }

                bible.classList.remove('form-hidden');
                // En modo búsqueda usamos las fotos de Biblias físicas
                if (typeof window.setRandomBibleSearchBackground === 'function') {
                    window.setRandomBibleSearchBackground();
                } else if (typeof window.setRandomBibleBackground === 'function') {
                    // Fallback por si no está definida la función de búsqueda
                    window.setRandomBibleBackground();
                }
            }
            if (sectionKey === 'hymns' && hymns) {
                // Resetear contenido visible de Himnos al entrar desde el menú
                const hymnTitle = document.getElementById('hymn-title');
                const hymnLyrics = document.getElementById('hymn-lyrics');
                const hymnInput = document.getElementById('hymn-number-input');
                const hymnSuggestionsPanel = document.getElementById('hymn-suggestions-panel');
                const hymnSuggestionsList = document.getElementById('hymn-suggestions-list');
                if (hymnTitle) hymnTitle.textContent = '';
                if (hymnLyrics) hymnLyrics.innerHTML = '';
                if (hymnInput) hymnInput.value = '';
                if (hymnSuggestionsPanel && hymnSuggestionsList) {
                    hymnSuggestionsPanel.classList.add('search-suggestions--hidden');
                    hymnSuggestionsList.innerHTML = '';
                }

                hymns.classList.remove('form-hidden');
                if (typeof window.setRandomHymnBackground === 'function') {
                    window.setRandomHymnBackground();
                }
            }
            if (sectionKey === 'messages' && messages) {
                // Si no hay mensaje activo, limpiar y mostrar buscador.
                const messagesStageEl = document.getElementById('messages-stage');
                const messageTitle = document.getElementById('message-title');
                const hasResults = !!(messagesStageEl && messagesStageEl.classList.contains('messages-stage--results'));

                if (!hasResults && (!messageTitle || !messageTitle.textContent)) {
                    const messageText = document.getElementById('message-text');
                    const messageInput = document.getElementById('message-search-input');
                    const messageSuggestionsPanel = document.getElementById('message-suggestions-panel');
                    const messageSuggestionsList = document.getElementById('message-suggestions-list');
                    if (messageTitle) messageTitle.textContent = '';
                    if (messageText) messageText.innerHTML = '';
                    if (messageInput) messageInput.value = '';
                    if (messageSuggestionsPanel && messageSuggestionsList) {
                        messageSuggestionsPanel.classList.add('search-suggestions--hidden');
                        messageSuggestionsList.innerHTML = '';
                    }
                }

                messages.classList.remove('form-hidden');
                if (typeof window.setRandomMessageBackground === 'function') {
                    window.setRandomMessageBackground();
                }
            }
            if (sectionKey === 'class' && classBible) {
                classBible.classList.remove('form-hidden');
                if (typeof window.showClassBibleScene === 'function') {
                    window.showClassBibleScene();
                }
            }
            if (sectionKey === 'specials' && specials) {
                specials.classList.remove('form-hidden');
                if (typeof window.showSpecialsScene === 'function') {
                    window.showSpecialsScene();
                }
            }
            if (sectionKey === 'prayer' && prayer) {
                prayer.classList.remove('form-hidden');
                if (typeof window.showPrayerScene === 'function') {
                    window.showPrayerScene();
                }
            }
            if (sectionKey === 'goodbye' && goodbye) {
                if (typeof window.showGoodbyeFromMenu === 'function') {
                    window.showGoodbyeFromMenu();
                } else {
                    goodbye.classList.remove('form-hidden');
                }
            }
        }

        // Marcar opción activa en el menú
        const items = document.querySelectorAll('.main-menu__item');
        items.forEach(item => {
            const key = item.getAttribute('data-section');
            if (key === sectionKey) {
                item.classList.add('main-menu__item--active');
            } else {
                item.classList.remove('main-menu__item--active');
            }
        });
    }

    window.showSection = showSection;

    window.addEventListener('DOMContentLoaded', () => {
        const menu = document.querySelector('.main-menu');
        const toggle = document.querySelector('.main-menu__toggle');
        const mobileBottomNav = document.getElementById('mobile-bottom-nav');

        // Optimización: Delegación de eventos en el contenedor padre
        if (menu) {
            // Delegación: manejar clicks en los botones del menú superior (escritorio y móvil)
            menu.addEventListener('click', (e) => {
                const item = e.target.closest('.main-menu__item');
                if (item) {
                    e.preventDefault();
                    const key = item.getAttribute('data-section');
                    if (key) {
                        showSection(key);
                    }
                    // Cerrar panel desplegable en móviles
                    menu.classList.remove('main-menu--open');
                }
            });
        }

        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                menu.classList.toggle('main-menu--open');
            });
        }

        // Barra inferior exclusiva para móviles
        if (mobileBottomNav) {
            mobileBottomNav.addEventListener('click', (e) => {
                const item = e.target.closest('.mobile-bottom-nav__item');
                if (!item) return;
                e.preventDefault();
                const key = item.getAttribute('data-section');
                if (key) {
                    showSection(key);
                }
            });
        }

        // Atajos de teclado 1-9 para cambiar de sección del menú
        // 1: Inicio, 2: Voz, 3: Biblia, 4: Himnos, 5: Mensajes,
        // 6: Clases, 7: Especiales, 8: Oración, 9: Despedida
        // Además: tecla "t" abre una nueva pestaña interna solo cuando estamos en Biblia, Himnos o Mensajes.
        window.addEventListener('keydown', (e) => {
            // No interferir cuando el usuario está escribiendo en campos de texto
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
                return;
            }

            const key = e.key;

            // Atajo: "t" crea una nueva pestaña interna SOLO si la sección activa es Biblia, Himnos o Mensajes
            if ((key === 't' || key === 'T') && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                const activeItem = document.querySelector('.main-menu__item.main-menu__item--active');
                const activeSection = activeItem ? activeItem.getAttribute('data-section') : null;

                if (activeSection === 'bible') {
                    const tabsEl = document.getElementById('bible-tabs');
                    const addBtn = tabsEl ? tabsEl.querySelector('[data-add-tab="true"]') : null;
                    if (addBtn && addBtn instanceof HTMLElement) {
                        e.preventDefault();
                        addBtn.click();
                    }
                    return;
                }

                if (activeSection === 'hymns') {
                    const tabsEl = document.getElementById('hymn-tabs');
                    const addBtn = tabsEl ? tabsEl.querySelector('[data-add-tab="true"]') : null;
                    if (addBtn && addBtn instanceof HTMLElement) {
                        e.preventDefault();
                        addBtn.click();
                    }
                    return;
                }

                if (activeSection === 'messages') {
                    const tabsEl = document.getElementById('message-tabs');
                    const addBtn = tabsEl ? tabsEl.querySelector('[data-add-tab="true"]') : null;
                    if (addBtn && addBtn instanceof HTMLElement) {
                        e.preventDefault();
                        addBtn.click();
                    }
                    return;
                }
            }

            // Atajo: "w" cierra la pestaña activa de Biblia (equivalente a pulsar la "x" de la pestaña)
            if ((key === 'w' || key === 'W') && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                const activeItem = document.querySelector('.main-menu__item.main-menu__item--active');
                const activeSection = activeItem ? activeItem.getAttribute('data-section') : null;

                if (activeSection === 'bible') {
                    const tabsEl = document.getElementById('bible-tabs');
                    const activeTab = tabsEl ? tabsEl.querySelector('.bible-tab.bible-tab--active') : null;
                    const closeBtn = activeTab ? activeTab.querySelector('[data-close-tab-id]') : null;
                    if (closeBtn && closeBtn instanceof HTMLElement) {
                        e.preventDefault();
                        closeBtn.click();
                    }
                    return;
                }
            }

            if (!/^[1-9]$/.test(key)) return;

            const sectionMap = {
                '1': 'home',
                '2': 'voice',
                '3': 'bible',
                '4': 'hymns',
                '5': 'messages',
                '6': 'class',
                '7': 'specials',
                '8': 'prayer',
                '9': 'goodbye'
            };

            const targetSection = sectionMap[key];
            if (!targetSection) return;

            e.preventDefault();
            showSection(targetSection);
        });

        // Optimización global de imágenes: carga diferida y decodificación asíncrona
        document.querySelectorAll('img').forEach(img => {
            img.setAttribute('loading', 'lazy');
            img.setAttribute('decoding', 'async');
        });

        // Estado inicial: Inicio
        showSection('home');
    });
})();
