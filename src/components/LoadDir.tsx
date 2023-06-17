import { createSignal, onMount } from "solid-js"
import Button from "./UI/Button"
import cl from "../styles/components/LoadDir.module.css"

const LoadDir = () => {
  const [loadDir, setLoadDir] = createSignal("")

  onMount(async () => {
    const path = await (window as any).electronAPI.getLoadDir()
    (window as any).electronAPI.webSocket()
    setLoadDir(path)
  })

  const changeLoadDir = async () => {
    const result = await (window as any).electronAPI.changeLoadDir()
    if (!result.canceled) setLoadDir(result.filePaths[0])
  }
  return (
    <div class={cl.container}>
      <span>{loadDir()}</span>
      <Button onClick={changeLoadDir}>Load Dir</Button>
    </div>
  )
}

export default LoadDir
