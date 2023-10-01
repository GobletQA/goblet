import type { PaperProps } from '@mui/material/Paper'
import type { DrawerProps } from '@mui/material/Drawer'
import type { TBottomDrawerTab } from './BottomDrawerHeader'
import type {
  ReactNode,
  CSSProperties,
  MutableRefObject,
  MouseEvent as RMouseEvent,
  SyntheticEvent
} from 'react'

import { cls } from '@keg-hub/jsutils'
import { useState, useCallback, useEffect } from 'react'
import { BottomDrawerHeader } from './BottomDrawerHeader'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import {
  colors,
  useEnsureRef,
} from '@gobletqa/components'

import {
  Drawer,
  BottomDrawerContainer,
} from './BottomDrawer.styled'


export type TBottomDrawerRef = {
  toggleLock: (state?:boolean) => any
  toggleDrawer: (state?:boolean) => any
}

export type TDefinitionSlider = {
  sx?:CSSProperties
  className?:string
  activeTab?:number
  children:ReactNode
  initialOpen?:boolean
  initialLocked?:boolean
  tabs?:TBottomDrawerTab[]
  paperProps?:Partial<PaperProps>
  drawerProps?:Partial<DrawerProps>
  onLock?:(state:boolean) => any
  onToggle?:(state:boolean) => any
  onTabClick?:(event:RMouseEvent<HTMLDivElement>) => void
  drawerRef?:MutableRefObject<TBottomDrawerRef|undefined>
  onTabChange?:(event: SyntheticEvent, newValue: number) => any
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

const DrawerProps:Partial<DrawerProps> = {
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

const PaperProps:Partial<PaperProps> = {
  elevation: 0,
  sx: styles.paper
}


export const BottomDrawer = (props:TDefinitionSlider) => {

  const {
    sx,
    tabs,
    onLock,
    onToggle,
    children,
    activeTab,
    className,
    paperProps,
    onTabClick,
    initialOpen,
    drawerProps,
    onTabChange,
    initialLocked,
  } = props

  const drawerRef = useEnsureRef<TBottomDrawerRef>(props.drawerRef)
  const [open, setOpen] = useState(initialOpen)
  const [locked, setLocked] = useState(initialLocked)

  const toggleDrawer = useCallback(() => {
    const update = !open
    onToggle?.(update)
    setOpen(update)
  }, [open])

  const toggleLock = useCallback(() => {
    const update = !locked
    onLock?.(update)
    setLocked(update)
  }, [locked])

  const onClickAway = useCallback((event: MouseEvent | TouchEvent) => {
    !locked && open && setOpen(false)
  }, [open, locked])

  const onTabClickCB = useCallback((evt:RMouseEvent<HTMLDivElement>) => {
    !open && toggleDrawer()
    onTabClick?.(evt)
  }, [open, toggleDrawer])

  useEffect(() => {
    drawerRef.current = {
      toggleLock,
      toggleDrawer
    }
  }, [toggleLock, toggleDrawer])

  return (
    <BottomDrawerContainer
      sx={sx}
      className={cls('gb-bottom-drawer', className)}
    >
      <ClickAwayListener onClickAway={onClickAway} >
        <Drawer
          {...DrawerProps}
          {...drawerProps}
          open={open}
          onClose={toggleDrawer}
          PaperProps={{
            ...PaperProps,
            ...paperProps
          }}
        >
          {tabs && (
            <BottomDrawerHeader
              tabs={tabs}
              active={activeTab}
              onChange={onTabChange}
              onTabClick={onTabClickCB}
            />
          ) || null}
          {children}
        </Drawer>
      </ClickAwayListener>
    </BottomDrawerContainer>
  )
}
