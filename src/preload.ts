// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("electronAPI", {
  getThumbnail: (url: string) => ipcRenderer.invoke("ytdlp:get_thumbnail", url),
  changeLoadDir: () => ipcRenderer.invoke("ytdlp:change_load_dir"),
  getLoadDir: () => ipcRenderer.invoke("ytdlp:get_load_dir"),
  download: (url: string, options: { videoId: string; audioId: string }) =>
    ipcRenderer.invoke("ytdlp:download", url, options),
})
