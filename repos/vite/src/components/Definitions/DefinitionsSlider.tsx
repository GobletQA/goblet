import type { CSSProperties } from 'react'
import type { DrawerProps } from '@mui/material/Drawer'

import { useRef, useState, useCallback } from 'react'

import Box from '@mui/material/Box'
import { Definitions } from './Definitions'
import { grey } from '@mui/material/colors'
import { PanelDimsSetEvt } from '@constants'
import { useTheme } from '@hooks/theme/useTheme'
import { useEffectOnce } from '@hooks/useEffectOnce'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import { ChevronUpIcon, ChevronDownIcon } from '@components/Icons'
import {
  Drawer,
  DefsExpandBtn,
} from './Definitions.styled'

export type TDefinitionSlider = {}

const drawerProps:Partial<DrawerProps> = {
  elevation: 0,
  anchor: `bottom`,
  hideBackdrop: true,
  variant: `permanent`,
  sx: { left: `50px` },
  className: `goblet-defs-drawer`,
}

export const DefinitionsSlider = (props:TDefinitionSlider) => {

  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  const theme = useTheme()

  const toggleDrawer = useCallback(() => {
    setOpen(!open)
  }, [open])

  const onTabClick = useCallback(() => {
    !open && toggleDrawer()
  }, [open, toggleDrawer])

  useEffectOnce(() => {
    const off = EE.on(PanelDimsSetEvt, () => {
      const parent = parentRef?.current
      const drawerChild = drawerRef?.current?.firstElementChild as HTMLDivElement
      if(!drawerChild || !parent) return

      drawerChild.style.width = `${parentRef?.current?.clientWidth}px`
    })
    
    return () => {
      off?.()
    }
  })

  const onClickAway = useCallback((event: MouseEvent | TouchEvent) => {
    open && setOpen(false)
  }, [open])

  return (
    <Box
      width='100%'
      height='100%'
      ref={parentRef}
      position='relative'
      className='goblet-definitions-slider'
      bgcolor={theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default}
    >
      <ClickAwayListener onClickAway={onClickAway} >
        <Drawer
          {...drawerProps}
          open={open}
          ref={drawerRef}
          onClose={toggleDrawer}
          PaperProps={{
            elevation: 0,
            sx:{
              width: parentRef?.current?.clientWidth || 0
            }
          }}
        >
          <Definitions onTabClick={onTabClick} />
          <DefsExpandBtn onClick={toggleDrawer} >
            {open ? <ChevronDownIcon /> : <ChevronUpIcon /> }
          </DefsExpandBtn>
        </Drawer>
      </ClickAwayListener>
    </Box>
  )
}