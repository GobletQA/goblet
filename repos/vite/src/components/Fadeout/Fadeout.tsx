// @ts-nocheck
import { useEffect, useState, useMemo } from 'react'
import { exists } from '@keg-hub/jsutils'
import { useSetTimeout } from '@hooks/useSetTimeout'
import { Fade, FadeSection, FadeView } from './Fadeout.styled'

type TFadeoutProps = {
  content?: any
  start?: boolean
  speed?: number
  color?: string
  styles?: Record<string, any>
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
const useFadeEffect = (start?:boolean, speed?:number, styles?:Record<string, any>) => {
  const [style, setStyle] = useState({ ...(styles?.main || {}), opacity: 1 })

  useEffect(() => {
    start &&
      !style.display &&
      style.opacity === 1 &&
      setStyle({ ...style, opacity: 0 })
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
    content,
    start,
    color,
    styles,
    speed=2000,
  } = props

  const fadeStart = useFadeStart(start)
  const [fadeStyle] = useFadeEffect(fadeStart, speed, styles)

  return (
    <Fade className='gb-fade-out' speed={speed} sx={fadeStyle}>
      <FadeSection>
        <FadeView color={color} >
          {content}
        </FadeView>
      </FadeSection>
    </Fade>
  )
}