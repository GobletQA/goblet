import type { TBaseActionAction, TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { useMemo } from 'react'
import { EBrowserState } from '@types'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import {
  gutter,
  BaseAction,
  DangerousIcon,
  RadioButtonCheckedIcon,
} from '@gobletqa/components'
import {
  WSCancelAutomateEvent,
} from '@constants'

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
        Icon: DangerousIcon,
        variant: 'contained',
        onClick: onCancelAutomation,
        tooltip: 'Cancel browser recording',
        className: 'goblet-browser-cancel-recording',
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