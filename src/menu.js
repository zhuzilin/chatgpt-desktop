const { app, Menu, shell, session, dialog } = require('electron');
const { readFile } = require('fs').promises;

const url = 'https://chat.openai.com'
const token_key = '__Secure-next-auth.session-token'

const template = [
    {
        role: 'editMenu'
    },
    {
        label: 'Tool',
        submenu: [
            {role: 'reload'},
            {
                label: 'Back',
                accelerator: 'Backspace',
                click (menuItem, browserWindow) {
                    if(browserWindow.webContents.canGoBack())
                        browserWindow.webContents.goBack();
                }
            },
            {
                label: 'Set Cookie',
                async click (menuItem, browserWindow) {
                    const file = await dialog.showOpenDialog({
                        properties: ['openFile']
                    })
                    if (!file.canceled && file.filePaths.length > 0) {
                        const token_value = await readFile(file.filePaths[0], 'utf8')
                        const cookies = session.defaultSession.cookies;
                        let values = await cookies.get({ url: url })
                        for (const value of values) {
                            await cookies.remove(url, value.name);
                        }
                        values = await cookies.get({ url: url })
                        await cookies.set({
                            url: url,
                            name: token_key,
                            value: token_value,
                            secure: true,
                        })
                        await cookies.flushStore()
                        values = await cookies.get({ url: url })
                        browserWindow.loadURL(url)
                    }
                }
            },
            {
                label: 'Clear Cookie',
                async click (menuItem, browserWindow) {
                    cookies = session.defaultSession.cookies;
                    await cookies.remove(url, token_key)
                    browserWindow.webContents.reload()
                }
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'About',
                click () { shell.openExternal('https://github.com/zhuzilin/chatgpt-desktop') }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}

        ]
    });

    // Window menu
    template[3].submenu = [
        {role: 'close'},
        {role: 'minimize'},
        {role: 'zoom'},
        {type: 'separator'},
        {role: 'front'}
    ]
}

const menu = Menu.buildFromTemplate(template)

exports.menu = menu;