import cl from "../../styles/components/UI/CircularLoader.module.css"

const CircularLoader = () => {
  return (
    <div class={cl.loader}>
      <svg class={cl.circular} viewBox="25 25 50 50">
        <circle class={cl.path} cx="50" cy="50" r="20"></circle>
      </svg>
    </div>
  )
}

export default CircularLoader
