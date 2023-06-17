import { app, BrowserWindow, ipcMain } from "electron"
import YtdlpServices from "./services/YtdlpServices"
import fs from "fs"
import path from "path"
import updateLibs from "./utils/updateLibs"
import store from "./store/electronStore"

require("dotenv").config()

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string


// todo check on exist
if (process.platform === "darwin") {
  const ytdlp = path.join(store.get("ytdlp_folder"), "yt-dlp_macos")
  store.set("ytdlp", ytdlp)
} else if (process.platform === "linux") {
  const ytdlp = path.join(store.get("ytdlp_folder"), "yt-dlp")
  store.set("ytdlp", ytdlp)
} else if (process.platform === "win32") {
  const ytdlp = path.join(store.get("ytdlp_folder"), "yt-dlp.exe")
  store.set("ytdlp", ytdlp)
}



if (require("electron-squirrel-startup")) {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  app.quit()
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

if (!fs.existsSync(store.get("tmp_folder"))) {
  fs.mkdirSync(store.get("tmp_folder"))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
updateLibs(store.get("ytdlp")).then(() =>
  app.whenReady().then(() => {
    ipcMain.handle("ytdlp:get_thumbnail", YtdlpServices.getThumbnail)
    ipcMain.handle("ytdlp:change_load_dir", YtdlpServices.changeLoadDir)
    ipcMain.handle("ytdlp:download", YtdlpServices.download)
    ipcMain.handle("ytdlp:get_load_dir", YtdlpServices.getLoadDir)
    // ipcMain.emit("ytdlp:websocket", YtdlpServices.getLoadDir)
    createWindow()
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
