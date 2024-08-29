// Module to control the application lifecycle and the native browser window.
import {
	app,
	BrowserWindow,
	protocol,
	Menu,
	MenuItem,
	shell,
	ipcMain,
	dialog,
} from 'electron'
import { readFile, writeFile } from 'fs'
import * as path from 'path'
import * as url from 'url'

const isMac = process.platform === 'darwin'

// since our main window is global when the app closes we need to delete it
// to avoid memory leaks
let mainWindow: BrowserWindow | null

// Create windows =====================================
function createWindow() {
	mainWindow = new BrowserWindow({
		title: 'Bark Dialogue Editor',
		width: 1280,
		height: 720,
		webPreferences: {
			preload: path.join(__dirname, '..', 'preload', 'preload.js'),
		},
		show: false, // don't show until ready
	})

	const splashWindow = new BrowserWindow({
		width: 600,
		height: 660,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
	})

	// In production, set the initial browser path to the local bundle generated
	// by the Create React App build process.
	// In development, set it to localhost to allow live/hot-reloading.
	const appURL = app.isPackaged
		? url.format({
				pathname: path.join(__dirname, '..', 'renderer', 'index.html'),
				protocol: 'file:',
				slashes: true,
		  })
		: 'http://localhost:3000'

	const splashURL = app.isPackaged
		? url.format({
				pathname: path.join(__dirname, '..', 'renderer', 'splash.html'),
				protocol: 'file:',
				slashes: true,
		  })
		: 'http://localhost:3000/splash.html'

	// set the user agent to electron so we can retrieve this on the app side
	mainWindow.loadURL(appURL, { userAgent: 'Electron' })
	splashWindow.loadURL(splashURL, { userAgent: 'Electron' })

	setTimeout(() => {
		splashWindow.destroy()
		mainWindow!.show()
	}, 3000)

	// Show splash immediately after window's finished loading
	// mainWindow.webContents.on('did-finish-load', () => {
	// 	splashWindow.destroy()
	// 	mainWindow!.show()
	// })

	// Automatically open Chrome's DevTools in development mode.
	if (!app.isPackaged) {
		mainWindow.webContents.openDevTools()
	}

	// win.loadFile('../index.html')
}

// create about window
function createAboutWindow() {
	const win = new BrowserWindow({
		title: 'About',
		width: 600,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, '..', 'preload', 'preload.js'),
		},
	})

	win.removeMenu()

	// In production, set the initial browser path to the local bundle generated
	// by the Create React App build process.
	// In development, set it to localhost to allow live/hot-reloading.
	const appURL = app.isPackaged
		? url.format({
				pathname: path.join(__dirname, '..', 'renderer', 'about.html'),
				protocol: 'file:',
				slashes: true,
		  })
		: 'http://localhost:3000/about.html'

	// set the user agent to electron so we can retrieve this on the app side
	win.loadURL(appURL, { userAgent: 'Electron' })
	// could use loadfile instead
}

// IPC ============================================
function createNewWorkspace() {
	mainWindow!.webContents.send('workspace:new')
}

function createNewScene() {
	mainWindow!.webContents.send('scene:new')
}

function editWorkspace() {
	mainWindow!.webContents.send('workspace:edit')
}

// I/O ===========================================

function openWorkspace() {
	// returns a promise
	dialog
		.showOpenDialog(mainWindow!, {
			properties: ['openFile'],
			filters: [{ name: 'Bark File', extensions: ['bark'] }],
		})
		.then((result) => {
			// If we didn't cancel, then load the file and send data to the app
			if (!result.canceled) {
				readFile(result.filePaths[0], (err, data) => {
					if (!err) {
						mainWindow!.webContents.send('workspace:open', data)
					}
				})
			}
		})
}

function openScene() {
	// returns a promise
	dialog
		.showOpenDialog(mainWindow!, {
			properties: ['openFile'],
			filters: [
				{ name: 'JSON', extensions: ['json'] },
				{ name: 'Dialogue File', extensions: ['dlg'] },
			],
		})
		.then((result) => {
			// If we didn't cancel, then load the file and send data to the app
			if (!result.canceled) {
				readFile(result.filePaths[0], (err, data) => {
					if (!err) {
						mainWindow!.webContents.send('scene:open', data)
					}
				})
			}
		})
}

// open save dialogue, but don't actually write file
function saveWorkspace() {
	// returns a promise
	dialog
		.showSaveDialog(mainWindow!, {
			properties: ['showOverwriteConfirmation'],
			filters: [{ name: 'Dialogue File', extensions: ['bark'] }],
		})
		.then((result) => {
			// If we didn't cancel, then load the file and send data to the app
			if (!result.canceled) {
				// if there's no extension, add .whatever to the end
				mainWindow!.webContents.send('workspace:saveWorkspace', {
					path: result.filePath,
				})
			}
		})
}

function saveScene() {
	// returns a promise
	dialog
		.showSaveDialog(mainWindow!, {
			properties: ['showOverwriteConfirmation'],
			filters: [{ name: 'Dialogue File', extensions: ['dlg'] }],
		})
		.then((result) => {
			// If we didn't cancel, then load the file and send data to the app
			if (!result.canceled) {
				// if there's no extension, add .whatever to the end
				mainWindow!.webContents.send('scene:saveScene', {
					path: result.filePath,
				})
			}
		})
}

function exportWorkspaceJSON() {
	// returns a promise
	dialog
		.showSaveDialog(mainWindow!, {
			properties: ['showOverwriteConfirmation'],
			filters: [{ name: 'Project Files', extensions: ['zip'] }],
		})
		.then((result) => {
			// If we didn't cancel, then load the file and send data to the app
			if (!result.canceled) {
				// if there's no extension, add .json to the end
				mainWindow!.webContents.send('workspace:exportJSON', {
					path: result.filePath,
				})
			}
		})
}

function exportSceneJSON() {
	// returns a promise
	dialog
		.showSaveDialog(mainWindow!, {
			properties: ['showOverwriteConfirmation'],
			filters: [
				{ name: 'JSON', extensions: ['json'] },
				{ name: 'Dialogue File', extensions: ['dlg'] },
			],
		})
		.then((result) => {
			// If we didn't cancel, then load the file and send data to the app
			if (!result.canceled) {
				// if there's no extension, add .json to the end
				mainWindow!.webContents.send('scene:exportJSON', {
					path: result.filePath,
				})
			}
		})
}

// write file to given path
function writeJSON(savePath: string, data: any) {
	writeFile(savePath, data, (err) => {
		if (err) {
			console.log(err)
			mainWindow!.webContents.send('window:writeFailed')
		} else {
			mainWindow!.webContents.send('window:writeSuccess')
		}
	})
}

// exportworkspace

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
	protocol.registerHttpProtocol('file', (request, callback) => {
		const local_url = request.url.substr(8)
		callback({ path: path.normalize(`${__dirname}/${local_url}`) })
	})
}

// menu template
const template = [
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
						{ type: 'separator' },
						{ role: 'services' },
						{ type: 'separator' },
						{ role: 'hide' },
						{ role: 'hideOthers' },
						{ role: 'unhide' },
						{ type: 'separator' },
						{ role: 'quit' },
					],
				},
		  ]
		: []),
	{
		label: 'Workspace',
		submenu: [
			{
				label: 'New Workspace',
				click: createNewWorkspace,
				accelerator: 'CmdOrCtrl+Shift+N',
			},
			{
				label: 'Open Workspace',
				click: openWorkspace,
				accelerator: 'CmdOrCtrl+O',
			},
			{
				label: 'Save',
				click: saveWorkspace,
				accelerator: 'CmdOrCtrl+S',
			},
			{
				label: 'Edit Workspace',
				click: editWorkspace,
				// accelerator: 'CmdOrCtrl+W',
			},
			{
				label: 'Export Project',
				click: exportWorkspaceJSON,
				accelerator: 'CmdOrCtrl+Shift+E',
			},
			{ type: 'separator' },
			{
				label: 'Quit',
				click: () => app.quit(),
				accelerator: 'CmdOrCtrl+W',
			},
		],
	},
	{
		label: 'Scene',
		submenu: [
			{
				label: 'New Scene',
				click: createNewScene,
			},
			{
				label: 'Load Scene',
				click: openScene,
			},
			{
				label: 'Save Scene',
				click: saveScene,
			},
			{
				label: 'Export Scene',
				click: exportSceneJSON,
				// accelerator: 'CmdOrCtrl+W',
			},
		],
	},
	...(!isMac
		? [
				{
					role: 'help',
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
						{
							label: 'Learn More',
							click: async () => {
								await shell.openExternal(
									'https://www.nclarke.dev/projects/bark/'
								)
							},
						},
					],
				},
		  ]
		: []),
]

app.whenReady().then(() => {
	createWindow()
	setupLocalFilesNormalizerProxy()

	// implement menu
	// @ts-ignore
	const mainMenu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(mainMenu)

	// remove mainWindow from memory on close
	if (mainWindow) {
		mainWindow.on('closed', () => {
			mainWindow?.destroy()
			mainWindow = null
		})
	}

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

// Respond to ipcRenerer =====================================================
// options is the data that we sent
ipcMain.on('window:write', (event, options) => {
	console.log(options)
	const pathName = options.path
	const { data } = options

	writeJSON(pathName, data)
})

app.on('window-all-closed', () => {
	if (!isMac) {
		app.quit()
	}
})

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = 'https://my-electron-app.com'
app.on('web-contents-created', (_event, contents) => {
	contents.on('will-navigate', (event, navigationUrl) => {
		const parsedUrl = new URL(navigationUrl)

		if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
			event.preventDefault()
		}
	})
})
