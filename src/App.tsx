import { createSignal } from "solid-js"
import { render } from "solid-js/web"
import "./App.css"
import Preview from "./components/Preview"
import Button from "./components/UI/Button"
import Input from "./components/UI/Input"

function App() {
  const [imgFile, setImgFile] = createSignal("")
  const [timer, setTimer] = createSignal(null)
  const [title, setTitle] = createSignal("")
  const [isLoading, setIsLoading] = createSignal(false)
  const isUrl = new RegExp(
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
  )
  const getThumbnail = async (url: string) => {
    const [img, fileName] = await (window as any).electronAPI.getThumbnail(url)
    setTitle(fileName)
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
        setIsLoading(true)

        const tumbnail = new Promise((resolve) => resolve(getThumbnail(url)))
        await Promise.allSettled([tumbnail, title])

        setIsLoading(false)
      }
    }, 300)

    setTimer(timeout)
  }

  const clickHandler = async () => {
    const path = await(window as any).electronAPI.changeLoadDir()
    console.log(path);
    
  }

  return (
    <div class="app">
      <Preview bufImg={imgFile} title={title} isLoading={isLoading} />
      <Input placeholder="URL..." onInput={(e) => changeHandler(e)} />
      <Button onClick={clickHandler}>Load Dir</Button>
      <Button>Download Video</Button>
      <Button>Download Audio</Button>
    </div>
  )
}

render(() => <App />, document.getElementById("root"))
