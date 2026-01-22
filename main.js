const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'img', 'logo.png')  // <- usa img/logo.png
  });

  // Ejemplo: cargar Ebenezer
  // win.loadURL('http://localhost:8000');
  // o
  // win.loadFile('index.html');
}

app.whenReady().then(createWindow);