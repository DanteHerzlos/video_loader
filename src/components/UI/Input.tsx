import { Component, JSX } from "solid-js"
import cl from "../../styles/components/UI/Input.module.css"

const Input: Component<JSX.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input class={cl.input} type="text" {...props} />
}

export default Input
