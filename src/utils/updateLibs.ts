import { spawn } from "child_process"
import { once } from "events"

const func = async () => {
  await new Promise(() => {
    setTimeout(() => {
      console.log("timeout")
    }, 10000)
  })
}

const updateLibs = async (path: string) => {
  if (!path) {
    throw new Error("Can't resolve path for update!")
  }
  const ytdlpUpdate = spawn(path, ["-U"])
  ytdlpUpdate.stdout.on("data", (data) => {
    console.log(data.toString())
  })
  await once(ytdlpUpdate, "close")
  // await func()
}

export default updateLibs
