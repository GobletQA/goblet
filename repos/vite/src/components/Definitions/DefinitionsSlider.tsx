import type { DrawerProps } from '@mui/material/Drawer'

import { useRef, useState, useCallback } from 'react'

import Box from '@mui/material/Box'
import { Definitions } from './Definitions'
import { PanelDimsSetEvt } from '@constants'
import { useEffectOnce } from '@hooks/useEffectOnce'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import { gray, black, gobletColors } from '@gobletqa/components/theme'
import {
  Tooltip,
  useTheme,
  LockIcon,
  LockOpenIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@gobletqa/components'
  
import {
  Drawer,
  DefsSliderAction,
  DefsSliderActions,
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

const styles = {
  lock: {
    open: { color: gobletColors.shinyShamrock, fontSize: `16px` },
    closed: { color: gobletColors.cardinal, fontSize: `16px` }
  },
  toggle: {
    fontSize: `22px`
  }
}

export const DefinitionsSlider = (props:TDefinitionSlider) => {

  const [open, setOpen] = useState(false)
  const [locked, setLocked] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  const theme = useTheme()

  const toggleDrawer = useCallback(() => {
    setOpen(!open)
  }, [open])

  const toggleLock = useCallback(() => {
    setLocked(!locked)
  }, [locked])

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
    !locked && open && setOpen(false)
  }, [open, locked])

  return (
    <Box
      width='100%'
      height='100%'
      ref={parentRef}
      position='relative'
      className='goblet-definitions-slider'
      bgcolor={theme.palette.mode === 'light' ? gray.gray00 : black.black12}
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
          <Definitions onTabClick={onTabClick} onClose={onClickAway} />

          <DefsSliderActions>
            <Tooltip title='Lock the drawer open state. Must be manually closed.'>
              <DefsSliderAction onClick={toggleLock} >
                {
                  locked
                    ? <LockIcon sx={styles.lock.closed} />
                    : <LockOpenIcon sx={styles.lock.open} />
                }
              </DefsSliderAction>
            </Tooltip>

            <Tooltip title='Manually toggle the drawer open or closed.'>
              <DefsSliderAction onClick={toggleDrawer} >
                {
                  open
                    ? <ChevronDownIcon sx={styles.toggle} />
                    : <ChevronUpIcon sx={styles.toggle} />
                }
              </DefsSliderAction>
            </Tooltip>

          </DefsSliderActions>

        </Drawer>
      </ClickAwayListener>
    </Box>
  )
}