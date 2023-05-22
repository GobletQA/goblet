import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { useMemo } from 'react'
import { EBrowserState } from '@types'
import { capitalize, cls } from '@keg-hub/jsutils'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import {
  colors,
  BaseAction,
  CircleMinusIcon,
  PlayCircleOutlineIcon,
  RadioButtonCheckedIcon,
} from '@gobletqa/components'

const styles = {
  text: {
    lineHeight: `20px`
  },
}

const stateProps = {
  [EBrowserState.playing]: {
    text: `Browser ${capitalize(EBrowserState.playing)}`,
    Icon: PlayCircleOutlineIcon,
    sx: { color: colors.green10 },
    iconSx: { color: colors.green10 },
    disabledTooltip: `Interaction is disabled while ${EBrowserState.playing}`,
    className: `goblet-browser-state browser-state-${EBrowserState.playing}`,
    tooltip:`${capitalize(EBrowserState.playing)} Mode - running automation steps`,
  },
  [EBrowserState.recording]: {
    Icon: RadioButtonCheckedIcon,
    sx: { color: colors.red10 },
    iconSx: { color: colors.red10 },
    text: `Browser  ${capitalize(EBrowserState.recording)}`,
    className: `goblet-browser-state browser-state-${EBrowserState.recording}`,
    tooltip: `${capitalize(EBrowserState.recording)} Mode - user actions are being recorded`,
  },
  [EBrowserState.idle]: {
    Icon: CircleMinusIcon,
    text: `Browser ${capitalize(EBrowserState.idle)}`,
    className: `goblet-browser-state browser-state-${EBrowserState.idle}`,
    tooltip: `${capitalize(EBrowserState.idle)} Mode - no automation running`,
    iconSx: { color: colors.purple10 },
  }
}

const StateBrowser = (props:TBrowserActionProps) => {
  const { browserState } = useBrowserState()
  const actionProps = stateProps[browserState]

  return (
    <BaseAction
      as='button'
      loc='bottom'
      textSx={styles.text}
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
  containerSx: {
    opacity: `0.5`,
    justifyContent: `start`,
  },
}
