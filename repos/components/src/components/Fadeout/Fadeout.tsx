import type { TStyles } from '@GBC/types'
import type { CSSProperties } from 'react'

import { exists } from '@keg-hub/jsutils'
import { useEffect, useState, useMemo } from 'react'
import { useSetTimeout } from '@GBC/hooks/timer/useSetTimeout'
import { Fade, FadeSection, FadeView } from './Fadeout.styled'

type TFadeoutProps = {
  content?: any
  speed?: number
  color?: string
  start?: boolean
  styles?: TStyles
  initOpacity?: number
  onFadeOut?:() => void
}

/**
 * Hook to get the boolean trigger that starts the fade out
 */
const useFadeStart = (start?:boolean) => {
  return useMemo(
    () => (exists(start) ? start : false),
    [start]
  )
}

/**
 * Hook to check if the element should fade out
 * If so, then it updates the styles to fade out the element
 */
const useFadeEffect = (
  start?:boolean,
  speed?:number,
  styles?:TStyles,
  initOpacity:number=1
) => {

  const [style, setStyle] = useState<CSSProperties>({ ...(styles?.main || {}), opacity: initOpacity })

  useEffect(() => {
    start && !style.display && style.opacity === initOpacity
      ? setStyle({ ...style, opacity: 0 })
      : !start && style.display === `none`
        ? setStyle({ ...(styles?.main || {}), opacity: initOpacity })
        : undefined
  }, [start, style])

  useSetTimeout({
    delay: speed || 2000,
    condition: start && style.display !== `none`,
    callback: () => setStyle({ ...style, display: `none` }),
  })

  return [style, setStyle] as [CSSProperties, (css:CSSProperties) => void]
}

export const Fadeout = (props:TFadeoutProps) => {
  const {
    start,
    color,
    styles,
    content,
    onFadeOut,
    speed=2000,
    initOpacity=1,
  } = props

  const fadeStart = useFadeStart(start)
  const [fadeStyle] = useFadeEffect(
    fadeStart,
    speed,
    styles,
    initOpacity
  )

  useEffect(() => {
    fadeStyle?.display === `none` && onFadeOut?.()
  }, [onFadeOut, fadeStyle?.display])

  return (
    <Fade
      speed={speed}
      sx={fadeStyle}
      className='gb-fade-out'
    >
      <FadeSection sx={styles?.section} >
        <FadeView color={color} sx={styles?.view} >
          {content}
        </FadeView>
      </FadeSection>
    </Fade>
  )
}