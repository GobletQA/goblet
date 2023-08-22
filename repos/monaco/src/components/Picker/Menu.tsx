import { useCallback, useState, useEffect, useMemo } from 'react'
import { noOp } from '@keg-hub/jsutils/noOp'

export type Menu = {
  value: any
  label?: string
  className?: string
  defaultValue?: string | number
  handleSelect?: (obj: { value: any; label: string }) => void
}

export const Menu = (props:Menu) => {
  const {
    value,
    className,
    label = '',
    defaultValue = '',
    handleSelect = noOp
  } = props

  useEffect(() => {
    defaultValue === value && setSelected(true)
  }, [value, defaultValue])

  const [selected, setSelected] = useState(false)
  const onClick = useCallback(() => handleSelect({ value, label }), [value, label])

  const classNames = useMemo(() => {
    return [
      `goblet-editor-picker-item`,
      selected && `goblet-editor-picker-item-selected`,
      className
    ].filter(Boolean).join(` `).trim()
  }, [selected, className])

  return (
    <div className={classNames} onClick={onClick}>
      {label}
    </div>
  )
}

export default Menu
