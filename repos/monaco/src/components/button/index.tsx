import React from 'react'
import './index.css'

const Button: React.FC<{
  type?: string
  className?: string
  children?: any
  onClick?: (...args: any[]) => void
  style?: any
}> = ({ type = 'default', className = '', children, onClick = () => {}, style }) => {
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

export default Button
