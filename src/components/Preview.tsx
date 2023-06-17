import { Accessor, Component } from "solid-js"
import secondsToTime from "../utils/secondsToTime"
import cl from "../styles/components/Preview.module.css"
import CircularLoader from "./UI/CircularLoader"

interface PreviewProps {
  bufImg: Accessor<string>
  title: Accessor<string>
  isLoading?: Accessor<boolean>
  duration?: Accessor<number>
}
const Preview: Component<PreviewProps> = ({
  bufImg,
  title,
  isLoading,
  duration,
}) => {
  const setPreview = () => {
    if (bufImg()) {
      return (
        <div class={cl.img_container}>
          <img class={cl.img} src={`data:image/jpg;base64,${bufImg()}`} />
          {duration() ? (
            <span class={cl.duration}>{secondsToTime(duration())}</span>
          ) : (
            <></>
          )}
        </div>
      )
    }
    return (
      <div class={cl.no_preview}>
        <span>No preview</span>
      </div>
    )
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
      <span class={cl.title}>{title() ? title() : "No title"}</span>
    </div>
  )
}

export default Preview
