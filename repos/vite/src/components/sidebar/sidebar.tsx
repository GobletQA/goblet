import type { ReactNode } from 'react'
import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'

type TDrawerCb = (...args:any[]) => any

type TRenderToggleProps = {
  toggleDrawer:(event: React.KeyboardEvent | React.MouseEvent) => void
  [key:string|number|symbol]: any
}

type TSidebarProps = {
  anchor?: 'top' | 'left' | 'bottom' | 'right'
  children:ReactNode
  initialOpen?: boolean
  onClose?: TDrawerCb
  onToggle?: TDrawerCb
  onOpen?: TDrawerCb
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
    onToggle,
    children,
    anchor='left',
    renderToggle,
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

  return (
    <Box>
      {renderToggle ? renderToggle({ toggleDrawer }) : (<DefToggle toggleDrawer={toggleDrawer} />)}
      <Drawer
        open={open}
        anchor={anchor}
        onClose={toggleDrawer}
      >
        <>
          {children}
        </>
      </Drawer>
    </Box>
  )
}