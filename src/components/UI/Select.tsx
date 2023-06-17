import { Accessor, Component, For, JSX } from "solid-js"
import cl from "../../styles/components/UI/Select.module.css"

export interface IOption extends JSX.InputHTMLAttributes<HTMLOptionElement> {
  children: string
}

interface SelectProps extends JSX.InputHTMLAttributes<HTMLSelectElement> {
  options: Accessor<IOption[]>
  label?: string
}

const Select: Component<SelectProps> = ({ label, options, ...props }) => {
  return (
    <div class={cl.container}>
      <select class={[props.class, cl.select].join(" ")} {...props}>
        <option value="">None</option>
        <For each={options()}>{(option) => <option {...option} />}</For>
      </select>
      {label && <span class={cl.label}>{label}</span>}
    </div>
  )
}
export default Select
