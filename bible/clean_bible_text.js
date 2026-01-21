const fs = require('fs');
const path = require('path');

const biblePath = path.join(__dirname, 'Holy-bible', 'bible.json');

try {
    console.log("Leyendo bible.json...");
    let raw = fs.readFileSync(biblePath, 'utf8');

    // Contar ocurrencias antes
    const count = (raw.match(/\/n/g) || []).length;
    console.log(`Encontradas ${count} ocurrencias de '/n'.`);

    if (count > 0) {
        console.log("Limpiando...");
        // Reemplazar /n por nada (o espacio si es necesario, pero parece ser prefijo basura)
        // Viendo el ejemplo: "/nLos hijos...", parece que sobra totalmente.
        const cleaned = raw.replace(/\/n/g, "");

        fs.writeFileSync(biblePath, cleaned, 'utf8');
        console.log("Archivo guardado limpio.");
    } else {
        console.log("No se requiere limpieza.");
    }

} catch (e) {
    console.error("Error:", e);
}
