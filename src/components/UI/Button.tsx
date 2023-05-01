import cl from "../../styles/components/UI/Button.module.css"
import { JSX } from "solid-js"

const Button = (props: JSX.HTMLAttributes<HTMLButtonElement> ) => {
  return <button {...props} class={cl.btn} />
}

export default Button
