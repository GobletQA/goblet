
import type { MutableRefObject, ComponentProps, ComponentType, MouseEvent } from 'react'
import type { TMenuItem } from './MenuItems'


import { useMemo } from 'react'
import MuiMenu from '@mui/material/Menu'

import { MenuItems } from './MenuItems'
import { exists } from '@keg-hub/jsutils'
import { useInline } from '@GBC/hooks/useInline'

export type TMenu = Omit<ComponentProps<typeof MuiMenu>, `open`> & {
  items: TMenuItem[]
  anchorRef:MutableRefObject<HTMLElement|null|undefined>
  open?:boolean
  autoClose?: boolean
  posAV?:`top`|`center`|`bottom`
  posAH?:`left`|`center`|`right`
  posTV?:`top`|`center`|`bottom`
  posTH?:`left`|`center`|`right`
  onOpen?:(event: MouseEvent<HTMLElement>) => any
  onClose?:(event: MouseEvent<HTMLElement>) => any
}

const usePos = (props:TMenu) => {
  const {
    posAV,
    posAH,
    posTV,
    posTH,
    anchorOrigin,
    transformOrigin
  } = props
  
  return useMemo(() => {
    if(
      !posAH
        && !posAV
        && !posTV
        && !posTH
        && !anchorOrigin
        && !transformOrigin
    ) return {} 

    return {
      anchorOrigin: {
        vertical: posAV || posAH,
        horizontal: posAH || posAV,
        ...anchorOrigin
      }  as any,
      transformOrigin: {
        vertical: posTV || posTH,
        horizontal: posTH || posTV,
        ...transformOrigin
      } as any
    }
  }, [
    posAV,
    posAH,
    posTV,
    posTH,
    anchorOrigin,
    transformOrigin
  ])
  
}

export const Menu = (props:TMenu) => {
  const {
    posAV,
    posAH,
    posTV,
    posTH,
    open,
    items,
    anchorRef,
    autoClose=true,
    onOpen:onMenuOpen,
    onClose:onMenuClose,
    ...rest
  } = props

  const pos = usePos(props)

  const onOpen = useInline((event: MouseEvent<HTMLElement>) => {
    anchorRef.current = event.currentTarget
    onMenuOpen?.(event)
  })

  const onClose = useInline((event) => {
    anchorRef.current = null
    onMenuClose?.(event)
  })

  const hasRef = Boolean(anchorRef.current)

  return (
    <MuiMenu
      {...rest}
      {...pos}
      onClose={onClose}
      anchorEl={anchorRef.current}
      open={
        exists(open)
          ? Boolean(open && hasRef)
          : Boolean(anchorRef.current)
      }
    >
      <MenuItems
        items={items}
        autoClose={autoClose}
        onCloseMenu={onClose}
      />
    </MuiMenu>
  )
}

