import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'

import { useRef } from 'react'
import { useOnEvent } from '@gobletqa/components'
import {
  VNCResizeEvt,
  VNCConnectedEvt,
  PanelDimsSetEvt,
} from '@constants'


export const useLayoutResize = () => {

  const parentElRef = useRef<HTMLDivElement|null>(null)


  useOnEvent(VNCResizeEvt, () => {
    
  })



}