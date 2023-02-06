// Module to control the application lifecycle and the native browser window.
import { app, BrowserWindow, protocol } from 'electron'
import * as path from 'path'
import * as url from 'url'

function createWindow() {
	const win = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	})

	// In production, set the initial browser path to the local bundle generated
	// by the Create React App build process.
	// In development, set it to localhost to allow live/hot-reloading.
	const appURL = app.isPackaged
		? url.format({
				pathname: path.join(__dirname, '../index.html'),
				protocol: 'file:',
				slashes: true,
		  })
		: 'http://localhost:3000'
	win.loadURL(appURL)

	// Automatically open Chrome's DevTools in development mode.
	if (!app.isPackaged) {
		win.webContents.openDevTools()
	}

	// win.loadFile('../index.html')
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
	protocol.registerHttpProtocol('file', (request, callback) => {
		const local_url = request.url.substr(8)
		callback({ path: path.normalize(`${__dirname}/${local_url}`) })
	})
}

app.whenReady().then(() => {
	createWindow()
	setupLocalFilesNormalizerProxy()

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = 'https://my-electron-app.com'
app.on('web-contents-created', (event, contents) => {
	contents.on('will-navigate', (event, navigationUrl) => {
		const parsedUrl = new URL(navigationUrl)

		if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
			event.preventDefault()
		}
	})
})
