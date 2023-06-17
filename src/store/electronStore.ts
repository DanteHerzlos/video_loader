import Store from "electron-store"
import path from "path"

interface IStore {
  tmp_folder: string
  ffmpeg_folder: string
  ytdlp_folder: string
  loadFolder: string
}

// const schema = {
//   tmp_folder: {
//     default: "./tmp",
//   },
//   ffmpeg_folder: {
//     default: "./libs/ffmpeg",
//   },
//   ytdlp_folder: {
//     default: "./libs/yt-dlp",
//   },
//   loadFolder: {
//     default: "C://Users/Dante/Downloads",
//   },
// }

const store = new Store<IStore>()
if (!store.get("tmp_folder")) store.set("tmp_folder", path.resolve("./tmp"))
if (!store.get("ffmpeg_folder"))
  store.set("ffmpeg_folder", path.resolve("./libs/ffmpeg"))
if (!store.get("ytdlp_folder"))
  store.set("ytdlp_folder", path.resolve("./libs/yt-dlp"))
if (!store.get("loadFolder"))
  store.set("loadFolder", path.resolve("C:\\Users\\%USERPROFILE%\\Downloads"))

export default store
