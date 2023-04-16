import type { MouseEvent, ComponentProps } from 'react'
import type { TMenu, TOnMuiClose, TOnMenuOpen } from '@GBC/types'

import { useMemo } from 'react'
import { MenuItems } from './MenuItems'
import MuiMenu from '@mui/material/Menu'
import { exists } from '@keg-hub/jsutils'
import { MenuContext } from './MenuContext'
import { useInline } from '@GBC/hooks/components/useInline'

type TMuiMenuProps = ComponentProps<typeof MuiMenu>

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
      }  as TMuiMenuProps[`anchorOrigin`],
      transformOrigin: {
        vertical: posTV || posTH,
        horizontal: posTH || posTV,
        ...transformOrigin
      } as TMuiMenuProps[`transformOrigin`]
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
    open,
    items,
    posAV,
    posAH,
    posTV,
    posTH,
    Context,
    SubMenu,
    anchorRef,
    autoClose,
    onOpen:onMenuOpen,
    onClose:onMenuClose,
    ...rest
  } = props

  const pos = usePos(props)

  const hasRef = Boolean(anchorRef.current)
  const onOpen = useInline<TOnMenuOpen>((event) => {
    anchorRef.current = event.currentTarget
    onMenuOpen?.(event)
  })

  const onClose = useInline((
    event:MouseEvent<HTMLElement>,
    closeParent?:boolean,
    ...args:any[]
  ) => {
    anchorRef.current = null
    onMenuClose?.(event, closeParent, ...args)
  })

  const onMuiClose = useInline<TOnMuiClose>((
    event,
    reason
  ) => onClose(event, false, reason))

  return (
    <>
      <MuiMenu
        {...rest}
        {...pos}
        onClose={onMuiClose}
        anchorEl={anchorRef.current}
        open={
          exists(open)
            ? Boolean(open && hasRef)
            : Boolean(anchorRef.current)
        }
      >

        {Context && (
          <MenuContext>
            {Context}
          </MenuContext>
        )||null}

        <MenuItems
          items={items}
          autoClose={autoClose}
          onCloseMenu={onClose}
        />
      </MuiMenu>

      {SubMenu}
    </>
  )
}

