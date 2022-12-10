import type { CSSProperties } from 'react'

import { useRef, useState, useCallback } from 'react'

import Box from '@mui/material/Box'
import { Definitions } from './Definitions'
import { grey } from '@mui/material/colors'
import { PanelDimsSetEvt } from '@constants'
import { useTheme } from '@hooks/theme/useTheme'
import { useEffectOnce } from '@hooks/useEffectOnce'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { Drawer, DefsExpandBtn } from './Definitions.styled'
import { ChevronUpIcon, ChevronDownIcon } from '@components/Icons'

export type TDefinitionSlider = {
  sx?: CSSProperties
}

export const DefinitionsSlider = (props:TDefinitionSlider) => {
  const { sx } = props

  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  const theme = useTheme()

  const toggleDrawer = useCallback(() => {
    setOpen(!open)
  }, [open])

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

  return (
    <Box
      sx={sx}
      width='100%'
      height='100%'
      ref={parentRef}
      position='relative'
      className='goblet-definitions-slider'
      bgcolor={theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default}
    >
      <Drawer
        open={open}
        hideBackdrop
        elevation={0}
        ref={drawerRef}
        anchor="bottom"
        variant="permanent"
        sx={{ left: `50px` }}
        onClose={toggleDrawer}
        className='goblet-defs-drawer'
        PaperProps={{
          elevation: 0,
          sx:{
            width: parentRef?.current?.clientWidth || 0
          }
        }}
      >
        <Box
          sx={{
            height: '100%',
            backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
          }}
        >
          <Definitions />
        </Box>
        <DefsExpandBtn onClick={toggleDrawer} >
          {open ? <ChevronDownIcon /> : <ChevronUpIcon /> }
        </DefsExpandBtn>
      </Drawer>
    </Box>
  )
}