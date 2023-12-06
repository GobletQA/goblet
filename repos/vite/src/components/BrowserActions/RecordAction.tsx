import type { TBaseActionAction, TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { useMemo } from 'react'
import { EBrowserState } from '@types'
import { EE } from '@services/sharedService'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import {
  gutter,
  BaseAction,
  DangerousIcon,
  RadioButtonCheckedIcon,
} from '@gobletqa/components'
import {
  CancelButtonID,
  BrowserStateAttr,
  WSCancelPlayerEvent,
  WSCancelAutomateEvent,
} from '@constants'

const onCancelPlayers = () => EE.emit(WSCancelPlayerEvent, {})
const onCancelAutomation = () => EE.emit(WSCancelAutomateEvent, {})

const useActionProps = (props:TBrowserActionProps, browserState:EBrowserState) => {
  
  const actProps = useMemo<TBaseActionAction>(() => {
    return browserState ===  EBrowserState.idle
    ? {
        tooltip: '',
        as: 'button',
        loc: 'bottom',
        disabled:true,
        text: 'Record',
        variant: 'text',
        onClick: props.onClick,
        Icon: RadioButtonCheckedIcon,
        className: 'goblet-browser-record',
        disabledTooltip: 'COMING SOON - Record browser actions',
      }
    : {
        as: 'button',
        loc: 'bottom',
        color: 'error',
        text: 'Cancel',
        variant: 'text',
        id: CancelButtonID,
        Icon: DangerousIcon,
        [BrowserStateAttr]: browserState,
        tooltip: 'Cancel browser automation',
        className: 'goblet-browser-cancel-recording',
        onClick: browserState === EBrowserState.playing ? onCancelPlayers : onCancelAutomation,
      }
  }, [browserState])


  return {
    actProps
  }

}

const RecordBrowser = (props:TBrowserActionProps) => {
  const { browserState } = useBrowserState()
  const { actProps } = useActionProps(props, browserState)

  return (<BaseAction {...actProps} />)
}

export const RecordAction:TBrowserAction = {
  Component: RecordBrowser,
  name: `record-browser-action`,
  containerSx: {
    marginLeft: gutter.margin.hpx,
  },
}