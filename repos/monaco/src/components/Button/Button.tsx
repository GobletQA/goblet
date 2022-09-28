import './Button.css'

export type Button = {
  type?: string
  className?: string
  children?: any
  onClick?: (...args: any[]) => void
  style?: any
}

export const Button = (props:Button) => {
  const { type = 'default', className = '', children, onClick = () => {}, style } = props
  return (
    <div
      onClick={onClick}
      style={style}
      className={`goblet-monaco-editor-button goblet-monaco-editor-button-${type} ${className}`}
    >
      {children}
    </div>
  )
}


