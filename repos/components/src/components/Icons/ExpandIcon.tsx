import type { CSSProperties } from 'react'

import { useMemo } from 'react'
import { emptyObj, flatArr } from '@keg-hub/jsutils'
import { ExpandMoreIcon } from '@GBC/components/Icons'

export type TExpandIcon = {
  expand?:boolean
  className?:string
  noIconTransform?:boolean
  sx?:CSSProperties|CSSProperties[]
}

export const ExpandIcon = (props:TExpandIcon) => {
  const {
    sx,
    expand,
    className,
    noIconTransform
  } = props

  const style = useMemo(() => {
    return noIconTransform
      ? emptyObj
      : expand || className?.split(' ').includes(`expanded`)
        ? { transform: 'rotate(0deg) !important', }
        : { transform: 'rotate(-90deg) !important' }

  }, [expand, className, noIconTransform])

  return (
    <ExpandMoreIcon
      className={className}
      sx={flatArr<CSSProperties>([{transition: `transform 300ms`}, sx as CSSProperties, style])}
    />
  )
}