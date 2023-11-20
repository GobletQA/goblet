import type { CSSProperties } from 'react'

import { ScreencastView } from './ScreencastView'
import { ScreencastLoading } from './ScreencastLoading'
import {useShowBrowser} from '@hooks/screencast/useShowBrowser'

export type TScreencastProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
  browserIsActive?:boolean
}

export const Screencast = (props:TScreencastProps) => {

  const { browserIsActive } = props
  const { isActive, showBrowser } = useShowBrowser()

  return showBrowser && browserIsActive
    ? (<ScreencastView {...props} />)
    : (<ScreencastLoading isActive={isActive} />)
}
