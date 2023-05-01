import { Accessor, Component } from "solid-js"
import cl from "../styles/components/Preview.module.css"
import CircularLoader from "./UI/CircularLoader"

interface PreviewProps {
  bufImg: Accessor<string>
  title: Accessor<string>
  isLoading?: Accessor<boolean>
}
const Preview: Component<PreviewProps> = ({ bufImg, title, isLoading }) => {
  const setPreview = () => {
    if (bufImg()) {
      return <img class={cl.img} src={`data:image/jpg;base64,${bufImg()}`} />
    }
    return (
      <div class={cl.no_preview}>
        <span>No preview</span>
      </div>
    )
  }

  const setTitle = () => {
    if (title()) {
      return <span class={cl.title}>{title()}</span>
    }
    return <></>
  }

  return (
    <div class={cl.container}>
      <div class={cl.thumbnail}>
        {isLoading() ? (
          <div class={cl.no_preview}>
            <CircularLoader />
          </div>
        ) : (
          setPreview()
        )}
      </div>
      {isLoading() ? <></> : setTitle()}
    </div>
  )
}

export default Preview
