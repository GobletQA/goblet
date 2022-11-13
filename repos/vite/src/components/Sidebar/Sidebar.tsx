import type { ReactNode } from 'react'
import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/base/ClickAwayListener'


type TDrawerCb = (...args:any[]) => any

type TRenderToggleProps = {
  toggleDrawer:(event: React.KeyboardEvent | React.MouseEvent) => void
  [key:string|number|symbol]: any
}

type TRenderContentProps = {
  open: boolean
  toggleDrawer:(event: React.KeyboardEvent | React.MouseEvent, drawerState?:boolean) => void
  [key:string|number|symbol]: any
}

type TSidebarProps = {
  anchor?: 'top' | 'left' | 'bottom' | 'right'
  children:ReactNode
  initialOpen?: boolean
  onClose?: TDrawerCb
  onToggle?: TDrawerCb
  onOpen?: TDrawerCb
  variant?: "permanent" | "persistent" | "temporary"
  renderContent?: (props:TRenderContentProps) => ReactNode
  renderToggle?: (props:TRenderToggleProps) => ReactNode
}

const DefToggle = (props:TRenderToggleProps) => {
  return (
    <Button onClick={props.toggleDrawer}>Open Nav</Button>
  ) 
}

export const Sidebar = (props:TSidebarProps) => {
  const {
    onOpen,
    onClose,
    variant,
    onToggle,
    children,
    anchor='left',
    renderToggle,
    renderContent,
    initialOpen=false,
  } = props

  const [open, setOpen] = useState(initialOpen)

  const toggleDrawer = useCallback((event: React.KeyboardEvent | React.MouseEvent) => {
    const { type, key } = event as React.KeyboardEvent
    if(type === 'keydown' && (key === 'Tab' || key === 'Shift')) return
    
    const updated = !open
    setOpen(updated)
    onToggle?.(event, updated)
    !updated ? onClose?.(event, updated) : onOpen?.(event, updated)

  }, [open, onClose, onOpen, onToggle])

  const onClickAway = useCallback((event: MouseEvent | TouchEvent) => {
    open && setOpen(false)
    onToggle?.(event, false)
    onClose?.(event, false)
  }, [open, onClose, onToggle])

  return (
    <Box>
      {renderToggle ? renderToggle({ toggleDrawer }) : (<DefToggle toggleDrawer={toggleDrawer} />)}
      <ClickAwayListener onClickAway={onClickAway} >
        <Drawer
          open={open}
          anchor={anchor}
          variant={variant}
          onClose={toggleDrawer}
          PaperProps={{
            sx: { width: "45px" },
          }}
        >
          <>
            {children}
            {renderContent?.({ ...props, open, toggleDrawer })}
          </>
        </Drawer>
      </ClickAwayListener>
    </Box>
  )
}