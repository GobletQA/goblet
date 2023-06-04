import type { MouseEvent, ReactNode, CSSProperties } from 'react'

import { MenuToggleBtn } from './Menu.styled'
import { Kebab } from '@GBC/components/Icons'

export type TMenuToggle = {
  id:string
  open?:boolean
  Icon?:ReactNode
  sx?:CSSProperties
  controlId:string
  onOpen: (event: MouseEvent<HTMLElement>) => void
}

export const MenuToggle = (props:TMenuToggle) => {

  const {
    sx,
    id,
    open,
    onOpen,
    controlId,
    Icon=Kebab
  } = props

  return (
    <MenuToggleBtn
      sx={sx}
      Icon={Icon}
      onClick={onOpen}
      aria-haspopup="true"
      id={`gb-${id}-menu-button`}
      aria-expanded={open ? `true` : undefined}
      aria-controls={open ? controlId : undefined}
    />
  )
  
}