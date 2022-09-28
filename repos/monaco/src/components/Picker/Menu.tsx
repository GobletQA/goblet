import { useState, useEffect } from 'react'

export type Menu = {
  value: any
  label?: string
  className?: string
  defaultValue?: string | number
  handleSelect?: (obj: { value: any; label: string }) => void
}

export const Menu = (props:Menu) => {
  const { label = '', value, className, defaultValue = '', handleSelect = () => ({}) } = props
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    if (defaultValue === value) {
      setSelected(true)
    }
  }, [value, defaultValue])

  return (
    <div
      onClick={() => {
        handleSelect({ value, label })
      }}
      className={`goblet-monaco-editor-picker-item ${
        selected ? 'goblet-monaco-editor-picker-item-selected' : ''
      }`}
    >
      {label}
    </div>
  )
}

export default Menu
