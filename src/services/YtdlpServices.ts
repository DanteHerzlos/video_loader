import { spawn } from "child_process"
import { dialog } from "electron"
import { once } from "events"
import fs from "fs"
import path from "path"
require("dotenv").config()

const tmpFolder = process.env.DEFAULT_TMP_FOLDER

class YtdlpServices {
  static changeLoadDir = async (event: Electron.IpcMainInvokeEvent) => {
    const path = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    })
    return path
  }

  static extractAudio = (event: Electron.IpcMainInvokeEvent, url: string) => {
    spawn("yt-dlp", [
      url,
      "--ffmpeg-location",
      ".\\ffmpeg\\ffmpeg.exe",
      "-x",
      "--audio-format",
      "mp3",
    ])
  }

  // static getListFormats = async (
  //   event: Electron.IpcMainInvokeEvent,
  //   url: string
  // ) => {
  //   const out = spawn("yt-dlp", [
  //     url,
  //     "--write-thumbnail",
  //     "--skip-download",
  //     "--no-playlist",
  //     "-o",
  //     fileTemplate,
  //   ])
  //   await once(out, "close")

  // }

  static getThumbnail = async (
    event: Electron.IpcMainInvokeEvent,
    url: string
  ) => {
    if (fs.readdirSync(tmpFolder).length !== 0) {
      fs.unlinkSync(path.join(tmpFolder, fs.readdirSync(tmpFolder)[0]))
    }
    const fileTemplate = tmpFolder + "/" + "%(title)s"

    const out = spawn("yt-dlp", [
      url,
      "--write-thumbnail",
      "--skip-download",
      "--no-playlist",
      "-o",
      fileTemplate,
    ])
    await once(out, "close")
    if (fs.readdirSync(tmpFolder).length !== 0) {
      const fileName = fs.readdirSync(tmpFolder)[0]
      const file = fs
        .readFileSync(path.join(tmpFolder, fs.readdirSync(tmpFolder)[0]))
        .toString("base64")
      return [file, path.parse(fileName).name]
    }
    return 0
  }
}

export default YtdlpServices
