import type { TTerminalTabs, TXTermIdMap } from '@types'
import type { MutableRefObject, SyntheticEvent } from 'react'

import { useCallback, useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import { terminalDispatch } from '@store'
import { TerminalTabs } from './TerminalTabs'
import { TerminalExpandEvt } from '@constants'
import { TerminalExpandBtn } from './Terminal.styled'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { ChevronUpIcon, ChevronDownIcon } from '@gobletqa/components'

export type TerminalHeader = {
  active:number
  tabs:TTerminalTabs
  terminals: MutableRefObject<TXTermIdMap>
}

export const TerminalHeader = (props:TerminalHeader) => {
  const { active, tabs, terminals } = props
  const [expanded, setExpanded] = useState<boolean>(false)
  const expandedRef = useRef<boolean>(expanded)

  const onChange = useCallback((evt:SyntheticEvent, value:`+`|number) => {
    value === `+`
      ? terminalDispatch.createTerminal({})
      : terminalDispatch.setActiveTerminal(value)

  }, [active, tabs])

  const onExpand = useCallback(() => {
    EE.emit<boolean>(TerminalExpandEvt, !expanded)
    setExpanded(!expanded)
  }, [expanded, terminals])

  const onClose = useCallback((evt:SyntheticEvent, tabId:string) => {
    evt?.preventDefault()
    evt?.stopPropagation()

    terminals?.current?.[tabId]?.remove?.()
    terminalDispatch.removeTerminal(tabId)

  }, [active, tabs, terminals])

  useEffect(() => {
    if(expandedRef.current === expanded) return
    
    expandedRef.current = expanded
    Object.values(terminals.current).forEach(terminal => terminal?.term?.resize())
  }, [expanded])

  return (
    <>
      <TerminalTabs
        tabs={tabs}
        active={active}
        onTabClose={onClose}
        onTabChange={onChange}
        className='terminal-header-tabs'
        TabIndicatorProps={{ children: <span className="MuiTabs-indicator" /> }}
      />
      <Box
        right="0px"
        height="30px"
        display='flex'
        position='absolute'
        justifyContent='end'
      >
        <TerminalExpandBtn onClick={onExpand} className='goblet-terminal-expand-button' >
          {expanded ? <ChevronDownIcon /> : <ChevronUpIcon /> }
        </TerminalExpandBtn>
      </Box>
    </>
  )
}