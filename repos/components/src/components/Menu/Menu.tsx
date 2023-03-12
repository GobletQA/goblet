
import type { MutableRefObject, ComponentProps, ReactNode, MouseEvent } from 'react'
import type { TMenuItem } from './MenuItems'


import { useMemo } from 'react'
import MuiMenu from '@mui/material/Menu'

import { If } from '../If'
import { MenuItems } from './MenuItems'
import { exists } from '@keg-hub/jsutils'
import { MenuContext } from './MenuContext'
import { useInline } from '@GBC/hooks/components/useInline'

export type TMenu<T=Record<any, any>> = Omit<ComponentProps<typeof MuiMenu>, `open`> & {
  Context?: ReactNode
  items: TMenuItem<T>[]
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

const usePos = <T=Record<any, any>>(props:TMenu<T>) => {
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

export const Menu = <T=Record<any, any>>(props:TMenu<T>) => {
  const {
    open,
    items,
    posAV,
    posAH,
    posTV,
    posTH,
    Context,
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

    <If check={Context}>
      <MenuContext>
        {Context}
      </MenuContext>
    </If>
      <MenuItems
        items={items}
        autoClose={autoClose}
        onCloseMenu={onClose}
      />
    </MuiMenu>
  )
}

