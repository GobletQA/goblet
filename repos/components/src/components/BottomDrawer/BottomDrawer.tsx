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
import { BottomDrawerHeader } from './BottomDrawerHeader'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import {
  Drawer,
  BottomDrawerContainer,
} from './BottomDrawer.styled'


export type TBottomDrawerRef = {
  toggleLock: (state?:boolean) => any
  toggleDrawer: (state?:boolean) => any
}

export type TBottomDrawer = {
  open?:boolean
  locked?:boolean
  sx?:CSSProperties
  className?:string
  activeTab?:number
  children:ReactNode
  drawerHeight?:string
  tabs?:TBottomDrawerTab[]
  paperProps?:Partial<PaperProps>
  drawerProps?:Partial<DrawerProps>
  onToggle?:(state:boolean, fromClickAway?:boolean) => any
  drawerRef?:MutableRefObject<TBottomDrawerRef|undefined>
  onTabChange?:(event: SyntheticEvent, newValue: number) => any
  onTabClick?:(event:RMouseEvent<any>, tab?:number) => void
}

const styles = {
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

export const BottomDrawer = (props:TBottomDrawer) => {

  const {
    sx,
    tabs,
    open,
    onToggle,
    children,
    activeTab,
    className,
    paperProps,
    onTabClick,
    drawerProps,
    drawerHeight,
    onTabChange,
  } = props

  return (
    <BottomDrawerContainer
      sx={sx}
      className={cls('gb-bottom-drawer', className)}
    >
      <ClickAwayListener onClickAway={() => onToggle?.(false, true)} >
        <Drawer
          {...DrawerProps}
          {...drawerProps}
          open={open}
          drawerHeight={drawerHeight}
          onClose={() => onToggle?.(false)}
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
              onTabClick={onTabClick}
            />
          ) || null}
          {children}
        </Drawer>
      </ClickAwayListener>
    </BottomDrawerContainer>
  )
}
