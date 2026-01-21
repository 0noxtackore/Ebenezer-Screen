const bgLayer = document.getElementById('bg-layer');
const overlay = document.getElementById('overlay');

// 1. Configuración de fondos usando GIFs locales en la carpeta img
// Asegúrate de tener: img/morning.gif, img/afternoon.gif, img/night.gif
const backgrounds = {
    morning: "https://i.pinimg.com/originals/83/21/41/832141b397980bb46259c93938829e97.gif",
    afternoon: "https://i.pinimg.com/originals/5a/f8/5b/5af85b84954519f43c8da72a3e9486d1.gif",
    night: "https://i.pinimg.com/originals/f4/46/2d/f4462d9b13f40600953ca1ac773c21c0.gif"
};

function updateScene() {
    const hour = new Date().getHours();
    let selectedBg = "";
    let overlayColor = "rgba(0, 0, 0, 0.5)"; // Color por defecto

    if (hour >= 6 && hour < 12) {
        selectedBg = backgrounds.morning;
        overlayColor = "rgba(100, 100, 50, 0.4)"; // Tono cálido mañana
    } else if (hour >= 12 && hour < 20) {
        selectedBg = backgrounds.afternoon;
        overlayColor = "rgba(150, 50, 0, 0.4)";  // Tono naranja tarde
    } else {
        selectedBg = backgrounds.night;
        overlayColor = "rgba(0, 0, 50, 0.5)";    // Tono azul noche
    }

    bgLayer.style.backgroundImage = `url('${selectedBg}')`;
    overlay.style.backgroundColor = overlayColor;
}

// Actualizar cada minuto para el cambio de hora
setInterval(updateScene, 60000);
updateScene();