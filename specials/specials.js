// Escenas para Especiales (canciones especiales para el Señor)
const SPECIALS_SCENES = [
  {
    background:
      "https://media.istockphoto.com/id/1484095487/es/foto/oraci%C3%B3n-manual-sobre-fondo-bokeh-de-luz-naranja.jpg?s=612x612&w=0&k=20&c=4nyYUgihO_v9_sEBnqgQn7UKAYgwojz9aM78Kbv4R2k=",
    title: "ESPECIALES",
    subtitle: "Salmos 104:33",
    text:
      "Cantaré a Jehová en mi vida; a mi Dios cantaré salmos mientras viva."
  },
  {
    background: "https://media.istockphoto.com/id/1402981447/es/foto/las-manos-humanas-abren-la-mano-de-adoraci%C3%B3n.jpg?s=612x612&w=0&k=20&c=P1pIXIAWCDmax4HgIl2lnOmvCbGGxqlSzlqbmWPa7zo=",
    title: "ESPECIALES",
    subtitle: "Hebreos 13:15 ",
    text:
      "Ofrezcamos siempre a Dios, por medio de él, sacrificio de alabanza, es decir, fruto de labios que confiesan su nombre."
  },
  {
    background:
      "https://img.freepik.com/foto-gratis/varon-joven-hablando-sosteniendo-biblia-sus-manos_181624-25520.jpg?semt=ais_hybrid&w=740&q=80",
    title: "ESPECIALES",
    subtitle: "Éxodo 15:2",
    text:
      "El Señor es mi fuerza y mi cántico; él es mi salvación. Él es mi Dios, y lo alabaré; es el Dios de mi padre, y lo enalteceré."
  },
  {
    background:
      "https://contralaapostasia.com/wp-content/uploads/2015/11/hombre-de-dios.jpg",
    title: "ESPECIALES",
    subtitle: "Salmos 34:1",
    text:
      "Bendeciré a Jehová en todo tiempo; su alabanza estará de continuo en mi boca."
  },
  {
    background:
      "https://s.bibliaon.com/es/imagenes/adoracion-dios-que-como-adorarle-og.jpg",
    title: "ESPECIALES",
    subtitle: "Salmos 150:6",
    text:
      "Todo lo que respira alabe a JAH. Aleluya."
  },
  {
    background:
      "https://img.freepik.com/foto-gratis/adolescente-oracion-naturaleza-soleada_1150-7219.jpg",
    title: "ESPECIALES",
    subtitle: "Salmos 47:1",
    text:
      "Pueblos todos, batid las manos; aclamad a Dios con voz de júbilo."
  },
  {
    background:
      "https://media.istockphoto.com/id/1471817807/es/v%C3%ADdeo/silueta-de-manos-humanas-abiertas-palma-hacia-arriba-adoraci%C3%B3n-terapia-eucar%C3%ADstica-bendice-a.jpg?s=640x640&k=20&c=MbRnCbQT0BmTrhy5oB7I39nV88xGdwHArv6axAPBT0Y=",
    title: "ESPECIALES",
    subtitle: "Salmos 96:1",
    text:
      "Cantad a Jehová cántico nuevo; cantad a Jehová, toda la tierra."
  },
  {
    background:
      "https://soltarlapalabra.wordpress.com/wp-content/uploads/2012/04/adorando2011-1.jpg",
    title: "ESPECIALES",
    subtitle: "Salmos 147:7",
    text:
      "Cantad a Jehová con gracia; cantad salmos con arpa a nuestro Dios."
  },
  {
    background:
      "https://media.istockphoto.com/id/806917618/es/foto/silueta-de-hombre-levant%C3%B3-las-manos-con-las-monta%C3%B1as-del-paisaje-al-atardecer.jpg?s=612x612&w=0&k=20&c=iRDBqFrDX7kuSUk7s40TDhX1WZmXyNUmGv9bC3txgdI=",
    title: "ESPECIALES",
    subtitle: "Salmos 149:3",
    text:
      "Alaben su nombre con danza; con pandero y arpa a él canten."
  }
];

function showSpecialsScene() {
  const container = document.getElementById('specials-container');
  const bgLayer = document.getElementById('bg-layer-specials');
  const titleEl = document.getElementById('specials-title');
  const subtitleEl = document.getElementById('specials-subtitle');
  const textEl = document.getElementById('specials-text');
  if (!container || !bgLayer || !titleEl || !subtitleEl || !textEl) return;

  const random = SPECIALS_SCENES[Math.floor(Math.random() * SPECIALS_SCENES.length)];

  bgLayer.style.backgroundImage = `url('${random.background}')`;
  titleEl.textContent = random.title;
  subtitleEl.textContent = random.subtitle;
  textEl.textContent = `"${random.text}"`;

  container.classList.remove('form-hidden');
}

window.showSpecialsScene = showSpecialsScene;
