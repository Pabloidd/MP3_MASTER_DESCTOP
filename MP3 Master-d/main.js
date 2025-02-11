const { app, BrowserWindow, screen, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const mainWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      zoomFactor: 1,
    }
  });


    mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));
    mainWindow.setFullScreen(true);


    mainWindow.webContents.on('zoom-changed', (event, zoomDirection) => {
          event.preventDefault(); // Запрещаем зум
    });

    mainWindow.on('closed', () => {
      console.log('Window closed');
      mainWindow = null
    });

    // Пример использования горячих клавиш (Ctrl+= и Ctrl+-)
  globalShortcut.register('CommandOrControl+=', () => {
        let currentZoom = mainWindow.webContents.getZoomFactor();
        mainWindow.webContents.setZoomFactor(Math.min(currentZoom + 0.1, 2)); // Увеличиваем на 0.1, максимум до 2
    });

    globalShortcut.register('CommandOrControl+-', () => {
      let currentZoom = mainWindow.webContents.getZoomFactor();
      mainWindow.webContents.setZoomFactor(Math.max(currentZoom - 0.1, 0.5)); // Уменьшаем на 0.1, минимум до 0.5
    });

    globalShortcut.register('CommandOrControl+0', () => {
        mainWindow.webContents.setZoomFactor(1); // Сбрасываем до 1.
    });

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    globalShortcut.unregisterAll();
    app.quit()
  }
});
