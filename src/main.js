const { app, Menu, BrowserWindow } = require('electron');
let { menu } = require('./menu');

let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        title: app.getName(),
        width: 1000,
        height: 800,
        icon: './img/openai-avatar.png',
        webPreferences: {
            nodeIntegration: false
        }
    });
    // mainWindow.webContents.openDevTools();
    mainWindow.loadURL('https://chat.openai.com/chat');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', async () => {
    console.log('ready')
    await createWindow();
    Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});