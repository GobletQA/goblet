import type { MouseEvent } from 'react'
import type { ClickAwayListenerProps } from '@mui/material/ClickAwayListener'


import { EBrowserState } from '@types'
import { noOp } from '@keg-hub/jsutils'
import { useMemo, useState } from 'react'
import {useBrowserState} from './useBrowserState'
import { useSetting } from '@hooks/settings/useSetting'

type TClickAwayProps = Omit<ClickAwayListenerProps, `children`>

export const useBrowserCover = () => {

  const { browserState, setBrowserState } = useBrowserState()
  const intentClickSetting = useSetting(`goblet.browserIntentClick`)
  const [clickHidden, setClickHidden] = useState<boolean>(false)

  const clickAwayProps = useMemo(() => {
    return clickHidden
      ? {
          onClickAway: (evt:MouseEvent) => {
            ;(evt.target as HTMLElement)?.nodeName !== `BODY` && setClickHidden(false)
          }
        }
      : {
          onClickAway: noOp,
          mouseEvent: false as const,
          touchEvent: false as const,
        }
  }, [clickHidden]) as TClickAwayProps

  return {
    clickHidden,
    browserState,
    setClickHidden,
    setBrowserState,
    clickAwayProps,
    /**
     * Only use intentClickSetting on the browser when in an Idle state
     * This way the browser state will set the browser cover when it's being automated
     */
    intentClickSetting: browserState === EBrowserState.idle
      ? intentClickSetting
      : false
  }
}