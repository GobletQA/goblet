import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { useMemo } from 'react'
import { EBrowserState } from '@types'
import { capitalize, cls } from '@keg-hub/jsutils'
import { BaseAction, StateIcon, colors } from '@gobletqa/components'
import { useBrowserState } from '@hooks/screencast/useBrowserState'

const useActionProps = () => {
  const { browserState } = useBrowserState()

  return useMemo(() => {
    const text = `Browser ${capitalize(browserState)}`
    const disabledTooltip = `Interaction is disabled while ${browserState}`
    const className = cls('goblet-browser-state', `browser-state-${browserState}`)
    
    switch(browserState){
      case EBrowserState.playing:
        return {
          text,
          className,
          disabledTooltip,
          iconSx: { color: colors.green10 },
          tooltip:`${text}; running steps in active file`,
        }
      case EBrowserState.recording:
        return {
          text,
          className,
          disabledTooltip,
          iconSx: { color: colors.red10 },
          tooltip: `${text}; user actions are being recorded`,
        }
      default:
        return {
          text,
          className,
          iconSx: { color: colors.purple10 },
          tooltip: `${text}; no automation running`,
        }
    }
  }, [browserState])
  
}

const StateBrowser = (props:TBrowserActionProps) => {
  const actionProps = useActionProps()

  return (
    <BaseAction
      as='button'
      loc='bottom'
      Icon={StateIcon}
      onClick={props.onClick}
      actionClassName={cls(
        `no-click`,
        `state-browser-action`,
        actionProps.className,
      )}
      {...actionProps}
    />
  )
}

export const StateAction:TBrowserAction = {
  Component: StateBrowser,
  name: `state-browser-action`,
  containerSx: { minWidth: `150px` },
}