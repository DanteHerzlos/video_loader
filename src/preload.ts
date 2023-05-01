// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("electronAPI", {
  getThumbnail: (url: string) => ipcRenderer.invoke("ytdlp:get_thumbnail", url),
  getAudio: (url: string) => ipcRenderer.invoke("ytdlp:get_audio", url),
  changeLoadDir: () => ipcRenderer.invoke("ytdlp:change_load_dir"),
})
