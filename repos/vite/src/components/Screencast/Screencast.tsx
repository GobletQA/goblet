import type { CSSProperties } from 'react'

import { ScreencastView } from './ScreencastView'
import { ScreencastLoading } from './ScreencastLoading'
import {useShowBrowser} from '@hooks/screencast/useShowBrowser'

export type TScreencastProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
}

export const Screencast = (props:TScreencastProps) => {
  const { isActive, showBrowser } = useShowBrowser()

  return showBrowser
    ? (<ScreencastView {...props} />)
    : (<ScreencastLoading isActive={isActive} />)
}
