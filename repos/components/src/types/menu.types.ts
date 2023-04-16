
import type MuiMenu from '@mui/material/Menu'
import type {
  ReactNode,
  MouseEvent,
  ComponentType,
  ComponentProps,
  MutableRefObject,
} from 'react'

export type TOnMenuOpen = (event: MouseEvent<HTMLElement>, ...args:any[]) => any

export type TOnMenuClose = (
  event: MouseEvent<HTMLElement>,
  closeParent?:boolean,
  reason?: `backdropClick`|`escapeKeyDown`
) => any

export type TOnMuiClose = (
  event:MouseEvent<HTMLElement>,
  reason: `backdropClick`|`escapeKeyDown`
) => void

export type TMenuItem = {
  key?:string
  id?:string
  text?:string
  label?:string
  closeMenu?:boolean
  children?:ReactNode
  dividerTop?:boolean
  closeParent?:boolean
  dividerBottom?:boolean
  onCloseMenu?:TOnMenuClose
  iconProps?:ComponentProps<any>
  Icon?:ComponentType<any>|ReactNode
  onClick: (event: MouseEvent<HTMLElement>, ...args:any[]) => any
}

export type TMenuItems = {
  items: TMenuItem[]
  autoClose?:boolean
  onCloseMenu?:TOnMenuClose
}

export type TMenu = Omit<ComponentProps<typeof MuiMenu>, `open`|`onClose`> & {
  open?:boolean
  items: TMenuItem[]
  SubMenu?:ReactNode
  Context?: ReactNode
  autoClose?: boolean
  onOpen?:TOnMenuOpen
  onClose?:TOnMenuClose
  posAV?:`top`|`center`|`bottom`
  posAH?:`left`|`center`|`right`
  posTV?:`top`|`center`|`bottom`
  posTH?:`left`|`center`|`right`
  anchorRef:MutableRefObject<HTMLElement|null|undefined>
}