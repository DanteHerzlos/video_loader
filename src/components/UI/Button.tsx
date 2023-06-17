import cl from "../../styles/components/UI/Button.module.css"
import { Component, JSX } from "solid-js"

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {}

const Button: Component<ButtonProps> = ({ ...props }) => {
  return <button {...props} class={cl.btn} />
}

export default Button
