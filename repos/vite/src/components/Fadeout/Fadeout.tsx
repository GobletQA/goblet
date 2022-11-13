import { TStyles, TStyle } from '@types'

import { useEffect, useState, useMemo } from 'react'
import { exists, checkCall } from '@keg-hub/jsutils'
import { useSetTimeout } from '@hooks/useSetTimeout'
import { Fade, FadeSection, FadeView } from './Fadeout.styled'

type TFadeoutProps = {
  content?: any
  speed?: number
  color?: string
  start?: boolean
  styles?: TStyles
  initOpacity?: number
}

/**
 * Hook to get the boolean tigger that starts the fade out
 * @param {boolean} start - Trigger the fadeout from outside the component
 *
 * @param {Boolean} - Trigger that starts the fade out
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

  const [style, setStyle] = useState<TStyle>({ ...(styles?.main || {}), opacity: initOpacity })

  useEffect(() => {
    start && !style.display && style.opacity === initOpacity
      ? setStyle({ ...style, opacity: 0 })
      : !start && style.display === `none`
        ? setStyle({ ...(styles?.main || {}), opacity: initOpacity })
        : undefined
  }, [start, style])

  useSetTimeout({
    delay: speed || 2000,
    condition: start && style.display !== 'none',
    callback: () => setStyle({ ...style, display: 'none' }),
  })

  return [style, setStyle]
}

export const Fadeout = (props:TFadeoutProps) => {
  const {
    start,
    color,
    styles,
    content,
    speed=2000,
    initOpacity=1,
  } = props

  const fadeStart = useFadeStart(start)
  const [fadeStyle] = useFadeEffect(fadeStart, speed, styles, initOpacity)

  return (
    <Fade
      speed={speed}
      className='gb-fade-out'
      sx={fadeStyle as TStyle}
    >
      <FadeSection sx={styles?.section} >
        <FadeView color={color} sx={styles?.view} >
          {content}
        </FadeView>
      </FadeSection>
    </Fade>
  )
}