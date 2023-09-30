import type { DrawerProps } from '@mui/material/Drawer'

import { useState, useCallback } from 'react'

import Box from '@mui/material/Box'
import { Definitions } from './Definitions'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { gray, black, gobletColors } from '@gobletqa/components/theme'
import {
  Tooltip,
  useTheme,
  LockIcon,
  SyncIcon,
  LockOpenIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@gobletqa/components'
  
import {
  Drawer,
  DefsSliderAction,
  DefsSliderActions,
} from './Definitions.styled'
import {getRemoteDefinitions} from '@actions/definitions/api/getRemoteDefinitions'

export type TDefinitionSlider = {}

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

  const onClickAway = useCallback((event: MouseEvent | TouchEvent) => {
    !locked && open && setOpen(false)
  }, [open, locked])

  return (
    <Box
      width='100%'
      height='100%'
      className='gb-definitions-slider'
      bgcolor={theme.palette.mode === 'light' ? gray.gray00 : black.black12}
    >
      <ClickAwayListener onClickAway={onClickAway} >
        <Drawer
          {...drawerProps}
          open={open}
          onClose={toggleDrawer}
          PaperProps={{
            elevation: 0,
            sx:{
              zIndex: `20`,
              width: `100%`,
              position: `absolute`,
            }
          }}
        >
          <Definitions onTabClick={onTabClick} onClose={onClickAway} />

          <DefsSliderActions>
          
            <Tooltip title='Sync step definitions with backend.'>
              <DefsSliderAction onClick={getRemoteDefinitions} >
                <SyncIcon sx={styles.lock.closed} />
              </DefsSliderAction>
            </Tooltip>
          
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
