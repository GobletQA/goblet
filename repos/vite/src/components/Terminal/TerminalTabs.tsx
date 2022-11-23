import type { TTerminalTabs } from '@types'
import type { ComponentProps } from 'react'
import type Tabs from '@mui/material/Tabs'

import Box from '@mui/material/Box'
import { useTheme } from '@hooks/theme/useTheme'
import { TabsHeaderList, HeaderTab, TabCloseIcon, TabAddIcon } from './Terminal.styled'

export type TerminalTabs = ComponentProps<typeof Tabs> & {
  active:number
  tabs: TTerminalTabs
  onTabClose: (...args:any[]) => void
  onTabChange: (...args:any[]) => void
}

export const TerminalTabs = (props:TerminalTabs) => {
  const {
    tabs,
    active,
    onTabClose,
    onTabChange,
    ...rest
  } = props

  const { palette } = useTheme()

  const addColor = palette.mode === `light`
    ? palette.colors.white00
    : palette.colors.black01

  return (
    <Box
      width={'100%'}
      className="terminal-header-container"
    >
      <TabsHeaderList
        {...rest}
        value={active}
        onChange={onTabChange}
        aria-label="terminal-header-tabs"
      >
        {tabs.map((tab, idx) => {
          return (
            <HeaderTab
              value={idx}
              key={tab.id}
              label={tab.name || `terminal-${idx}`}
              icon={(
                <TabCloseIcon
                  className='terminal-tab-close-icon'
                  onClick={event => onTabClose(event, tab.id)}
                />
              )}
            />
          )
        })}
        <HeaderTab
          value={`+`}
          className='terminal-add-tab'
          icon={<TabAddIcon className='terminal-tab-add-icon' />}
          sx={{
            minWidth: `20px`,
            color: addColor,
          }}
        />
      </TabsHeaderList>
    </Box>
  )
}