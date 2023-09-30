import type { DrawerProps } from '@mui/material/Drawer'
import type { ReactNode } from 'react'
import { useState, useCallback } from 'react'

import ClickAwayListener from '@mui/material/ClickAwayListener'
import { colors } from '@gobletqa/components/theme'

import {
  Drawer,
  DrawerSliderAction,
  DrawerSliderActions,
  BottomDrawerContainer,
} from './BottomDrawer.styled'

export type TDefinitionSlider = {
  children:ReactNode
}

const drawerProps:Partial<DrawerProps> = {
  elevation: 0,
  anchor: `bottom`,
  hideBackdrop: true,
  disablePortal: true,
  variant: `permanent`,
  sx: {
    width: `100%`,
  },
  className: `gb-defs-drawer`,
}

const styles = {
  lock: {
    closed: { color: colors.cardinal, fontSize: `16px` },
    open: { color: colors.shinyShamrock, fontSize: `16px` },
  },
  toggle: {
    fontSize: `22px`
  },
  paper: {
    zIndex: `20`,
    width: `100%`,
    position: `absolute`,
  }
}

export const BottomDrawer = (props:TDefinitionSlider) => {

  const {
    children
  } = props

  const [open, setOpen] = useState(false)
  const [locked, setLocked] = useState(false)

  const toggleDrawer = useCallback(() => {
    setOpen(!open)
  }, [open])

  const toggleLock = useCallback(() => {
    setLocked(!locked)
  }, [locked])

  const onTabClick = useCallback(() => {
    !open && toggleDrawer()
  }, [open, toggleDrawer])

  const onClickAway = useCallback((event: MouseEvent | TouchEvent) => {
    !locked && open && setOpen(false)
  }, [open, locked])

  return (
    <BottomDrawerContainer className='gb-bottom-drawer'>
      <ClickAwayListener onClickAway={onClickAway} >
        <Drawer
          {...drawerProps}
          open={open}
          onClose={toggleDrawer}
          PaperProps={{
            elevation: 0,
            sx: styles.paper
          }}
        >
          {children}
        </Drawer>
      </ClickAwayListener>
    </BottomDrawerContainer>
  )
}
