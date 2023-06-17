import { spawn } from "child_process"
import { dialog } from "electron"
import { once } from "events"
import fs from "fs"
import path from "path"
import store from "../store/electronStore"
require("dotenv").config()

const tmpFolder = store.get("tmp_folder")
const ffmpegFolder = store.get("ffmpeg_folder")
class YtdlpServices {
  static getLoadDir = (event: Electron.IpcMainInvokeEvent) => {
    return store.get("loadFolder")
  }

  static changeLoadDir = async (event: Electron.IpcMainInvokeEvent) => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    })
    if (!result.canceled) {
      store.set("loadFolder", result.filePaths[0])
    }
    return result
  }

  static getListFormats = async (
    event: Electron.IpcMainInvokeEvent,
    url: string
  ) => {
    const fileTemplate = path.join(tmpFolder, "format")

    const out = spawn(store.get("ytdlp"), [
      url,
      "--skip-download",
      "--no-playlist",
      "--write-info-json",
      "-o",
      fileTemplate,
    ])

    await once(out, "close")
    if (fs.existsSync(fileTemplate + ".info.json")) {
      const statFile = fs.readFileSync(fileTemplate + ".info.json").toString()
      return statFile
    }
    return 0
  }

  static getThumbnail = async (
    event: Electron.IpcMainInvokeEvent,
    url: string
  ) => {
    if (fs.readdirSync(tmpFolder).length !== 0) {
      for (const file of fs.readdirSync(tmpFolder)) {
        fs.unlinkSync(path.join(tmpFolder, file))
      }
    }

    const imgTemplate = path.join(tmpFolder, "thumbnail")
    const out = spawn(store.get("ytdlp"), [
      url,
      "--write-thumbnail",
      "--skip-download",
      "--no-playlist",
      "-o",
      imgTemplate,
    ])

    await once(out, "close")

    const thumbnailFile = fs
      .readdirSync(tmpFolder)
      .filter((file) => /^thumbnail.*$/.test(file))[0]

    const thumbnailPath = path.join(tmpFolder, thumbnailFile)

    const statFile = await this.getListFormats(event, url)

    if (fs.existsSync(thumbnailPath)) {
      const file = fs.readFileSync(thumbnailPath).toString("base64")
      return [file, statFile]
    }
    throw new Error("Thumbnail didn't load!")
  }

  static download = async (
    event: Electron.IpcMainInvokeEvent,
    url: string,
    options: { videoId: string; audioId: string }
  ) => {
    let fileId = ""

    if (options.audioId && options.videoId) {
      fileId = `${options.videoId}+${options.audioId}`
    } else if (options.videoId || options.audioId) {
      fileId = options.videoId + options.audioId
    } else {
      throw new Error("didn't choose video or audip to download!")
    }
    const downloadProcess = spawn(store.get("ytdlp"), [
      url,
      "--no-playlist",
      `-f ${fileId}`,
      "-o",
      `${store.get("loadFolder")}/%(title)s.%(ext)s`,
      "--ffmpeg-location",
      ffmpegFolder,
    ])
    downloadProcess.stdout.on("data", (data) => {
      console.log(data.toString())
    })
    await once(downloadProcess, "close")
    return { success: true }
  }
}

export default YtdlpServices
