// Escenas de Clase Bíblica (fondos + textos sobre los niños)
const CLASS_BIBLE_SCENES = [
  {
    background:
      "https://i.ibb.co/JRNb8JjF/Whats-App-Image-2026-01-19-at-10-38-04-AM.jpg",
    title: "CLASE BÍBLICA",
    ref: "Mateo 19:14",
    text:
      "Dejad a los niños venir a mí, y no se lo impidáis; porque de los tales es el reino de los cielos."
  },
  {
    background:
      "https://i.ibb.co/0jH2cfdD/Whats-App-Image-2026-01-19-at-10-37-54-AM-1.jpg",
    title: "CLASE BÍBLICA",
    ref: "Salmo 8:2",
    text:
      "De la boca de los niños y de los que maman, fundaste la fortaleza, a causa de tus enemigos, para hacer callar al enemigo y al vengativo"
  },
  {
    background:
      "https://i.ibb.co/4wZkXfjF/Whats-App-Image-2026-01-19-at-10-37-54-AM-2.jpg",
    title: "CLASE BÍBLICA",
    ref: "Proverbios 22:6",
    text:
      "Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él."
  },
  {
    background:
      "https://i.ibb.co/DDP9y9Lj/Whats-App-Image-2026-01-19-at-10-37-54-AM-3.jpg",
    title: "CLASE BÍBLICA",
    ref: "Mateo 11:25",
    text:
      "Te alabo Padre, Señor del cielo y de la tierra, porque has escondido estas cosas de los sabios y entendidos, y se las has revelado a estos que son como niños. Sí Padre, porque así te agradó."
  },
  {
    background:
      "https://i.ibb.co/8DR0Hpn7/Whats-App-Image-2026-01-19-at-10-37-54-AM.jpg",
    title: "CLASE BÍBLICA",
    ref: "Mateo 18:3",
    text: "En verdad os digo que, si no vosotros no os convertís y no se hacéis como niños, de ninguna manera entrareis en el reino de los cielos."
  },
  {
    background:
      "https://i.ibb.co/7t5Qw61K/Whats-App-Image-2026-01-19-at-10-37-55-AM.jpg",
    title: "CLASE BÍBLICA",
    ref: "Deuteronomio 6:6-7",
    text:
      "Y estas palabras que yo te mando hoy, estarán sobre tu corazón; y las repetirás a tus hijos."
  }
];

function showClassBibleScene() {
  const container = document.getElementById('class-container');
  const bgLayer = document.getElementById('bg-layer-class');
  const titleEl = document.getElementById('class-title');
  const refEl = document.getElementById('class-ref');
  const textEl = document.getElementById('class-text');
  if (!container || !bgLayer || !titleEl || !refEl || !textEl) return;

  const random = CLASS_BIBLE_SCENES[Math.floor(Math.random() * CLASS_BIBLE_SCENES.length)];

  bgLayer.style.backgroundImage = `url('${random.background}')`;
  titleEl.textContent = random.title;
  refEl.textContent = random.ref;
  // Versículo entre comillas como en prayer/goodbye
  textEl.textContent = `"${random.text}"`;

  container.classList.remove('form-hidden');
}

window.showClassBibleScene = showClassBibleScene;
