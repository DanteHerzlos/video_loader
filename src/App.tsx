import { createSignal } from "solid-js"
import { render } from "solid-js/web"
import "./App.css"
import LoadDir from "./components/LoadDir"
import Preview from "./components/Preview"
import Button from "./components/UI/Button"
import Input from "./components/UI/Input"
import Select, { IOption } from "./components/UI/Select"
import fileSize from "./utils/fileSize"
interface IFormat {
  format_id: string
  format_note: string
  format: string
  fps: number
  ext: string
  audio_ext: string
  filesize: number
  filesize_approx: number
  resolution: string
  video_ext: string
  acodec: string
  vcodec: string
}

function App() {
  const [imgFile, setImgFile] = createSignal("")
  const [timer, setTimer] = createSignal(null)
  const [title, setTitle] = createSignal("")
  const [isLoading, setIsLoading] = createSignal(false)
  const [videoFormats, setVideoFormats] = createSignal<IFormat[]>([])
  const [audioFormats, setAudioFormats] = createSignal<IFormat[]>([])
  const [videoOptions, setVideoOptions] = createSignal<IOption[]>([])
  const [audioOptions, setAudioOptions] = createSignal<IOption[]>([])
  const [selectedAudioId, setSelectedAudioId] = createSignal<string>("")
  const [selectedVideoId, setSelectedVideoId] = createSignal<string>("")
  const [duration, setDurtation] = createSignal<number>(0)
  const [videoUrl, setVideoUrl] = createSignal<string>("")
  const isUrl = new RegExp(
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
  )
  let downloadBtn: HTMLButtonElement

  const getThumbnail = async (url: string) => {
    const [img, info] = await (window as any).electronAPI.getThumbnail(url)
    const fileInfo = JSON.parse(info)
    setDurtation(fileInfo.duration)
    const formats: IFormat[] = fileInfo.formats
    const video: IFormat[] = formats.filter((el) => el.vcodec !== "none")
    const audio: IFormat[] = formats.filter(
      (el) => el.vcodec === "none" && el.acodec !== "none"
    )
    setVideoFormats(video)
    setAudioFormats(audio)
    setVideoOptions(
      video.map((el) => ({
        children: [
          el.format_note ? el.format_note : el.resolution,
          el.video_ext,
          el.filesize ? fileSize(el.filesize) : "",
          el.filesize_approx ? fileSize(el.filesize_approx) : "",
          el.acodec === "none" ? "" : "+audio",
        ].join(" "),
        value: el.format_id,
      }))
    )
    setAudioOptions(
      audio.map((el) => ({
        children: [el.format_note, el.audio_ext, fileSize(el.filesize)].join(
          " "
        ),
        value: el.format_id,
      }))
    )
    setTitle(fileInfo.title)

    setImgFile(img)
  }

  const changeHandler = (
    e: Event & {
      currentTarget: HTMLInputElement
      target: Element
    }
  ) => {
    if (timer()) {
      clearTimeout(timer())
    }

    const url = e.currentTarget.value

    const timeout = setTimeout(async () => {
      if (isUrl.test(url)) {
        setVideoUrl(url)
        setSelectedAudioId("")
        setSelectedVideoId("")
        setAudioOptions([])
        setVideoOptions([])
        setIsLoading(true)
        downloadBtn.disabled = true
        await getThumbnail(url)
        downloadBtn.disabled = false
        setIsLoading(false)
      }
    }, 300)

    setTimer(timeout)
  }

  const totalSize = () => {
    let size = 0
    if (selectedAudioId()) {
      const audio = audioFormats().filter(
        (el) => el.format_id === selectedAudioId()
      )[0]
      size += audio.filesize ?? audio.filesize_approx
    }
    if (selectedVideoId()) {
      const video = videoFormats().filter(
        (el) => el.format_id === selectedVideoId()
      )[0]
      size += video.filesize ?? video.filesize_approx
    }
    if (size === 0) return ""
    return fileSize(size)
  }

  const downloadHandler = async () => {
    const options = { videoId: selectedVideoId(), audioId: selectedAudioId() }
    try {
      downloadBtn.disabled = true
      await (window as any).electronAPI.download(videoUrl(), options)
    } catch (error) {
      console.error(error.message)
    } finally {
      downloadBtn.disabled = false
    }
    console.log("end")
  }

  return (
    <div class="app">
      <Preview
        bufImg={imgFile}
        title={title}
        isLoading={isLoading}
        duration={duration}
      />
      <Input placeholder="URL..." onInput={(e) => changeHandler(e)} />
      <div class="select_group">
        <Select
          disabled={isLoading()}
          onChange={(e) => setSelectedVideoId(e.currentTarget.value)}
          name="video"
          id="video"
          options={videoOptions}
          label="video"
        />
        <Select
          onChange={(e) => setSelectedAudioId(e.currentTarget.value)}
          name="audio"
          id="audio"
          label="audio"
          options={audioOptions}
        />
      </div>
      <LoadDir />
      <Button ref={downloadBtn} onClick={downloadHandler}>
        Download {totalSize()}
      </Button>
    </div>
  )
}

render(() => <App />, document.getElementById("root"))
